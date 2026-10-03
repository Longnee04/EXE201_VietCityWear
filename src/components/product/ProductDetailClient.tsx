"use client";

import { useState } from "react";
import Image from "next/image";
import { type Product, formatPrice } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Check, ShieldCheck, Truck } from "lucide-react";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Vui lòng chọn size (kích thước)");
      return;
    }
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0],
    });
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-10 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        
        {/* Left: Images */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-[4/5] bg-[#F7F4EE] rounded-sm overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Thumbnails if we had more images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/5] bg-[#F7F4EE] rounded-sm cursor-pointer border-2 border-transparent hover:border-[#111]">
                  <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col mt-4 lg:mt-0">
          {product.badge && (
            <div className="mb-4 inline-block px-3 py-1 bg-black text-white text-[10px] font-bold tracking-[0.1em] uppercase rounded-sm self-start">
              {product.badge}
            </div>
          )}
          
          <h1 className="text-[28px] md:text-[36px] font-bold leading-tight mb-2">
            {product.name}
          </h1>
          
          <div className="flex items-end gap-3 mb-8">
            <span className="text-[24px] font-bold">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[16px] text-[#999] line-through mb-1">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="prose prose-sm text-[#555] mb-8">
            <p>{product.description}</p>
          </div>

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium tracking-[0.05em] uppercase">
                  Màu sắc: <span className="font-bold">{selectedColor}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`relative w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                      selectedColor === c.name
                        ? "border-[#111] ring-2 ring-offset-2 ring-[#111]"
                        : "border-[#eaeaea] hover:border-[#999]"
                    }`}
                    style={{ backgroundColor: c.value }}
                    aria-label={`Chọn màu ${c.name}`}
                  >
                    {selectedColor === c.name && (
                      <Check className={`w-5 h-5 ${c.value === '#F7F4EE' || c.value === '#White' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium tracking-[0.05em] uppercase">Kích thước</span>
              <button className="text-[12px] text-[#777] underline underline-offset-4 hover:text-[#111]">
                Hướng dẫn chọn size
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`h-12 border text-[13px] font-medium uppercase tracking-[0.05em] rounded-sm transition-colors ${
                    selectedSize === s
                      ? "border-black bg-black text-white"
                      : "border-[#eaeaea] bg-white text-[#111] hover:border-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full h-[54px] bg-black text-white flex items-center justify-center gap-2 text-[13px] font-bold tracking-[0.1em] uppercase rounded-sm hover:bg-gray-800 transition-colors disabled:bg-[#eaeaea] disabled:text-[#999] disabled:cursor-not-allowed mb-8"
          >
            <ShoppingBag className="w-5 h-5" />
            {product.inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
          </button>

          {/* Features/Trust badges */}
          <div className="border-t border-[#eaeaea] pt-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[13px] text-[#555]">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <span>Sản phẩm chính hãng có NFC. Đổi trả trong vòng 7 ngày.</span>
            </div>
            <div className="flex items-center gap-3 text-[13px] text-[#555]">
              <Truck className="w-5 h-5 text-blue-600" />
              <span>Giao hàng toàn quốc. Miễn phí ship cho đơn từ 500k.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
