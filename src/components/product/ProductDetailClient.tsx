"use client";

import { useState } from "react";
import Image from "next/image";
import { type Product, formatPrice } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Check, X, Box, Clock, Bell, ChevronDown } from "lucide-react";

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
  const [openSection, setOpenSection] = useState<string | null>("packaging");

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Left: Images & View Angle */}
        <div className="flex flex-col gap-4">
          {/* Front / Back Toggle Tabs (chỉ hiện khi là áo và có từ 2 ảnh trở lên) */}
          {isApparel && product.images.length > 1 ? (
            <div className="flex items-center gap-2 border-b border-[#eaeaea] pb-2">
              <button
                onClick={() => {
                  setViewSide("front");
                  setSelectedImageIndex(0);
                }}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  viewSide === "front"
                    ? "bg-[#111] text-white"
                    : "bg-[#f5f5f5] text-[#666] hover:text-[#111]"
                }`}
              >
                Mặt trước
              </button>
              <button
                onClick={() => {
                  setViewSide("back");
                  setSelectedImageIndex(1);
                }}
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
          ) : (
            <div className="flex items-center justify-between border-b border-[#eaeaea] pb-2 text-[11px] font-semibold text-[#888] uppercase tracking-wider">
              <span>Hình ảnh chi tiết sản phẩm</span>
              <span>VIET CITY WEAR</span>
            </div>
          )}

          {/* Main Visual */}
          <div className="relative w-full aspect-[4/5] bg-[#F7F4EE] overflow-hidden border border-[#eaeaea]">
            <Image
              src={currentImage}
              alt={`${product.name} - ${viewSide === "front" ? "Mặt trước" : "Mặt sau"}`}
              fill
              className="object-contain p-4"
              priority
            />
            {isApparel && product.images.length > 1 && (
              <div className="absolute bottom-3 left-3 bg-[#111]/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 tracking-widest uppercase">
                {viewSide === "front" ? "GÓC NHÌN: MẶT TRƯỚC" : "GÓC NHÌN: MẶT SAU"}
              </div>
            )}
          </div>

          {/* Thumbnails list if multiple images exist */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    if (idx === 0) setViewSide("front");
                    else if (idx === 1) setViewSide("back");
                  }}
                  className={`relative w-16 h-16 overflow-hidden border transition-all flex-shrink-0 bg-[#F7F4EE] ${
                    selectedImageIndex === idx
                      ? "border-[#111]"
                      : "border-[#eaeaea] opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Chi tiết ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
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
              <span
                className={`px-2.5 py-0.5 text-white text-[10px] font-bold tracking-[0.1em] uppercase ${
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

          <h1 className="text-[24px] md:text-[30px] font-extrabold leading-tight uppercase text-[#111] mb-2">
            {product.name}
          </h1>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-[22px] font-bold text-[#111]">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[15px] text-[#999] line-through mb-1">
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
                    className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                      selectedColor === c.name
                        ? "border-[#111] ring-2 ring-offset-2 ring-[#111]"
                        : "border-[#eaeaea] hover:border-[#999]"
                    }`}
                    style={{ backgroundColor: c.value }}
                    aria-label={`Chọn màu ${c.name}`}
                  >
                    {selectedColor === c.name && (
                      <Check
                        className={`w-3.5 h-3.5 ${
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
          )}

          {/* Add to Cart Button or Coming Soon Banner */}
          {isComingSoon ? (
            <div className="mb-6 space-y-3">
              <button
                disabled={true}
                className="w-full h-[52px] bg-[#8B4513] text-white flex items-center justify-center gap-2 text-[12px] font-bold tracking-[0.15em] uppercase cursor-not-allowed opacity-90"
              >
                <Clock className="w-4 h-4" />
                SẢN PHẨM SẮP MỞ BÁN (COMING SOON)
              </button>
              <div className="p-3.5 bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <Bell className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold uppercase tracking-wider mb-0.5">Dự kiến phát hành đợt tới</p>
                  <p className="text-amber-800 leading-relaxed text-[11px]">
                    Sản phẩm đang trong giai đoạn hoàn thiện sản xuất giới hạn và chưa mở bán trực tiếp trên website. Quý khách vui lòng liên hệ fanpage hoặc theo dõi các kênh truyền thông chính thức để nhận thông báo ngay khi mở đặt hàng!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full h-[52px] bg-black text-white flex items-center justify-center gap-2 text-[12px] font-bold tracking-[0.15em] uppercase hover:bg-gray-800 transition-colors disabled:bg-[#eaeaea] disabled:text-[#999] disabled:cursor-not-allowed mb-6"
            >
              <ShoppingBag className="w-4 h-4" />
              {product.inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
            </button>
          )}

          {/* Clean Levents-style Accordion Information */}
          <div className="border-t border-[#eaeaea] divide-y divide-[#eaeaea] mb-6">
            {/* Tab 1: Packaging & Inclusions */}
            <div className="py-3">
              <button
                onClick={() => toggleSection("packaging")}
                className="w-full flex items-center justify-between text-left text-[12px] font-bold uppercase tracking-wider text-[#111]"
              >
                <span>Quy cách đóng gói & Bộ sản phẩm</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openSection === "packaging" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === "packaging" && (
                <div className="pt-3 text-xs text-[#555] space-y-1.5 leading-relaxed">
                  {product.includes && product.includes.length > 0 ? (
                    product.includes.map((item, idx) => (
                      <p key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#111] rounded-full flex-shrink-0" />
                        <span>{item}</span>
                      </p>
                    ))
                  ) : (
                    <>
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#111] rounded-full flex-shrink-0" />
                        <span>01 × Áo thun di sản chính hãng (Cotton 100% 250GSM)</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#111] rounded-full flex-shrink-0" />
                        <span>05 × Thẻ bưu thiếp địa danh văn hóa kèm câu chuyện di sản</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#111] rounded-full flex-shrink-0" />
                        <span>01 × Móc khóa gỗ khắc mã QR kết nối trang trải nghiệm số</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#111] rounded-full flex-shrink-0" />
                        <span>01 × Hộp quà đóng gói cao cấp Branded Box</span>
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Tab 2: Materials */}
            <div className="py-3">
              <button
                onClick={() => toggleSection("materials")}
                className="w-full flex items-center justify-between text-left text-[12px] font-bold uppercase tracking-wider text-[#111]"
              >
                <span>Chất liệu & Kỹ thuật dệt may</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openSection === "materials" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === "materials" && (
                <div className="pt-3 text-xs text-[#555] space-y-1.5 leading-relaxed">
                  <p>• <strong>Chất vải:</strong> 100% Cotton Compact 250GSM, bề mặt dệt mịn màng, thoáng khí tự nhiên, đứng form streetwear.</p>
                  <p>• <strong>Bo cổ:</strong> Dệt sợi spandex 2.8cm mật độ cao chống dão khi giặt máy.</p>
                  <p>• <strong>Hình in:</strong> In lụa Plastisol sắc nét, bền màu theo thời gian.</p>
                </div>
              )}
            </div>

            {/* Tab 3: QR Instructions */}
            <div className="py-3">
              <button
                onClick={() => toggleSection("qr")}
                className="w-full flex items-center justify-between text-left text-[12px] font-bold uppercase tracking-wider text-[#111]"
              >
                <span>Mã QR & Trải nghiệm số</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openSection === "qr" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === "qr" && (
                <div className="pt-3 text-xs text-[#555] space-y-1.5 leading-relaxed">
                  <p>1. Dùng camera điện thoại hoặc Zalo/Google Lens quét mã QR trên móc khóa hoặc mặt sau của bộ thẻ.</p>
                  <p>2. Nhấn vào liên kết để mở trang tương tác văn hóa, audio thuyết minh và bản đồ di sản 3D.</p>
                </div>
              )}
            </div>
          </div>

          {/* Simple Clean Policies */}
          <div className="border-t border-[#eaeaea] pt-4 text-xs text-[#666] space-y-2">
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#111] rounded-full flex-shrink-0" />
              <span>Giao hàng COD toàn quốc & Chuyển khoản VietQR • Freeship từ 500.000₫</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#111] rounded-full flex-shrink-0" />
              <span>Đổi trả minh bạch trong vòng 7 ngày cho lỗi sản xuất và hỗ trợ đổi size</span>
            </p>
          </div>
        </div>
      </div>

      {/* Size Guide Modal (chỉ có khi là áo) */}
      {isApparel && sizeGuideOpen && (
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
