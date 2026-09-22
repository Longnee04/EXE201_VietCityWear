export default function CampaignSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Left — Large campaign image */}
          <div className="relative aspect-[4/5] sm:aspect-[3/4] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] overflow-hidden group cursor-pointer">
            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10 z-10">
              <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-white/50 mb-2">
                Hà Nội Collection
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
                PHỐ CỔ
                <br />
                36 PHỐ PHƯỜNG
              </h3>
              <a
                href="#t-shirts"
                className="mt-4 inline-block text-[11px] font-semibold tracking-[0.12em] uppercase text-white border-b border-white/40 pb-0.5 hover:border-white transition-colors w-fit"
              >
                EXPLORE
              </a>
            </div>
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Placeholder text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <p className="text-[10px] text-white/20 tracking-widest uppercase">
                Campaign Photo
              </p>
            </div>
          </div>

          {/* Right — Two stacked images */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="relative flex-1 min-h-[200px] bg-gradient-to-br from-[#e8e4e0] to-[#d5cfc9] overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 z-10">
                <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#111]/40 mb-1">
                  NFC Technology
                </p>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#111] uppercase tracking-tight">
                  CHẠM ĐỂ KHÁM PHÁ
                </h3>
                <a
                  href="#t-shirts"
                  className="mt-3 inline-block text-[11px] font-semibold tracking-[0.12em] uppercase text-[#111] border-b border-[#111]/40 pb-0.5 hover:border-[#111] transition-colors w-fit"
                >
                  SHOP NOW
                </a>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <p className="text-[10px] text-[#bbb] tracking-widest uppercase">
                  Lifestyle Photo
                </p>
              </div>
            </div>

            <div className="relative flex-1 min-h-[200px] bg-gradient-to-br from-[#1a1a1a] to-[#333] overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 z-10">
                <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-white/40 mb-1">
                  Digital Passport
                </p>
                <h3 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-tight">
                  SƯU TẦM DI SẢN
                </h3>
                <a
                  href="#t-shirts"
                  className="mt-3 inline-block text-[11px] font-semibold tracking-[0.12em] uppercase text-white border-b border-white/40 pb-0.5 hover:border-white transition-colors w-fit"
                >
                  LEARN MORE
                </a>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <p className="text-[10px] text-white/20 tracking-widest uppercase">
                  Campaign Photo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
