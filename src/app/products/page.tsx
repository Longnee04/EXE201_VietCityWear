import { Suspense } from "react";
import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductsPageClient from "@/components/products/ProductsPageClient";
import { RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Cửa Hàng — Tất Cả Sản Phẩm Thời Trang Di Sản | VIET CITY WEAR",
  description:
    "Khám phá các mẫu áo thun thời trang di sản và quà tặng lưu niệm văn hóa VIET CITY WEAR kết hợp công nghệ chạm NFC độc đáo.",
};

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-[#888] mb-3" />
              <p className="text-xs font-semibold text-[#888] uppercase tracking-wider">
                Đang tải danh sách sản phẩm...
              </p>
            </div>
          }
        >
          <ProductsPageClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
