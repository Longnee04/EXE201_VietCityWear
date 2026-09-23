import Image from "next/image";
import { footerNav } from "@/data/navigation";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[#eaeaea] bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:gap-16">
          {/* Brand Info */}
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#eaeaea] bg-white">
                <Image
                  src="/images/logo-vietcitywear.png"
                  alt="Logo VIET CITY WEAR"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <span className="text-sm font-extrabold tracking-[0.08em] uppercase text-[#111]">
                VIETCITYWEAR
              </span>
            </div>
            <p className="text-[12px] font-semibold text-[#111] uppercase tracking-wide">
              Mặc thành phố – Mang câu chuyện về nhà
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
                  <a
                    href={link.href}
                    className="text-[13px] text-[#666] hover:text-[#111] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#pricing"
                  className="text-[13px] text-[#666] hover:text-[#111] transition-colors"
                >
                  Bảng giá gói
                </a>
              </li>
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
                  <a
                    href={link.href}
                    className="text-[13px] text-[#666] hover:text-[#111] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#features"
                  className="text-[13px] text-[#666] hover:text-[#111] transition-colors"
                >
                  NFC & Thẻ
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#111] mb-5">
              Follow Us
            </h4>
            <ul className="space-y-3">
              {footerNav.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[13px] text-[#666] hover:text-[#111] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[#eaeaea] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#999] tracking-wide">
            © 2025 VIETCITYWEAR. All rights reserved.
          </p>
          <p className="text-[10px] text-[#999] tracking-widest uppercase">
            LOCAL CITIES • REAL STORIES • WEAR IT
          </p>
        </div>
      </div>
    </footer>
  );
}
