"use client";

import { useState, useMemo, useEffect } from "react";
import { filterProducts, products as defaultProducts, type Product } from "@/data/products";
import { fetchLiveProducts } from "@/lib/products-service";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";

const categoryFilters = [
  { key: "all" as const, label: "Tất cả" },
  { key: "new" as const, label: "Mới nhất" },
  { key: "best-seller" as const, label: "Bán chạy" },
];

const priceFilters = [
  { key: "all" as const, label: "Mọi mức giá" },
  { key: "under_100" as const, label: "Dưới 100k" },
  { key: "100_to_200" as const, label: "100k – 200k" },
  { key: "above_200" as const, label: "Trên 200k" },
];

const sortOptions = [
  { key: "default" as const, label: "Sắp xếp mặc định" },
  { key: "best_seller" as const, label: "Bán chạy nhất" },
  { key: "price_asc" as const, label: "Giá: Thấp → Cao" },
  { key: "price_desc" as const, label: "Giá: Cao → Thấp" },
  { key: "newest" as const, label: "Ưu tiên mẫu mới" },
];

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<"all" | "new" | "best-seller">("all");
  const [activeCity, setActiveCity] = useState<string>("all");
  const [activePrice, setActivePrice] = useState<"all" | "under_100" | "100_to_200" | "above_200">("all");
  const [activeSort, setActiveSort] = useState<"default" | "price_asc" | "price_desc" | "newest" | "best_seller">("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>(defaultProducts);

  // Tải danh sách sản phẩm động từ Supabase (móc nối trực tiếp từ Admin)
  useEffect(() => {
    fetchLiveProducts().then((data) => {
      if (data && data.length > 0) {
        setAllProducts(data);
      }
    });
  }, []);

  // Danh sách các thành phố thực tế có sản phẩm
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => {
      if (p.city) set.add(p.city);
    });
    return ["all", ...Array.from(set)];
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return filterProducts(
      {
        category: activeCategory,
        city: activeCity === "all" ? undefined : activeCity,
        priceRange: activePrice,
        sort: activeSort,
        searchQuery: searchQuery,
      },
      allProducts
    );
  }, [activeCategory, activeCity, activePrice, activeSort, searchQuery, allProducts]);

  const hasActiveFilters =
    activeCategory !== "all" ||
    activeCity !== "all" ||
    activePrice !== "all" ||
    activeSort !== "default" ||
    searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setActiveCategory("all");
    setActiveCity("all");
    setActivePrice("all");
    setActiveSort("default");
    setSearchQuery("");
  };

  return (
    <section id="t-shirts" className="py-16 sm:py-24 border-t border-neutral-200/80 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Top Header: Title & Search bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-black inline-block" />
              <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-neutral-500">
                BỘ SƯU TẬP ÁO THUN & VẬT PHẨM LƯU NIỆM
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black uppercase">
              BỘ SƯU TẬP SẢN PHẨM
            </h2>
          </div>

          {/* Search box & filter trigger */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Tìm áo, địa danh di sản, thẻ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 text-xs rounded-full border border-neutral-300 bg-neutral-50 focus:bg-white focus:outline-none focus:border-black transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "md:hidden flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-bold border uppercase tracking-wider transition-colors",
                showFilters ? "border-black bg-black text-white" : "border-neutral-300 bg-neutral-50 text-neutral-800"
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Lọc</span>
            </button>
          </div>
        </div>

        {/* Filter controls row */}
        <div className={cn("space-y-4 mb-8", !showFilters && "hidden md:block")}>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-100">
            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase mr-1 font-mono">
                Phân loại:
              </span>
              {categoryFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveCategory(f.key)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.05em] uppercase transition-all shadow-2xs",
                    activeCategory === f.key
                      ? "bg-black text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* City tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase mr-1 font-mono">
                Thành phố:
              </span>
              {availableCities.map((cityName) => (
                <button
                  key={cityName}
                  onClick={() => setActiveCity(cityName)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.05em] uppercase transition-all shadow-2xs",
                    activeCity === cityName
                      ? "bg-black text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black"
                  )}
                >
                  {cityName === "all" ? "Tất cả TP" : cityName}
                </button>
              ))}
            </div>

            {/* Price tabs & Sort */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase mr-1 font-mono">
                Giá:
              </span>
              {priceFilters.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setActivePrice(p.key)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all shadow-2xs",
                    activePrice === p.key
                      ? "bg-black text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black"
                  )}
                >
                  {p.label}
                </button>
              ))}

              {/* Sort dropdown */}
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value as "default" | "price_asc" | "price_desc" | "newest" | "best_seller")}
                className="py-1.5 px-3 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-300 focus:outline-none focus:border-black cursor-pointer shadow-2xs"
              >
                {sortOptions.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>

              {/* Reset button */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[11px] font-bold text-neutral-600 hover:text-black underline px-2 py-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Xóa lọc</span>
                </button>
              )}
            </div>
          </div>

          {/* Result counter indicator */}
          <div className="flex items-center justify-between text-[11.5px] text-neutral-500 pt-1">
            <span>
              Hiển thị <strong className="text-black">{filteredProducts.length}</strong> / {allProducts.length} sản phẩm
            </span>
            {searchQuery && (
              <span>
                Kết quả cho từ khóa: <strong className="text-black">&quot;{searchQuery}&quot;</strong>
              </span>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-200 my-6">
            <p className="text-base font-bold text-black mb-2">Không tìm thấy sản phẩm phù hợp</p>
            <p className="text-xs text-neutral-500 mb-5">
              Thử tìm kiếm với từ khóa khác hoặc xóa bớt tiêu chí lọc
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-3 rounded-xl bg-black text-white text-xs font-bold tracking-wider uppercase hover:bg-neutral-800 transition-all shadow-sm"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
