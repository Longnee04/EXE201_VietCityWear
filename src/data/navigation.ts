export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: "TRANG CHỦ", href: "/" },
  { label: "BỘ SƯU TẬP", href: "/#t-shirts" },
  { label: "KHÁM PHÁ DI SẢN", href: "/explore" },
  { label: "CẨM NANG BLOG", href: "/blog" },
  { label: "VỀ CHÚNG TÔI", href: "/about" },
  { label: "LIÊN HỆ", href: "/contact" },
];

export const footerNav = {
  shop: [
    { label: "Bộ sưu tập sản phẩm", href: "/#t-shirts" },
    { label: "Khám phá các thành phố", href: "/explore" },
    { label: "Di sản Hà Nội & NFC", href: "/explore/hanoi" },
  ],
  about: [
    { label: "Giới thiệu thương hiệu", href: "/about" },
    { label: "Cẩm nang & Blog di sản", href: "/blog" },
    { label: "Liên hệ hỗ trợ", href: "/contact" },
  ],
  support: [
    { label: "Điều khoản sử dụng", href: "/terms" },
    { label: "Chính sách bảo mật", href: "/privacy" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com/vietcitywear" },
    { label: "Facebook", href: "https://facebook.com/vietcitywear" },
    { label: "TikTok", href: "https://tiktok.com/@vietcitywear" },
  ],
};
