"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Clock, Utensils, Compass, Sparkles } from "lucide-react";
import { HANOI_GUIDE } from "@/data/landmarks";

type FoodCategory = "all" | "main" | "coffee" | "snack";

interface CuratedFoodItem {
  name: string;
  category: "main" | "coffee" | "snack";
  categoryLabel: string;
  dish: string;
  address: string;
  nearLandmark: string;
}

const curatedFoods: CuratedFoodItem[] = [
  {
    name: "Phở Gia Truyền Bát Đàn",
    category: "main",
    categoryLabel: "Món chính",
    dish: "Phở bò tái lăn nước dùng trong thanh, quế hồi ngọt xương",
    address: "49 Bát Đàn, Hoàn Kiếm",
    nearLandmark: "Phố Cổ Hà Nội",
  },
  {
    name: "Cà phê Đinh (Bà Bích)",
    category: "coffee",
    categoryLabel: "Cà phê & Đồ uống",
    dish: "Cà phê trứng béo mịn ngắm trọn tháp Rùa và liễu rủ",
    address: "Tầng 2, 13 Đinh Tiên Hoàng",
    nearLandmark: "Hồ Hoàn Kiếm",
  },
  {
    name: "Bún chả Hàng Quạt",
    category: "main",
    categoryLabel: "Món chính",
    dish: "Bún chả nướng than hoa thơm lừng trong ngõ hẹp",
    address: "Ngõ 74 Hàng Quạt, Hoàn Kiếm",
    nearLandmark: "Phố Cổ Hà Nội",
  },
  {
    name: "Kem Tràng Tiền",
    category: "snack",
    categoryLabel: "Ăn vặt & Tráng miệng",
    dish: "Kem que đậu xanh bùi béo và ốc quế cốm xanh thơm nức",
    address: "35 Tràng Tiền, Hoàn Kiếm",
    nearLandmark: "Hồ Hoàn Kiếm",
  },
  {
    name: "Trà chanh & Nem nướng Ấu Triệu",
    category: "snack",
    categoryLabel: "Ăn vặt & Tráng miệng",
    dish: "Nem nướng dính than hồng ăn kèm trà chanh hoa nhài",
    address: "10 Ấu Triệu, Hoàn Kiếm",
    nearLandmark: "Nhà Thờ Lớn",
  },
  {
    name: "Bún chả Sinh Từ",
    category: "main",
    categoryLabel: "Món chính",
    dish: "Bún chả gia truyền đậm đà nước chấm chua ngọt",
    address: "57 Nguyễn Khuyến, Đống Đa",
    nearLandmark: "Văn Miếu – Quốc Tử Giám",
  },
];

export default function LandmarkHighlights() {
  const [selectedLandmarkIdx, setSelectedLandmarkIdx] = useState(0);
  const [foodCategory, setFoodCategory] = useState<FoodCategory>("all");

  const currentLandmark = HANOI_GUIDE.landmarks[selectedLandmarkIdx];

  const filteredFoods = curatedFoods.filter((f) => {
    if (foodCategory === "all") return true;
    return f.category === foodCategory;
  });

  return (
    <section id="landmarks-and-food" className="py-16 sm:py-24 border-t border-[#eaeaea] bg-[#fafafa]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 text-[#111]" />
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#777]">
                Trải nghiệm du lịch & Văn hóa
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111] uppercase">
              ĐỊA DANH & CẨM NANG HÀ NỘI
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#666] max-w-md">
            Mỗi chiếc áo kết nối một câu chuyện di sản. Dưới đây là 5 địa danh trên áo Hà Nội và những gợi ý ẩm thực không thể bỏ lỡ.
          </p>
        </div>

        {/* Part 1: 5 Landmarks Explorer */}
        <div className="bg-white border border-[#eaeaea] rounded-sm p-6 sm:p-8 mb-12">
          {/* Landmark tab selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-[#f0f0f0]">
            {HANOI_GUIDE.landmarks.map((landmark, idx) => (
              <button
                key={landmark.id}
                onClick={() => setSelectedLandmarkIdx(idx)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors rounded-none ${
                  selectedLandmarkIdx === idx
                    ? "bg-[#111] text-white"
                    : "bg-[#f5f5f5] text-[#555] hover:bg-[#eee] hover:text-[#111]"
                }`}
              >
                0{landmark.order}. {landmark.name_vi}
              </button>
            ))}
          </div>

          {/* Active Landmark Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Preview */}
            <div className="lg:col-span-5 relative aspect-[4/3] bg-[#f5f5f5] border border-[#eaeaea] overflow-hidden">
              <Image
                src={currentLandmark.image}
                alt={currentLandmark.name_vi}
                fill
                className="object-contain p-4"
              />
              <div className="absolute top-3 left-3 bg-[#111] text-white text-[9px] font-bold px-2.5 py-1 tracking-widest uppercase">
                THẺ ĐỊA DANH #0{currentLandmark.order}
              </div>
            </div>

            {/* Information */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888]">
                  {currentLandmark.name_en}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#111] uppercase tracking-tight mt-1">
                  {currentLandmark.name_vi}
                </h3>
                <p className="text-xs font-semibold text-[#555] italic mt-1">
                  &quot;{currentLandmark.highlight_vi}&quot;
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#444] leading-relaxed">
                {currentLandmark.story_vi}
              </p>

              {/* Coordinates / Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#f0f0f0] text-xs text-[#666]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#111] flex-shrink-0 mt-0.5" />
                  <span>{currentLandmark.address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#111] flex-shrink-0 mt-0.5" />
                  <span>{currentLandmark.best_time_vi}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  href="/explore/hanoi"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#111] text-white text-[11px] font-bold tracking-wider uppercase hover:bg-[#333] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Khám phá di sản số</span>
                </Link>
                <Link
                  href="/#t-shirts"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#111] hover:underline px-2 py-2"
                >
                  <span>Xem mẫu áo tương ứng</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: Ăn gì – Chơi gì – Du lịch xung quanh */}
        <div className="border-t border-[#eaeaea] pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#111]" />
              <h3 className="text-lg sm:text-xl font-bold uppercase text-[#111] tracking-tight">
                ĂN GÌ – CHƠI GÌ GẦN ĐỊA DANH?
              </h3>
            </div>

            {/* Food Filter Pills */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFoodCategory("all")}
                className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors ${
                  foodCategory === "all"
                    ? "bg-[#111] text-white"
                    : "bg-white text-[#666] border border-[#e5e5e5] hover:text-[#111]"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFoodCategory("main")}
                className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors ${
                  foodCategory === "main"
                    ? "bg-[#111] text-white"
                    : "bg-white text-[#666] border border-[#e5e5e5] hover:text-[#111]"
                }`}
              >
                Món chính
              </button>
              <button
                onClick={() => setFoodCategory("coffee")}
                className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors ${
                  foodCategory === "coffee"
                    ? "bg-[#111] text-white"
                    : "bg-white text-[#666] border border-[#e5e5e5] hover:text-[#111]"
                }`}
              >
                Cà phê trứng
              </button>
              <button
                onClick={() => setFoodCategory("snack")}
                className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors ${
                  foodCategory === "snack"
                    ? "bg-[#111] text-white"
                    : "bg-white text-[#666] border border-[#e5e5e5] hover:text-[#111]"
                }`}
              >
                Ăn vặt phố cổ
              </button>
            </div>
          </div>

          {/* Food spots cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFoods.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#eaeaea] p-4 flex flex-col justify-between hover:border-[#111] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold tracking-wider uppercase text-[#888] bg-[#f5f5f5] px-2 py-0.5">
                      {item.categoryLabel}
                    </span>
                    <span className="text-[10px] text-[#777] font-medium">
                      Gần {item.nearLandmark}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#111] mb-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#555] leading-relaxed mb-3">
                    {item.dish}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#777] pt-2 border-t border-[#f5f5f5]">
                  <MapPin className="w-3 h-3 text-[#111] flex-shrink-0" />
                  <span className="truncate">{item.address}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Footer banner */}
          <div className="mt-8 p-4 sm:p-5 bg-white border border-[#eaeaea] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#111]">
                Cần thêm gợi ý du lịch và timeline di chuyển?
              </p>
              <p className="text-xs text-[#666] mt-0.5">
                Chạm NFC trên móc khóa hoặc quét QR trên thẻ để mở bản đồ số và thuyết minh audio song ngữ.
              </p>
            </div>
            <Link
              href="/explore/hanoi"
              className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#111] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#333] transition-colors flex-shrink-0"
            >
              <span>Xem trang trải nghiệm Hà Nội</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
