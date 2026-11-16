"use client";

import { useState, useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const messages = [
  { text: "Mặc thành phố – Chạm câu chuyện", tag: "VIETCITYWEAR", href: "/explore/hanoi" },
  { text: "Ra mắt Hanoi Heritage Set — Chỉ 219.000₫", tag: "HOT RELEASE", href: "/#t-shirts" },
  { text: "Quét Mã QR Laser CNC khám phá di sản số Hà Nội", tag: "DIGITAL HERITAGE", href: "/explore/hanoi" },
  { text: "Miễn phí vận chuyển toàn quốc cho đơn từ 500K", tag: "FREESHIP", href: "/#collections" },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 300);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const current = messages[index];

  return (
    <aside aria-label="Thông báo ưu đãi" className="bg-[#0c0c0c] text-white py-2 px-4 text-center overflow-hidden border-b border-neutral-800/80 select-none relative z-50">
      <div className="mx-auto max-w-[1440px] flex items-center justify-center">
        <Link
          href={current.href}
          className={`group inline-flex items-center gap-2 sm:gap-2.5 transition-all duration-300 transform ${
            fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1.5"
          }`}
        >
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/10 text-white/80 text-[9px] font-mono font-semibold tracking-wider uppercase border border-white/10">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            {current.tag}
          </span>
          <p className="text-[11px] sm:text-[11.5px] font-medium tracking-[0.14em] uppercase text-white/90 group-hover:text-white transition-colors">
            {current.text}
          </p>
          <ArrowRight className="w-3 h-3 text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all hidden sm:inline-block" />
        </Link>
      </div>
    </aside>
  );
}
