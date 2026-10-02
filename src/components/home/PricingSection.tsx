export default function PricingSection() {
  const packages = [
    {
      name: "Gói Cơ bản",
      price: "249.000đ",
      features: [
        "Áo thun văn hóa",
        "3 thẻ địa danh",
      ],
      isPopular: false,
    },
    {
      name: "Gói Tiêu chuẩn",
      price: "299.000đ",
      badge: "PHỔ BIẾN NHẤT",
      features: [
        "Áo thun văn hóa",
        "5 thẻ địa danh",
        "Móc khóa NFC",
      ],
      isPopular: true,
    },
    {
      name: "Gói Phiên bản đặc biệt",
      price: "349.000đ",
      badge: "ĐẶC BIỆT",
      features: [
        "Áo chất liệu tốt hơn",
        "5 thẻ địa danh",
        "Móc khóa NFC",
        "Hộp đẹp",
      ],
      isPopular: false,
    },
  ];

  return (
    <section id="pricing" className="py-16 sm:py-24 border-t border-[#eaeaea] bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#999] mb-2">
            Bảng giá sản phẩm
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111] uppercase">
            CÁC GÓI SẢN PHẨM
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#666]">
            Lựa chọn gói sản phẩm phù hợp để lưu giữ kỷ niệm thành phố và câu chuyện di sản.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`relative rounded-xl p-7 sm:p-8 flex flex-col justify-between transition-all ${
                pkg.isPopular
                  ? "bg-white border-2 border-[#111] shadow-lg md:scale-105 z-10"
                  : "bg-[#fafafa] border border-[#eaeaea]"
              }`}
            >
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#111] text-white text-[10px] font-semibold tracking-wider px-3 py-0.5 uppercase">
                  {pkg.badge}
                </div>
              )}

              <div>
                <div className="text-center pb-6 border-b border-[#eaeaea]">
                  <h3 className="text-base font-bold text-[#111] uppercase mb-1">
                    {pkg.name}
                  </h3>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#111] tracking-tight">
                    {pkg.price}
                  </div>
                </div>

                <div className="py-6 space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#999]">
                    Bao gồm:
                  </p>
                  <ul className="space-y-2.5">
                    {pkg.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#333]">
                        <svg
                          className="w-4 h-4 text-[#111] flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  className={`w-full py-3 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                    pkg.isPopular
                      ? "bg-[#111] text-white hover:bg-[#333]"
                      : "bg-white border border-[#111] text-[#111] hover:bg-[#111] hover:text-white"
                  }`}
                >
                  Chọn {pkg.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
