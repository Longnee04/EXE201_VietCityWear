"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles, Filter, RefreshCw } from "lucide-react";
import { type Product, products as defaultProducts } from "@/data/products";
import { fetchLiveProducts } from "@/lib/products-service";
import ProductCard from "@/components/home/ProductCard";

type CategoryFilter = "all" | "new" | "best-seller";
type PriceFilter = "all" | "under-200" | "200-300" | "above-300";
type SortOption = "default" | "newest" | "best-selling" | "price-asc" | "price-desc";

export default function ProductsPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL Query Params Support (?filter=new, ?filter=best-seller, ?city=hanoi, ?q=...)
  const initialCategory = (searchParams.get("filter") as CategoryFilter) || "all";
  const initialCity = searchParams.get("city") || "all";
  const initialSearch = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(initialCategory);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Sync state if query param changes
  useEffect(() => {
    const filterParam = searchParams.get("filter") as CategoryFilter;
    if (filterParam && ["all", "new", "best-seller"].includes(filterParam)) {
      setActiveCategory(filterParam);
    }
    const qParam = searchParams.get("q");
    if (qParam !== null) {
      setSearchQuery(qParam);
    }
  }, [searchParams]);

  // Load products from Supabase
  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const live = await fetchLiveProducts();
        if (!ignore && live && live.length > 0) {
          setProducts(live);
        }
      } catch (err) {
        console.warn("Failed to load live products, using defaults", err);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  // Unique list of cities
  const cities = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.city) set.add(p.city);
    });
    return Array.from(set);
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.city && p.city.toLowerCase().includes(q))
      );
    }

    // 2. Category Tab
    if (activeCategory === "new") {
      list = list.filter((p) => p.category === "new" || p.badge === "NEW");
    } else if (activeCategory === "best-seller") {
      list = list.filter((p) => p.category === "best-seller" || p.badge === "BEST SELLER");
    }

    // 3. City
    if (selectedCity !== "all") {
      list = list.filter((p) => p.city?.toLowerCase() === selectedCity.toLowerCase());
    }

    // 4. Price
    if (selectedPrice === "under-200") {
      list = list.filter((p) => p.price < 200000);
    } else if (selectedPrice === "200-300") {
      list = list.filter((p) => p.price >= 200000 && p.price <= 300000);
    } else if (selectedPrice === "above-300") {
      list = list.filter((p) => p.price > 300000);
    }

    // 5. Sorting
    if (sortOption === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOption === "newest") {
      list.sort((a, b) => {
        if (a.badge === "NEW" && b.badge !== "NEW") return -1;
        if (b.badge === "NEW" && a.badge !== "NEW") return 1;
        return 0;
      });
    } else if (sortOption === "best-selling") {
      list.sort((a, b) => {
        if (a.badge === "BEST SELLER" && b.badge !== "BEST SELLER") return -1;
        if (b.badge === "BEST SELLER" && a.badge !== "BEST SELLER") return 1;
        return 0;
      });
    }

    return list;
  }, [products, searchQuery, activeCategory, selectedCity, selectedPrice, sortOption]);

  const handleResetFilters = () => {
    setActiveCategory("all");
    setSelectedCity("all");
    setSelectedPrice("all");
    setSortOption("default");
    setSearchQuery("");
    router.replace("/products");
  };

  const hasActiveFilters =
    activeCategory !== "all" ||
    selectedCity !== "all" ||
    selectedPrice !== "all" ||
    sortOption !== "default" ||
    searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <div className="bg-[#FAF8F5] border-b border-[#EAE6DF] py-10 sm:py-14">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#888] uppercase">
                  Cửa Hàng Chính Hãng
                </span>
                <span className="text-[#ccc]">•</span>
                <span className="text-[10px] font-bold tracking-[0.1em] text-black uppercase">
                  VIET CITY WEAR
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111]">
                Tất Cả Sản Phẩm Thời Trang Di Sản
              </h1>
              <p className="text-xs sm:text-sm text-[#666] mt-1.5 max-w-2xl leading-relaxed">
                Khám phá các mẫu áo thun kết hợp nghệ thuật đường phố và di sản văn hóa Việt Nam, tích hợp công nghệ chạm NFC kết nối hành trình trải nghiệm số.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3 text-xs text-[#555] bg-white px-4 py-2.5 rounded-sm border border-[#EAE6DF] self-start md:self-auto shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Hiển thị <strong className="text-black font-extrabold">{filteredProducts.length}</strong> / {products.length} sản phẩm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-8">
        {/* Navigation Tabs (All | New | Best-seller) */}
        <div className="flex items-center justify-between border-b border-[#eaeaea] pb-4 mb-6 gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors ${
                activeCategory === "all"
                  ? "bg-black text-white shadow-xs"
                  : "bg-[#f5f5f5] text-[#555] hover:text-black"
              }`}
            >
              Tất cả sản phẩm
            </button>
            <button
              onClick={() => setActiveCategory("new")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors ${
                activeCategory === "new"
                  ? "bg-black text-white shadow-xs"
                  : "bg-[#f5f5f5] text-[#555] hover:text-black"
              }`}
            >
              Sản phẩm mới
            </button>
            <button
              onClick={() => setActiveCategory("best-seller")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors ${
                activeCategory === "best-seller"
                  ? "bg-black text-white shadow-xs"
                  : "bg-[#f5f5f5] text-[#555] hover:text-black"
              }`}
            >
              Sản phẩm bán chạy
            </button>
          </div>

          {/* Reset Filters Button if any filter active */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 font-semibold flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>

        {/* Filter & Search Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 mb-8 items-center bg-[#fafafa] p-4 rounded-sm border border-[#eaeaea]">
          {/* Search Box (4 cols) */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên áo hoặc thành phố..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs border border-[#ddd] bg-white rounded-xs focus:outline-none focus:border-black"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#888] hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* City Filter (3 cols) */}
          <div className="lg:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-[#ddd] bg-white rounded-xs focus:outline-none focus:border-black cursor-pointer font-medium"
            >
              <option value="all">Tất cả thành phố di sản</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  Thành phố {city}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter (3 cols) */}
          <div className="lg:col-span-3">
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value as PriceFilter)}
              className="w-full py-2 px-3 text-xs border border-[#ddd] bg-white rounded-xs focus:outline-none focus:border-black cursor-pointer font-medium"
            >
              <option value="all">Tất cả mức giá</option>
              <option value="under-200">Dưới 200.000đ</option>
              <option value="200-300">200.000đ – 300.000đ</option>
              <option value="above-300">Trên 300.000đ</option>
            </select>
          </div>

          {/* Sort Option (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="w-full py-2 px-3 text-xs border border-[#ddd] bg-white rounded-xs focus:outline-none focus:border-black cursor-pointer font-medium"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="newest">Mới nhất</option>
              <option value="best-selling">Bán chạy nhất</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#888] mb-3" />
            <p className="text-xs text-[#777] uppercase tracking-wider">Đang tải sản phẩm...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[#ddd] rounded-sm p-8 my-6">
            <Filter className="w-8 h-8 text-[#999] mx-auto mb-3" />
            <h3 className="text-base font-bold uppercase tracking-wider text-[#111] mb-1">
              Không tìm thấy sản phẩm phù hợp
            </h3>
            <p className="text-xs text-[#666] max-w-md mx-auto mb-5">
              Rất tiếc, không có mẫu áo nào phù hợp với bộ lọc hiện tại của bạn. Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
