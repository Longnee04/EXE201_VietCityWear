import { Stamp, Gift, Trophy, ArrowRight } from "lucide-react";

const milestones = [
  {
    count: 1,
    title: "Khởi đầu hành trình",
    reward: "Mở khóa Hộ chiếu số và con dấu đầu tiên",
    icon: Stamp,
  },
  {
    count: 3,
    title: "Nhà thám hiểm",
    reward: "Nhận mã giảm giá 10% cho đơn hàng tiếp theo",
    icon: Gift,
  },
  {
    count: 5,
    title: "Sứ giả di sản",
    reward: "Nhận áo thun Limited Edition miễn phí + badge vinh danh",
    icon: Trophy,
  },
];

export default function PassportSection() {
  return (
    <section id="passport" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-20">
          {/* Passport Visual */}
          <div className="w-full max-w-md lg:w-1/2">
            <div className="relative mx-auto aspect-[3/4] max-w-xs overflow-hidden rounded-3xl border-2 border-slate-800 bg-gradient-to-b from-slate-900 to-slate-800 p-6 shadow-2xl">
              {/* Header */}
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-400">
                  Socialist Republic of Vietnam
                </p>
                <div className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-400/30 bg-amber-400/10">
                  <span className="text-3xl">🇻🇳</span>
                </div>
                <h3 className="mt-3 text-lg font-bold tracking-wide text-white">
                  HỘ CHIẾU SỐ
                </h3>
                <p className="mt-0.5 text-[10px] font-medium text-amber-400/80">
                  DIGITAL PASSPORT
                </p>
              </div>

              {/* Stamps Grid */}
              <div className="mt-6 grid grid-cols-3 gap-2">
                {/* Hà Nội - collected */}
                <div className="flex aspect-square flex-col items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 p-1.5">
                  <span className="text-lg">🏛️</span>
                  <p className="mt-0.5 text-[8px] font-bold text-amber-400">Hà Nội</p>
                  <span className="text-[7px] text-amber-400/60">✓ Đã sưu tầm</span>
                </div>
                {/* Huế - locked */}
                <div className="flex aspect-square flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-1.5">
                  <span className="text-lg opacity-40">🏯</span>
                  <p className="mt-0.5 text-[8px] font-medium text-white/30">Huế</p>
                  <span className="text-[7px] text-white/20">🔒</span>
                </div>
                {/* Hội An - locked */}
                <div className="flex aspect-square flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-1.5">
                  <span className="text-lg opacity-40">🏮</span>
                  <p className="mt-0.5 text-[8px] font-medium text-white/30">Hội An</p>
                  <span className="text-[7px] text-white/20">🔒</span>
                </div>
                {/* Đà Nẵng - locked */}
                <div className="flex aspect-square flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-1.5">
                  <span className="text-lg opacity-40">🐉</span>
                  <p className="mt-0.5 text-[8px] font-medium text-white/30">Đà Nẵng</p>
                  <span className="text-[7px] text-white/20">🔒</span>
                </div>
                {/* TP.HCM - locked */}
                <div className="flex aspect-square flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-1.5">
                  <span className="text-lg opacity-40">⛪</span>
                  <p className="mt-0.5 text-[8px] font-medium text-white/30">TP.HCM</p>
                  <span className="text-[7px] text-white/20">🔒</span>
                </div>
                {/* Đà Lạt - locked */}
                <div className="flex aspect-square flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-1.5">
                  <span className="text-lg opacity-40">🌸</span>
                  <p className="mt-0.5 text-[8px] font-medium text-white/30">Đà Lạt</p>
                  <span className="text-[7px] text-white/20">🔒</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-white/60">Tiến độ sưu tầm</span>
                  <span className="font-bold text-amber-400">1/6</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[16.6%] rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all" />
                </div>
              </div>

              {/* Decorative border */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-amber-900/20 to-transparent" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-red-700">
              Gamification
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Hộ chiếu số — Sưu tầm di sản Việt
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-500">
              Mỗi thẻ địa danh đi kèm một mã code duy nhất. Nhập mã code để đóng
              dấu mộc thành phố vào hộ chiếu số của bạn. Sưu tầm đủ bộ để nhận
              phần thưởng hấp dẫn!
            </p>

            {/* Milestone Cards */}
            <div className="mt-8 space-y-4">
              {milestones.map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.count}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-red-200 hover:bg-red-50/30"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                          {m.count} thành phố
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">{m.reward}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              href="#products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg"
            >
              Bắt đầu sưu tầm
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
