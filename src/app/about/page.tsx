import type { Metadata } from "next";
import ContentPageClient from "@/components/content/ContentPageClient";
import { BRAND_SLOGAN } from "@/data/brand";

export const metadata: Metadata = {
  title: `Giới thiệu VIET CITY WEAR — ${BRAND_SLOGAN.vi}`,
  description:
    "VIET CITY WEAR là thương hiệu thời trang văn hóa độc đáo, kết hợp áo thun lưu niệm với công nghệ NFC để mang đến trải nghiệm khám phá di sản Việt Nam.",
};

export default function AboutPage() {
  return (
    <ContentPageClient
      pageName="about"
      defaultTitle="Giới thiệu VIET CITY WEAR"
      defaultContent={`VIET CITY WEAR là thương hiệu thời trang văn hóa độc đáo, kết hợp áo thun lưu niệm với công nghệ NFC để mang đến trải nghiệm khám phá di sản Việt Nam.

**Sứ mệnh:** Mặc thành phố – Chạm câu chuyện

**Sản phẩm:**
- Áo thun văn hóa theo từng thành phố
- Thẻ địa danh và móc khóa NFC
- Trải nghiệm văn hóa số qua công nghệ

**Liên hệ:**
Email: contact@vietcitywear.com
Hotline: 0901 234 567`}
    />
  );
}
