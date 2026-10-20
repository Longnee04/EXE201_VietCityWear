import Image from "next/image";
import Link from "next/link";
import { footerNav } from "@/data/navigation";
import { BRAND_SLOGAN, BRAND_TAGLINE, SOCIAL_LINKS } from "@/data/brand";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[#eaeaea] bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:gap-16">
          {/* Brand Info & Social Links */}
          <div className="col-span-2 sm:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-md overflow-hidden border border-[#eaeaea] bg-[#F7F4EE] flex-shrink-0">
                <Image
                  src="/images/logo-vietcitywear.png"
                  alt="Logo VIET CITY WEAR"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-8 w-[105px] flex items-center">
                <Image
                  src="/images/logo-text-crisp.png"
                  alt="VIET CITY — WEAR —"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-[12px] font-semibold text-[#111] uppercase tracking-wide">
              {BRAND_SLOGAN.vi}
            </p>
            <p className="text-[12px] text-[#666] leading-relaxed">
              Thương hiệu thời trang lưu niệm lấy cảm hứng từ các thành phố và địa điểm du lịch Việt Nam, kết nối qua mã QR di sản số.
            </p>

            {/* Social Links Buttons */}
            <div className="pt-1 flex items-center gap-2.5">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-stone-200 bg-stone-50 hover:bg-[#111] hover:text-white hover:border-[#111] text-[#333] flex items-center justify-center transition-colors"
                title="Theo dõi VIET CITY WEAR trên Facebook"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-stone-200 bg-stone-50 hover:bg-[#111] hover:text-white hover:border-[#111] text-[#333] flex items-center justify-center transition-colors"
                title="Theo dõi VIET CITY WEAR trên TikTok"
                aria-label="TikTok"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>

              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-stone-200 bg-stone-50 hover:bg-[#111] hover:text-white hover:border-[#111] text-[#333] flex items-center justify-center transition-colors"
                title="Theo dõi VIET CITY WEAR trên Instagram"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#111] mb-5">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerNav.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-[#666] hover:text-[#111] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#111] mb-5">
              About
            </h4>
            <ul className="space-y-3">
              {footerNav.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-[#666] hover:text-[#111] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Chính sách */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#111] mb-5">
              Chính sách
            </h4>
            <ul className="space-y-3 text-[13px] text-[#666]">
              {footerNav.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-[#666] hover:text-[#111] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 text-[12px] border-t border-[#f0f0f0]">
                Thanh toán: <span className="font-semibold text-[#111]">COD & Chuyển khoản VietQR</span>
              </li>
              <li className="text-[12px]">
                Vận chuyển: <span className="font-semibold text-[#111]">Freeship từ 500K</span>
              </li>
              <li className="text-[12px]">
                Đổi trả: <span className="font-semibold text-[#111]">7 ngày minh bạch</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[#eaeaea] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#999] tracking-wide">
            © 2026 VIETCITYWEAR. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-[10px] text-[#999] tracking-widest uppercase">
              {BRAND_TAGLINE}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}