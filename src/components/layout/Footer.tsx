import Image from "next/image";
import { footerNav } from "@/data/navigation";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[#E5DFD5] bg-[#1A2421] text-[#F7F4EE]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start mb-14 pb-12 border-b border-[#F7F4EE]/10">
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white p-1 border border-[#E5DFD5]">
                <Image
                  src="/images/logo-vietcitywear.png"
                  alt="Logo VIET CITY WEAR"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-black tracking-tight uppercase text-white">
                VIET CITY WEAR
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#B4532A]">
              Mặc thành phố – Mang câu chuyện về nhà
            </p>
            <p className="text-xs text-[#F7F4EE]/70 max-w-md leading-relaxed">
              Thương hiệu thời trang lưu niệm lấy cảm hứng từ các thành phố và địa điểm du lịch Việt Nam, kết hợp thời trang, văn hóa, du lịch và công nghệ.
            </p>
          </div>

          {/* Nav links */}
          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#B4532A] mb-4">
                Sản phẩm
              </h4>
              <ul className="space-y-2.5 text-xs text-[#F7F4EE]/70">
                {footerNav.shop.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Bảng giá gói
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#B4532A] mb-4">
                Thương hiệu
              </h4>
              <ul className="space-y-2.5 text-xs text-[#F7F4EE]/70">
                {footerNav.about.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    NFC & Thẻ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#B4532A] mb-4">
                Mạng xã hội
              </h4>
              <ul className="space-y-2.5 text-xs text-[#F7F4EE]/70">
                {footerNav.social.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#F7F4EE]/50">
          <p>© 2025 VIET CITY WEAR. All rights reserved.</p>
          <p className="tracking-widest uppercase text-[10px]">
            LOCAL CITIES • REAL STORIES • WEAR IT
          </p>
        </div>
      </div>
    </footer>
  );
}
