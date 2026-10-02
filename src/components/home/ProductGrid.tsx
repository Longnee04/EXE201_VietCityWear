"use client";

import { useState } from "react";
import { getByCategory } from "@/data/products";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

const filters = [
  { key: "all" as const, label: "All" },
  { key: "new" as const, label: "New" },
  { key: "best-seller" as const, label: "Best Seller" },
];

export default function ProductGrid() {
  const [activeFilter, setActiveFilter] = useState<"all" | "new" | "best-seller">("all");
  const filteredProducts = getByCategory(activeFilter);

  return (
    <section id="t-shirts" className="py-16 sm:py-24 border-t border-[#f0f0f0]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Header + Filter */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111] uppercase">
            T-SHIRTS
          </h2>
          <div className="flex gap-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={cn(
                  "px-4 py-2 text-[11px] font-medium tracking-[0.1em] uppercase transition-colors",
                  activeFilter === f.key
                    ? "bg-[#111] text-white"
                    : "bg-[#f5f5f5] text-[#666] hover:bg-[#eee] hover:text-[#111]"
                )}
              >
                {f.label}
              </button>
            ))}
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
          <div className="text-center py-20">
            <p className="text-sm text-[#999]">No products found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
