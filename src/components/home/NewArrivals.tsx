import { getNewArrivals } from "@/data/products";
import ProductCard from "./ProductCard";

export default function NewArrivals() {
  const newProducts = getNewArrivals();

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#999] mb-2">
              Just Dropped
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111] uppercase">
              NEW ARRIVALS
            </h2>
          </div>
          <a
            href="#t-shirts"
            className="hidden sm:inline-block text-[12px] font-medium tracking-[0.1em] uppercase text-[#555] hover:text-[#111] transition-colors border-b border-[#555] hover:border-[#111] pb-0.5"
          >
            View All
          </a>
        </div>

        {/* Desktop: Grid 4 cols / Mobile: Horizontal scroll */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="sm:hidden flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
          {newProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[70vw]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="sm:hidden mt-8 text-center">
          <a
            href="#t-shirts"
            className="inline-block text-[12px] font-medium tracking-[0.1em] uppercase text-[#555] hover:text-[#111] transition-colors border-b border-[#555] hover:border-[#111] pb-0.5"
          >
            View All T-Shirts
          </a>
        </div>
      </div>
    </section>
  );
}
