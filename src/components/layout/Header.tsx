"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { mainNav } from "@/data/navigation";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#eaeaea]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-[60px] lg:h-[64px]">
          {/* LEFT — Mobile menu + Logo */}
          <div className="flex items-center gap-4 lg:w-[200px]">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1 -ml-1"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="block">
              <span className="text-[15px] sm:text-base font-extrabold tracking-[0.08em] uppercase">
                VIETCITYWEAR
              </span>
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
          </nav>

          {/* RIGHT — Actions */}
          <div className="flex items-center gap-1 lg:w-[200px] justify-end">
            <button className="p-2.5 text-[#555] hover:text-[#111] transition-colors" aria-label="Search">
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button className="relative p-2.5 text-[#555] hover:text-[#111] transition-colors" aria-label="Cart">
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
              <span className="text-sm font-extrabold tracking-[0.08em] uppercase">
                VIETCITYWEAR
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1"
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
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
