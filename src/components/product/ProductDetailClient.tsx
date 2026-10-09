"use client";

import { useState } from "react";
import Image from "next/image";
import { type Product, formatPrice } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Check, ShieldCheck, Truck, X, Sparkles, Box, QrCode } from "lucide-react";

const sizeChart = [
  { size: "S", chest: "100 cm", length: "68 cm", height: "1m50 – 1m60", weight: "45 – 55 kg" },
  { size: "M", chest: "106 cm", length: "71 cm", height: "1m60 – 1m70", weight: "55 – 65 kg" },
  { size: "L", chest: "112 cm", length: "74 cm", height: "1m70 – 1m78", weight: "65 – 75 kg" },
  { size: "XL", chest: "118 cm", length: "77 cm", height: "1m75 – 1m83", weight: "75 – 85 kg" },
  { size: "2XL", chest: "124 cm", length: "80 cm", height: "1m80+", weight: "85 – 95 kg" },
];

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [viewSide, setViewSide] = useState<"front" | "back">("front");
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Vui lòng chọn size áo trước khi thêm vào giỏ hàng");
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
        
        {/* Left: Images & View Angle */}
        <div className="flex flex-col gap-4">
          {/* Front / Back Toggle Tabs */}
          <div className="flex items-center gap-2 border-b border-[#eaeaea] pb-2">
            <button
              onClick={() => setViewSide("front")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                viewSide === "front"
                  ? "bg-[#111] text-white"
                  : "bg-[#f5f5f5] text-[#666] hover:text-[#111]"
              }`}
            >
              Mặt trước
            </button>
            <button
              onClick={() => setViewSide("back")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                viewSide === "back"
                  ? "bg-[#111] text-white"
                  : "bg-[#f5f5f5] text-[#666] hover:text-[#111]"
              }`}
            >
              Mặt sau
            </button>
            <span className="text-[11px] text-[#888] ml-auto">
              {viewSide === "front" ? "Tên thành phố & Logo" : "Họa tiết địa danh di sản"}
            </span>
          </div>

          {/* Main Visual */}
          <div className="relative w-full aspect-[4/5] bg-[#F7F4EE] rounded-sm overflow-hidden border border-[#eaeaea]">
            <Image
              src={product.images[0]}
              alt={`${product.name} - ${viewSide === "front" ? "Mặt trước" : "Mặt sau"}`}
              fill
              className="object-contain p-4"
              priority
            />
            <div className="absolute bottom-3 left-3 bg-[#111]/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 tracking-widest uppercase">
              {viewSide === "front" ? "GÓC NHÌN: MẶT TRƯỚC" : "GÓC NHÌN: MẶT SAU"}
            </div>
          </div>

          <p className="text-[11px] text-[#777] italic">
            * Mặt trước in tên thành phố và thương hiệu tối giản; mặt sau in hình minh họa địa danh di sản sắc nét.
          </p>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col mt-4 lg:mt-0">
          <div className="flex items-center gap-2 mb-3">
            {product.city && (
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#777] bg-[#f5f5f5] px-2.5 py-0.5">
                {product.city}
              </span>
            )}
            {product.badge && (
              <span className="px-2.5 py-0.5 bg-black text-white text-[10px] font-bold tracking-[0.1em] uppercase">
                {product.badge}
              </span>
            )}
          </div>
          
          <h1 className="text-[26px] md:text-[34px] font-extrabold leading-tight uppercase text-[#111] mb-2">
            {product.name}
          </h1>
          
          <div className="flex items-end gap-3 mb-6">
            <span className="text-[24px] font-bold text-[#111]">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[16px] text-[#999] line-through mb-1">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="prose prose-sm text-[#555] mb-6 border-y border-[#f0f0f0] py-4">
            <p className="text-xs sm:text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[12px] font-semibold tracking-[0.05em] uppercase text-[#111]">
                  Màu sắc: <span className="font-bold text-[#111]">{selectedColor}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`relative w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                      selectedColor === c.name
                        ? "border-[#111] ring-2 ring-offset-2 ring-[#111]"
                        : "border-[#eaeaea] hover:border-[#999]"
                    }`}
                    style={{ backgroundColor: c.value }}
                    aria-label={`Chọn màu ${c.name}`}
                  >
                    {selectedColor === c.name && (
                      <Check className={`w-4 h-4 ${c.value === '#F7F4EE' || c.value === '#White' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection & Guide trigger */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[12px] font-semibold tracking-[0.05em] uppercase text-[#111]">
                Kích thước áo {selectedSize ? `(${selectedSize})` : ""}
              </span>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-[12px] font-semibold text-[#111] underline underline-offset-4 hover:text-[#555]"
              >
                Hướng dẫn chọn size
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`h-11 border text-[12px] font-bold uppercase tracking-[0.05em] transition-colors ${
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

          {/* Product Inclusions Preview */}
          <div className="mb-6 p-3.5 bg-[#fafafa] border border-[#eaeaea]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#111] mb-2 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5" />
              <span>Quy cách đóng gói & Bộ sản phẩm:</span>
            </p>
            <ul className="text-xs text-[#555] space-y-1.5">
              {product.includes && product.includes.length > 0 ? (
                product.includes.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#111] rounded-full flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#111] rounded-full" />
                    <span>01 Sản phẩm chính hãng VIET CITY WEAR</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#111] rounded-full" />
                    <span>Thẻ bảo hành & Hướng dẫn trải nghiệm số</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full h-[52px] bg-black text-white flex items-center justify-center gap-2 text-[12px] font-bold tracking-[0.15em] uppercase hover:bg-gray-800 transition-colors disabled:bg-[#eaeaea] disabled:text-[#999] disabled:cursor-not-allowed mb-6"
          >
            <ShoppingBag className="w-4 h-4" />
            {product.inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
          </button>

          {/* Trust Badges */}
          <div className="border-t border-[#eaeaea] pt-5 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-xs text-[#555]">
              <Sparkles className="w-4 h-4 text-[#111] flex-shrink-0" />
              <span>Chạm NFC hoặc quét QR mở trang câu chuyện di sản song ngữ Việt - Anh.</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#555]">
              <Truck className="w-4 h-4 text-[#111] flex-shrink-0" />
              <span>Thanh toán COD khi nhận hàng. Freeship cho đơn từ 500.000₫.</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#555]">
              <ShieldCheck className="w-4 h-4 text-[#111] flex-shrink-0" />
              <span>Đổi trả trong 7 ngày nếu lỗi từ nhà sản xuất.</span>
            </div>
          </div>

        </div>
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white max-w-lg w-full p-6 border border-[#111] shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaeaea] mb-4">
              <h3 className="text-base font-extrabold uppercase tracking-tight text-[#111]">
                BẢNG HƯỚNG DẪN CHỌN SIZE ÁO
              </h3>
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="p-1 text-[#888] hover:text-[#111]"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#666] mb-4">
              Form áo dáng Oversized thoải mái, phong cách streetwear. Nếu bạn thích mặc vừa người gọn gàng, có thể chọn lùi 1 size.
            </p>

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#f5f5f5] text-[#111] border-b border-[#ddd]">
                    <th className="p-2.5 font-bold uppercase">Size</th>
                    <th className="p-2.5 font-bold uppercase">Rộng ngực</th>
                    <th className="p-2.5 font-bold uppercase">Dài áo</th>
                    <th className="p-2.5 font-bold uppercase">Chiều cao</th>
                    <th className="p-2.5 font-bold uppercase">Cân nặng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee]">
                  {sizeChart.map((row) => (
                    <tr key={row.size} className="hover:bg-[#fafafa]">
                      <td className="p-2.5 font-bold text-[#111]">{row.size}</td>
                      <td className="p-2.5 text-[#555]">{row.chest}</td>
                      <td className="p-2.5 text-[#555]">{row.length}</td>
                      <td className="p-2.5 text-[#555]">{row.height}</td>
                      <td className="p-2.5 text-[#555]">{row.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-[#fafafa] p-3 text-[11px] text-[#666] border border-[#eaeaea] mb-4">
              <strong>Mẹo chọn size:</strong> Người mẫu cao 1m75 nặng 68kg đang mặc size L.
            </div>

            <button
              onClick={() => setSizeGuideOpen(false)}
              className="w-full py-2.5 bg-[#111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333]"
            >
              Đã hiểu & Quay lại chọn size
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
