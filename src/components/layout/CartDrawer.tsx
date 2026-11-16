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
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

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
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#eaeaea]">
          <h2 className="text-[13px] font-bold tracking-[0.1em] uppercase flex items-center gap-2 text-[#111]">
            <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
            Giỏ hàng ({totalCount})
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-[#555] hover:text-black transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5 stroke-[1.75]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-[#777] py-12">
              <ShoppingBag className="w-10 h-10 opacity-20" />
              <p className="text-[12px] uppercase tracking-[0.08em] font-semibold text-[#111]">Giỏ hàng trống</p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-[#111] text-white text-[11px] font-medium uppercase tracking-[0.1em] hover:bg-[#333] transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex gap-4 pb-4 border-b border-[#f0f0f0] last:border-0">
                  <div className="relative w-20 h-26 bg-[#F7F4EE] overflow-hidden flex-shrink-0 border border-[#eaeaea]">
                    <Image
                      src={item.image || "/images/ao-thun-hai-phong.png"}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[13px] font-medium leading-snug text-[#111]">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-[#777] mt-1">
                        {item.color ? `${item.color} / ` : ""}{item.size}
                      </p>
                      <p className="text-[13px] font-semibold mt-1 text-[#111]">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Control */}
                      <div className="flex items-center border border-[#ddd]">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="px-2 py-1 text-[#555] hover:text-black hover:bg-[#fafafa] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-[12px] w-7 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="px-2 py-1 text-[#555] hover:text-black hover:bg-[#fafafa] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-[11px] uppercase tracking-[0.05em] text-[#888] underline underline-offset-4 hover:text-red-600 transition-colors"
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
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#555]">Tổng tạm tính</span>
              <span className="text-[16px] font-bold text-[#111]">{formatPrice(subtotal)}</span>
            </div>
            {subtotal >= 500000 ? (
              <p className="text-[11px] text-[#244033] font-semibold mb-4">
                ✓ Đơn hàng của bạn đủ điều kiện FREESHIP toàn quốc!
              </p>
            ) : (
              <p className="text-[11px] text-[#78716C] mb-4">
                Mua thêm {formatPrice(500000 - subtotal)} để được <span className="font-semibold text-[#111]">FREESHIP</span>.
              </p>
            )}
            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full h-12 bg-[#111] text-white flex items-center justify-center gap-2 text-[12px] font-bold tracking-[0.12em] uppercase hover:bg-[#333] transition-colors"
            >
              <span>Thanh toán</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
