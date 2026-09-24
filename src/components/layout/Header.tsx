"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { mainNav } from "@/data/navigation";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#eaeaea]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-[60px] lg:h-[64px]">
          {/* LEFT — Mobile menu + [BLOCK_LOGO] + Brand Name */}
          <div className="flex items-center gap-3 sm:gap-4 lg:w-[260px]">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1 -ml-1 text-[#555] hover:text-[#111]"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div
                id="[BLOCK_LOGO]"
                className="block-logo relative w-10 h-10 sm:w-11 sm:h-11 overflow-hidden rounded-md border border-[#eaeaea] bg-[#F7F4EE] shadow-2xs flex-shrink-0"
              >
                <Image
                  src="/images/logo-vietcitywear.png"
                  alt="Logo VIET CITY WEAR"
                  fill
                  sizes="(max-width: 768px) 40px, 44px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="relative h-8 sm:h-9 w-[105px] sm:w-[120px] flex items-center">
                <Image
                  src="/images/logo-text-crisp.png"
                  alt="VIET CITY — WEAR —"
                  fill
                  sizes="(max-width: 768px) 105px, 120px"
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* CENTER — Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[12px] font-medium tracking-[0.1em] uppercase text-[#555] transition-colors hover:text-[#111]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#pricing"
              className="px-4 py-2 text-[12px] font-medium tracking-[0.1em] uppercase text-[#555] transition-colors hover:text-[#111]"
            >
              BẢNG GIÁ
            </a>
          </nav>

          {/* RIGHT — Actions (Icons & Cart badge) */}
          <div className="flex items-center gap-1 lg:w-[260px] justify-end">
            <button
              className="p-2.5 text-[#555] hover:text-[#111] transition-colors"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            <Link
              href="/login"
              className="p-2.5 text-[#555] hover:text-[#111] transition-colors"
              aria-label="Tài khoản / Đăng nhập"
              title="Đăng nhập tài khoản"
            >
              <User className="w-[18px] h-[18px]" />
            </Link>
            <button
              className="relative p-2.5 text-[#555] hover:text-[#111] transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#111] text-white text-[9px] font-bold">
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
          <div className="absolute top-0 left-0 h-full w-[300px] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 h-[60px] border-b border-[#eaeaea]">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-md overflow-hidden border border-[#eaeaea] bg-[#F7F4EE] flex-shrink-0">
                  <Image
                    src="/images/logo-vietcitywear.png"
                    alt="Logo VIET CITY WEAR"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-7 w-[95px] flex items-center">
                  <Image
                    src="/images/logo-text-crisp.png"
                    alt="VIET CITY — WEAR —"
                    fill
                    className="object-contain object-left"
                  />
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-[#555] hover:text-[#111]"
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
                  className="py-3 text-[13px] font-medium tracking-[0.08em] uppercase text-[#333] hover:text-[#111] border-b border-[#f0f0f0] last:border-0"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#pricing"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-[13px] font-medium tracking-[0.08em] uppercase text-[#333] hover:text-[#111] border-b border-[#f0f0f0]"
              >
                BẢNG GIÁ
              </a>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-[13px] font-bold tracking-[0.08em] uppercase text-black flex items-center justify-between"
              >
                <span>ĐĂNG NHẬP / TÀI KHOẢN</span>
                <User className="w-4 h-4" />
              </Link>
            </nav>
            <div className="p-5 border-t border-[#eaeaea] text-[11px] text-[#777]">
              Mặc thành phố – Mang câu chuyện về nhà
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
