"use client";

import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/data/products";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[110] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaeaea]">
          <h2 className="text-[14px] font-bold tracking-[0.1em] uppercase flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Giỏ hàng ({items.reduce((acc, item) => acc + item.quantity, 0)})
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-[#555] hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-[#777]">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p className="text-[13px] uppercase tracking-[0.05em]">Giỏ hàng trống</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-black text-white text-[12px] font-medium uppercase tracking-[0.1em] rounded-sm hover:bg-gray-800 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex gap-4">
                  <div className="relative w-24 h-32 bg-[#F7F4EE] rounded-sm overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/images/ao-thun-hai-phong.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[13px] font-medium leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-[12px] text-[#777] mt-1">
                        {item.color} / {item.size}
                      </p>
                      <p className="text-[13px] font-semibold mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Control */}
                      <div className="flex items-center border border-[#eaeaea] rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="px-2.5 py-1.5 text-[#555] hover:text-black hover:bg-[#F7F4EE] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-[13px] w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="px-2.5 py-1.5 text-[#555] hover:text-black hover:bg-[#F7F4EE] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-[11px] uppercase tracking-[0.05em] text-[#777] underline underline-offset-4 hover:text-red-500 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#eaeaea] p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-medium uppercase tracking-[0.05em]">Tổng tạm tính</span>
              <span className="text-[16px] font-bold">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-[11px] text-[#777] mb-6">
              Phí vận chuyển sẽ được tính ở bước thanh toán.
            </p>
            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full h-12 bg-black text-white flex items-center justify-center gap-2 text-[12px] font-bold tracking-[0.1em] uppercase rounded-sm hover:bg-gray-800 transition-colors group"
            >
              Thanh toán
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
