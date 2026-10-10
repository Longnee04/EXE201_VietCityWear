import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Shirt, Sparkles } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/client";
import { BRAND_SLOGAN, HERO_HEADLINE } from "@/data/brand";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: blog } = await supabase
    .from("blogs")
    .select("title, content")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single();

  if (!blog) {
    return {
      title: "Bài viết — VIET CITY WEAR",
    };
  }

  return {
    title: `${blog.title} — VIET CITY WEAR`,
    description: blog.content ? blog.content.slice(0, 160) : BRAND_SLOGAN.vi,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single();

  if (!blog) {
    notFound();
  }

  // Fetch 2 other related articles
  const { data: relatedBlogs } = await supabase
    .from("blogs")
    .select("id, title, slug, cover_image, category, created_at")
    .neq("id", blog.id)
    .limit(2);

  const paragraphs = (blog.content || "")
    .split("\n\n")
    .filter((p: string) => p.trim().length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-[#888] uppercase tracking-wider">
            <Link href="/" className="hover:text-black">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-black">
              Cẩm nang
            </Link>
            <span>/</span>
            <span className="text-[#111] font-semibold truncate max-w-[200px]">
              {blog.category || "Di sản"}
            </span>
          </nav>

          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-neutral-100 text-black border border-neutral-200">
              {blog.category || "Văn hóa di sản"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111] leading-tight mb-4">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 py-3 border-y border-[#eaeaea] text-xs text-[#666] mb-8">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span className="font-medium text-[#111]">VIET CITY WEAR Editorial</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {blog.published_at || blog.created_at
                  ? new Date(blog.published_at || blog.created_at).toLocaleDateString("vi-VN")
                  : "2026"}
              </span>
            </div>
            <span>•</span>
            <span className="font-semibold text-black uppercase tracking-wider text-[10px]">
              {BRAND_SLOGAN.vi}
            </span>
          </div>

          {/* Featured Cover Image */}
          {blog.cover_image && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#eaeaea] bg-neutral-50 mb-8 shadow-xs">
              <Image
                src={blog.cover_image}
                alt={blog.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="space-y-5 text-sm sm:text-base leading-relaxed text-[#333]">
            {paragraphs.map((para: string, idx: number) => {
              if (para.startsWith("#")) {
                return (
                  <h2
                    key={idx}
                    className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#111] pt-4"
                  >
                    {para.replace(/^[#\s]+/, "")}
                  </h2>
                );
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {para}
                </p>
              );
            })}
          </div>

          {/* Brand Call to action card */}
          <div className="my-12 p-6 sm:p-8 rounded-2xl border border-black bg-[#111] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                <Sparkles className="w-4 h-4 text-white" />
                <span>VIET CITY WEAR EXPERIENCE</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight">
                {HERO_HEADLINE.vi}
              </h3>
              <p className="text-xs text-neutral-300 max-w-md">
                Mỗi áo thun đi kèm 5 thẻ di sản và móc khóa NFC thông minh. Chạm điện thoại để mở bản đồ ẩm thực và lịch trình di chuyển.
              </p>
            </div>
            <Link
              href="/#t-shirts"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition flex-shrink-0"
            >
              <Shirt className="w-4 h-4" />
              <span>Xem áo thun</span>
            </Link>
          </div>

          {/* Back button */}
          <div className="pt-6 border-t border-[#eaeaea] flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại tất cả bài viết</span>
            </Link>
          </div>
        </article>

        {/* Related Articles */}
        {relatedBlogs && relatedBlogs.length > 0 && (
          <section className="mx-auto max-w-5xl px-4 sm:px-6 mt-16 pt-12 border-t border-[#eaeaea]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111] mb-6">
              Câu chuyện di sản khác
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {relatedBlogs.map((rel: any) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug || rel.id}`}
                  className="group flex gap-4 p-4 rounded-xl border border-[#eaeaea] hover:border-black transition bg-white"
                >
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    <Image
                      src={rel.cover_image || "/images/hanoi-banner.jpg"}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                      {rel.category || "Văn hóa"}
                    </span>
                    <h4 className="font-extrabold text-sm text-[#111] group-hover:text-black line-clamp-2 mt-1">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
