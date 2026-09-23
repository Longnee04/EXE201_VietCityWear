import Image from "next/image";

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
          <div className="bg-[#fafafa] rounded-xl p-6 sm:p-8 border border-[#eaeaea] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-semibold tracking-[0.15em] uppercase bg-[#111] text-white px-3 py-1">
                  MÓC KHÓA NFC
                </span>
                <span className="text-[11px] text-[#777]">Quà tặng đi kèm</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#111] uppercase mb-2">
                Móc khóa gỗ NFC (HANOI)
              </h3>

              {/* Caption from requirements */}
              <div className="p-3 bg-white rounded-md border border-[#eaeaea] mb-5">
                <p className="text-xs sm:text-sm font-semibold text-[#111]">
                  Khách chạm điện thoại vào móc khóa → mở trang web của VIET CITY WEAR
                </p>
              </div>

              {/* Image [BLOCK_MOC_KHOA_NFC] */}
              <div
                id="[BLOCK_MOC_KHOA_NFC]"
                className="block-moc-khoa-nfc relative w-full aspect-square max-h-[340px] mx-auto rounded-lg overflow-hidden bg-white border border-[#eaeaea]"
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

            <p className="mt-5 text-xs text-[#666] border-t border-[#eaeaea] pt-3">
              Mở ra câu chuyện về địa danh, hình ảnh, video và cẩm nang du lịch song ngữ Việt - Anh.
            </p>
          </div>

          {/* Card 2: [BLOCK_THE_DIA_DANH] */}
          <div className="bg-[#fafafa] rounded-xl p-6 sm:p-8 border border-[#eaeaea] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-semibold tracking-[0.15em] uppercase bg-[#111] text-white px-3 py-1">
                  THẺ ĐỊA DANH
                </span>
                <span className="text-[11px] text-[#777]">Hộp & Thẻ in hình</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#111] uppercase mb-2">
                Bộ HANOI STORY CARDS
              </h3>

              <div className="p-3 bg-white rounded-md border border-[#eaeaea] mb-5">
                <p className="text-xs sm:text-sm text-[#555]">
                  Hộp màu xanh và các thẻ địa danh in hình – giới thiệu các địa điểm xuất hiện trên áo.
                </p>
              </div>

              {/* Image [BLOCK_THE_DIA_DANH] */}
              <div
                id="[BLOCK_THE_DIA_DANH]"
                className="block-the-dia-danh relative w-full aspect-[1312/1199] max-h-[340px] mx-auto rounded-lg overflow-hidden bg-white border border-[#eaeaea]"
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

            <p className="mt-5 text-xs text-[#666] border-t border-[#eaeaea] pt-3">
              10+ thẻ địa danh tuyển chọn, tích hợp mã QR xem video & nghe audio thuyết minh.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
