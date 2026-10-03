import { notFound } from "next/navigation";
import { products } from "@/data/products";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Generate static params for all known mock products
export function generateStaticParams() {
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </>
  );
}
