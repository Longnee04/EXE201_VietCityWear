"use client";

import { X, Minus, Plus, ShoppingBag, ArrowRight, Sparkles, Truck } from "lucide-react";
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
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const freeshipProgress = Math.min(100, Math.round((subtotal / 500000) * 100));

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[100] transition-opacity animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[110] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-black" />
            <h2 className="text-sm font-black tracking-[0.12em] uppercase text-black">
              Giỏ hàng ({totalCount})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Freeship Progress Bar */}
        <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-200/80">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-neutral-700">
              <Truck className="w-3.5 h-3.5 text-black" />
              {subtotal >= 500000 ? (
                <span className="font-bold text-emerald-600">Đơn hàng của bạn được FREESHIP!</span>
              ) : (
                <span>
                  Thêm <strong className="text-black">{formatPrice(500000 - subtotal)}</strong> để Freeship
                </span>
              )}
            </span>
            <span className="font-mono text-[11px] text-neutral-500 font-bold">{freeshipProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                subtotal >= 500000 ? "bg-emerald-500" : "bg-black"
              }`}
              style={{ width: `${freeshipProgress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-neutral-400 py-12">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold uppercase tracking-wider text-neutral-700">Giỏ hàng của bạn đang trống</p>
              <p className="text-xs text-neutral-500 max-w-[220px]">
                Hãy khám phá các mẫu áo thun di sản và phụ kiện độc quyền của VietCityWear
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition-all shadow-sm"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-4 p-3 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                >
                  <div className="relative w-20 h-24 bg-[#FAF8F5] rounded-lg overflow-hidden flex-shrink-0 border border-neutral-200">
                    <Image
                      src={item.image || "/images/ao-thun-hai-phong.png"}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold leading-snug text-neutral-900 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-neutral-500 mt-0.5 font-mono">
                        {item.color ? `${item.color} / ` : ""}{item.size}
                      </p>
                      <p className="text-xs font-black text-black mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Control */}
                      <div className="flex items-center border border-neutral-200 rounded-md bg-white shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="px-2 py-1 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                          aria-label="Giảm số lượng"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs w-7 text-center font-bold text-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="px-2 py-1 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                          aria-label="Tăng số lượng"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-[10.5px] uppercase tracking-wider text-neutral-400 hover:text-red-500 transition-colors font-bold"
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
          <div className="border-t border-neutral-200 p-6 bg-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Tổng tạm tính</span>
              <span className="text-xl font-black text-black">{formatPrice(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full h-13 rounded-xl bg-black text-white flex items-center justify-center gap-2 text-xs font-bold tracking-[0.14em] uppercase hover:bg-neutral-800 transition-all shadow-md group active:scale-[0.99]"
            >
              <span>Tiến hành thanh toán</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
