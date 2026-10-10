import { supabase } from "@/lib/supabase/client";
import { products as defaultProducts, type Product, slugify } from "@/data/products";

export interface DbProductRow {
  id: string;
  name: string;
  base_price: number | string;
  front_image: string | null;
  back_image: string | null;
  description: string | null;
  package_type: string | null;
  size_guide_text: string | null;
  city_id: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DbVariantRow {
  id: string;
  product_id: string;
  size: string;
  color: string;
  price: number | string;
  stock_quantity: number;
}

export interface DbCityRow {
  id: string;
  name: string;
}

/**
 * Ánh xạ bản ghi Supabase sang cấu trúc Product của giao diện
 */
export function mapDbProductToUi(
  dbProd: DbProductRow,
  cityName?: string,
  variants: DbVariantRow[] = []
): Product {
  const prodVariants = variants.filter((v) => v.product_id === dbProd.id);
  const totalStock = prodVariants.reduce((sum, v) => sum + (Number(v.stock_quantity) || 0), 0);
  const inStock = prodVariants.length > 0 ? totalStock > 0 : true;

  const uniqueSizes = Array.from(new Set(prodVariants.map((v) => v.size))).filter(Boolean);
  const uniqueColors = Array.from(new Set(prodVariants.map((v) => v.color))).filter(Boolean);

  const images = [
    dbProd.front_image,
    dbProd.back_image,
  ].filter((img): img is string => Boolean(img && img.trim().length > 0));

  if (images.length === 0) {
    images.push("/images/products/tee-hanoi-front.jpg");
  }

  const generatedSlug = slugify(dbProd.name) || dbProd.id;

  return {
    id: dbProd.id,
    name: dbProd.name,
    slug: generatedSlug,
    price: Number(dbProd.base_price) || 299000,
    images: images,
    colors:
      uniqueColors.length > 0
        ? uniqueColors.map((c) => ({
            name: c,
            value: c.toLowerCase().includes("trắng")
              ? "#F7F4EE"
              : c.toLowerCase().includes("vàng")
              ? "#E8B923"
              : c.toLowerCase().includes("tím")
              ? "#4B2E83"
              : "#111111",
          }))
        : [{ name: "Tiêu chuẩn", value: "#111111" }],
    sizes: uniqueSizes.length > 0 ? uniqueSizes : ["S", "M", "L", "XL"],
    badge: "NEW",
    category: "new",
    city: cityName as "Hà Nội" | "Hải Phòng" | undefined,
    description:
      dbProd.description ||
      "Sản phẩm áo thun văn hóa di sản độc bản từ VIET CITY WEAR.",
    inStock: inStock,
    includes: dbProd.package_type
      ? [dbProd.package_type]
      : ["01 × Áo thun di sản", "01 × Thẻ địa danh AR", "01 × Móc khóa NFC"],
  };
}

/**
 * Tải toàn bộ danh sách sản phẩm động từ Supabase (có cache fallback)
 */
export async function fetchLiveProducts(): Promise<Product[]> {
  try {
    const { data: dbProducts, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !dbProducts || dbProducts.length === 0) {
      return defaultProducts;
    }

    const [{ data: dbCities }, { data: dbVariants }] = await Promise.all([
      supabase.from("cities").select("id, name"),
      supabase.from("product_variants").select("*"),
    ]);

    const cityMap = new Map((dbCities || []).map((c) => [c.id, c.name]));

    const mappedProducts: Product[] = (dbProducts as DbProductRow[]).map((p) =>
      mapDbProductToUi(
        p,
        p.city_id ? cityMap.get(p.city_id) : undefined,
        (dbVariants as DbVariantRow[]) || []
      )
    );

    // Lưu vào LocalStorage làm cache phản hồi tức thì
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vcw_cached_products", JSON.stringify(mappedProducts));
      } catch {}
    }

    return mappedProducts;
  } catch (err) {
    console.warn("Lỗi tải sản phẩm từ Supabase, chuyển sang chế độ dự phòng:", err);
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("vcw_cached_products");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return defaultProducts;
  }
}

/**
 * Lấy chi tiết một sản phẩm theo slug hoặc id từ dữ liệu tĩnh hoặc Supabase
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  // 1. Kiểm tra trong danh sách tĩnh trước
  const staticFound = defaultProducts.find((p) => p.slug === slug || p.id === slug);
  if (staticFound) return staticFound;

  // 2. Tra cứu trong Supabase DB
  try {
    const { data: dbProducts } = await supabase.from("products").select("*");
    if (!dbProducts || dbProducts.length === 0) return null;

    const matched = (dbProducts as DbProductRow[]).find((p) => {
      const generatedSlug = slugify(p.name);
      return p.id === slug || generatedSlug === slug;
    });

    if (!matched) return null;

    const [{ data: dbCity }, { data: dbVariants }] = await Promise.all([
      matched.city_id
        ? supabase.from("cities").select("id, name").eq("id", matched.city_id).maybeSingle()
        : Promise.resolve({ data: null }),
      supabase.from("product_variants").select("*").eq("product_id", matched.id),
    ]);

    return mapDbProductToUi(
      matched,
      dbCity?.name,
      (dbVariants as DbVariantRow[]) || []
    );
  } catch (err) {
    console.warn("Lỗi tra cứu sản phẩm theo slug từ Supabase:", err);
    return null;
  }
}

