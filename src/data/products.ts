export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  hoverImage?: string;
  colors: ProductColor[];
  sizes: string[];
  badge?: "NEW" | "BEST SELLER" | "LIMITED";
  category: "new" | "best-seller" | "all";
  description: string;
  inStock: boolean;
}

export interface ProductColor {
  name: string;
  value: string;
}

export const products: Product[] = [
  {
    id: "vcw-hp-001",
    name: "Áo thun Hải Phòng Heritage Tee",
    slug: "ao-thun-hai-phong-heritage-tee",
    price: 299000,
    images: ["/images/ao-thun-hai-phong.png"],
    colors: [
      { name: "White", value: "#F7F4EE" },
      { name: "Navy", value: "#1A2421" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    badge: "NEW",
    category: "new",
    description: "Mặt trước in logo VIET CITY WEAR, mặt sau in hình bến cảng và tọa độ 20.8449°N, 106.6881°E.",
    inStock: true,
  },
  {
    id: "vcw-hn-001",
    name: "Hà Nội Old Quarter Tee",
    slug: "ha-noi-old-quarter-tee",
    price: 299000,
    images: ["/images/ao-thun-hai-phong.png"],
    colors: [
      { name: "Black", value: "#1A2421" },
      { name: "White", value: "#F7F4EE" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    badge: "BEST SELLER",
    category: "best-seller",
    description: "Áo thun phố cổ Hà Nội 36 phố phường — Cotton 100%, form Oversized.",
    inStock: true,
  },
  {
    id: "vcw-hn-002",
    name: "Hoàn Kiếm Lake Heritage Tee",
    slug: "hoan-kiem-lake-heritage-tee",
    price: 349000,
    images: ["/images/ao-thun-hai-phong.png"],
    colors: [
      { name: "Dark Green", value: "#1B4332" },
      { name: "Black", value: "#1A2421" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    badge: "LIMITED",
    category: "new",
    description: "Hồ Hoàn Kiếm — Phiên bản đặc biệt kèm thẻ địa danh và chip NFC.",
    inStock: true,
  },
  {
    id: "vcw-hn-003",
    name: "Temple of Literature Tee",
    slug: "temple-of-literature-tee",
    price: 249000,
    images: ["/images/ao-thun-hai-phong.png"],
    colors: [
      { name: "White", value: "#F7F4EE" },
      { name: "Sand", value: "#C9B99A" },
    ],
    sizes: ["S", "M", "L", "XL"],
    category: "all",
    description: "Văn Miếu — Quốc Tử Giám, biểu tượng tri thức ngàn năm.",
    inStock: true,
  },
  {
    id: "vcw-hn-004",
    name: "Long Biên Bridge Tee",
    slug: "long-bien-bridge-tee",
    price: 299000,
    images: ["/images/ao-thun-hai-phong.png"],
    colors: [
      { name: "Rust", value: "#B4532A" },
      { name: "Black", value: "#1A2421" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    badge: "BEST SELLER",
    category: "best-seller",
    description: "Cầu Long Biên — Di sản kiến trúc nối liền quá khứ và hiện tại.",
    inStock: true,
  },
  {
    id: "vcw-hn-005",
    name: "Đông Kinh Nghĩa Thục Tee",
    slug: "dong-kinh-nghia-thuc-tee",
    price: 349000,
    images: ["/images/ao-thun-hai-phong.png"],
    colors: [
      { name: "Navy", value: "#1E3A5F" },
      { name: "Cream", value: "#F7F4EE" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    category: "all",
    description: "Quảng trường Đông Kinh Nghĩa Thục — Tinh thần Hà Nội hiện đại.",
    inStock: true,
  },
];

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.badge === "NEW" || p.category === "new").slice(0, 4);
}

export function getByCategory(cat: "new" | "best-seller" | "all"): Product[] {
  if (cat === "all") return products;
  return products.filter(
    (p) =>
      p.category === cat ||
      (cat === "best-seller" && p.badge === "BEST SELLER") ||
      (cat === "new" && p.badge === "NEW")
  );
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN").format(price) + "₫";
}
