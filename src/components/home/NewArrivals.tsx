"use client";

import { useState, useEffect } from "react";
import { getNewArrivals, type Product } from "@/data/products";
import { fetchLiveProducts } from "@/lib/products-service";
import ProductCard from "./ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";

export default function NewArrivals() {
  const [newProducts, setNewProducts] = useState<Product[]>(getNewArrivals());

  useEffect(() => {
    fetchLiveProducts().then((data) => {
      if (data && data.length > 0) {
        setNewProducts(data.slice(0, 4));
      }
    });
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-neutral-50/50">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-black inline-block animate-pulse" />
              <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-neutral-500">
                PHÁT HÀNH MỚI NHẤT
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black uppercase">
              SẢN PHẨM MỚI NHẤT
            </h2>
          </div>
          <a
            href="#t-shirts"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.12em] uppercase text-neutral-700 hover:text-black transition-all hover:translate-x-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Desktop: Grid 4 cols / Mobile: Horizontal scroll */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="sm:hidden flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
          {newProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[75vw]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="sm:hidden mt-8 text-center">
          <a
            href="#t-shirts"
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.1em] uppercase text-neutral-800 hover:text-black transition-colors border-b border-black pb-0.5"
          >
            <span>Xem tất cả sản phẩm</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
