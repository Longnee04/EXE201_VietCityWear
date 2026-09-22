import { Smartphone, Globe, Headphones, Sparkles } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Smartphone,
    title: "Chạm điện thoại",
    description:
      "Đưa điện thoại lại gần móc khóa NFC trên áo hoặc thẻ địa danh. Trình duyệt tự động mở — không cần cài ứng dụng.",
    color: "red",
  },
  {
    step: "02",
    icon: Globe,
    title: "Khám phá văn hóa",
    description:
      "Trang trải nghiệm đa ngôn ngữ (Việt & Anh) mở ra với câu chuyện lịch sử, hình ảnh, video và cẩm nang du lịch.",
    color: "blue",
  },
  {
    step: "03",
    icon: Headphones,
    title: "Nghe thuyết minh",
    description:
      "Phát audio storytelling bằng tiếng Việt hoặc tiếng Anh — tận hưởng câu chuyện bản địa khi đang dạo phố.",
    color: "purple",
  },
  {
    step: "04",
    icon: Sparkles,
    title: "Trò chuyện với AI",
    description:
      'Trợ lý AI du lịch bản địa giải đáp mọi thắc mắc: "Quán phở ngon gần đây?", "Kể thêm về Tháp Rùa"...',
    color: "amber",
  },
];

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  red: { bg: "bg-red-100", text: "text-red-700", ring: "ring-red-200" },
  blue: { bg: "bg-blue-100", text: "text-blue-700", ring: "ring-blue-200" },
  purple: { bg: "bg-purple-100", text: "text-purple-700", ring: "ring-purple-200" },
  amber: { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-200" },
};

export default function NFCExperienceSection() {
  return (
    <section id="nfc-experience" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-700">
            Trải nghiệm NFC
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Chạm để khám phá — Đơn giản chưa từng có
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 leading-relaxed">
            Không cần tải app, không cần quét mã QR phức tạp. Chỉ cần một cái chạm
            nhẹ, cả thế giới văn hóa bản địa mở ra trước mắt bạn.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => {
            const Icon = item.icon;
            const colors = colorMap[item.color];

            return (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
              >
                {/* Step Number */}
                <span className="absolute -top-3.5 right-6 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                  {item.step}
                </span>

                {/* Icon */}
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg} ${colors.text} ring-4 ${colors.ring} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Visual Demo Area */}
        <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 sm:p-12">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
            {/* Phone mockup placeholder */}
            <div className="flex-shrink-0">
              <div className="relative mx-auto h-80 w-44 rounded-3xl border-4 border-slate-900 bg-gradient-to-b from-slate-800 to-slate-900 p-2 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 h-5 w-20 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
                {/* Screen */}
                <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-red-50 to-amber-50 p-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-xs font-bold text-slate-800">
                    Trang NFC Landing
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500 leading-relaxed">
                    Hà Nội Heritage
                  </p>
                  <div className="mt-3 space-y-1.5 w-full">
                    <div className="h-2 rounded-full bg-red-200/60" />
                    <div className="h-2 w-3/4 rounded-full bg-slate-200/60" />
                    <div className="h-2 w-1/2 rounded-full bg-amber-200/60" />
                  </div>
                  <div className="mt-4 rounded-full bg-red-600 px-4 py-1.5">
                    <p className="text-[9px] font-semibold text-white">Khám phá ngay</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-slate-900">
                Mở cánh cửa văn hóa bằng một cái chạm
              </h3>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-500">
                Chip NFC được tích hợp bên trong mỗi móc khóa và thẻ địa danh. Khi du khách
                chạm điện thoại, trình duyệt tự động mở trang trải nghiệm với đầy đủ thông tin
                văn hóa, ẩm thực, lịch sử và cẩm nang du lịch — hiển thị cả tiếng Việt và tiếng Anh.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                <span className="rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-red-100">
                  🇻🇳 Tiếng Việt
                </span>
                <span className="rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                  🇬🇧 English
                </span>
                <span className="rounded-full bg-purple-50 px-4 py-1.5 text-xs font-semibold text-purple-700 ring-1 ring-purple-100">
                  🤖 AI Assistant
                </span>
                <span className="rounded-full bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                  🎧 Audio Guide
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
