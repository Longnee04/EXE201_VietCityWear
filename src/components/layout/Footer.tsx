import Image from "next/image";
import Link from "next/link";
import { footerNav } from "@/data/navigation";
import { BRAND_SLOGAN, BRAND_TAGLINE } from "@/data/brand";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[#eaeaea] bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:gap-16">
          {/* Brand Info */}
          <div className="col-span-2 sm:col-span-1 space-y-3">
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
              Thương hiệu thời trang lưu niệm lấy cảm hứng từ các thành phố và địa điểm du lịch Việt Nam.
            </p>
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
                Thanh toán: <span className="font-semibold text-[#111]">Duy nhất COD</span>
              </li>
              <li className="text-[12px]">
                Vận chuyển: <span className="font-semibold text-[#111]">Freeship từ 500K</span>
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
            <Link
              href="/admin/dashboard"
              className="text-[11px] text-[#888] hover:text-[#111] transition-colors flex items-center gap-1 font-medium"
              title="Cổng đăng nhập và quản lý dành cho Quản trị viên"
            >
              <span>Kênh Quản Trị</span>
            </Link>
            <span className="text-gray-300">•</span>
            <p className="text-[10px] text-[#999] tracking-widest uppercase">
              {BRAND_TAGLINE}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
