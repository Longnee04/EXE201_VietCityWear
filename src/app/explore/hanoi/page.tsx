import type { Metadata } from "next";
import ExploreClient from "@/components/explore/ExploreClient";
import { BRAND_SLOGAN } from "@/data/brand";

export const metadata: Metadata = {
  title: `Khám phá Di sản Hà Nội — VIET CITY WEAR | ${BRAND_SLOGAN.vi}`,
  description:
    "Trải nghiệm số mở ra từ Thẻ địa danh và Móc khóa NFC: Khám phá câu chuyện Hồ Gươm, Văn Miếu, Lăng Bác, Nhà Thờ Lớn, Phố Cổ và ẩm thực kinh kỳ Hà Nội.",
};

export default function HanoiExplorePage() {
  return <ExploreClient />;
}
