import { Package, Star, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const packages = [
  {
    tier: "Cơ bản",
    price: "249.000",
    icon: Package,
    color: "slate",
    description: "Trải nghiệm đầu tiên với di sản Việt",
    includes: [
      "01 Áo thun Heritage chất lượng cao",
      "Thiết kế riêng theo thành phố",
      "Chất liệu Cotton thoáng mát",
      "Bảng size đa dạng: S → 2XL",
    ],
    featured: false,
    badge: null,
  },
  {
    tier: "Tiêu chuẩn",
    price: "299.000",
    icon: Star,
    color: "red",
    description: "Bộ sưu tập kết hợp công nghệ NFC",
    includes: [
      "01 Áo thun Heritage chất lượng cao",
      "01 Thẻ địa danh văn hóa minh họa",
      "01 Móc khóa NFC tích hợp chip thông minh",
      "Truy cập trang trải nghiệm NFC đa ngôn ngữ",
    ],
    featured: true,
    badge: "Phổ biến nhất",
  },
  {
    tier: "Đặc biệt",
    price: "349.000",
    icon: Crown,
    color: "amber",
    description: "Trải nghiệm du lịch số toàn diện",
    includes: [
      "01 Áo thun Heritage phiên bản giới hạn",
      "01 Thẻ địa danh phiên bản Premium",
      "01 Móc khóa NFC với AR tương tác",
      "Trợ lý AI du lịch bản địa thông minh",
      "Mã kích hoạt Hộ chiếu số (Digital Passport)",
    ],
    featured: false,
    badge: "Premium",
  },
];

export default function ProductsSection() {
  return (
    <section id="products" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-700">
            Bộ sưu tập
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Chọn gói trải nghiệm của bạn
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 leading-relaxed">
            Ba phân loại sản phẩm phù hợp cho mọi du khách — từ chiếc áo lưu niệm đơn giản
            đến bộ trải nghiệm du lịch số toàn diện với NFC, AI và AR.
          </p>
        </div>

        {/* Package Cards */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            const isFeatured = pkg.featured;

            return (
              <div
                key={pkg.tier}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-8 transition-all duration-300 hover:shadow-xl",
                  isFeatured
                    ? "border-red-200 bg-red-50/50 shadow-lg shadow-red-100/50 ring-2 ring-red-600 scale-[1.02] lg:scale-105"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                {/* Badge */}
                {pkg.badge && (
                  <div
                    className={cn(
                      "absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold",
                      isFeatured
                        ? "bg-red-600 text-white"
                        : "bg-amber-100 text-amber-800"
                    )}
                  >
                    {pkg.badge}
                  </div>
                )}

                {/* Icon & Tier */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl",
                      pkg.color === "red"
                        ? "bg-red-100 text-red-700"
                        : pkg.color === "amber"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-700"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Gói {pkg.tier}</h3>
                    <p className="text-xs text-slate-500">{pkg.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                    {pkg.price}
                  </span>
                  <span className="text-base font-medium text-slate-400">đ</span>
                </div>

                {/* Features List */}
                <ul className="mt-8 flex-1 space-y-3">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div
                        className={cn(
                          "mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-white",
                          isFeatured ? "bg-red-600" : "bg-slate-800"
                        )}
                      >
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-sm leading-relaxed text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={cn(
                    "mt-8 w-full rounded-full py-3 text-sm font-semibold transition-all",
                    isFeatured
                      ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-200"
                      : "border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50"
                  )}
                >
                  Chọn gói {pkg.tier}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
