import {
  ExternalLink,
  Heart,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const footerLinks = {
  product: [
    { label: "Bộ sưu tập Hà Nội", href: "#" },
    { label: "Bộ sưu tập Huế", href: "#" },
    { label: "Bộ sưu tập Hội An", href: "#" },
    { label: "Gói Cơ bản", href: "#" },
    { label: "Gói Tiêu chuẩn", href: "#" },
    { label: "Gói Đặc biệt", href: "#" },
  ],
  support: [
    { label: "Hướng dẫn mua hàng", href: "#" },
    { label: "Chính sách đổi trả", href: "#" },
    { label: "Vận chuyển & giao hàng", href: "#" },
    { label: "Câu hỏi thường gặp", href: "#" },
    { label: "Liên hệ hỗ trợ", href: "#contact" },
  ],
  about: [
    { label: "Về Viet City Wear", href: "#" },
    { label: "Câu chuyện thương hiệu", href: "#" },
    { label: "Trải nghiệm NFC", href: "#nfc-experience" },
    { label: "Hộ chiếu số", href: "#passport" },
    { label: "Blog du lịch", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-700 text-white font-black text-sm">
                V
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-extrabold tracking-tight text-white">
                  VIET CITY WEAR
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-red-400 uppercase">
                  Heritage Collection
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 mb-6 max-w-xs">
              Mặc trên mình văn hóa Việt — mỗi chiếc áo là một câu chuyện di sản,
              mỗi tấm thẻ là một hành trình khám phá.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-red-700 hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-red-700 hover:text-white"
              >
                <Heart className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-red-700 hover:text-white"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Sản phẩm
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Hỗ trợ
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Về chúng tôi
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="h-3.5 w-3.5" />
                <span>0123 456 789</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="h-3.5 w-3.5" />
                <span>hello@vietcitywear.vn</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>FPT University, Hà Nội</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © 2025 VIET CITY WEAR. Đồ án Hệ thống thông tin (EXE201) — FPT University.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300">
              Chính sách bảo mật
            </a>
            <a href="#" className="hover:text-slate-300">
              Điều khoản sử dụng
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
