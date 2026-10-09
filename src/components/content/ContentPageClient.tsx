"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, Shield, FileText, Info, Mail } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/client";
import { BRAND_SLOGAN } from "@/data/brand";

interface Props {
  pageName: "about" | "terms" | "privacy" | "contact";
  defaultTitle: string;
  defaultContent: string;
}

export default function ContentPageClient({ pageName, defaultTitle, defaultContent }: Props) {
  const [title, setTitle] = useState(defaultTitle);
  const [content, setContent] = useState(defaultContent);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const { data, error } = await supabase
          .from("website_content")
          .select("*")
          .eq("page_name", pageName)
          .single();

        if (!error && data && data.content_body && typeof data.content_body === "object") {
          const body = data.content_body as { title?: string; content?: string };
          if (body.title) setTitle(body.title);
          if (body.content) setContent(body.content);
          if (data.updated_at) setUpdatedAt(data.updated_at);
        }
      } catch {
        // fallback
      }
    }
    fetchContent();
  }, [pageName]);

  const paragraphs = content.split("\n\n").filter((p) => p.trim().length > 0);

  const getIcon = () => {
    switch (pageName) {
      case "about":
        return <Info className="w-5 h-5 text-black" />;
      case "terms":
        return <FileText className="w-5 h-5 text-black" />;
      case "privacy":
        return <Shield className="w-5 h-5 text-black" />;
      case "contact":
        return <Mail className="w-5 h-5 text-black" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 py-12 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-[#888] uppercase tracking-wider">
            <Link href="/" className="hover:text-black">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-[#111] font-semibold">{title}</span>
          </nav>

          {/* Header */}
          <div className="border-b border-[#eaeaea] pb-8 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#eaeaea] bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-[#555] mb-4">
              {getIcon()}
              <span>VIET CITY WEAR • CHÍNH SÁCH & THÔNG TIN</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111] leading-tight">
              {title}
            </h1>
            <p className="mt-2 text-xs text-[#888]">
              Cập nhật lần cuối:{" "}
              {updatedAt
                ? new Date(updatedAt).toLocaleDateString("vi-VN")
                : new Date().toLocaleDateString("vi-VN")}{" "}
              • {BRAND_SLOGAN.vi}
            </p>
          </div>

          {/* Body Content */}
          <div className="space-y-4 text-sm leading-relaxed text-[#333]">
            {paragraphs.map((para, idx) => {
              // Heading
              if (para.startsWith("**") && para.includes("**\n")) {
                const parts = para.split("\n");
                return (
                  <div key={idx} className="pt-3">
                    <h2 className="font-extrabold text-base text-[#111] uppercase tracking-wide">
                      {parts[0].replace(/\*\*/g, "")}
                    </h2>
                    <p className="mt-1 leading-relaxed">{parts.slice(1).join("\n")}</p>
                  </div>
                );
              }
              if (para.startsWith("#")) {
                return (
                  <h2
                    key={idx}
                    className="font-extrabold text-base sm:text-lg text-[#111] uppercase tracking-wide pt-3"
                  >
                    {para.replace(/^[#\s]+/, "")}
                  </h2>
                );
              }
              return (
                <p key={idx} className="leading-relaxed whitespace-pre-line">
                  {para.replace(/\*\*(.*?)\*\*/g, "$1")}
                </p>
              );
            })}
          </div>

          {/* Footer Back Link */}
          <div className="pt-10 mt-12 border-t border-[#eaeaea] flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về trang chủ</span>
            </Link>
            <Link
              href="/#t-shirts"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Khám phá bộ sưu tập áo thun</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
