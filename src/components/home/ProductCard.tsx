"use client";

import { useState } from "react";
import Image from "next/image";
import { type Product, formatPrice } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Sparkles, QrCode } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();

  const isUnavailable = !product.inStock || product.badge === "COMING SOON";

  const handleAddToCart = () => {
    if (isUnavailable) return;
    if (!selectedSize) return;
    addToCart({
      productId: product.id,
      name: product.name,
      size: selectedSize,
      price: product.price,
      image: product.images[0],
      color: product.colors[0]?.name,
    });
    setQuickAddOpen(false);
    setSelectedSize(null);
  };

  return (
    <div
      className="group relative flex flex-col justify-between rounded-xl border border-neutral-200/70 bg-white p-3 sm:p-3.5 transition-all duration-300 hover:border-neutral-900/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setQuickAddOpen(false);
        setSelectedSize(null);
      }}
    >
      <div>
        {/* Image Container */}
        <div className="relative aspect-product overflow-hidden rounded-lg bg-[#FAF8F5] mb-3.5 border border-neutral-100">
          {/* Product image */}
          <Link
            href={`/products/${product.slug}`}
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out z-0",
              isHovered ? "scale-105" : "scale-100"
            )}
          >
            {product.images && product.images[0] ? (
              <div className="relative w-full h-full p-2.5">
                <Image
                  src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-contain transition-opacity duration-300"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-[#f0f0f0] flex items-center justify-center">
                <span className="text-[#999] text-xs tracking-wider uppercase font-medium">
                  {product.name}
                </span>
              </div>
            )}
          </Link>

          {/* Badges on Top Left */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
            {product.badge && (
              <span
                className={cn(
                  "text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full shadow-2xs font-mono",
                  product.badge === "NEW"
                    ? "bg-black text-white"
                    : product.badge === "BEST SELLER"
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : "bg-[#8B4513] text-white"
                )}
              >
                {product.badge}
              </span>
            )}
          </div>

          {/* QR Heritage indicator on Top Right */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="inline-flex items-center gap-1 text-[8.5px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-neutral-800 border border-neutral-200/80 shadow-2xs">
              <QrCode className="w-2.5 h-2.5 text-black" />
              <span>QR DI SẢN</span>
            </span>
          </div>

          {/* Quick Add or Coming Soon / View Details */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 transition-all duration-300 ease-out z-10",
              isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            )}
          >
            {isUnavailable ? (
              <Link
                href={`/products/${product.slug}`}
                className="block w-full text-center bg-[#8B4513]/95 backdrop-blur-xs text-white text-[11px] font-bold tracking-[0.12em] uppercase py-3 hover:bg-[#8B4513] transition-colors"
              >
                SẮP RA MẮT • XEM CHI TIẾT
              </Link>
            ) : !quickAddOpen ? (
              <button
                onClick={() => setQuickAddOpen(true)}
                className="w-full bg-black/90 backdrop-blur-xs text-white text-[11px] font-bold tracking-[0.14em] uppercase py-3 hover:bg-black transition-colors"
              >
                THÊM NHANH
              </button>
            ) : (
              <div className="bg-white border-t border-neutral-200 p-3 shadow-lg">
                {/* Size selector */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-[34px] h-[32px] px-2 text-[10.5px] font-bold rounded-sm border transition-all",
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className={cn(
                    "w-full py-2.5 rounded-sm text-[11px] font-bold tracking-[0.1em] uppercase transition-colors",
                    selectedSize
                      ? "bg-black text-white hover:bg-neutral-800"
                      : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  )}
                >
                  THÊM VÀO GIỎ
                </button>
              </div>
            )}
          </div>

          {/* Mobile Quick Add button */}
          {!isUnavailable && (
            <button
              onClick={() => setQuickAddOpen(!quickAddOpen)}
              className="lg:hidden absolute bottom-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-md text-black"
              aria-label="Thêm nhanh"
            >
              <span className="text-[16px] leading-none font-bold">+</span>
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1.5 px-0.5">
          {/* City tag & Color dots */}
          <div className="flex items-center justify-between">
            {product.city && (
              <span className="text-[9.5px] font-bold font-mono tracking-[0.15em] uppercase text-neutral-500">
                {product.city}
              </span>
            )}
            {product.colors.length > 1 && (
              <div className="flex gap-1.5 ml-auto">
                {product.colors.map((color) => (
                  <span
                    key={color.name}
                    className="w-2.5 h-2.5 rounded-full border border-neutral-300 ring-1 ring-white"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Name */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-[13.5px] font-bold text-neutral-900 leading-snug line-clamp-1 hover:text-black group-hover:underline">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-[14px] font-black text-black">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[11.5px] text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Quick Add panel */}
      {!isUnavailable && quickAddOpen && (
        <div className="lg:hidden mt-2 p-3 border border-neutral-200 bg-white rounded-lg shadow-md">
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "min-w-[34px] h-[32px] px-2 text-[10.5px] font-bold rounded-sm border transition-colors",
                  selectedSize === size
                    ? "bg-black text-white border-black"
                    : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                )}
              >
                {size}
              </button>
            ))}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={cn(
              "w-full py-2.5 rounded-sm text-[11px] font-bold tracking-[0.1em] uppercase transition-colors",
              selectedSize
                ? "bg-black text-white hover:bg-neutral-800"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            )}
          >
            XÁC NHẬN THÊM VÀO GIỎ
          </button>
        </div>
      )}
    </div>
  );
}
