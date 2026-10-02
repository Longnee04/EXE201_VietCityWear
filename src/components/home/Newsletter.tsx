"use client";

import { useState } from "react";
import { footerNav } from "@/data/navigation";

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
    <section className="py-20 sm:py-28 border-t border-[#eaeaea] bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#999] mb-3">
            Stay Connected
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111] uppercase mb-4">
            JOIN THE VIETCITYWEAR COMMUNITY
          </h2>
          <p className="text-sm text-[#666] leading-relaxed mb-8">
            Đăng ký để nhận thông tin sớm nhất về các đợt phát hành bộ sưu tập mới,
            câu chuyện di sản và ưu đãi độc quyền.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                className="flex-1 px-4 py-3 text-[13px] border border-[#ddd] focus:border-[#111] focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="bg-[#111] text-white text-[11px] font-semibold tracking-[0.15em] uppercase px-8 py-3.5 hover:bg-[#333] transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
          ) : (
            <div className="p-4 bg-[#f8f8f8] border border-[#e5e5e5] max-w-md mx-auto">
              <p className="text-[13px] font-medium text-[#111]">
                Cảm ơn bạn đã tham gia cộng đồng VietCityWear!
              </p>
            </div>
          )}

          {/* Social Media Links */}
          <div className="mt-12 pt-8 border-t border-[#f0f0f0] flex items-center justify-center gap-8">
            {footerNav.social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[12px] font-medium tracking-[0.1em] uppercase text-[#777] hover:text-[#111] transition-colors"
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
