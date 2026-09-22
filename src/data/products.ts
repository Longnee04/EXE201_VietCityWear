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
    id: "vcw-hn-001",
    name: "Hà Nội Old Quarter Tee",
    slug: "ha-noi-old-quarter-tee",
    price: 299000,
    images: ["/products/placeholder-1.jpg"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "White", value: "#FFFFFF" },
      { name: "Cream", value: "#F5F0E8" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    badge: "NEW",
    category: "new",
    description: "Áo thun phố cổ Hà Nội 36 phố phường — Cotton 100%, form Oversized.",
    inStock: true,
  },
  {
    id: "vcw-hn-002",
    name: "Hoàn Kiếm Lake Heritage Tee",
    slug: "hoan-kiem-lake-heritage-tee",
    price: 349000,
    images: ["/products/placeholder-2.jpg"],
    colors: [
      { name: "Dark Green", value: "#1B4332" },
      { name: "Black", value: "#000000" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    badge: "BEST SELLER",
    category: "best-seller",
    description: "Hồ Hoàn Kiếm — Limited Heritage Edition, kèm thẻ NFC địa danh.",
    inStock: true,
  },
  {
    id: "vcw-hn-003",
    name: "Temple of Literature Tee",
    slug: "temple-of-literature-tee",
    price: 249000,
    images: ["/products/placeholder-3.jpg"],
    colors: [
      { name: "White", value: "#FFFFFF" },
      { name: "Sand", value: "#C9B99A" },
    ],
    sizes: ["S", "M", "L", "XL"],
    badge: "NEW",
    category: "new",
    description: "Văn Miếu — Quốc Tử Giám, biểu tượng tri thức ngàn năm.",
    inStock: true,
  },
  {
    id: "vcw-hn-004",
    name: "Long Biên Bridge Tee",
    slug: "long-bien-bridge-tee",
    price: 299000,
    images: ["/products/placeholder-4.jpg"],
    colors: [
      { name: "Rust", value: "#8B4513" },
      { name: "Black", value: "#000000" },
      { name: "White", value: "#FFFFFF" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    badge: "BEST SELLER",
    category: "best-seller",
    description: "Cầu Long Biên — Di sản kiến trúc Pháp giữa lòng Hà Nội.",
    inStock: true,
  },
  {
    id: "vcw-hn-005",
    name: "Hà Nội Street Food Tee",
    slug: "ha-noi-street-food-tee",
    price: 249000,
    images: ["/products/placeholder-5.jpg"],
    colors: [
      { name: "Red", value: "#B91C1C" },
      { name: "Black", value: "#000000" },
    ],
    sizes: ["S", "M", "L", "XL"],
    category: "all",
    description: "Ẩm thực đường phố Hà Nội — phở, bún chả, cà phê trứng.",
    inStock: true,
  },
  {
    id: "vcw-hn-006",
    name: "Đông Kinh Nghĩa Thục Tee",
    slug: "dong-kinh-nghia-thuc-tee",
    price: 349000,
    images: ["/products/placeholder-6.jpg"],
    colors: [
      { name: "Navy", value: "#1E3A5F" },
      { name: "Cream", value: "#F5F0E8" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    badge: "LIMITED",
    category: "new",
    description: "Quảng trường Đông Kinh Nghĩa Thục — Tinh thần Hà Nội hiện đại.",
    inStock: true,
  },
  {
    id: "vcw-hn-007",
    name: "Hanoi Motorbike Culture Tee",
    slug: "hanoi-motorbike-culture-tee",
    price: 249000,
    images: ["/products/placeholder-7.jpg"],
    colors: [
      { name: "Charcoal", value: "#333333" },
      { name: "White", value: "#FFFFFF" },
    ],
    sizes: ["S", "M", "L", "XL"],
    category: "all",
    description: "Văn hóa xe máy Hà Nội — Dòng chảy đô thị không bao giờ ngừng.",
    inStock: true,
  },
  {
    id: "vcw-hn-008",
    name: "Tràng Tiền Plaza Tee",
    slug: "trang-tien-plaza-tee",
    price: 299000,
    compareAtPrice: 349000,
    images: ["/products/placeholder-8.jpg"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Off White", value: "#FAF9F6" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    badge: "BEST SELLER",
    category: "best-seller",
    description: "Tràng Tiền Plaza — Giao thoa kiến trúc Pháp và Hà Nội đương đại.",
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
