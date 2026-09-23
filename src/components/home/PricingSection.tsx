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
      badge: "Phổ biến nhất",
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
      badge: "Đặc biệt",
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
    <section id="pricing" className="py-16 sm:py-24 border-t border-[#E5DFD5] bg-[#F7F4EE]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#B4532A] mb-2">
            Bảng giá sản phẩm
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A2421] uppercase">
            CÁC GÓI SẢN PHẨM
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#1A2421]/70">
            Lựa chọn gói sản phẩm phù hợp để lưu giữ kỷ niệm thành phố và câu chuyện di sản.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`relative bg-white rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all ${
                pkg.isPopular
                  ? "border-2 border-[#B4532A] shadow-md md:scale-105 z-10"
                  : "border border-[#E5DFD5] shadow-xs"
              }`}
            >
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B4532A] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                  {pkg.badge}
                </div>
              )}

              <div>
                <div className="text-center pb-6 border-b border-[#E5DFD5]">
                  <h3 className="text-lg font-bold text-[#1A2421] mb-1">
                    {pkg.name}
                  </h3>
                  <div className="text-3xl sm:text-4xl font-black text-[#1A2421] tracking-tight">
                    {pkg.price}
                  </div>
                </div>

                <div className="py-6 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#1A2421]/60">
                    Bao gồm:
                  </p>
                  <ul className="space-y-2.5">
                    {pkg.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs sm:text-sm text-[#1A2421]/80">
                        <svg
                          className="w-4 h-4 text-[#B4532A] flex-shrink-0"
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
                  className={`w-full py-3 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                    pkg.isPopular
                      ? "bg-[#B4532A] text-white hover:bg-[#96421F]"
                      : "bg-[#F7F4EE] text-[#1A2421] hover:bg-[#E5DFD5]"
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
