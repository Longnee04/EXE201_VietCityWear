"use client";

import { useState } from "react";
import Image from "next/image";
import { type Product, formatPrice } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import {
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  X,
  Sparkles,
  Box,
  Clock,
  Bell,
  Star,
  QrCode,
  ChevronDown,
  Layers,
  HelpCircle,
  RotateCcw,
} from "lucide-react";

const sizeChart = [
  { size: "S", chest: "100 cm", length: "68 cm", height: "1m50 – 1m60", weight: "45 – 55 kg" },
  { size: "M", chest: "106 cm", length: "71 cm", height: "1m60 – 1m70", weight: "55 – 65 kg" },
  { size: "L", chest: "112 cm", length: "74 cm", height: "1m70 – 1m78", weight: "65 – 75 kg" },
  { size: "XL", chest: "118 cm", length: "77 cm", height: "1m75 – 1m83", weight: "75 – 85 kg" },
  { size: "2XL", chest: "124 cm", length: "80 cm", height: "1m80+", weight: "85 – 95 kg" },
];

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();

  // Phân biệt sản phẩm áo thời trang và phụ kiện (móc khóa, thẻ địa danh, hộp 10 thẻ)
  const isApparel = !["keychain", "móc khóa", "card", "thẻ", "hộp", "box"].some((term) =>
    product.name.toLowerCase().includes(term)
  );
  const isComingSoon = product.badge === "COMING SOON" || !product.inStock;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name);
  const [selectedSize, setSelectedSize] = useState<string | null>(isApparel ? null : "One Size");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewSide, setViewSide] = useState<"front" | "back">("front");

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>("heritage");

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const currentImage = product.images[selectedImageIndex] || product.images[0];

  const handleAddToCart = () => {
    if (isComingSoon) {
      alert("Sản phẩm sắp mở bán, hiện chưa thể thêm vào giỏ hàng.");
      return;
    }

    if (isApparel && !selectedSize) {
      alert("Vui lòng chọn size áo trước khi thêm vào giỏ hàng");
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize || "One Size",
      color: selectedColor,
      image: currentImage || product.images[0],
    });
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-10 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Product Images (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Front / Back Toggle Tabs (chỉ hiện khi là áo và có từ 2 ảnh trở lên) */}
          {isApparel && product.images.length > 1 ? (
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="inline-flex rounded-lg bg-neutral-100 p-1">
                <button
                  onClick={() => {
                    setViewSide("front");
                    setSelectedImageIndex(0);
                  }}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                    viewSide === "front"
                      ? "bg-white text-black shadow-xs"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  Mặt trước
                </button>
                <button
                  onClick={() => {
                    setViewSide("back");
                    setSelectedImageIndex(1);
                  }}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                    viewSide === "back"
                      ? "bg-white text-black shadow-xs"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  Mặt sau
                </button>
              </div>
              <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline-block">
                {viewSide === "front" ? "TÊN THÀNH PHỐ & TYPOGRAPHY" : "HỌA TIẾT ĐỊA DANH DI SẢN"}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3 text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-widest">
              <span>HÌNH ẢNH CHI TIẾT SẢN PHẨM</span>
              <span>VIETCITYWEAR OFFICIAL</span>
            </div>
          )}

          {/* Main Visual Frame */}
          <div className="relative w-full aspect-[4/5] bg-[#FAF8F5] rounded-2xl overflow-hidden border border-neutral-200 shadow-sm transition-all">
            <Image
              src={currentImage}
              alt={`${product.name} - ${viewSide === "front" ? "Mặt trước" : "Mặt sau"}`}
              fill
              className="object-contain p-6 transition-all duration-300"
              priority
            />
            {isApparel && product.images.length > 1 && (
              <div className="absolute bottom-4 left-4 bg-black/85 backdrop-blur-xs text-white text-[9.5px] font-mono font-bold px-3 py-1.5 rounded-md tracking-widest uppercase">
                {viewSide === "front" ? "GÓC NHÌN: MẶT TRƯỚC" : "GÓC NHÌN: MẶT SAU"}
              </div>
            )}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs border border-neutral-200 text-neutral-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1">
              <QrCode className="w-3 h-3 text-black" />
              <span>QR CONNECTED</span>
            </div>
          </div>

          {/* Thumbnails list if multiple images exist */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    if (idx === 0) setViewSide("front");
                    else if (idx === 1) setViewSide("back");
                  }}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-[#FAF8F5] ${
                    selectedImageIndex === idx
                      ? "border-black ring-2 ring-black/20"
                      : "border-neutral-200 opacity-70 hover:opacity-100 hover:border-neutral-400"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Chi tiết ${idx + 1}`}
                    fill
                    className="object-contain p-1.5"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Actions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          {/* City & Badges */}
          <div className="flex items-center gap-2 mb-3">
            {product.city && (
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full">
                {product.city}
              </span>
            )}
            {product.badge && (
              <span
                className={`px-3 py-1 text-white text-[10px] font-mono font-bold tracking-[0.12em] uppercase rounded-full ${
                  product.badge === "COMING SOON"
                    ? "bg-[#8B4513]"
                    : product.badge === "NEW"
                    ? "bg-black"
                    : "bg-[#2C4C5E]"
                }`}
              >
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h1 className="text-2xl sm:text-3xl font-black leading-tight uppercase text-black mb-3">
            {product.name}
          </h1>

          {/* Social Proof / Rating */}
          <div className="flex items-center gap-2 mb-4 text-xs">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="font-bold text-black">5.0</span>
            <span className="text-neutral-400">•</span>
            <span className="text-neutral-500 font-medium">Bộ sưu tập Di sản Thăng Long Hà Nội</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="text-3xl font-black text-black">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-base text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="ml-auto text-[11px] font-mono font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              IN STOCK
            </span>
          </div>

          {/* Short description */}
          <div className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
            <p>{product.description}</p>
          </div>

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  Màu sắc: <span className="font-medium text-neutral-600">{selectedColor}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedColor === c.name
                        ? "border-black ring-2 ring-offset-2 ring-black scale-105"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                    style={{ backgroundColor: c.value }}
                    aria-label={`Chọn màu ${c.name}`}
                  >
                    {selectedColor === c.name && (
                      <Check
                        className={`w-4 h-4 ${
                          c.value === "#F7F4EE" || c.value === "#White"
                            ? "text-black"
                            : "text-white"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection & Guide trigger (chỉ hiển thị cho Áo) */}
          {isApparel && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  Kích thước áo {selectedSize ? `(${selectedSize})` : ""}
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs font-semibold text-neutral-800 underline underline-offset-4 hover:text-black flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Hướng dẫn chọn size</span>
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`h-12 rounded-lg border text-xs font-black uppercase tracking-wider transition-all ${
                      selectedSize === s
                        ? "border-black bg-black text-white shadow-sm"
                        : "border-neutral-200 bg-white text-neutral-800 hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button or Coming Soon Banner */}
          {isComingSoon ? (
            <div className="mb-6 space-y-3">
              <button
                disabled={true}
                className="w-full h-14 rounded-xl bg-[#8B4513] text-white flex items-center justify-center gap-2 text-xs font-bold tracking-[0.16em] uppercase cursor-not-allowed opacity-90 shadow-sm"
              >
                <Clock className="w-4 h-4" />
                SẢN PHẨM SẮP MỞ BÁN (COMING SOON)
              </button>
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
                <Bell className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold uppercase tracking-wider mb-0.5">Dự kiến phát hành đợt tới</p>
                  <p className="text-amber-800 leading-relaxed text-[11.5px]">
                    Sản phẩm đang trong giai đoạn hoàn thiện sản xuất giới hạn và chưa mở bán trực tiếp trên website. Quý khách vui lòng liên hệ fanpage hoặc theo dõi các kênh truyền thông chính thức để nhận thông báo ngay khi mở đặt hàng!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full h-14 rounded-xl bg-black text-white flex items-center justify-center gap-2.5 text-xs font-bold tracking-[0.16em] uppercase hover:bg-neutral-800 transition-all shadow-md hover:shadow-xl active:scale-[0.99] disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed mb-6"
            >
              <ShoppingBag className="w-4 h-4" />
              {product.inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
            </button>
          )}

          {/* Product Accordion Breakdown */}
          <div className="border-t border-neutral-200 divide-y divide-neutral-200 mb-6">
            {/* Accordion 1: Heritage & Inclusions */}
            <div className="py-3.5">
              <button
                onClick={() => toggleAccordion("heritage")}
                className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-black group"
              >
                <span className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-neutral-600 group-hover:text-black" />
                  <span>Quy cách đóng gói & Bộ sản phẩm</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                    openAccordion === "heritage" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "heritage" && (
                <div className="pt-3 text-xs text-neutral-600 space-y-2">
                  <ul className="space-y-1.5 pl-1">
                    {product.includes && product.includes.length > 0 ? (
                      product.includes.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                          <span>01 × Áo thun di sản chính hãng (Cotton 100% 250GSM)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                          <span>05 × Thẻ bưu thiếp địa danh văn hóa kèm câu chuyện di sản</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                          <span>01 × Móc khóa gỗ khắc mã QR kết nối trang trải nghiệm số</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                          <span>01 × Hộp quà đóng gói cao cấp Branded Box</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Accordion 2: Materials & Specs */}
            <div className="py-3.5">
              <button
                onClick={() => toggleAccordion("materials")}
                className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-black group"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-neutral-600 group-hover:text-black" />
                  <span>Chất liệu & Kỹ thuật dệt may cao cấp</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                    openAccordion === "materials" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "materials" && (
                <div className="pt-3 text-xs text-neutral-600 space-y-2 leading-relaxed">
                  <p>
                    • <strong>Chất vải:</strong> 100% Cotton Compact chải kỹ 250GSM, bề mặt mịn màng, thấm hút mồ hôi tự nhiên và đứng form chuẩn streetwear.
                  </p>
                  <p>
                    • <strong>Bo cổ:</strong> Dệt sợi spandex 2.8cm mật độ cao, chống dão và giữ cổ áo ôm gọn gàng sau nhiều lần giặt.
                  </p>
                  <p>
                    • <strong>Kỹ thuật in:</strong> In lụa thủ công Plastisol cao cấp sắc nét, giữ trọn chi tiết mỹ thuật của từng di sản.
                  </p>
                </div>
              )}
            </div>

            {/* Accordion 3: QR Guide */}
            <div className="py-3.5">
              <button
                onClick={() => toggleAccordion("qrguide")}
                className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-black group"
              >
                <span className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-neutral-600 group-hover:text-black" />
                  <span>Cách thức quét mã QR Di sản số</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                    openAccordion === "qrguide" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "qrguide" && (
                <div className="pt-3 text-xs text-neutral-600 space-y-2 leading-relaxed">
                  <p>
                    1. Mở camera điện thoại thông minh hoặc ứng dụng quét mã (Zalo, Google Lens).
                  </p>
                  <p>
                    2. Hướng máy ảnh vào mã QR khắc laser trên móc khóa hoặc mặt sau của bộ thẻ văn hóa.
                  </p>
                  <p>
                    3. Nhấn vào liên kết hiển thị trên màn hình để lập tức bước vào trang tương tác đa phương tiện, audio thuyết minh và bản đồ di sản 3D.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-xs text-neutral-700">
              <Sparkles className="w-4 h-4 text-black flex-shrink-0" />
              <span>Tích hợp mã QR kết nối di sản số độc quyền</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-neutral-700">
              <Truck className="w-4 h-4 text-black flex-shrink-0" />
              <span>Thanh toán COD toàn quốc & Chuyển khoản VietQR • Freeship từ 500.000₫</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-neutral-700">
              <RotateCcw className="w-4 h-4 text-black flex-shrink-0" />
              <span>Đổi trả 7 ngày minh bạch cho lỗi sản xuất và hỗ trợ đổi size</span>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal (chỉ có khi là áo) */}
      {isApparel && sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full p-6 rounded-2xl border border-neutral-200 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200 mb-4">
              <h3 className="text-base font-black uppercase tracking-tight text-black">
                BẢNG HƯỚNG DẪN CHỌN SIZE ÁO
              </h3>
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 mb-4">
              Form áo dáng Oversized thoải mái, phong cách streetwear. Nếu bạn thích mặc vừa người gọn gàng, có thể chọn lùi 1 size.
            </p>

            <div className="overflow-x-auto mb-4 rounded-lg border border-neutral-200">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-100 text-black border-b border-neutral-200">
                    <th className="p-2.5 font-bold uppercase">Size</th>
                    <th className="p-2.5 font-bold uppercase">Rộng ngực</th>
                    <th className="p-2.5 font-bold uppercase">Dài áo</th>
                    <th className="p-2.5 font-bold uppercase">Chiều cao</th>
                    <th className="p-2.5 font-bold uppercase">Cân nặng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {sizeChart.map((row) => (
                    <tr key={row.size} className="hover:bg-neutral-50">
                      <td className="p-2.5 font-black text-black">{row.size}</td>
                      <td className="p-2.5 text-neutral-600">{row.chest}</td>
                      <td className="p-2.5 text-neutral-600">{row.length}</td>
                      <td className="p-2.5 text-neutral-600">{row.height}</td>
                      <td className="p-2.5 text-neutral-600">{row.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-neutral-50 p-3.5 rounded-lg text-[11.5px] text-neutral-700 border border-neutral-200 mb-5">
              <strong>Mẹo chọn size:</strong> Người mẫu cao 1m75 nặng 68kg đang mặc size L.
            </div>

            <button
              onClick={() => setSizeGuideOpen(false)}
              className="w-full py-3 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-sm"
            >
              Đã hiểu & Quay lại chọn size
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
