"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function VnpayReturnClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "invalid">("loading");
  const [message, setMessage] = useState("");
  const { items, removeFromCart } = useCart();
  const processedRef = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      // Prevent running twice in strict mode
      if (processedRef.current) return;
      processedRef.current = true;

      // 1. Get query string to send to verify API
      const queryString = searchParams.toString();
      if (!queryString) {
        setStatus("invalid");
        setMessage("Không tìm thấy thông tin thanh toán.");
        return;
      }

      try {
        const res = await fetch(`/api/vnpay/verify?${queryString}`);
        const data = await res.json();

        if (data.verified && data.success) {
          setStatus("success");
          setMessage("Thanh toán thành công! Đơn hàng của bạn đang được xử lý.");
          
          // Move pending order to admin orders
          const pendingOrderRaw = localStorage.getItem("vcw_pending_order");
          if (pendingOrderRaw) {
            const pendingOrder = JSON.parse(pendingOrderRaw);
            const existingRaw = localStorage.getItem("vcw_admin_orders");
            let existingOrders = [];
            if (existingRaw) {
              existingOrders = JSON.parse(existingRaw);
            }
            
            // Avoid duplicates (if user refreshes the page)
            const isDuplicate = existingOrders.some((o: any) => o.id === pendingOrder.id);
            if (!isDuplicate) {
              localStorage.setItem("vcw_admin_orders", JSON.stringify([pendingOrder, ...existingOrders]));
            }
            localStorage.removeItem("vcw_pending_order");
            
            // Clear cart properly based on items we had
            const currentItems = JSON.parse(localStorage.getItem("vcw_cart") || "[]");
            currentItems.forEach((item: any) => removeFromCart(item.productId, item.size));
          }
        } else if (data.verified && !data.success) {
          setStatus("error");
          setMessage(`Thanh toán thất bại hoặc đã bị hủy (Mã lỗi: ${data.code}).`);
        } else {
          setStatus("invalid");
          setMessage("Chữ ký không hợp lệ. Đơn hàng có thể bị giả mạo.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Đã xảy ra lỗi khi xác minh giao dịch.");
      }
    };

    verifyPayment();
  }, [searchParams, removeFromCart]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-gray-50">
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow-sm border border-gray-100 max-w-md w-full">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-black animate-spin mb-6" />
            <h1 className="text-xl font-bold uppercase tracking-widest mb-2">Đang xác minh...</h1>
            <p className="text-gray-500">Vui lòng không đóng trình duyệt lúc này.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center animate-fade-in">
            <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" />
            <h1 className="text-xl font-bold uppercase tracking-widest mb-4">Giao Dịch Thành Công!</h1>
            <p className="text-gray-600 mb-8">{message}</p>
            <Link 
              href="/"
              className="px-8 py-3 w-full bg-black text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors inline-block"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        )}

        {(status === "error" || status === "invalid") && (
          <div className="flex flex-col items-center animate-fade-in">
            <XCircle className="w-20 h-20 text-red-500 mb-6" />
            <h1 className="text-xl font-bold uppercase tracking-widest mb-4 text-red-600">Giao Dịch Thất Bại!</h1>
            <p className="text-gray-600 mb-8">{message}</p>
            <div className="flex flex-col gap-3 w-full">
              <Link 
                href="/checkout"
                className="px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors"
              >
                Thử thanh toán lại
              </Link>
              <Link 
                href="/"
                className="px-8 py-3 bg-white border border-gray-300 text-black text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-gray-50 transition-colors"
              >
                Trở về Trang chủ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
