import Image from "next/image";
import Link from "next/link";

export default function CampaignSection() {
  return (
    <section id="features" className="py-16 sm:py-24 border-t border-[#eaeaea] bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#999] mb-2">
            Công nghệ & Trải nghiệm
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111] uppercase">
            NFC & HANOI STORY CARDS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: [BLOCK_MOC_KHOA_NFC] */}
          <div className="bg-[#fafafa] rounded-sm p-6 sm:p-8 border border-[#eaeaea] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-semibold tracking-[0.15em] uppercase bg-[#111] text-white px-3 py-1">
                  MÓC KHÓA NFC
                </span>
                <span className="text-[11px] text-[#777] font-mono">CHIP NTAG213</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#111] uppercase mb-2">
                Móc khóa gỗ NFC di sản
              </h3>

              <p className="text-xs sm:text-sm text-[#555] leading-relaxed mb-5">
                Chạm nhẹ điện thoại vào móc khóa để mở ngay trang trải nghiệm di sản số, bản đồ ẩm thực và lịch trình khám phá văn hóa đô thị.
              </p>

              {/* Image [BLOCK_MOC_KHOA_NFC] */}
              <div
                id="[BLOCK_MOC_KHOA_NFC]"
                className="block-moc-khoa-nfc relative w-full aspect-square max-h-[340px] mx-auto rounded-none overflow-hidden bg-white border border-[#eaeaea]"
              >
                <Image
                  src="/images/moc-khoa-nfc-hanoi.png"
                  alt="Móc khóa gỗ NFC (HANOI) — VIET CITY WEAR"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-contain p-4"
                />
              </div>
            </div>

            <div className="mt-5 border-t border-[#eaeaea] pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-[#666]">
                Mở câu chuyện địa danh, audio thuyết minh và cẩm nang du lịch song ngữ Việt – Anh.
              </p>
              <Link
                href="/explore/hanoi"
                className="inline-flex items-center justify-center px-4 py-2.5 bg-[#111] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#333] transition-colors flex-shrink-0"
              >
                Chạm thử NFC →
              </Link>
            </div>
          </div>

          {/* Card 2: [BLOCK_THE_DIA_DANH] */}
          <div className="bg-[#fafafa] rounded-sm p-6 sm:p-8 border border-[#eaeaea] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-semibold tracking-[0.15em] uppercase bg-[#111] text-white px-3 py-1">
                  THẺ ĐỊA DANH
                </span>
                <span className="text-[11px] text-[#777] font-mono">STORY CARDS</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#111] uppercase mb-2">
                Bộ Hanoi Story Cards
              </h3>

              <p className="text-xs sm:text-sm text-[#555] leading-relaxed mb-5">
                Các thẻ địa danh in hình mỹ thuật giới thiệu từng địa điểm văn hóa xuất hiện trên áo, tích hợp mã QR tương tác nhanh.
              </p>

              {/* Image [BLOCK_THE_DIA_DANH] */}
              <div
                id="[BLOCK_THE_DIA_DANH]"
                className="block-the-dia-danh relative w-full aspect-[1312/1199] max-h-[340px] mx-auto rounded-none overflow-hidden bg-white border border-[#eaeaea]"
              >
                <Image
                  src="/images/hanoi-story-cards.png"
                  alt="Bộ HANOI STORY CARDS — VIET CITY WEAR"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-contain p-2"
                />
              </div>
            </div>

            <div className="mt-5 border-t border-[#eaeaea] pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-[#666]">
                Khám phá trọn vẹn hình ảnh, câu chuyện lịch sử và gợi ý quán ăn nổi tiếng quanh địa danh.
              </p>
              <Link
                href="/explore/hanoi"
                className="inline-flex items-center justify-center px-4 py-2.5 border border-[#111] text-[#111] text-[11px] font-bold uppercase tracking-wider hover:bg-[#111] hover:text-white transition-colors flex-shrink-0"
              >
                Khám phá di sản →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
