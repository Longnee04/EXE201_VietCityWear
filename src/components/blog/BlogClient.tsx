"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/client";
import { BRAND_SLOGAN, BRAND_TAGLINE } from "@/data/brand";
import { BlogPost, fallbackBlogs } from "@/data/blogs";

export default function BlogClient() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadBlogs() {
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("status", "Published")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setBlogs(data);
        } else {
          setBlogs(fallbackBlogs);
        }
      } catch {
        setBlogs(fallbackBlogs);
      } finally {
        setIsLoading(false);
      }
    }
    loadBlogs();
  }, []);

  const categories = [
    { key: "all", label: "Tất cả bài viết" },
    { key: "culture", label: "Văn hóa di sản" },
    { key: "landmark", label: "Địa danh nổi bật" },
    { key: "travel", label: "Cẩm nang du lịch" },
  ];

  const filteredBlogs = blogs.filter((b) => {
    const matchesCat =
      activeCategory === "all" ||
      (b.category && b.category.toLowerCase().includes(activeCategory.toLowerCase()));

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.title.toLowerCase().includes(q) ||
      (b.content && b.content.toLowerCase().includes(q));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-[#eaeaea] bg-[#fafafa] py-14 sm:py-20">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#eaeaea] bg-white text-[11px] font-bold uppercase tracking-wider text-[#555] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>{BRAND_TAGLINE}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#111] max-w-3xl mx-auto">
              Cẩm Nang Di Sản & Câu Chuyện Thành Phố
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#666] max-w-xl mx-auto">
              {BRAND_SLOGAN.vi}. Khám phá những câu chuyện văn hóa, dấu ấn lịch sử ẩn sau từng họa tiết áo thun lưu niệm của VIET CITY WEAR.
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-md mx-auto relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết, địa danh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-[#eaeaea] bg-white text-xs sm:text-sm focus:outline-none focus:border-black transition shadow-xs"
              />
            </div>
          </div>
        </section>

        {/* Filter Pills */}
        <section className="border-b border-[#eaeaea] bg-white sticky top-[60px] z-10 backdrop-blur-md">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-3.5 overflow-x-auto flex items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition whitespace-nowrap cursor-pointer border ${
                  activeCategory === cat.key
                    ? "bg-black text-white border-black"
                    : "bg-white text-[#666] border-[#eaeaea] hover:border-black hover:text-black"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="border border-[#eaeaea] rounded-xl overflow-hidden animate-pulse bg-[#fafafa] h-96"
                  />
                ))}
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-[#eaeaea] rounded-2xl max-w-md mx-auto">
                <BookOpen className="w-10 h-10 text-[#999] mx-auto mb-3" />
                <h3 className="font-bold text-sm uppercase text-[#111]">
                  Không tìm thấy bài viết phù hợp
                </h3>
                <p className="text-xs text-[#666] mt-1">
                  Hãy thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục khác.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((post) => {
                  const slugOrId = post.slug || post.id;
                  const snippet = post.content
                    ? post.content.replace(/[*#_]/g, "").slice(0, 140) + "..."
                    : "Khám phá câu chuyện lịch sử văn hóa đằng sau địa danh này...";

                  return (
                    <article
                      key={post.id}
                      className="group border border-[#eaeaea] rounded-2xl overflow-hidden bg-white hover:border-black transition-all duration-300 flex flex-col hover:shadow-lg"
                    >
                      {/* Image Thumbnail */}
                      <Link
                        href={`/blog/${slugOrId}`}
                        className="relative aspect-[16/10] overflow-hidden bg-[#f5f5f5] block"
                      >
                        <Image
                          src={post.cover_image || "/images/hanoi-banner.jpg"}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-black backdrop-blur-xs shadow-xs border border-[#eaeaea]">
                            {post.category || "Văn hóa"}
                          </span>
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-[11px] text-[#888] mb-2.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {post.published_at || post.created_at
                                ? new Date(post.published_at || post.created_at).toLocaleDateString(
                                    "vi-VN"
                                  )
                                : "2026"}
                            </span>
                            <span>•</span>
                            <span>VIET CITY WEAR Editorial</span>
                          </div>

                          <Link href={`/blog/${slugOrId}`}>
                            <h2 className="font-extrabold text-base sm:text-lg text-[#111] group-hover:text-black line-clamp-2 leading-snug">
                              {post.title}
                            </h2>
                          </Link>

                          <p className="mt-2.5 text-xs text-[#666] leading-relaxed line-clamp-3">
                            {snippet}
                          </p>
                        </div>

                        <div className="pt-5 mt-4 border-t border-[#f0f0f0] flex items-center justify-between">
                          <Link
                            href={`/blog/${slugOrId}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black group-hover:translate-x-1 transition-transform"
                          >
                            <span>Đọc tiếp câu chuyện</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
