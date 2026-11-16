"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles, Compass } from "lucide-react";
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
  coords?: string;
}

const defaultCityCollections: CityItem[] = [
  {
    id: "hanoi",
    name: "HÀ NỘI",
    region: "Miền Bắc",
    status: "active",
    badgeText: "CHÍNH THỨC PHÁT HÀNH",
    description: "5 địa danh di sản, bộ thẻ văn hóa và móc khóa gỗ QR kết nối không gian số.",
    landmarksCount: 5,
    href: "/#t-shirts",
    exploreHref: "/explore/hanoi",
    coords: "21.0285°N • 105.8542°E",
  },
  {
    id: "haiphong",
    name: "HẢI PHÒNG",
    region: "Miền Bắc",
    status: "second",
    badgeText: "HẢI PHÒNG CHAPTER",
    description: "Thành phố cảng hoa phượng đỏ, đậm tinh thần phóng khoáng và kiên cường miền biển.",
    landmarksCount: 3,
    href: "/products/ao-thun-hai-phong-heritage-tee",
    coords: "20.8449°N • 106.6881°E",
  },
  {
    id: "hue",
    name: "HUẾ",
    region: "Miền Trung",
    status: "upcoming",
    badgeText: "SẮP RA MẮT",
    description: "Cố đô vàng son trầm mặc bên dòng Hương Giang và đền đài lăng tẩm cổ kính.",
    coords: "16.4637°N • 107.5909°E",
  },
  {
    id: "hoian",
    name: "HỘI AN",
    region: "Miền Trung",
    status: "upcoming",
    badgeText: "SẮP RA MẮT",
    description: "Phố cổ rêu phong, ánh đèn lồng lung linh bên bờ sông Hoài và mái ngói âm dương.",
    coords: "15.8801°N • 108.3380°E",
  },
  {
    id: "danang",
    name: "ĐÀ NẴNG",
    region: "Miền Trung",
    status: "upcoming",
    badgeText: "SẮP RA MẮT",
    description: "Thành phố biển năng động, những cây cầu biểu tượng và dãy Ngũ Hành Sơn hùng vĩ.",
    coords: "16.0544°N • 108.2022°E",
  },
  {
    id: "saigon",
    name: "TP. HỒ CHÍ MINH",
    region: "Miền Nam",
    status: "upcoming",
    badgeText: "SẮP RA MẮT",
    description: "Nhịp sống hiện đại giao thoa kiến trúc Sài Gòn xưa và tinh thần phóng khoáng phương Nam.",
    coords: "10.8231°N • 106.6297°E",
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
              coords: existingDefault?.coords,
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
    <section id="collections" className="py-18 sm:py-26 border-t border-neutral-200/80 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2 h-2 bg-black rounded-full inline-block animate-ping" />
              <p className="text-[10.5px] font-mono font-bold tracking-[0.25em] uppercase text-neutral-500">
                HÀNH TRÌNH DI SẢN CÁC THÀNH PHỐ
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black uppercase">
              BỘ SƯU TẬP THÀNH PHỐ
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
            Mỗi thành phố là một câu chuyện lịch sử và văn hóa độc bản được tái hiện qua lăng kính thời trang đường phố đương đại.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cityList.map((city) => (
            <div
              key={city.id}
              className={`p-6 sm:p-7 rounded-xl border transition-all duration-300 flex flex-col justify-between group ${
                city.status === "active"
                  ? "border-black bg-gradient-to-b from-neutral-50 to-white shadow-md hover:shadow-xl hover:-translate-y-1"
                  : city.status === "second"
                  ? "border-neutral-300 bg-white hover:border-black hover:shadow-lg hover:-translate-y-1"
                  : "border-neutral-200/80 bg-neutral-50/60 opacity-85 hover:opacity-100 hover:border-neutral-300"
              }`}
            >
              <div>
                {/* Header tag */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase px-3 py-1 rounded-full shadow-2xs ${
                      city.status === "active"
                        ? "bg-black text-white"
                        : city.status === "second"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {city.badgeText}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{city.region}</span>
                  </div>
                </div>

                {/* City name */}
                <div className="flex items-baseline justify-between mb-1.5">
                  <h3 className="text-2xl sm:text-[26px] font-black text-black tracking-tight uppercase group-hover:text-black">
                    {city.name}
                  </h3>
                  {city.coords && (
                    <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline-block">
                      {city.coords}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-600 mb-6">
                  {city.description}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-neutral-100">
                {city.status === "active" ? (
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      href={city.exploreHref || "/explore/hanoi"}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-black text-white text-[11px] font-bold tracking-wider uppercase hover:bg-neutral-800 transition-all shadow-xs"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Chạm di sản số</span>
                    </Link>
                    <a
                      href={city.href || "/#t-shirts"}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-800 hover:text-black px-3 py-2 uppercase tracking-wider hover:underline"
                    >
                      <span>Xem áo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : city.status === "second" ? (
                  <Link
                    href={city.href || "/#t-shirts"}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-neutral-300 hover:border-black text-[11px] font-bold tracking-wider uppercase text-black hover:bg-black hover:text-white transition-all shadow-xs"
                  >
                    <span>Xem áo Hải Phòng (Coming Soon)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-400 uppercase tracking-wider font-mono">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Đang hoàn thiện thiết kế</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
