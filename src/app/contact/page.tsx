import type { Metadata } from "next";
import ContentPageClient from "@/components/content/ContentPageClient";

export const metadata: Metadata = {
  title: "Liên hệ với chúng tôi — VIET CITY WEAR",
  description: "Thông tin liên hệ, văn phòng, hotline hỗ trợ khách hàng của thương hiệu VIET CITY WEAR.",
};

export default function ContactPage() {
  return (
    <ContentPageClient
      pageName="contact"
      defaultTitle="Liên hệ với chúng tôi"
      defaultContent={`**Thông tin liên hệ & Hỗ trợ khách hàng:**

**Kênh mạng xã hội chính thức:**
- **Facebook:** [Viet City Wear Official](https://www.facebook.com/profile.php?id=61594562979390)
- **TikTok:** [@vietct.wr26](https://www.tiktok.com/@vietct.wr26)
- **Instagram:** [@vietcitywear](https://www.instagram.com/vietcitywear)

**Hotline & Zalo tư vấn:**
0912 345 678 (Hỗ trợ 08:30 – 21:30 hàng ngày)

**Hộp thư điện tử:**
- Hỗ trợ khách hàng & đơn hàng: support@vietcitywear.com
- Hợp tác & Dự án di sản: contact@vietcitywear.com

**Địa chỉ văn phòng:**
Khu trải nghiệm văn hóa số & lưu niệm di sản VIET CITY WEAR, Hà Nội, Việt Nam.

Chúng tôi luôn sẵn sàng hỗ trợ và đồng hành cùng bạn trên hành trình khám phá di sản văn hóa Việt Nam!`}
    />
  );
}