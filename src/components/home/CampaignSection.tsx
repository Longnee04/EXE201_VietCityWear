import Image from "next/image";
import Link from "next/link";
import { QrCode, Sparkles, ArrowRight } from "lucide-react";

export default function CampaignSection() {
  return (
    <section id="features" className="py-18 sm:py-26 border-t border-neutral-200/80 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-3">
            <Sparkles className="w-3 h-3 text-black" />
            <span>CÔNG NGHỆ & TRẢI NGHIỆM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black uppercase">
            MÃ QR DI SẢN & HANOI STORY CARDS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: [BLOCK_MOC_KHOA_QR] */}
          <div className="bg-gradient-to-b from-neutral-50 to-white rounded-2xl p-6 sm:p-8 border border-neutral-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold tracking-[0.15em] uppercase bg-black text-white px-3 py-1 rounded-full shadow-2xs">
                  MÓC KHÓA QR
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">KHẮC LASER 2 MẶT</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-black uppercase mb-2 group-hover:text-black">
                Móc khóa gỗ QR di sản
              </h3>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                Quét mã QR trên móc khóa để mở ngay trang trải nghiệm di sản số, bản đồ ẩm thực và lịch trình khám phá văn hóa đô thị Hà Nội.
              </p>

              {/* Image [BLOCK_MOC_KHOA_QR] */}
              <div
                id="[BLOCK_MOC_KHOA_QR]"
                className="block-moc-khoa-qr relative w-full aspect-square max-h-[340px] mx-auto rounded-xl overflow-hidden bg-[#FAF8F5] border border-neutral-200/80 shadow-inner group-hover:border-black/30 transition-colors"
              >
                <Image
                  src="/images/moc-khoa-qr-hanoi.png"
                  alt="Móc khóa gỗ QR (HANOI) — VIET CITY WEAR"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="mt-6 border-t border-neutral-100 pt-5 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-black" />
                <span>QUÉT MÃ QR ĐỂ MỞ</span>
              </span>
              <Link
                href="/explore/hanoi"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-black text-white text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-xs flex-shrink-0"
              >
                <span>Quét thử QR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: [BLOCK_THE_DIA_DANH] */}
          <div className="bg-gradient-to-b from-neutral-50 to-white rounded-2xl p-6 sm:p-8 border border-neutral-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold tracking-[0.15em] uppercase bg-black text-white px-3 py-1 rounded-full shadow-2xs">
                  THẺ ĐỊA DANH
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">STORY CARDS</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-black uppercase mb-2 group-hover:text-black">
                Bộ Hanoi Story Cards
              </h3>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                Các thẻ địa danh in hình mỹ thuật giới thiệu từng địa điểm văn hóa xuất hiện trên áo, tích hợp mã QR tương tác nhanh với lịch sử.
              </p>

              {/* Image [BLOCK_THE_DIA_DANH] */}
              <div
                id="[BLOCK_THE_DIA_DANH]"
                className="block-the-dia-danh relative w-full aspect-[1312/1199] max-h-[340px] mx-auto rounded-xl overflow-hidden bg-[#FAF8F5] border border-neutral-200/80 shadow-inner group-hover:border-black/30 transition-colors"
              >
                <Image
                  src="/images/hanoi-story-cards.png"
                  alt="Bộ HANOI STORY CARDS — VIET CITY WEAR"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="mt-6 border-t border-neutral-100 pt-5 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>10 THẺ DI SẢN MỸ THUẬT</span>
              </span>
              <Link
                href="/explore/hanoi"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl border border-neutral-300 text-black text-[11px] font-bold uppercase tracking-wider hover:border-black hover:bg-black hover:text-white transition-all shadow-xs flex-shrink-0"
              >
                <span>Khám phá di sản</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
