"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface CityItem {
  id: string;
  name: string;
  region: string;
  status: "active" | "second" | "upcoming";
  badgeText: string;
  description: string;
  landmarksCount?: number;
  href?: string;
  exploreHref?: string;
}

const defaultCityCollections: CityItem[] = [
  {
    id: "hanoi",
    name: "HÀ NỘI",
    region: "Miền Bắc",
    status: "active",
    badgeText: "CHÍNH THỨC PHÁT HÀNH",
    description: "Thủ đô ngàn năm văn hiến. Trọn vẹn với 5 địa danh di sản, bộ thẻ Hanoi Story Cards và móc khóa gỗ NFC.",
    landmarksCount: 5,
    href: "/#t-shirts",
    exploreHref: "/explore/hanoi",
  },
  {
    id: "haiphong",
    name: "HẢI PHÒNG",
    region: "Miền Bắc",
    status: "second",
    badgeText: "HẢI PHÒNG CHAPTER",
    description: "Thành phố cảng hoa phượng đỏ. Ghi dấu tọa độ 20.8449°N, 106.6881°E và tinh thần phóng khoáng miền duyên hải.",
    landmarksCount: 3,
    href: "/products/ao-thun-hai-phong-heritage-tee",
  },
  {
    id: "hue",
    name: "HUẾ",
    region: "Miền Trung",
    status: "upcoming",
    badgeText: "SẮP RA MẮT",
    description: "Cố đô vàng son bên dòng Hương Giang, lăng tẩm uy nghiêm và nét trầm mặc thi vị của miền di sản cung đình.",
  },
  {
    id: "hoian",
    name: "HỘI AN",
    region: "Miền Trung",
    status: "upcoming",
    badgeText: "SẮP RA MẮT",
    description: "Thương cảng cổ thế kỷ 16 với những mái ngói rêu phong, ánh đèn lồng rực rỡ và nhịp sống êm đềm bên sông Hoài.",
  },
  {
    id: "danang",
    name: "ĐÀ NẴNG",
    region: "Miền Trung",
    status: "upcoming",
    badgeText: "SẮP RA MẮT",
    description: "Thành phố đáng sống với những cây cầu biểu tượng, đỉnh Bà Nà hùng vĩ và bãi biển xanh cát trắng hiện đại.",
  },
  {
    id: "saigon",
    name: "TP. HỒ CHÍ MINH",
    region: "Miền Nam",
    status: "upcoming",
    badgeText: "SẮP RA MẮT",
    description: "Nhịp đập năng động, giao thoa kiến trúc Sài Gòn xưa và tinh thần chuyển mình trẻ trung của đô thị phương Nam.",
  },
];

export default function CityCollections() {
  const [cityList, setCityList] = useState<CityItem[]>(defaultCityCollections);

  useEffect(() => {
    async function loadDbCities() {
      try {
        const [{ data: dbCities }, { data: dbLandmarks }] = await Promise.all([
          supabase.from("cities").select("*").order("created_at", { ascending: true }),
          supabase.from("landmarks").select("id, city_id"),
        ]);

        if (dbCities && dbCities.length > 0) {
          const mapped: CityItem[] = dbCities.map((c, idx) => {
            const count = (dbLandmarks || []).filter((lm) => lm.city_id === c.id).length;
            const normalizedName = c.name.toUpperCase();
            const existingDefault = defaultCityCollections.find(
              (dc) => dc.name.toUpperCase() === normalizedName
            );

            return {
              id: c.id,
              name: c.name.toUpperCase(),
              region: existingDefault?.region || (idx < 2 ? "Miền Bắc" : "Miền Trung"),
              status: idx === 0 ? "active" : idx === 1 ? "second" : "upcoming",
              badgeText:
                idx === 0
                  ? "CHÍNH THỨC PHÁT HÀNH"
                  : idx === 1
                  ? "ĐANG PHÁT HÀNH"
                  : "SẮP RA MẮT",
              description:
                c.description ||
                existingDefault?.description ||
                `Hành trình văn hóa và di sản tại ${c.name}.`,
              landmarksCount: count || existingDefault?.landmarksCount || 3,
              href: existingDefault?.href || "/#t-shirts",
              exploreHref: existingDefault?.exploreHref || "/explore/hanoi",
            };
          });

          setCityList(mapped);
        }
      } catch (err) {
        console.warn("Lỗi tải thành phố từ Supabase, dùng dữ liệu mặc định:", err);
      }
    }

    loadDbCities();
  }, []);

  return (
    <section id="collections" className="py-16 sm:py-24 border-t border-[#eaeaea] bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[#111] rounded-full inline-block" />
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#777]">
                Hành trình các thành phố
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111] uppercase">
              BỘ SƯU TẬP THÀNH PHỐ
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#666] max-w-md">
            Khởi đầu tại Hà Nội và Hải Phòng, VIET CITY WEAR tiếp tục hành trình lưu giữ câu chuyện và văn hóa của từng mảnh đất Việt Nam.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cityList.map((city) => (
            <div
              key={city.id}
              className={`p-6 sm:p-7 border transition-all flex flex-col justify-between ${
                city.status === "active"
                  ? "border-[#111] bg-[#fafafa] shadow-xs"
                  : city.status === "second"
                  ? "border-[#eaeaea] bg-white hover:border-[#111]"
                  : "border-[#f0f0f0] bg-[#fafafa]/50 opacity-80"
              }`}
            >
              <div>
                {/* Header tag */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 ${
                      city.status === "active"
                        ? "bg-[#111] text-white"
                        : city.status === "second"
                        ? "bg-[#e5e5e5] text-[#111]"
                        : "bg-[#f0f0f0] text-[#888]"
                    }`}
                  >
                    {city.badgeText}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#888]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{city.region}</span>
                  </div>
                </div>

                {/* City name */}
                <h3 className="text-xl sm:text-2xl font-black text-[#111] tracking-tight uppercase mb-2">
                  {city.name}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-[13px] leading-relaxed text-[#555] mb-6">
                  {city.description}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#eaeaea]">
                {city.status === "active" ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={city.exploreHref || "/explore/hanoi"}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#111] text-white text-[11px] font-bold tracking-wider uppercase hover:bg-[#333] transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Chạm di sản số</span>
                    </Link>
                    <a
                      href={city.href || "/#t-shirts"}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#111] hover:underline px-2 py-2"
                    >
                      <span>Xem áo</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                ) : city.status === "second" ? (
                  <Link
                    href={city.href || "/#t-shirts"}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#111] hover:underline"
                  >
                    <span>Xem áo Hải Phòng</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="text-[11px] font-medium text-[#999] tracking-wider uppercase">
                    Sắp phát hành • Coming Soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
