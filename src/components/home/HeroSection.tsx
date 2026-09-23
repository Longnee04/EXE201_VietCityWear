import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full py-12 sm:py-20 lg:py-24 overflow-hidden bg-[#F7F4EE] border-b border-[#E5DFD5]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text (5 cols) */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B4532A]/10 text-[#B4532A] text-[11px] font-bold tracking-[0.2em] uppercase">
              LOCAL CITIES • REAL STORIES • WEAR IT
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A2421] tracking-tight leading-[1.15] uppercase">
              Mặc thành phố –
              <br />
              Mang câu chuyện
              <br />
              về nhà
            </h1>

            <p className="text-sm sm:text-base text-[#1A2421]/75 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Thương hiệu thời trang lưu niệm lấy cảm hứng từ các thành phố và địa điểm du lịch Việt Nam, kết hợp thời trang, văn hóa, du lịch và công nghệ.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <a
                href="#features"
                className="w-full sm:w-auto inline-block text-center bg-[#B4532A] text-white text-[12px] font-bold tracking-[0.12em] uppercase px-8 py-3.5 hover:bg-[#96421F] transition-colors shadow-sm"
              >
                Khám phá câu chuyện
              </a>
              <a
                href="#t-shirts"
                className="w-full sm:w-auto inline-block text-center bg-white border border-[#1A2421]/30 text-[#1A2421] text-[12px] font-bold tracking-[0.12em] uppercase px-8 py-3.5 hover:bg-[#1A2421] hover:text-white transition-colors"
              >
                SHOP T-SHIRTS
              </a>
            </div>
          </div>

          {/* Right: Featured T-Shirt [BLOCK_AO_HAIPHONG] (7 cols) */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              id="[BLOCK_AO_HAIPHONG]"
              className="block-ao-haiphong relative w-full max-w-2xl bg-white p-3 sm:p-5 rounded-2xl border border-[#E5DFD5] shadow-md"
            >
              <div className="relative w-full aspect-[1553/1032] overflow-hidden rounded-xl bg-[#F7F4EE]">
                <Image
                  src="/images/ao-thun-hai-phong.png"
                  alt="Áo thun HẢI PHÒNG - Mặt trước in logo nhỏ, Mặt sau in hình bến cảng, tọa độ"
                  fill
                  sizes="(max-width: 768px) 100vw, 750px"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Sub-bar explaining the shirt */}
              <div className="mt-3 pt-2.5 border-t border-[#E5DFD5] flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-[#1A2421]/70 gap-1.5 px-1">
                <span className="font-bold text-[#1A2421] uppercase tracking-wide">
                  Áo thun HẢI PHÒNG
                </span>
                <span className="text-center sm:text-right">
                  Mặt trước: in logo VIET CITY WEAR • Mặt sau: in hình bến cảng & tọa độ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
