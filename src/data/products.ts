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
  city?: "Hà Nội" | "Hải Phòng";
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
    city: "Hải Phòng",
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
    city: "Hà Nội",
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
    city: "Hà Nội",
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
    city: "Hà Nội",
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
    city: "Hà Nội",
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
    city: "Hà Nội",
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

export interface ProductFilterOptions {
  category?: "new" | "best-seller" | "all";
  city?: "all" | "Hà Nội" | "Hải Phòng";
  priceRange?: "all" | "under_300" | "above_300";
  sort?: "default" | "price_asc" | "price_desc" | "newest";
  searchQuery?: string;
}

export function filterProducts(options: ProductFilterOptions = {}): Product[] {
  let result = [...products];

  // Category filter
  if (options.category && options.category !== "all") {
    result = result.filter(
      (p) =>
        p.category === options.category ||
        (options.category === "best-seller" && p.badge === "BEST SELLER") ||
        (options.category === "new" && p.badge === "NEW")
    );
  }

  // City filter
  if (options.city && options.city !== "all") {
    result = result.filter((p) => p.city === options.city);
  }

  // Price range filter
  if (options.priceRange === "under_300") {
    result = result.filter((p) => p.price < 300000);
  } else if (options.priceRange === "above_300") {
    result = result.filter((p) => p.price >= 300000);
  }

  // Search query filter
  if (options.searchQuery && options.searchQuery.trim() !== "") {
    const q = options.searchQuery.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.city && p.city.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (options.sort === "price_asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (options.sort === "price_desc") {
    result.sort((a, b) => b.price - a.price);
  } else if (options.sort === "newest") {
    result.sort((a, b) => (b.badge === "NEW" ? 1 : 0) - (a.badge === "NEW" ? 1 : 0));
  }

  return result;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN").format(price) + "₫";
}
