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
      defaultContent={`**Thông tin liên hệ:**

**Địa chỉ văn phòng:**
Số 123, Đường ABC, Quận XYZ, Hà Nội, Việt Nam

**Hotline/Zalo:**
0901 234 567 (8:00 - 20:00 hàng ngày)

**Email:**
- Hỗ trợ khách hàng: support@vietcitywear.com
- Hợp tác kinh doanh: business@vietcitywear.com
- Báo chí truyền thông: pr@vietcitywear.com

**Thời gian làm việc:**
Thứ 2 - Thứ 6: 8:00 - 18:00
Thứ 7 - Chủ nhật: 9:00 - 17:00

Chúng tôi luôn sẵn sàng hỗ trợ và lắng nghe ý kiến của bạn!`}
    />
  );
}
