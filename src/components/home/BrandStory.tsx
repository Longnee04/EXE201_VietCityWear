import Image from "next/image";
import { BRAND_SLOGAN } from "@/data/brand";

export default function BrandStory() {
  return (
    <section id="brand-story" className="py-16 sm:py-24 border-t border-[#f0f0f0] bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Real project image presentation */}
          <div className="relative aspect-[4/3] bg-[#fafafa] rounded-sm border border-[#eaeaea] overflow-hidden">
            <Image
              src="/images/hanoi-story-cards.png"
              alt="HANOI STORY CARDS - VIET CITY WEAR"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-contain p-4"
            />
          </div>

          {/* Content */}
          <div className="lg:py-6 space-y-4">
            <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#999]">
              Câu chuyện thương hiệu
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111] uppercase leading-[1.1]">
              VIETCITYWEAR
            </h2>
            <p className="text-sm font-bold text-[#111] uppercase tracking-wider">
              {BRAND_SLOGAN.vi}
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-[#555] max-w-lg">
              VIET CITY WEAR kể câu chuyện văn hóa các vùng đất qua góc nhìn thời trang streetwear tối giản, kết hợp thẻ thông minh NFC để mở ra trải nghiệm di sản sống động.
            </p>
            <div className="pt-2">
              <a
                href="#t-shirts"
                className="inline-block text-[12px] font-semibold tracking-[0.12em] uppercase text-[#111] border-b-2 border-[#111] pb-1 hover:text-[#555] hover:border-[#555] transition-colors"
              >
                KHÁM PHÁ BỘ SƯU TẬP ÁO
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
