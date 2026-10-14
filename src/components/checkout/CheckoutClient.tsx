"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/data/products";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, UserCheck, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { type User as SupabaseUser } from "@supabase/supabase-js";

export default function CheckoutClient() {
  const { items, itemCount, clearCart } = useCart();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "SEPAY">("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUser(session.user);
          const { data: profile } = await supabase
            .from("users")
            .select("full_name, phone")
            .eq("id", session.user.id)
            .maybeSingle();

          setFormData((prev) => ({
            name: profile?.full_name || session.user.user_metadata?.full_name || prev.name,
            phone: profile?.phone || session.user.user_metadata?.phone || prev.phone,
            address: prev.address,
          }));
        }
      } catch (err) {
        console.error("Lỗi lấy thông tin phiên người dùng:", err);
      }
    }
    loadUserSession();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + (items.length > 0 ? shippingFee : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);

    try {
      // 1. Create order in Database
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser?.id || null,
          receiver_name: formData.name,
          receiver_phone: formData.phone,
          shipping_address: formData.address,
          total_amount: total,
          payment_method: paymentMethod,
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            size: item.size,
            color: item.color || "Tiêu chuẩn",
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Failed to create order");

      setCreatedOrderId(data.orderId || null);

      if (paymentMethod === "SEPAY") {
        // Redirect to SePay QR page using real OrderId
        router.push(`/checkout/sepay?orderId=${data.orderId}&amount=${total}`);
        return;
      }

      // COD Flow
      clearCart();
      setIsSuccess(true);
      
    } catch (err) {
      console.error("Failed to save order", err);
      alert("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        <CheckCircle2 className="w-16 h-16 text-emerald-600 mb-5" />
        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider rounded-full mb-3">
          Thanh toán khi nhận hàng (Ship COD)
        </span>
        <h1 className="text-2xl font-extrabold uppercase tracking-wide text-[#111] mb-2">
          Đặt Hàng Thành Công!
        </h1>
        {createdOrderId && (
          <p className="text-xs text-[#555] font-mono bg-[#f5f5f5] px-3 py-1.5 rounded border border-[#eaeaea] mb-4">
            Mã đơn hàng: <strong className="text-black">{createdOrderId.slice(0, 18)}</strong>
          </p>
        )}
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Cảm ơn bạn đã đồng hành cùng VIET CITY WEAR. Đơn hàng sẽ được đóng gói chỉn chu trong Hộp quà di sản và giao đến địa chỉ của bạn sớm nhất.
        </p>

        {/* Guest Recommendation Box */}
        {!currentUser && (
          <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-sm mb-6 text-xs text-stone-800 text-left">
            <p className="font-bold text-amber-950 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Khuyến nghị: Tạo tài khoản để tra cứu & theo dõi đơn hàng</span>
            </p>
            <p className="text-stone-600 mb-3 leading-relaxed">
              Bạn vừa đặt hàng với số điện thoại <strong>{formData.phone}</strong>. Hãy đăng ký tài khoản thành viên bằng số điện thoại này để đăng nhập và tra cứu tiến độ xử lý đơn hàng bất kỳ lúc nào!
            </p>
            <Link
              href={`/login?tab=register&phone=${encodeURIComponent(formData.phone)}&name=${encodeURIComponent(formData.name)}`}
              className="inline-flex items-center justify-center w-full py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors rounded-xs gap-1.5"
            >
              <span>Đăng ký tài khoản để theo dõi đơn hàng</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          {currentUser ? (
            <Link
              href="/login?tab=orders"
              className="px-6 py-3 bg-[#111] text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors rounded-sm"
            >
              Tra cứu đơn hàng của tôi
            </Link>
          ) : (
            <Link
              href="/"
              className="px-6 py-3 border border-[#111] text-[#111] text-xs font-bold uppercase tracking-widest hover:bg-[#fafafa] transition-colors rounded-sm"
            >
              Trở về Trang chủ
            </Link>
          )}
          <Link 
            href="/products"
            className="px-6 py-3 border border-[#111] text-[#111] text-xs font-bold uppercase tracking-widest hover:bg-[#fafafa] transition-colors rounded-sm"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10 lg:py-16">
      <Link href="/products" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Cửa hàng</span>
      </Link>

      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#eaeaea]">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111] uppercase">
          Xác Nhận & Thanh Toán COD
        </h1>
        <span className="text-xs text-[#888] font-medium hidden sm:inline">
          Duy nhất hình thức nhận hàng trả tiền (Ship COD)
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Checkout Form */}
        <div className="flex-1">
          {/* User Context Banner */}
          {currentUser ? (
            <div className="mb-6 p-3.5 bg-stone-100 border border-stone-200 rounded-sm text-xs flex items-center justify-between text-stone-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Đang đặt hàng với tài khoản: <strong>{currentUser.email}</strong>
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Tự động lưu đơn
              </span>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-amber-50/80 border border-amber-200/80 rounded-sm text-xs text-stone-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-amber-950 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>Khuyến nghị dành cho bạn</span>
                  </p>
                  <p className="text-stone-600 leading-relaxed">
                    Bạn đang đặt hàng với tư cách <strong>Khách (Guest)</strong>. Tạo tài khoản thành viên để tra cứu lịch sử đơn hàng và nhận ưu đãi độc quyền.
                  </p>
                </div>
                <Link
                  href="/login?tab=register"
                  className="px-3.5 py-2 bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-xs hover:bg-stone-800 whitespace-nowrap text-center flex-shrink-0"
                >
                  Tạo tài khoản ngay
                </Link>
              </div>
            </div>
          )}

          <div className="bg-[#F7F4EE] p-6 sm:p-8 rounded-sm border border-[#eaeaea]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#111] mb-6">Thông Tin Giao Hàng</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Họ và tên người nhận *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Số điện thoại nhận hàng *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                  placeholder="Ví dụ: 0912 345 678"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Địa chỉ giao hàng chi tiết *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors resize-none"
                  placeholder="Số nhà, ngõ/đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                />
              </div>

              <div className="pt-4 border-t border-gray-300">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#111] mb-3">
                  Phương Thức Thanh Toán (Theo Đặc Tả)
                </h3>
                <div className="p-4 border-2 border-black bg-white rounded-sm shadow-xs flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full border-4 border-black bg-white mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-black uppercase tracking-wider block">
                      Thanh toán khi nhận hàng (Ship COD)
                    </span>
                    <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                      Kiểm tra hàng trước khi thanh toán. Trọn bộ gồm áo thun, hộp quà di sản, 05 thẻ bưu thiếp và móc khóa chạm chip NFC.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={items.length === 0 || isSubmitting}
                className="w-full h-[52px] mt-6 bg-black text-white flex items-center justify-center gap-2 text-xs font-bold tracking-[0.15em] uppercase rounded-sm hover:bg-neutral-800 transition-colors disabled:bg-[#eaeaea] disabled:text-[#999] disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang tạo đơn hàng..." : `Xác nhận đặt hàng COD (${formatPrice(total)})`}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-[400px]">
          <div className="border border-[#eaeaea] p-6 rounded-sm sticky top-24">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-[#eaeaea] pb-4">Đơn hàng của bạn ({itemCount})</h2>
            
            <div className="space-y-6 mb-6">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex gap-4">
                  <div className="relative w-16 h-20 bg-[#F7F4EE] rounded-sm overflow-hidden flex-shrink-0 border border-[#eaeaea]">
                    <Image
                      src={item.image || "/images/ao-thun-hai-phong.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[13px] font-medium leading-tight">{item.name}</h3>
                    <p className="text-[12px] text-[#777] mt-1">{item.color} / {item.size}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[12px] text-[#555]">SL: {item.quantity}</span>
                      <span className="text-[13px] font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-[#eaeaea] text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí giao hàng</span>
                <span>{items.length === 0 ? "0₫" : shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t border-[#eaeaea]">
                <span>Tổng cộng</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
