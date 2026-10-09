import type { Metadata } from "next";
import BlogClient from "@/components/blog/BlogClient";
import { BRAND_SLOGAN } from "@/data/brand";

export const metadata: Metadata = {
  title: `Cẩm Nang Di Sản & Câu Chuyện Thành Phố — VIET CITY WEAR | ${BRAND_SLOGAN.vi}`,
  description:
    "Đọc các bài viết văn hóa, huyền tích di sản và cẩm nang du lịch các thành phố Việt Nam từ đội ngũ VIET CITY WEAR.",
};

export default function BlogPage() {
  return <BlogClient />;
}
