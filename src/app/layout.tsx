import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { BRAND_SLOGAN, HERO_HEADLINE, BRAND_TAGLINE } from "@/data/brand";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `VIETCITYWEAR — ${BRAND_SLOGAN.vi}`,
  description: `${HERO_HEADLINE.vi}. Thương hiệu thời trang lưu niệm lấy cảm hứng từ các thành phố và địa điểm du lịch Việt Nam, kết hợp thời trang, văn hóa, du lịch và công nghệ. ${BRAND_TAGLINE}`,
  openGraph: {
    title: `VIETCITYWEAR — ${BRAND_SLOGAN.vi}`,
    description: `${HERO_HEADLINE.vi} · ${BRAND_SLOGAN.vi}. ${BRAND_TAGLINE}`,
    siteName: "VIET CITY WEAR",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `VIETCITYWEAR — ${BRAND_SLOGAN.vi}`,
    description: `${HERO_HEADLINE.vi} · ${BRAND_SLOGAN.vi}`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-white text-[#111]">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
