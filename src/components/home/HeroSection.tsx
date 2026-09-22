import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-red-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-red-500 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-amber-500 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-amber-300 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">Công nghệ NFC × Di sản văn hóa Việt</span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in-up-delay-1 mt-8 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Mặc trên mình{" "}
            <span className="bg-gradient-to-r from-red-400 via-amber-400 to-red-400 bg-clip-text text-transparent animate-gradient">
              văn hóa Việt
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up-delay-2 mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg md:text-xl">
            Mỗi chiếc áo mang câu chuyện một thành phố. Chạm điện thoại vào thẻ NFC —
            khám phá lịch sử, văn hóa và ẩm thực bản địa ngay tức thì.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up-delay-3 mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#products"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-red-700 hover:shadow-xl hover:shadow-red-500/20"
            >
              Khám phá bộ sưu tập
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#nfc-experience"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              NFC hoạt động như nào?
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-12">
            {[
              { value: "249K", label: "Giá từ" },
              { value: "3+", label: "Gói sản phẩm" },
              { value: "5+", label: "Thành phố" },
              { value: "NFC", label: "Công nghệ" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
