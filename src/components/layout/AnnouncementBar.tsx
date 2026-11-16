"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const messages = [
  { text: "Mặc thành phố – Chạm câu chuyện", href: "/explore/hanoi" },
  { text: "Ra mắt Hanoi Heritage Set — 219.000₫", href: "/#t-shirts" },
  { text: "Quét Mã QR Laser khám phá di sản số Hà Nội", href: "/explore/hanoi" },
  { text: "Miễn phí vận chuyển toàn quốc cho đơn từ 500K", href: "/#collections" },
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
    <aside aria-label="Thông báo" className="bg-[#111] text-white py-2 px-4 text-center overflow-hidden border-b border-neutral-900 select-none relative z-50">
      <div className="mx-auto max-w-[1440px] flex items-center justify-center">
        <Link
          href={current.href}
          className={`inline-block transition-all duration-300 transform ${
            fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          }`}
        >
          <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-200 hover:text-white transition-colors">
            {current.text}
          </p>
        </Link>
      </div>
    </aside>
  );
}
