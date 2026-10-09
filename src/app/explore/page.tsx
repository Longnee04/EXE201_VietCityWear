import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { MapPin, Sparkles, ArrowRight, Compass } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BRAND_TAGLINE } from "@/data/brand";

export const metadata: Metadata = {
  title: "Khám Phá Di Sản Các Thành Phố — VIET CITY WEAR",
  description:
    "Hành trình chạm di sản qua các thành phố Việt Nam: Hà Nội, Hải Phòng, Huế, Hội An, Đà Nẵng, TP. Hồ Chí Minh. Kết hợp thời trang, văn hóa và công nghệ số.",
  openGraph: {
    title: "Khám Phá Di Sản Các Thành Phố — VIET CITY WEAR",
    description: "Mặc thành phố – Chạm câu chuyện. Khám phá các điểm đến di sản Việt Nam.",
    images: [{ url: "/images/hanoi-heritage-set.png", width: 1200, height: 800 }],
  },
};

const cities = [
  {
    id: "hanoi",
    name: "HÀ NỘI",
    region: "Miền Bắc",
    status: "released",
    statusLabel: "ĐÃ PHÁT HÀNH • BỘ MVP",
    tagline: "Thủ đô ngàn năm văn hiến",
    description:
      "Khám phá trọn vẹn 5 địa danh di sản: Hồ Hoàn Kiếm, Văn Miếu, Lăng Bác, Nhà Thờ Lớn, Phố Cổ 36 phố phường cùng thuyết minh audio song ngữ và cẩm nang ẩm thực.",
    image: "/images/hanoi-heritage-set.png",
    exploreHref: "/explore/hanoi",
    shopHref: "/#t-shirts",
  },
  {
    id: "haiphong",
    name: "HẢI PHÒNG",
    region: "Miền Bắc",
    status: "upcoming",
    statusLabel: "SẮP RA MẮT • CHAPTER 02",
    tagline: "Thành phố hoa phượng đỏ",
    description:
      "Ghi dấu tọa độ 20.8449°N, 106.6881°E, kiến trúc Nhà hát lớn Hải Phòng và tinh thần phóng khoáng miền duyên hải cửa biển.",
    image: "/images/ao-thun-hai-phong-coming-soon.png",
    exploreHref: "#",
    shopHref: "/products/ao-thun-hai-phong-heritage-tee",
  },
  {
    id: "hue",
    name: "HUẾ",
    region: "Miền Trung",
    status: "upcoming",
    statusLabel: "SẮP RA MẮT",
    tagline: "Cố đô vàng son bên dòng Hương",
    description:
      "Kinh thành uy nghiêm, lăng tẩm trầm mặc và nét thi vị của miền di sản cung đình triều Nguyễn.",
    image: "/images/hue-banner.jpg",
    exploreHref: "#",
  },
  {
    id: "hoian",
    name: "HỘI AN",
    region: "Miền Trung",
    status: "upcoming",
    statusLabel: "SẮP RA MẮT",
    tagline: "Thương cảng rực rỡ đèn lồng",
    description:
      "Mái ngói rêu phong, nhịp sống êm đềm bên sông Hoài và giao thoa kiến trúc Đông – Tây thế kỷ 16.",
    image: "/images/hoian-banner.jpg",
    exploreHref: "#",
  },
  {
    id: "danang",
    name: "ĐÀ NẴNG",
    region: "Miền Trung",
    status: "upcoming",
    statusLabel: "SẮP RA MẮT",
    tagline: "Thành phố của những cây cầu",
    description:
      "Cầu Rồng, Cầu Vàng Bà Nà hùng vĩ và bãi biển xanh cát trắng hiện đại đầy năng lượng.",
    image: "/images/landmarks/ho-guom.jpg",
    exploreHref: "#",
  },
  {
    id: "saigon",
    name: "TP. HỒ CHÍ MINH",
    region: "Miền Nam",
    status: "upcoming",
    statusLabel: "SẮP RA MẮT",
    tagline: "Nhịp đập đô thị phương Nam",
    description:
      "Giao thoa giữa nét kiến trúc Sài Gòn xưa và tinh thần chuyển mình trẻ trung, năng động của đại đô thị.",
    image: "/images/landmarks/pho-co.jpg",
    exploreHref: "#",
  },
];

export default function ExploreIndexPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1 bg-white">
        {/* Banner */}
        <section className="relative py-16 sm:py-24 bg-[#111] text-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/70 text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase mb-4">
              <Compass className="w-3.5 h-3.5" />
              {BRAND_TAGLINE}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              KHÁM PHÁ CÁC THÀNH PHỐ
            </h1>
            <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
              Mỗi thành phố là một chương di sản độc bản. Chạm vào câu chuyện để tìm hiểu lịch sử,
              ẩm thực và văn hóa đằng sau từng thiết kế thời trang.
            </p>
          </div>
        </section>

        {/* Cities Grid */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cities.map((city) => (
                <div
                  key={city.id}
                  className={`border flex flex-col justify-between transition-all ${
                    city.status === "released"
                      ? "border-[#111] bg-white shadow-lg ring-1 ring-[#111]"
                      : "border-[#eaeaea] bg-[#fafafa]"
                  }`}
                >
                  <div>
                    {/* Visual Preview */}
                    <div className="relative aspect-[16/10] bg-[#f0f0f0] overflow-hidden">
                      <Image
                        src={city.image}
                        alt={city.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 ${
                            city.status === "released"
                              ? "bg-[#111] text-white"
                              : "bg-white/90 text-[#555] backdrop-blur-xs"
                          }`}
                        >
                          {city.statusLabel}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{city.region}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <p className="text-[11px] font-bold tracking-wider text-[#888] uppercase mb-1">
                        {city.tagline}
                      </p>
                      <h2 className="text-2xl font-black text-[#111] uppercase tracking-tight mb-3">
                        {city.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#555] leading-relaxed">
                        {city.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0">
                    <div className="border-t border-[#f0f0f0] pt-4 flex items-center justify-between">
                      {city.status === "released" ? (
                        <div className="flex items-center gap-3 w-full">
                          <Link
                            href={city.exploreHref}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#111] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#333] transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Khám phá Hà Nội</span>
                          </Link>
                          {city.shopHref && (
                            <Link
                              href={city.shopHref}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#111] hover:underline px-2 py-2"
                            >
                              <span>Xem đồ</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-[#999] uppercase tracking-wider">
                          Đang chuẩn bị nội dung & mẫu áo...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
