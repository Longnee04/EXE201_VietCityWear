import type { Metadata } from "next";
import ContentPageClient from "@/components/content/ContentPageClient";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng — VIET CITY WEAR",
  description: "Các điều khoản và quy định khi mua sắm và sử dụng dịch vụ tại VIET CITY WEAR.",
};

export default function TermsPage() {
  return (
    <ContentPageClient
      pageName="terms"
      defaultTitle="Điều khoản sử dụng"
      defaultContent={`**1. Giới thiệu**
Chào mừng bạn đến với VIET CITY WEAR. Khi sử dụng website và dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản sau.

**2. Sử dụng dịch vụ**
- Bạn phải từ 18 tuổi trở lên để mua hàng
- Thông tin cung cấp phải chính xác và trung thực
- Không sử dụng website cho mục đích bất hợp pháp

**3. Đặt hàng và thanh toán**
- Đơn hàng được xác nhận qua email
- Hiện chỉ hỗ trợ thanh toán COD (tiền mặt khi nhận hàng)
- Giá sản phẩm có thể thay đổi mà không cần báo trước

**4. Chính sách đổi trả**
- Đổi size trong vòng 7 ngày nếu sản phẩm chưa sử dụng
- Không hỗ trợ hoàn tiền
- Khách hàng chịu phí vận chuyển đổi hàng

**5. Quyền sở hữu trí tuệ**
- Mọi nội dung trên website thuộc quyền sở hữu của VIET CITY WEAR
- Không được sao chép, sử dụng trái phép các thiết kế và nội dung`}
    />
  );
}
