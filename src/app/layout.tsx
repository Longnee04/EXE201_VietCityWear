import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VIET CITY WEAR — Áo thun di sản & Thẻ NFC văn hóa Việt Nam",
  description:
    "Khám phá bộ sưu tập áo thun lưu niệm kết hợp thẻ địa danh và công nghệ NFC. Trải nghiệm du lịch số độc đáo với hộ chiếu số, trợ lý AI bản địa và WebAR.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
