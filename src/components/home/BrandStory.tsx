import Image from "next/image";

export default function BrandStory() {
  return (
    <section id="brand-story" className="py-16 sm:py-24 border-t border-[#f0f0f0] bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Real project image presentation */}
          <div className="relative aspect-[4/3] bg-[#fafafa] rounded-lg border border-[#eaeaea] overflow-hidden">
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
              Mặc thành phố – Mang câu chuyện về nhà
            </p>
            <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-[#555] max-w-lg">
              <p>
                Thương hiệu thời trang lưu niệm lấy cảm hứng từ các thành phố và địa điểm du lịch Việt Nam, kết hợp thời trang, văn hóa, du lịch và công nghệ.
              </p>
              <p>
                Mỗi áo đi kèm thẻ địa danh giới thiệu các địa điểm xuất hiện trên áo và móc khóa gỗ NFC thông minh, giúp du khách chạm điện thoại vào móc khóa để mở trang web khám phá câu chuyện và cẩm nang du lịch.
              </p>
            </div>
            <div className="pt-2">
              <a
                href="#pricing"
                className="inline-block text-[12px] font-semibold tracking-[0.12em] uppercase text-[#111] border-b-2 border-[#111] pb-1 hover:text-[#555] hover:border-[#555] transition-colors"
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
