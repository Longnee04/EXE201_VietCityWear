export interface NavSubLink {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
  isAction?: "cart" | "account";
  children?: NavSubLink[];
}

/**
 * Menu chuẩn hóa theo đặc tả chức năng VIET CITY WEAR (Mục 7):
 * TRANG CHỦ | CỬA HÀNG (Tất cả, Mới, Bán chạy) | KHÁM PHÁ (Hà Nội, Huế, Hội An,...) | GIỎ HÀNG | TÀI KHOẢN
 */
export const mainNav: NavLink[] = [
  { label: "TRANG CHỦ", href: "/" },
  {
    label: "CỬA HÀNG",
    href: "/products",
    children: [
      { label: "Tất cả sản phẩm", href: "/products" },
      { label: "Sản phẩm mới", href: "/products?filter=new" },
      { label: "Sản phẩm bán chạy", href: "/products?filter=best-seller" },
    ],
  },
  {
    label: "KHÁM PHÁ",
    href: "/explore",
    children: [
      { label: "Di sản Hà Nội & NFC", href: "/explore/hanoi" },
      { label: "Cố đô Huế", href: "/explore#hue" },
      { label: "Phố cổ Hội An", href: "/explore#hoian" },
      { label: "Thành phố Đà Nẵng", href: "/explore#danang" },
      { label: "TP. Hồ Chí Minh", href: "/explore#hcm" },
    ],
  },
  { label: "CẨM NANG BLOG", href: "/blog" },
  { label: "VỀ CHÚNG TÔI", href: "/about" },
  { label: "LIÊN HỆ", href: "/contact" },
];

export const footerNav = {
  shop: [
    { label: "Tất cả sản phẩm", href: "/products" },
    { label: "Sản phẩm mới", href: "/products?filter=new" },
    { label: "Sản phẩm bán chạy", href: "/products?filter=best-seller" },
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
