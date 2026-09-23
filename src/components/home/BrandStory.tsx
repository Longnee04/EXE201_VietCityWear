import Image from "next/image";

export default function BrandStory() {
  return (
    <section id="brand-story" className="py-16 sm:py-24 border-t border-[#E5DFD5] bg-[#F7F4EE]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Real image presentation */}
          <div className="relative aspect-[4/3] bg-white rounded-2xl border border-[#E5DFD5] overflow-hidden shadow-xs">
            <Image
              src="/images/hanoi-story-cards.png"
              alt="HANOI STORY CARDS - VIET CITY WEAR"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-contain p-4"
            />
          </div>

          {/* Content */}
          <div className="lg:py-6 space-y-5">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#B4532A]">
              Câu chuyện thương hiệu
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A2421] uppercase leading-[1.1]">
              VIET CITY WEAR
            </h2>
            <p className="text-base font-bold text-[#B4532A]">
              Mặc thành phố – Mang câu chuyện về nhà
            </p>
            <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-[#1A2421]/80 max-w-lg">
              <p>
                Thương hiệu thời trang lưu niệm lấy cảm hứng từ các thành phố và địa điểm du lịch Việt Nam, kết hợp thời trang, văn hóa, du lịch và công nghệ.
              </p>
              <p>
                Mỗi áo đi kèm thẻ địa danh giới thiệu các địa điểm xuất hiện trên áo và móc khóa gỗ NFC thông minh, giúp khách chạm điện thoại vào móc khóa để mở trang web khám phá câu chuyện và cẩm nang du lịch.
              </p>
            </div>
            <div className="pt-2">
              <a
                href="#pricing"
                className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase text-[#1A2421] border-b-2 border-[#1A2421] pb-1 hover:text-[#B4532A] hover:border-[#B4532A] transition-colors"
              >
                XEM BẢNG GIÁ SẢN PHẨM
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
