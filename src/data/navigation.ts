export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: "HOME", href: "/" },
  { label: "T-SHIRTS", href: "#t-shirts" },
  { label: "ABOUT US", href: "#brand-story" },
  { label: "CONTACT", href: "#contact" },
];

export const footerNav = {
  shop: [{ label: "T-Shirts", href: "#t-shirts" }],
  about: [
    { label: "About Us", href: "#brand-story" },
    { label: "Contact", href: "#contact" },
  ],
  support: [
    { label: "Shipping", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Size Guide", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  social: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "TikTok", href: "#" },
  ],
};
