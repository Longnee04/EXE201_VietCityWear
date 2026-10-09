export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: "HOME", href: "/" },
  { label: "T-SHIRTS", href: "/#t-shirts" },
  { label: "KHÁM PHÁ DI SẢN", href: "/explore/hanoi" },
  { label: "CẨM NANG BLOG", href: "/blog" },
  { label: "ABOUT US", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export const footerNav = {
  shop: [
    { label: "T-Shirts", href: "/#t-shirts" },
    { label: "NFC & Thẻ di sản", href: "/explore/hanoi" },
  ],
  about: [
    { label: "Giới thiệu thương hiệu", href: "/about" },
    { label: "Cẩm nang & Blog di sản", href: "/blog" },
    { label: "Liên hệ", href: "/contact" },
  ],
  support: [
    { label: "Điều khoản sử dụng", href: "/terms" },
    { label: "Chính sách bảo mật", href: "/privacy" },
  ],
  social: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "TikTok", href: "#" },
  ],
};
