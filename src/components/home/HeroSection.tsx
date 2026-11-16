import Image from "next/image";
import Link from "next/link";
import { BRAND_SLOGAN, HERO_HEADLINE, BRAND_TAGLINE } from "@/data/brand";
import { Sparkles, ArrowRight, Compass, ShieldCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[92vh] py-16 sm:py-24 flex items-center overflow-hidden bg-[#0c0c0c]">
      {/* Background rich dark gradient with subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800/30 via-[#111111] to-[#070707]" />

      {/* Subtle coordinates watermark pattern */}
      <div className="absolute top-8 left-8 text-neutral-800/60 font-mono text-[10px] sm:text-xs select-none pointer-events-none hidden md:block">
        LAT: 21.0285°N / LONG: 105.8542°E • HANOI CHAPTER
      </div>
      <div className="absolute bottom-8 right-8 text-neutral-800/60 font-mono text-[10px] sm:text-xs select-none pointer-events-none hidden md:block">
        VIETCITYWEAR • DIGITAL HERITAGE EXPERIENCE
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text (6 cols) */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-[10px] sm:text-[11px] font-mono font-semibold tracking-[0.25em] uppercase backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{BRAND_TAGLINE}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[42px] xl:text-[48px] font-black tracking-tight text-white uppercase leading-[1.12]">
              {HERO_HEADLINE.vi}
            </h1>

            <p className="text-sm sm:text-base md:text-lg font-bold text-amber-200/90 uppercase tracking-widest flex items-center justify-center lg:justify-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse" />
              {BRAND_SLOGAN.vi}
            </p>

            <p className="text-xs sm:text-sm lg:text-[15px] text-neutral-300/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Thời trang đường phố di sản tích hợp mã QR laser thông minh. Chạm vào áo và thẻ để mở khóa câu chuyện văn hóa các thành phố Việt Nam.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link
                href="/explore/hanoi"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black text-[11px] font-bold tracking-[0.16em] uppercase hover:bg-neutral-200 transition-all shadow-lg hover:shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Compass className="w-4 h-4" />
                <span>Khám phá câu chuyện</span>
              </Link>
              <a
                href="#t-shirts"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white text-[11px] font-bold tracking-[0.16em] uppercase hover:border-white hover:bg-white/10 transition-all backdrop-blur-xs active:scale-[0.98]"
              >
                <span>BỘ SƯU TẬP ÁO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Micro value badges */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-5 text-[11px] text-neutral-400 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Cotton 100% 250GSM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Mã QR Laser CNC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Freeship từ 500K</span>
              </div>
            </div>
          </div>

          {/* Right: Featured Hanoi Heritage Set (6 cols) */}
          <div className="lg:col-span-6 flex justify-center">
            <div
              id="[BLOCK_HERO_PRODUCT]"
              className="relative w-full max-w-xl bg-neutral-900/80 p-3 sm:p-5 rounded-xl border border-neutral-700/60 shadow-2xl backdrop-blur-md transition-transform duration-500 hover:border-neutral-500"
            >
              {/* Product Visual */}
              <div className="relative w-full aspect-[1536/1024] overflow-hidden rounded-lg bg-[#FAF8F5] shadow-inner">
                <Image
                  src="/images/hanoi-heritage-set.png"
                  alt={`Hanoi Heritage Set — ${BRAND_SLOGAN.vi}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 750px"
                  className="object-contain p-3 transition-transform duration-700 hover:scale-105"
                  priority
                />
                <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold font-mono tracking-widest px-2.5 py-1 rounded-sm uppercase">
                  LIMITED BOX SET
                </div>
              </div>

              {/* Sub-bar explaining the set */}
              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-300 px-1 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span className="font-bold text-white uppercase tracking-wider text-[10px] sm:text-[11.5px]">
                    HÀ NỘI HERITAGE SET • 21.0285°N
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-neutral-400 tracking-wider">
                  ÁO • THẺ QR • MÓC KHÓA • HỘP
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
