"use client";

import { useState, useEffect } from "react";

const messages = [
  "Mặc thành phố – Chạm câu chuyện",
  "Ra mắt Hanoi Heritage Set — 219.000₫",
  "Chạm NFC & Quét QR khám phá di sản Hà Nội",
  "Miễn phí vận chuyển cho đơn từ 500K",
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
    }, 5000); // Tự động chuyển sau 5 giây

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#111] text-white py-2 px-4 text-center overflow-hidden border-b border-neutral-800">
      <div className="h-5 flex items-center justify-center">
        <p
          className={`text-[11px] sm:text-xs font-medium tracking-wider uppercase transition-all duration-300 transform ${
            fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          }`}
        >
          {messages[index]}
        </p>
      </div>
    </div>
  );
}
