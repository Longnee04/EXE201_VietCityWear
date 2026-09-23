import Image from "next/image";

export default function CampaignSection() {
  return (
    <section id="features" className="py-16 sm:py-24 border-t border-[#E5DFD5] bg-[#F7F4EE]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#B4532A] mb-2">
            Công nghệ & Trải nghiệm
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A2421] uppercase">
            NFC & Hanoi Story Cards
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: [BLOCK_MOC_KHOA_NFC] */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5DFD5] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#B4532A] bg-[#B4532A]/10 px-3 py-1 rounded-full">
                  Móc khóa NFC
                </span>
                <span className="text-[11px] text-[#1A2421]/60">Quà tặng đi kèm</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#1A2421] uppercase mb-2">
                Móc khóa gỗ NFC (HANOI)
              </h3>

              {/* Caption from requirements */}
              <div className="p-3 bg-[#F7F4EE] rounded-lg border border-[#E5DFD5] mb-5">
                <p className="text-xs sm:text-sm font-semibold text-[#B4532A]">
                  Khách chạm điện thoại vào móc khóa → mở trang web của VIET CITY WEAR
                </p>
              </div>

              {/* Image [BLOCK_MOC_KHOA_NFC] */}
              <div
                id="[BLOCK_MOC_KHOA_NFC]"
                className="block-moc-khoa-nfc relative w-full aspect-square max-h-[340px] mx-auto rounded-xl overflow-hidden bg-[#F7F4EE] border border-[#E5DFD5]"
              >
                <Image
                  src="/images/moc-khoa-nfc-hanoi.png"
                  alt="Móc khóa gỗ NFC (HANOI) - Khách chạm điện thoại vào móc khóa mở trang web của VIET CITY WEAR"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-contain p-4"
                />
              </div>
            </div>

            <p className="mt-5 text-xs text-[#1A2421]/70 border-t border-[#E5DFD5] pt-3">
              Mở ra câu chuyện về địa danh, hình ảnh, video và cẩm nang du lịch song ngữ Việt - Anh.
            </p>
          </div>

          {/* Card 2: [BLOCK_THE_DIA_DANH] */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5DFD5] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#1A2421] bg-[#1A2421]/10 px-3 py-1 rounded-full">
                  Thẻ địa danh
                </span>
                <span className="text-[11px] text-[#1A2421]/60">Hộp & Thẻ in hình</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#1A2421] uppercase mb-2">
                Bộ HANOI STORY CARDS
              </h3>

              <div className="p-3 bg-[#F7F4EE] rounded-lg border border-[#E5DFD5] mb-5">
                <p className="text-xs sm:text-sm text-[#1A2421]/80">
                  Hộp màu xanh và các thẻ địa danh in hình – giới thiệu các địa điểm xuất hiện trên áo.
                </p>
              </div>

              {/* Image [BLOCK_THE_DIA_DANH] */}
              <div
                id="[BLOCK_THE_DIA_DANH]"
                className="block-the-dia-danh relative w-full aspect-[1312/1199] max-h-[340px] mx-auto rounded-xl overflow-hidden bg-[#F7F4EE] border border-[#E5DFD5]"
              >
                <Image
                  src="/images/hanoi-story-cards.png"
                  alt="Bộ HANOI STORY CARDS - Hộp màu xanh và các thẻ địa danh in hình"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-contain p-2"
                />
              </div>
            </div>

            <p className="mt-5 text-xs text-[#1A2421]/70 border-t border-[#E5DFD5] pt-3">
              10+ thẻ địa danh tuyển chọn, tích hợp mã QR xem video & nghe audio thuyết minh.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
