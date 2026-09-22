import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VIETCITYWEAR — Wear Your City",
  description:
    "Vietnamese heritage streetwear. Mỗi chiếc áo mang câu chuyện một thành phố — kết hợp công nghệ NFC và trải nghiệm du lịch số.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-white text-[#111]">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
