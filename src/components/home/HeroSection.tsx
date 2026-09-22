export default function HeroSection() {
  return (
    <section className="relative w-full h-[85vh] sm:h-[90vh] overflow-hidden bg-[#111]">
      {/* Background — placeholder for campaign photo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#0a0a0a]">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')]" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <p className="animate-fade-in text-[10px] sm:text-[11px] font-medium tracking-[0.3em] uppercase text-white/50 mb-6">
          Hà Nội Heritage Collection
        </p>

        <h1 className="animate-fade-in-delay text-[clamp(2.5rem,8vw,6rem)] font-extrabold leading-[0.9] tracking-tight text-white uppercase">
          WEAR YOUR
          <br />
          CITY.
        </h1>

        <p className="animate-fade-in-delay-2 mt-6 text-sm sm:text-base text-white/60 max-w-md leading-relaxed">
          Mỗi chiếc áo mang câu chuyện một thành phố.
          <br className="hidden sm:block" />
          Vietnamese heritage streetwear.
        </p>

        <a
          href="#t-shirts"
          className="animate-fade-in-delay-2 mt-10 inline-block bg-white text-[#111] text-[12px] font-semibold tracking-[0.15em] uppercase px-10 py-4 hover:bg-[#f5f5f5] transition-colors"
        >
          SHOP T-SHIRTS
        </a>
      </div>

      {/* Bottom gradient fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
