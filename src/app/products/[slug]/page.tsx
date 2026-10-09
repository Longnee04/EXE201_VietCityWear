import { notFound } from "next/navigation";
import { Metadata } from "next";
import { products, formatPrice } from "@/data/products";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Generate static params for all known products
export function generateStaticParams() {
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Sản phẩm không tìm thấy — VIET CITY WEAR",
    };
  }

  const title = `${product.name} — VIET CITY WEAR`;
  const description = `${product.description} Giá: ${formatPrice(product.price)}. Mặc thành phố – Chạm câu chuyện.`;
  const image = product.images[0] || "/images/logo-vietcitywear.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
