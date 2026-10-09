import type { Metadata } from "next";
import ContentPageClient from "@/components/content/ContentPageClient";

export const metadata: Metadata = {
  title: "Chính sách bảo mật — VIET CITY WEAR",
  description: "Chính sách bảo mật thông tin khách hàng và dữ liệu cá nhân tại VIET CITY WEAR.",
};

export default function PrivacyPage() {
  return (
    <ContentPageClient
      pageName="privacy"
      defaultTitle="Chính sách bảo mật"
      defaultContent={`**1. Thu thập thông tin**
Chúng tôi thu thập các thông tin sau:
- Họ tên, số điện thoại, địa chỉ email
- Địa chỉ giao hàng
- Lịch sử mua hàng và tương tác NFC

**2. Sử dụng thông tin**
Thông tin được sử dụng để:
- Xử lý đơn hàng và giao hàng
- Liên hệ hỗ trợ khách hàng
- Cải thiện trải nghiệm người dùng
- Gửi thông tin khuyến mãi (nếu đồng ý)

**3. Bảo mật thông tin**
- Thông tin được mã hóa và lưu trữ an toàn
- Không chia sẻ thông tin cho bên thứ ba
- Tuân thủ các quy định về bảo vệ dữ liệu cá nhân

**4. Cookie và công nghệ theo dõi**
- Website sử dụng cookie để cải thiện trải nghiệm
- Bạn có thể tắt cookie trong trình duyệt

**5. Quyền của bạn**
Bạn có quyền:
- Truy cập và cập nhật thông tin cá nhân
- Yêu cầu xóa dữ liệu
- Từ chối nhận email marketing`}
    />
  );
}
