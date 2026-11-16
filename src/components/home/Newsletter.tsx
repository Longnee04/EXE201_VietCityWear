"use client";

import { useState } from "react";
import { footerNav } from "@/data/navigation";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section id="contact" className="py-20 sm:py-28 border-t border-neutral-200/80 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 text-center">
        <div className="max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-3">
            <Mail className="w-3 h-3 text-black" />
            <span>KẾT NỐI VỚI CHÚNG TÔI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black uppercase mb-4">
            CỘNG ĐỒNG VIET CITY WEAR
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-8">
            Nhận thông báo sớm nhất về các đợt phát hành bộ sưu tập thành phố mới và ưu đãi độc quyền.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                className="flex-1 px-4 py-3 text-xs sm:text-[13px] rounded-xl border border-neutral-300 bg-neutral-50/80 focus:bg-white focus:outline-none focus:border-black transition-all shadow-inner"
              />
              <button
                type="submit"
                className="bg-black text-white text-[11px] font-bold tracking-[0.15em] uppercase px-7 py-3.5 rounded-xl hover:bg-neutral-800 transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <span>ĐĂNG KÝ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl max-w-md mx-auto flex items-center justify-center gap-2 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-xs font-bold uppercase tracking-wider">
                Cảm ơn bạn đã tham gia cộng đồng VietCityWear!
              </p>
            </div>
          )}

          {/* Social Media Links */}
          <div className="mt-12 pt-8 border-t border-neutral-100 flex items-center justify-center gap-8">
            {footerNav.social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs font-bold tracking-[0.12em] uppercase text-neutral-500 hover:text-black transition-colors hover:underline underline-offset-4"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
