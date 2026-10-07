"use client";

import { useState, useMemo } from "react";
import { filterProducts, products } from "@/data/products";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

const categoryFilters = [
  { key: "all" as const, label: "Tất cả" },
  { key: "new" as const, label: "Mới nhất" },
  { key: "best-seller" as const, label: "Bán chạy" },
];

const cityFilters = [
  { key: "all" as const, label: "Tất cả TP" },
  { key: "Hà Nội" as const, label: "Hà Nội" },
  { key: "Hải Phòng" as const, label: "Hải Phòng" },
];

const priceFilters = [
  { key: "all" as const, label: "Mọi mức giá" },
  { key: "under_300" as const, label: "Dưới 300k" },
  { key: "above_300" as const, label: "Từ 300k" },
];

const sortOptions = [
  { key: "default" as const, label: "Sắp xếp mặc định" },
  { key: "price_asc" as const, label: "Giá: Thấp → Cao" },
  { key: "price_desc" as const, label: "Giá: Cao → Thấp" },
  { key: "newest" as const, label: "Ưu tiên mẫu mới" },
];

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<"all" | "new" | "best-seller">("all");
  const [activeCity, setActiveCity] = useState<"all" | "Hà Nội" | "Hải Phòng">("all");
  const [activePrice, setActivePrice] = useState<"all" | "under_300" | "above_300">("all");
  const [activeSort, setActiveSort] = useState<"default" | "price_asc" | "price_desc" | "newest">("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    return filterProducts({
      category: activeCategory,
      city: activeCity,
      priceRange: activePrice,
      sort: activeSort,
      searchQuery: searchQuery,
    });
  }, [activeCategory, activeCity, activePrice, activeSort, searchQuery]);

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
    <section id="t-shirts" className="py-16 sm:py-24 border-t border-[#f0f0f0] bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Top Header: Title & Search bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#888] mb-1">
              Bộ sưu tập áo thun lưu niệm
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111] uppercase">
              T-SHIRTS & SẢN PHẨM
            </h2>
          </div>

          {/* Search box & filter trigger */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-[280px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
              <input
                type="text"
                placeholder="Tìm áo, địa danh, phố cổ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-[12px] border border-[#e0e0e0] rounded-none bg-[#fafafa] focus:bg-white focus:outline-none focus:border-[#111] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#888] hover:text-[#111]"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "md:hidden flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium border uppercase tracking-wider",
                showFilters ? "border-[#111] bg-[#111] text-white" : "border-[#e0e0e0] bg-[#fafafa] text-[#333]"
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Lọc</span>
            </button>
          </div>
        </div>

        {/* Filter controls row */}
        <div className={cn("space-y-4 mb-8", !showFilters && "hidden md:block")}>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#f0f0f0]">
            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[11px] font-semibold tracking-wider text-[#999] uppercase mr-1">
                Phân loại:
              </span>
              {categoryFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveCategory(f.key)}
                  className={cn(
                    "px-3 py-1.5 text-[11px] font-medium tracking-[0.05em] uppercase transition-colors",
                    activeCategory === f.key
                      ? "bg-[#111] text-white"
                      : "bg-[#f5f5f5] text-[#666] hover:bg-[#eee] hover:text-[#111]"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* City tabs */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[11px] font-semibold tracking-wider text-[#999] uppercase mr-1">
                Thành phố:
              </span>
              {cityFilters.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setActiveCity(c.key)}
                  className={cn(
                    "px-3 py-1.5 text-[11px] font-medium tracking-[0.05em] uppercase transition-colors",
                    activeCity === c.key
                      ? "bg-[#111] text-white"
                      : "bg-[#f5f5f5] text-[#666] hover:bg-[#eee] hover:text-[#111]"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Price tabs & Sort */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider text-[#999] uppercase mr-1">
                Giá:
              </span>
              {priceFilters.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setActivePrice(p.key)}
                  className={cn(
                    "px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                    activePrice === p.key
                      ? "bg-[#111] text-white"
                      : "bg-[#f5f5f5] text-[#666] hover:bg-[#eee] hover:text-[#111]"
                  )}
                >
                  {p.label}
                </button>
              ))}

              {/* Sort dropdown */}
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value as any)}
                className="py-1.5 px-2.5 text-[11px] font-medium bg-[#f5f5f5] text-[#333] border border-[#e0e0e0] focus:outline-none cursor-pointer"
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
                  className="flex items-center gap-1 text-[11px] text-[#888] hover:text-[#111] underline px-2 py-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Xóa lọc</span>
                </button>
              )}
            </div>
          </div>

          {/* Result counter indicator */}
          <div className="flex items-center justify-between text-[11px] text-[#777] pt-1">
            <span>
              Hiển thị <strong className="text-[#111]">{filteredProducts.length}</strong> / {products.length} sản phẩm
            </span>
            {searchQuery && (
              <span>
                Kết quả cho từ khóa: <strong className="text-[#111]">"{searchQuery}"</strong>
              </span>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-[#fafafa] border border-[#eaeaea] my-6">
            <p className="text-base font-semibold text-[#111] mb-2">Không tìm thấy sản phẩm phù hợp</p>
            <p className="text-xs text-[#777] mb-5">
              Thử tìm kiếm với từ khóa khác hoặc xóa bớt tiêu chí lọc
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-[#111] text-white text-[11px] font-semibold tracking-wider uppercase hover:bg-[#333] transition-colors"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
