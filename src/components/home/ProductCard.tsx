"use client";

import { useState } from "react";
import Image from "next/image";
import { type Product, formatPrice } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
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
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setQuickAddOpen(false);
        setSelectedSize(null);
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-product overflow-hidden bg-white border border-[#E5DFD5] rounded-lg mb-3">
        {/* Product image */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out",
            isHovered ? "scale-105" : "scale-100"
          )}
        >
          {product.images && product.images[0] ? (
            <div className="relative w-full h-full p-3 bg-[#F7F4EE]">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-[#F7F4EE] flex items-center justify-center">
              <span className="text-[#999] text-xs tracking-wider uppercase font-medium">
                {product.name}
              </span>
            </div>
          )}
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={cn(
                "text-[10px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1",
                product.badge === "NEW"
                  ? "bg-[#1A2421] text-white"
                  : product.badge === "BEST SELLER"
                  ? "bg-[#B4532A] text-white"
                  : "bg-[#8B4513] text-white"
              )}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick Add — appears on hover (desktop) */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 transition-all duration-300 ease-out z-10",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          )}
        >
          {!quickAddOpen ? (
            <button
              onClick={() => setQuickAddOpen(true)}
              className="w-full bg-[#1A2421]/95 backdrop-blur-xs text-white text-[11px] font-semibold tracking-[0.12em] uppercase py-3 hover:bg-[#1A2421] transition-colors"
            >
              QUICK ADD
            </button>
          ) : (
            <div className="bg-white border-t border-[#E5DFD5] p-3">
              {/* Size selector */}
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "min-w-[34px] h-[32px] px-2 text-[11px] font-semibold border transition-colors",
                      selectedSize === size
                        ? "bg-[#1A2421] text-white border-[#1A2421]"
                        : "bg-white text-[#1A2421] border-[#E5DFD5] hover:border-[#1A2421]"
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
                  "w-full py-2.5 text-[11px] font-bold tracking-[0.1em] uppercase transition-colors",
                  selectedSize
                    ? "bg-[#B4532A] text-white hover:bg-[#96421F]"
                    : "bg-[#E5DFD5] text-[#999] cursor-not-allowed"
                )}
              >
                ADD TO CART
              </button>
            </div>
          )}
        </div>

        {/* Mobile Quick Add button */}
        <button
          onClick={() => setQuickAddOpen(!quickAddOpen)}
          className="lg:hidden absolute bottom-3 right-3 z-10 w-8 h-8 bg-white border border-[#E5DFD5] flex items-center justify-center shadow-xs text-[#1A2421]"
        >
          <span className="text-[16px] leading-none font-bold">+</span>
        </button>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        {/* Color dots */}
        {product.colors.length > 1 && (
          <div className="flex gap-1.5 pb-0.5">
            {product.colors.map((color) => (
              <span
                key={color.name}
                className="w-3 h-3 rounded-full border border-[#E5DFD5]"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        )}

        {/* Name */}
        <h3 className="text-[13px] font-semibold text-[#1A2421] leading-snug line-clamp-1">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#1A2421]">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-[12px] text-[#999] line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Mobile Quick Add panel */}
      {quickAddOpen && (
        <div className="lg:hidden mt-2 p-3 border border-[#E5DFD5] bg-white rounded-md">
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "min-w-[34px] h-[32px] px-2 text-[11px] font-semibold border transition-colors",
                  selectedSize === size
                    ? "bg-[#1A2421] text-white border-[#1A2421]"
                    : "bg-white text-[#1A2421] border-[#E5DFD5] hover:border-[#1A2421]"
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
              "w-full py-2.5 text-[11px] font-bold tracking-[0.1em] uppercase transition-colors",
              selectedSize
                ? "bg-[#B4532A] text-white hover:bg-[#96421F]"
                : "bg-[#E5DFD5] text-[#999] cursor-not-allowed"
            )}
          >
            ADD TO CART
          </button>
        </div>
      )}
    </div>
  );
}
