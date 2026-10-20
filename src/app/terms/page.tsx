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
Chào mừng bạn đến với VIET CITY WEAR. Khi sử dụng website và mua sắm các sản phẩm thời trang di sản của chúng tôi, bạn đồng ý tuân thủ các điều khoản sau.

**2. Sử dụng dịch vụ**
- Thông tin khách hàng cung cấp khi đặt hàng phải chính xác và trung thực (họ tên, số điện thoại, địa chỉ nhận hàng).
- Không sử dụng website cho bất kỳ hành vi lừa đảo, tấn công mạng hay mục đích bất hợp pháp nào.

**3. Đặt hàng và thanh toán**
- VIET CITY WEAR hỗ trợ 02 hình thức thanh toán an toàn, minh bạch:
  1. Thanh toán tiền mặt khi nhận hàng (Ship COD toàn quốc, khách hàng được kiểm tra hàng trước khi nhận).
  2. Chuyển khoản ngân hàng tự động quét mã SePay VietQR (xác nhận đơn hàng tức thì).
- Miễn phí vận chuyển toàn quốc cho đơn hàng có giá trị từ 500.000₫. Đơn hàng dưới 500.000₫ áp dụng phí giao hàng cố định 30.000₫.

**4. Chính sách bảo hành và đổi trả**
- **Đổi trả do lỗi sản xuất:** Đổi mới 100% hoàn toàn miễn phí trong vòng 07 ngày nếu phát hiện lỗi đường may, hình in hoặc giao nhầm sản phẩm/kích cỡ.
- **Hỗ trợ đổi size:** Hỗ trợ đổi size trong vòng 07 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên tem mác, hộp đóng gói và đầy đủ phụ kiện (thẻ địa danh, móc khóa QR), chưa qua sử dụng hay giặt tẩy. Quý khách vui lòng hỗ trợ chi phí vận chuyển 1 chiều khi đổi size theo nhu cầu cá nhân.

**5. Bản quyền và quyền sở hữu trí tuệ**
- Toàn bộ thiết kế thời trang, hình ảnh mỹ thuật các địa danh, logo VIET CITY WEAR và nội dung bài viết di sản số đều thuộc quyền sở hữu độc quyền của VIET CITY WEAR. Mọi hành vi sao chép nhằm mục đích thương mại khi chưa được sự cho phép bằng văn bản đều vi phạm quyền tác giả.`}
    />
  );
}