"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Clock, Utensils, Compass, Sparkles } from "lucide-react";
import { HANOI_GUIDE, type Landmark } from "@/data/landmarks";
import { fetchLiveCityGuide } from "@/lib/landmarks-service";

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
  const [landmarks, setLandmarks] = useState<Landmark[]>(HANOI_GUIDE.landmarks);
  const [selectedLandmarkIdx, setSelectedLandmarkIdx] = useState(0);
  const [foodCategory, setFoodCategory] = useState<FoodCategory>("all");

  useEffect(() => {
    let ignore = false;
    async function loadLandmarks() {
      const guide = await fetchLiveCityGuide("Hà Nội");
      if (!ignore && guide && guide.landmarks.length > 0) {
        setLandmarks(guide.landmarks);
      }
    }
    loadLandmarks();
    return () => {
      ignore = true;
    };
  }, []);

  const currentLandmark = landmarks[selectedLandmarkIdx] || landmarks[0] || HANOI_GUIDE.landmarks[0];

  const filteredFoods = curatedFoods.filter((f) => {
    if (foodCategory === "all") return true;
    return f.category === foodCategory;
  });

  return (
    <section id="landmarks-and-food" className="py-18 sm:py-26 border-t border-neutral-200/80 bg-neutral-50/60">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Compass className="w-4 h-4 text-black" />
              <p className="text-[10.5px] font-mono font-bold tracking-[0.25em] uppercase text-neutral-500">
                TRẢI NGHIỆM DI SẢN SỐ
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black uppercase">
              ĐỊA DANH DI SẢN HÀ NỘI
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
            Mỗi thiết kế áo thun tương ứng với một biểu tượng lịch sử được kết nối trang đa phương tiện qua mã QR.
          </p>
        </div>

        {/* Part 1: 5 Landmarks Explorer */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 shadow-sm mb-14">
          {/* Landmark tab selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-neutral-100">
            {landmarks.map((landmark, idx) => (
              <button
                key={landmark.id}
                onClick={() => setSelectedLandmarkIdx(idx)}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all rounded-full shadow-2xs ${
                  selectedLandmarkIdx === idx
                    ? "bg-black text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black"
                }`}
              >
                0{landmark.order}. {landmark.name_vi}
              </button>
            ))}
          </div>

          {/* Active Landmark Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Visual Preview */}
            <div className="lg:col-span-5 relative aspect-[4/3] bg-neutral-100 rounded-xl border border-neutral-200 overflow-hidden shadow-inner">
              <Image
                src={currentLandmark.image}
                alt={currentLandmark.name_vi}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-3.5 left-3.5 bg-black/85 backdrop-blur-xs text-white text-[9.5px] font-mono font-bold px-3 py-1 rounded-sm tracking-widest uppercase">
                THẺ ĐỊA DANH #0{currentLandmark.order}
              </div>
            </div>

            {/* Information */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">
                  {currentLandmark.name_en}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mt-1">
                  {currentLandmark.name_vi}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-neutral-600 italic mt-1.5">
                  &quot;{currentLandmark.highlight_vi}&quot;
                </p>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {currentLandmark.story_vi}
              </p>

              {/* Coordinates / Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-neutral-100 text-xs text-neutral-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span>{currentLandmark.address}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span>{currentLandmark.best_time_vi}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  href="/explore/hanoi"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white text-xs font-bold tracking-wider uppercase hover:bg-neutral-800 transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Khám phá di sản số</span>
                </Link>
                <Link
                  href="/#t-shirts"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 hover:text-black hover:underline px-3 py-2 uppercase tracking-wider"
                >
                  <span>Xem mẫu áo tương ứng</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: Ăn gì – Chơi gì – Du lịch xung quanh */}
        <div className="border-t border-neutral-200 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-black" />
              <h3 className="text-lg sm:text-xl font-black uppercase text-black tracking-tight">
                ẨM THỰC & ĐIỂM HẸN VĂN HÓA XUNG QUANH
              </h3>
            </div>

            {/* Food Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setFoodCategory("all")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all shadow-2xs ${
                  foodCategory === "all"
                    ? "bg-black text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:text-black hover:bg-neutral-50"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFoodCategory("main")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all shadow-2xs ${
                  foodCategory === "main"
                    ? "bg-black text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:text-black hover:bg-neutral-50"
                }`}
              >
                Món chính
              </button>
              <button
                onClick={() => setFoodCategory("coffee")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all shadow-2xs ${
                  foodCategory === "coffee"
                    ? "bg-black text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:text-black hover:bg-neutral-50"
                }`}
              >
                Cà phê trứng
              </button>
              <button
                onClick={() => setFoodCategory("snack")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all shadow-2xs ${
                  foodCategory === "snack"
                    ? "bg-black text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:text-black hover:bg-neutral-50"
                }`}
              >
                Ăn vặt phố cổ
              </button>
            </div>
          </div>

          {/* Food spots cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredFoods.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-neutral-200/90 rounded-xl p-5 flex flex-col justify-between hover:border-black hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[9.5px] font-mono font-bold tracking-wider uppercase text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                      {item.categoryLabel}
                    </span>
                    <span className="text-[10.5px] text-neutral-400 font-medium">
                      Gần {item.nearLandmark}
                    </span>
                  </div>
                  <h4 className="text-[14px] font-bold text-black mb-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                    {item.dish}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11.5px] text-neutral-500 pt-3 border-t border-neutral-100">
                  <MapPin className="w-3.5 h-3.5 text-black flex-shrink-0" />
                  <span className="truncate">{item.address}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Footer banner */}
          <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-neutral-500">
              Xem bản đồ số, lịch trình và cẩm nang chi tiết tại trang Khám phá di sản.
            </span>
            <Link
              href="/explore/hanoi"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-xs flex-shrink-0"
            >
              <span>Xem cẩm nang đầy đủ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
