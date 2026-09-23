"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { mainNav } from "@/data/navigation";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-[#F7F4EE]/95 backdrop-blur-md border-b border-[#E5DFD5]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-[64px] lg:h-[70px]">
          {/* LEFT — Mobile menu + [BLOCK_LOGO] */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1 -ml-1 text-[#1A2421]"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div
                id="[BLOCK_LOGO]"
                className="block-logo relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-full border border-[#E5DFD5] bg-white shadow-xs flex-shrink-0"
              >
                <Image
                  src="/images/logo-vietcitywear.png"
                  alt="Logo VIET CITY WEAR"
                  fill
                  sizes="(max-width: 768px) 40px, 48px"
                  className="object-contain p-0.5"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] sm:text-base font-extrabold tracking-[0.08em] uppercase text-[#1A2421]">
                  VIET CITY WEAR
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#B4532A] font-semibold tracking-wider hidden sm:block">
                  MẶC THÀNH PHỐ – MANG CÂU CHUYỆN VỀ NHÀ
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER — Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[12px] font-semibold tracking-[0.1em] uppercase text-[#1A2421]/70 transition-colors hover:text-[#B4532A]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#pricing"
              className="px-4 py-2 text-[12px] font-semibold tracking-[0.1em] uppercase text-[#B4532A] transition-colors hover:text-[#96421F]"
            >
              BẢNG GIÁ
            </a>
          </nav>

          {/* RIGHT — Actions */}
          <div className="flex items-center gap-1 justify-end">
            <button
              className="p-2.5 text-[#1A2421]/70 hover:text-[#1A2421] transition-colors"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button
              className="relative p-2.5 text-[#1A2421]/70 hover:text-[#1A2421] transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#B4532A] text-white text-[9px] font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-0 left-0 h-full w-[300px] bg-[#F7F4EE] shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 h-[64px] border-b border-[#E5DFD5]">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#E5DFD5] bg-white">
                  <Image
                    src="/images/logo-vietcitywear.png"
                    alt="Logo VIET CITY WEAR"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
                <span className="text-xs font-extrabold tracking-[0.08em] uppercase text-[#1A2421]">
                  VIET CITY WEAR
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-[#1A2421]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-5 py-6 flex flex-col gap-1">
              {mainNav.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-[13px] font-semibold tracking-[0.08em] uppercase text-[#1A2421]/80 hover:text-[#B4532A] border-b border-[#E5DFD5]/60 last:border-0"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#pricing"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-[13px] font-semibold tracking-[0.08em] uppercase text-[#B4532A] hover:text-[#96421F]"
              >
                BẢNG GIÁ
              </a>
            </nav>
            <div className="p-5 border-t border-[#E5DFD5] text-[11px] text-[#1A2421]/60">
              Mặc thành phố – Mang câu chuyện về nhà
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
