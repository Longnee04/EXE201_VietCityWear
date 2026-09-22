import { MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const cities = [
  {
    name: "Hà Nội",
    slug: "ha-noi",
    tagline: "Ngàn năm văn hiến",
    landmarks: ["Hồ Hoàn Kiếm", "Văn Miếu", "Phố cổ 36 phố phường"],
    gradient: "from-red-600 to-rose-700",
    available: true,
  },
  {
    name: "Huế",
    slug: "hue",
    tagline: "Cố đô mộng mơ",
    landmarks: ["Đại Nội", "Chùa Thiên Mụ", "Sông Hương"],
    gradient: "from-purple-600 to-violet-700",
    available: false,
  },
  {
    name: "Hội An",
    slug: "hoi-an",
    tagline: "Phố cổ đèn lồng",
    landmarks: ["Chùa Cầu", "Phố cổ Hội An", "Làng rau Trà Quế"],
    gradient: "from-amber-500 to-orange-600",
    available: false,
  },
  {
    name: "Đà Nẵng",
    slug: "da-nang",
    tagline: "Thành phố đáng sống",
    landmarks: ["Cầu Rồng", "Bà Nà Hills", "Bán đảo Sơn Trà"],
    gradient: "from-cyan-500 to-blue-600",
    available: false,
  },
  {
    name: "TP. Hồ Chí Minh",
    slug: "ho-chi-minh",
    tagline: "Hòn ngọc Viễn Đông",
    landmarks: ["Nhà thờ Đức Bà", "Bến Nhà Rồng", "Chợ Bến Thành"],
    gradient: "from-emerald-500 to-teal-600",
    available: false,
  },
  {
    name: "Đà Lạt",
    slug: "da-lat",
    tagline: "Thành phố ngàn hoa",
    landmarks: ["Hồ Xuân Hương", "Đồi Mộng Mơ", "Ga Đà Lạt"],
    gradient: "from-pink-500 to-rose-600",
    available: false,
  },
];

export default function CitiesSection() {
  return (
    <section id="cities" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-700">
            Bộ sưu tập thành phố
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Mỗi thành phố — Một câu chuyện di sản
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 leading-relaxed">
            Bắt đầu với Hà Nội, lộ trình mở rộng đến các thành phố di sản khắp Việt Nam.
            Sưu tầm đủ bộ để mở khóa đặc quyền trong Hộ chiếu số.
          </p>
        </div>

        {/* City Grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <div
              key={city.slug}
              className={cn(
                "group relative overflow-hidden rounded-2xl transition-all duration-300",
                city.available
                  ? "cursor-pointer hover:shadow-2xl hover:-translate-y-1"
                  : "opacity-75"
              )}
            >
              {/* Background */}
              <div
                className={cn(
                  "h-56 bg-gradient-to-br p-6 flex flex-col justify-between",
                  city.gradient
                )}
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 text-white/80">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs font-medium">{city.tagline}</span>
                  </div>
                  {city.available ? (
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      Có sẵn
                    </span>
                  ) : (
                    <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur-sm">
                      Sắp ra mắt
                    </span>
                  )}
                </div>

                {/* City Info */}
                <div>
                  <h3 className="text-2xl font-extrabold text-white">{city.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {city.landmarks.map((landmark) => (
                      <span
                        key={landmark}
                        className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm"
                      >
                        {landmark}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="flex items-center justify-between border border-t-0 border-slate-200 bg-white px-6 py-4 rounded-b-2xl">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{city.name} Collection</p>
                  <p className="text-xs text-slate-500">
                    {city.available ? "3 gói sản phẩm" : "Đang phát triển"}
                  </p>
                </div>
                {city.available && (
                  <a
                    href="#products"
                    className="flex items-center gap-1 text-sm font-semibold text-red-700 transition-colors group-hover:text-red-800"
                  >
                    Xem
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
