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
  badge?: "NEW" | "BEST SELLER" | "LIMITED" | "COMING SOON";
  category: "new" | "best-seller" | "all";
  city?: "Hà Nội" | "Hải Phòng";
  description: string;
  inStock: boolean;
  includes?: string[];
}

export interface ProductColor {
  name: string;
  value: string;
}

export const products: Product[] = [
  {
    id: "vcw-set-001",
    name: "Hanoi Heritage Set — Hoan Kiem Lake Edition",
    slug: "hanoi-heritage-set-hoan-kiem-lake",
    price: 219000,
    compareAtPrice: 247000,
    images: [
      "/images/hanoi-heritage-set.png",
      "/images/ao-thun-ha-noi.png",
      "/images/the-dia-danh-hanoi.png",
      "/images/moc-khoa-qr-hanoi.png",
    ],
    colors: [
      { name: "White", value: "#F7F4EE" },
      { name: "Black", value: "#111111" },
    ],
    sizes: ["M", "L"],
    badge: "BEST SELLER",
    category: "best-seller",
    city: "Hà Nội",
    description:
      "Trọn bộ trải nghiệm Hà Nội: 01 Áo thun Hanoi Heritage Tee, 01 Thẻ địa danh Hanoi Heritage Card, 01 Móc khóa gỗ QR Keychain và Hộp quà Branded Carton Box.",
    inStock: true,
    includes: [
      "01 × Hanoi Heritage Tee (Cotton thoáng mát, form Regular)",
      "01 × Hanoi Heritage Card (Thẻ địa danh bo góc mỹ thuật)",
      "01 × VIET CITY WEAR QR Keychain (Móc khóa gỗ kết nối web)",
      "01 × Branded Carton Box (Hộp quà sang trọng)",
    ],
  },
  {
    id: "vcw-hn-001",
    name: "Hanoi Heritage Tee — Hoan Kiem Lake Edition",
    slug: "hanoi-heritage-tee-hoan-kiem-lake",
    price: 179000,
    compareAtPrice: 199000,
    images: ["/images/ao-thun-ha-noi.png"],
    colors: [
      { name: "White", value: "#F7F4EE" },
      { name: "Black", value: "#111111" },
    ],
    sizes: ["M", "L"],
    badge: "NEW",
    category: "new",
    city: "Hà Nội",
    description:
      "Áo thun lưu niệm di sản Hà Nội — Mặt trước in logo VIET CITY WEAR tối giản, mặt sau in hình Hồ Hoàn Kiếm, Tháp Rùa, xích lô truyền thống, thiếu nữ áo dài và tọa độ 21.0285°N, 105.8542°E. Chất liệu cotton mềm mại, thoáng khí.",
    inStock: true,
    includes: [
      "01 × Áo thun Hanoi Heritage Tee Unisex",
      "Thẻ thông tin sản phẩm và hướng dẫn bảo quản",
    ],
  },
  {
    id: "vcw-card-001",
    name: "Hanoi Heritage Card — Hoan Kiem Lake Edition",
    slug: "hanoi-heritage-card-hoan-kiem-lake",
    price: 39000,
    images: ["/images/the-dia-danh-hanoi.png"],
    colors: [{ name: "Classic Paper", value: "#F7F4EE" }],
    sizes: ["One Size"],
    category: "all",
    city: "Hà Nội",
    description:
      "Thẻ địa danh sưu tập bo góc mỹ thuật cao cấp kể câu chuyện Hồ Gươm và Tháp Rùa. Mặt trước in tranh minh họa nghệ thuật, mặt sau in câu chuyện văn hóa song ngữ và mã QR truy cập trang cẩm nang di sản số.",
    inStock: true,
    includes: [
      "01 × Thẻ địa danh in mỹ thuật 2 mặt bo góc",
      "Mã QR tra cứu audio thuyết minh và video trải nghiệm",
    ],
  },
  {
    id: "vcw-key-001",
    name: "Hanoi QR Keychain",
    slug: "hanoi-qr-keychain",
    price: 29000,
    images: ["/images/moc-khoa-qr-hanoi.png"],
    colors: [{ name: "Natural Wood", value: "#E5D9C5" }],
    sizes: ["One Size"],
    category: "all",
    city: "Hà Nội",
    description:
      "Móc khóa gỗ tròn khắc 2 mặt tinh xảo: Mặt trước khắc logo thương hiệu VIET CITY WEAR, mặt sau khắc mã QR / NFC kết nối trực tiếp với website du lịch số khi chạm hoặc quét điện thoại.",
    inStock: true,
    includes: [
      "01 × Móc khóa gỗ tự nhiên khoen kim loại",
      "Mã QR / NFC định danh duy nhất",
    ],
  },
  {
    id: "vcw-cards-box",
    name: "Hanoi Story Cards — Hộp 10 Thẻ Sưu Tập",
    slug: "hanoi-story-cards-collector-box",
    price: 129000,
    compareAtPrice: 150000,
    images: ["/images/hanoi-story-cards.png"],
    colors: [{ name: "Collector Box", value: "#2C4C5E" }],
    sizes: ["One Size"],
    badge: "LIMITED",
    category: "all",
    city: "Hà Nội",
    description:
      "Hộp quà sưu tập màu xanh cao cấp gồm trọn bộ 10 thẻ địa danh Hà Nội: Hồ Gươm, Văn Miếu, Lăng Bác, Nhà Thờ Lớn, Phố Cổ, Cầu Long Biên, Tây Hồ... Đi kèm túi vải canvas và mã QR tương tác.",
    inStock: true,
    includes: [
      "Hộp cứng nam châm cao cấp",
      "10 × Thẻ địa danh di sản Hà Nội",
      "01 × Túi rút vải canvas bảo vệ",
    ],
  },
  {
    id: "vcw-hp-001",
    name: "Hải Phòng Heritage Tee",
    slug: "ao-thun-hai-phong-heritage-tee",
    price: 179000,
    images: [
      "/images/ao-thun-hai-phong-coming-soon.png",
      "/images/ao-thun-hai-phong.png",
    ],
    colors: [
      { name: "White", value: "#F7F4EE" },
    ],
    sizes: ["M", "L"],
    badge: "COMING SOON",
    category: "new",
    city: "Hải Phòng",
    description:
      "Bộ sưu tập Thành phố cảng hoa phượng đỏ — Mặt trước in Hải Phòng - VIỆT NAM, mặt sau in hình Nhà hát lớn, Cầu Bính và hoa phượng đỏ rực. (Đang trong giai đoạn hoàn thiện chuẩn bị phát hành).",
    inStock: true,
    includes: [
      "01 × Áo thun Hải Phòng Heritage Tee",
      "Đợt phát hành dự kiến tiếp theo",
    ],
  },
];

export function getNewArrivals(): Product[] {
  return products.slice(0, 4);
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
  priceRange?: "all" | "under_100" | "100_to_200" | "above_200";
  sort?: "default" | "price_asc" | "price_desc" | "newest" | "best_seller";
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
  if (options.priceRange === "under_100") {
    result = result.filter((p) => p.price < 100000);
  } else if (options.priceRange === "100_to_200") {
    result = result.filter((p) => p.price >= 100000 && p.price <= 200000);
  } else if (options.priceRange === "above_200") {
    result = result.filter((p) => p.price > 200000);
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
  } else if (options.sort === "best_seller") {
    result.sort((a, b) => (b.badge === "BEST SELLER" ? 1 : 0) - (a.badge === "BEST SELLER" ? 1 : 0));
  }

  return result;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN").format(price) + "₫";
}
