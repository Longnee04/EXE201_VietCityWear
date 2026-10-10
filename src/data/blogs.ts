export interface BlogPost {
  id: string;
  title: string;
  slug: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  status: string | null;
  published_at: string | null;
  created_at: string;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const fallbackBlogs: BlogPost[] = [
  {
    id: "ho-guom-thap-rua-trai-tim-nghin-nam-van-hien",
    title: "Hồ Gươm & Tháp Rùa – Trái tim nghìn năm văn hiến",
    slug: "ho-guom-thap-rua-trai-tim-nghin-nam-van-hien",
    content: `Hồ Gươm không chỉ là biểu tượng bất tử của thủ đô Hà Nội, mà còn là nơi lưu giữ huyền tích vua Lê Lợi trả gươm báu cho Rùa Thần sau ngày khải hoàn.

Dạo bước quanh hồ buổi sớm mai để ngắm tháp Rùa cổ kính nép mình dưới hàng liễu rủ là trải nghiệm văn hóa không thể nào quên.

# Di sản kiến trúc Tháp Rùa và Đền Ngọc Sơn

Nằm trên gò đất nổi giữa hồ, Tháp Rùa soi bóng nước xanh màu ngọc bích hòa quyện cùng cầu Thê Húc màu son đỏ rực dẫn lối vào Đền Ngọc Sơn. Mỗi viên gạch, tán cây nơi đây đều chuyên chở hàng thế kỷ thăng trầm của kinh kỳ Thăng Long.

# Tinh thần VIET CITY WEAR

Lấy cảm hứng từ sắc xanh rêu phong cổ kính và bóng Tháp Rùa trầm mặc, BST Heritage Tee tái hiện lại nét đẹp thiêng liêng ấy qua những nét vẽ tối giản nhưng giàu hồn cốt.`,
    cover_image: "/images/hanoi-banner.jpg",
    category: "culture",
    status: "Published",
    published_at: "2026-01-01T00:00:00.000Z",
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "co-do-hue-dau-an-vang-son",
    title: "Cố Đô Huế – Dấu ấn vàng son của triều đại phong kiến cuối cùng",
    slug: "co-do-hue-dau-an-vang-son",
    content: `Nằm bên bờ sông Hương thơ mộng, Kinh thành Huế mang đậm dấu ấn cung đình triều Nguyễn với hệ thống lăng tẩm, hoàng thành uy nghiêm và nhã nhạc cung đình – di sản văn hóa phi vật thể của nhân loại.

# Nét trầm mặc của Đại Nội và lăng tẩm

Những mái ngói hoàng lưu ly rêu phong, những bức tường thành sừng sững qua bao thăng trầm lịch sử tạo nên vẻ đẹp trang nghiêm, lắng đọng đầy chất thơ của xứ Huế.

# Hồn di sản trong thời trang đương đại

Từng nét hoa văn cung đình được chắt lọc tinh tế để đưa vào trang phục thường nhật, kết nối thế hệ trẻ với dòng chảy lịch sử hào hùng.`,
    cover_image: "/images/hue-banner.jpg",
    category: "landmark",
    status: "Published",
    published_at: "2026-01-01T00:00:00.000Z",
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "pho-co-hoi-an-anh-den-long-song-hoai",
    title: "Phố Cổ Hội An – Ánh đèn lồng soi bóng dòng sông Hoài",
    slug: "pho-co-hoi-an-anh-den-long-song-hoai",
    content: `Đô thị cổ Hội An từng là thương cảng quốc tế sầm uất bậc nhất Đông Nam Á từ thế kỷ 16-17. Nơi đây giao thoa tinh hoa kiến trúc Việt – Hoa – Nhật Bản, tạo nên một nét hoài niệm quyến rũ không nơi nào có được.

# Bức tường vàng và giàn hoa giấy

Ánh đèn lồng lung linh soi bóng dòng sông Hoài, những mái ngói âm dương rêu phong cùng sắc vàng đặc trưng của những bức tường cổ tạo nên một bức tranh hoài niệm níu chân du khách muôn phương.

# Chạm câu chuyện di sản

VIET CITY WEAR lưu giữ vẻ đẹp của thương cảng xưa qua từng chất liệu vải và đường kim mũi chỉ, đồng hành cùng bạn trên mọi nẻo đường khám phá.`,
    cover_image: "/images/hoian-banner.jpg",
    category: "travel",
    status: "Published",
    published_at: "2026-01-01T00:00:00.000Z",
    created_at: "2026-01-01T00:00:00.000Z",
  },
];
