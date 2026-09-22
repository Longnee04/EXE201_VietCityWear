export default function BrandStory() {
  return (
    <section id="brand-story" className="py-16 sm:py-24 border-t border-[#f0f0f0]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Image placeholder */}
          <div className="aspect-[4/5] lg:aspect-[3/4] bg-gradient-to-br from-[#e8e4e0] to-[#d5cfc9] flex items-center justify-center">
            <div className="text-center px-8">
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#999]">
                Brand Campaign
              </p>
              <p className="text-xs text-[#bbb] mt-2">
                Photo placeholder — thay bằng lifestyle/campaign photo
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="lg:py-10">
            <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#999] mb-4">
              Our Story
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111] uppercase leading-[1.1] mb-6">
              VIETCITYWEAR
            </h2>
            <div className="space-y-4 text-[14px] leading-relaxed text-[#555] max-w-md">
              <p>
                Sinh ra từ tình yêu với những thành phố Việt Nam, VietCityWear biến mỗi
                chiếc áo thun thành một câu chuyện di sản — nơi văn hóa đường phố gặp gỡ
                công nghệ hiện đại.
              </p>
              <p>
                Mỗi thiết kế lấy cảm hứng từ một địa danh lịch sử, kết hợp chip NFC
                thông minh mang đến trải nghiệm du lịch số ngay trên chiếc áo bạn mặc.
              </p>
              <p>
                Bắt đầu từ Hà Nội — thành phố của ngàn năm văn hiến — chúng tôi đang xây
                dựng bộ sưu tập cho từng thành phố trên hành trình khám phá Việt Nam.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-block mt-8 text-[12px] font-semibold tracking-[0.12em] uppercase text-[#111] border-b-2 border-[#111] pb-1 hover:text-[#555] hover:border-[#555] transition-colors"
            >
              LEARN MORE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
