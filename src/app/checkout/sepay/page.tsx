"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/data/products";
import { Suspense, useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";

function SepayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { items, clearCart } = useCart();
  
  const orderId = searchParams.get("orderId");
  const amountStr = searchParams.get("amount");
  const amount = amountStr ? parseInt(amountStr) : 0;
  
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!orderId || isSuccess) return;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        const data = await res.json();
        if (data.success && data.status === "paid") {
           // Payment successful, clear cart
           clearCart();
           setIsSuccess(true);
        }
      } catch (err) {
        console.error("Failed to check status", err);
      }
    };

    const interval = setInterval(checkStatus, 3000); // Check every 3 seconds
    return () => clearInterval(interval);
  }, [orderId, clearCart, isSuccess]);

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" />
        <h1 className="text-2xl font-bold uppercase tracking-widest mb-4">Thanh Toán Thành Công!</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Đơn hàng <strong>{orderId}</strong> của bạn đã được thanh toán thành công và đang được xử lý.
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
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold uppercase tracking-widest mb-4">Thanh Toán Đơn Hàng</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Quý khách vui lòng quét mã QR dưới đây hoặc chuyển khoản theo thông tin để hoàn tất đơn hàng <strong>{orderId}</strong>. Hệ thống sẽ tự động cập nhật khi nhận được tiền.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 w-full max-w-md">
        <div className="flex flex-col items-center gap-4">
          <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
            {amount > 0 ? (
              <Image 
                src={`https://qr.sepay.vn/img?bank=MBBank&acc=0963539999&amount=${amount}&des=${orderId}`}
                alt="SePay QR Code"
                fill
                className="object-contain p-2"
                unoptimized
              />
            ) : (
              <div className="text-gray-400 text-sm">QR Code placeholder</div>
            )}
          </div>
          
          <div className="w-full text-left space-y-2 text-sm mt-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Ngân hàng:</span>
              <span className="font-semibold">MBBank</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Số tài khoản:</span>
              <span className="font-semibold">0963539999</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Chủ tài khoản:</span>
              <span className="font-semibold">VIET CITY WEAR</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Số tiền:</span>
              <span className="font-semibold text-red-600">{formatPrice(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Nội dung CK:</span>
              <span className="font-semibold">{orderId}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link 
          href="/"
          className="px-8 py-3 border border-black text-black text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
        >
          Trở về Trang chủ
        </Link>

      </div>
    </div>
  );
}

export default function SepayReturnPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Đang tải...</div>}>
      <SepayContent />
    </Suspense>
  );
}
