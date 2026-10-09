import { BRAND_SLOGAN, BRAND_TAGLINE } from "@/data/brand";

export default function BrandStatement() {
  return (
    <section className="py-20 sm:py-28 md:py-32 bg-[#111] overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 text-center">
        <h2 className="text-[clamp(0.9rem,4.2vw,3.6rem)] font-black leading-tight tracking-tight text-white uppercase whitespace-nowrap">
          {BRAND_SLOGAN.vi}
        </h2>
        <p className="mt-4 sm:mt-6 text-xs sm:text-sm md:text-base text-white/50 tracking-[0.2em] uppercase max-w-md mx-auto">
          {BRAND_TAGLINE}
        </p>
      </div>
    </section>
  );
}
