"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/data/products";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";


export default function CheckoutClient() {
  const { items, itemCount, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "SEPAY">("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

      if (paymentMethod === "SEPAY") {
        // 2. Redirect to SePay QR page using real OrderId
        router.push(`/checkout/sepay?orderId=${data.orderId}&amount=${total}`);
        return;
      }

      // COD Flow
      // Clear cart
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" />
        <h1 className="text-2xl font-bold uppercase tracking-widest mb-4">Đặt Hàng Thành Công!</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Cảm ơn bạn đã mua sắm tại VIET CITY WEAR. Đơn hàng của bạn đang được xử lý và sẽ được giao trong thời gian sớm nhất.
        </p>
        <Link 
          href="/"
          className="px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          Trở về Trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10 lg:py-16">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Tiếp tục mua sắm
      </Link>

      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111] uppercase mb-10">
        Thanh Toán
      </h1>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Checkout Form */}
        <div className="flex-1">
          <div className="bg-[#F7F4EE] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-6">Thông Tin Giao Hàng</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                  placeholder="Nhập họ và tên người nhận"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors resize-none"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                />
              </div>

              <div className="pt-4 border-t border-gray-300">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Phương Thức Thanh Toán</h3>
                <div className="flex flex-col gap-3">
                  <label className="flex items-start gap-3 p-4 border border-[#1A2E24] bg-white rounded-sm cursor-pointer shadow-xs">
                    <input 
                      type="radio" 
                      name="payment"
                      checked={true}
                      readOnly
                      className="w-4 h-4 text-[#1A2E24] focus:ring-[#1A2E24] cursor-pointer mt-0.5" 
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Thanh toán khi nhận hàng (COD)</span>
                      <p className="text-xs text-[#57534E] mt-1">
                        Kiểm tra hàng trước khi thanh toán.
                      </p>
                    </div>
                  </label>
                  
                  <label className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${paymentMethod === 'SEPAY' ? 'border-[#1A2E24] bg-gray-50' : 'border-gray-300 bg-white hover:border-[#1A2E24]'}`}>
                    <input 
                      type="radio" 
                      name="payment"
                      checked={paymentMethod === 'SEPAY'} 
                      onChange={() => setPaymentMethod('SEPAY')}
                      className="w-4 h-4 text-[#1A2E24] focus:ring-[#1A2E24] cursor-pointer mt-0.5" 
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium flex items-center gap-2">
                        Thanh toán chuyển khoản (SePay)
                      </span>
                      <span className="text-xs text-gray-500 mt-1">Quét mã QR để chuyển khoản</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={items.length === 0 || isSubmitting}
                className="w-full h-[54px] mt-6 bg-black text-white flex items-center justify-center gap-2 text-[13px] font-bold tracking-[0.1em] uppercase rounded-sm hover:bg-gray-800 transition-colors disabled:bg-[#eaeaea] disabled:text-[#999] disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
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
