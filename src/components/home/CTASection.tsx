import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-800 to-slate-900 py-20 sm:py-28">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-amber-400 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-red-400 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Sẵn sàng mặc trên mình{" "}
          <span className="text-amber-300">di sản Việt Nam?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-red-100 sm:text-lg">
          Đặt hàng ngay hôm nay để nhận áo thun Heritage cùng bộ trải nghiệm NFC
          độc đáo. Giao hàng toàn quốc — Thanh toán tiện lợi qua VNPay & MoMo.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#products"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-red-800 transition-all hover:bg-amber-50 hover:shadow-xl hover:shadow-black/20"
          >
            Mua ngay từ 249.000đ
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10"
          >
            Liên hệ tư vấn
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-red-200/80">
          <div className="flex items-center gap-2">
            <span>🚚</span>
            <span>Giao hàng toàn quốc</span>
          </div>
          <div className="hidden h-4 w-px bg-red-200/30 sm:block" />
          <div className="flex items-center gap-2">
            <span>💳</span>
            <span>Thanh toán an toàn</span>
          </div>
          <div className="hidden h-4 w-px bg-red-200/30 sm:block" />
          <div className="flex items-center gap-2">
            <span>🔄</span>
            <span>Đổi trả 7 ngày</span>
          </div>
          <div className="hidden h-4 w-px bg-red-200/30 sm:block" />
          <div className="flex items-center gap-2">
            <span>📱</span>
            <span>NFC tích hợp sẵn</span>
          </div>
        </div>
      </div>
    </section>
  );
}
