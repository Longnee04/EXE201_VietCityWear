import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] py-14 sm:py-20 flex items-center overflow-hidden bg-[#111]">
      {/* Background dark gradient like previous deploy */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#242424] to-[#0a0a0a]">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')]" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text (6 cols) */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/70 text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase">
              LOCAL CITIES • REAL STORIES • WEAR IT
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[44px] font-black tracking-tight text-white uppercase leading-[1.18]">
              <span className="block text-white">MẶC THÀNH PHỐ</span>
              <span className="block text-white/85 mt-1 sm:mt-1.5 font-bold">
                MANG CÂU CHUYỆN VỀ NHÀ
              </span>
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-white/60 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
              Thương hiệu thời trang lưu niệm lấy cảm hứng từ các thành phố và địa điểm du lịch Việt Nam, kết hợp thời trang, văn hóa, du lịch và công nghệ.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#111] text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#eaeaea] transition-all shadow-sm"
              >
                Khám phá câu chuyện
              </a>
              <a
                href="#t-shirts"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-white/30 text-white text-[11px] font-semibold tracking-[0.15em] uppercase hover:border-white hover:bg-white/10 transition-all"
              >
                SHOP T-SHIRTS
              </a>
            </div>
          </div>

          {/* Right: [BLOCK_AO_HAIPHONG] Featured T-Shirt (6 cols) */}
          <div className="lg:col-span-6 flex justify-center">
            <div
              id="[BLOCK_AO_HAIPHONG]"
              className="block-ao-haiphong relative w-full max-w-2xl bg-white/5 backdrop-blur-md p-3 sm:p-5 rounded-2xl border border-white/10 shadow-2xl"
            >
              <div className="relative w-full aspect-[1553/1032] overflow-hidden rounded-xl bg-white">
                <Image
                  src="/images/ao-thun-hai-phong.png"
                  alt="Áo thun HẢI PHÒNG - Mặt trước in logo nhỏ, Mặt sau in hình bến cảng, tọa độ"
                  fill
                  sizes="(max-width: 768px) 100vw, 750px"
                  className="object-contain p-2"
                  priority
                />
              </div>

              {/* Sub-bar explaining the shirt */}
              <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-white/70 gap-1.5 px-1">
                <span className="font-semibold text-white uppercase tracking-wider">
                  Áo thun HẢI PHÒNG
                </span>
                <span className="text-center sm:text-right text-white/50">
                  Mặt trước: In logo VIET CITY WEAR • Mặt sau: In hình bến cảng & tọa độ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
