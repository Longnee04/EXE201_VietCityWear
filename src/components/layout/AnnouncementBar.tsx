"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Flame, Tag, Truck } from "lucide-react";

interface Announcement {
  id: string;
  badge: string;
  icon: typeof Sparkles;
  text: string;
  highlight?: string;
  action: string;
  href: string;
}

const announcements: Announcement[] = [
  {
    id: "drop",
    badge: "SẢN PHẨM MỚI",
    icon: Flame,
    text: "HANOI HERITAGE SET — Trọn bộ trải nghiệm Hồ Gươm (Áo + Thẻ + Móc khóa + Hộp)",
    highlight: "219.000₫",
    action: "Xem ngay",
    href: "/products/hanoi-heritage-set-hoan-kiem-lake",
  },
  {
    id: "hero",
    badge: "MẶC THÀNH PHỐ",
    icon: Sparkles,
    text: "Chạm câu chuyện — Mang cả thành phố về nhà qua công nghệ chạm di sản số",
    highlight: "LOCAL CITIES • REAL STORIES",
    action: "Khám phá",
    href: "/explore/hanoi",
  },
  {
    id: "tee",
    badge: "HERITAGE TEE",
    icon: Tag,
    text: "Áo thun lưu niệm Hà Nội Heritage Tee — Form Unisex Regular fit",
    highlight: "179.000₫",
    action: "Mua áo",
    href: "/products/hanoi-heritage-tee-hoan-kiem-lake",
  },
  {
    id: "shipping",
    badge: "CHÍNH SÁCH",
    icon: Truck,
    text: "Miễn phí vận chuyển toàn quốc cho đơn từ 500K • Kiểm tra & Thanh toán COD khi nhận hàng",
    highlight: "FREE SHIPPING",
    action: "Mua sắm",
    href: "/#t-shirts",
  },
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotate every 3.8 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      triggerNext();
    }, 3800);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const triggerNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
      setIsAnimating(false);
    }, 250);
  };

  const triggerPrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
      setIsAnimating(false);
    }, 250);
  };

  const current = announcements[currentIndex];
  const IconComponent = current.icon;

  return (
    <div
      className="relative z-50 bg-[#111] text-white border-b border-neutral-800 select-none overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 h-9 sm:h-10 flex items-center justify-between">
        {/* Prev Button */}
        <button
          onClick={triggerPrev}
          aria-label="Previous announcement"
          className="text-white/40 hover:text-white transition-colors p-1 -ml-1 focus:outline-none hidden sm:flex items-center"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Dynamic Animated Content */}
        <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
          <Link
            href={current.href}
            className={`group inline-flex items-center gap-2 sm:gap-3 text-center transition-all duration-300 transform ${
              isAnimating
                ? "opacity-0 -translate-y-2 scale-95"
                : "opacity-100 translate-y-0 scale-100"
            }`}
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-1 bg-white text-[#111] text-[9px] font-black px-1.5 sm:px-2 py-0.5 tracking-widest uppercase flex-shrink-0">
              <IconComponent className="w-2.5 h-2.5 text-[#111]" />
              <span>{current.badge}</span>
            </span>

            {/* Main message */}
            <p className="text-[11px] sm:text-xs tracking-wide font-medium text-white/90 group-hover:text-white truncate max-w-[65vw] sm:max-w-2xl">
              {current.text}
              {current.highlight && (
                <span className="hidden md:inline font-bold text-white ml-1.5 underline underline-offset-2">
                  [{current.highlight}]
                </span>
              )}
            </p>

            {/* Action pill */}
            <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-bold text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all uppercase tracking-wider underline underline-offset-4">
              <span>{current.action}</span>
              <span>→</span>
            </span>
          </Link>
        </div>

        {/* Next Button & Indicators */}
        <div className="flex items-center gap-2">
          {/* Progress dots */}
          <div className="hidden lg:flex items-center gap-1 mr-1">
            {announcements.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentIndex(idx);
                    setIsAnimating(false);
                  }, 200);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1 transition-all rounded-full ${
                  currentIndex === idx ? "w-3 bg-white" : "w-1 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <button
            onClick={triggerNext}
            aria-label="Next announcement"
            className="text-white/40 hover:text-white transition-colors p-1 -mr-1 focus:outline-none hidden sm:flex items-center"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
