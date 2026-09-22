import { footerNav } from "@/data/navigation";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[#eaeaea] bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:gap-16">
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
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#111] mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {footerNav.support.map((link) => (
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
          <div className="flex gap-6 text-[11px] text-[#999]">
            <a href="#" className="hover:text-[#111] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#111] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
