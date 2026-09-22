"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#products", label: "Sản phẩm" },
  { href: "#nfc-experience", label: "Trải nghiệm NFC" },
  { href: "#cities", label: "Bộ sưu tập" },
  { href: "#passport", label: "Hộ chiếu số" },
  { href: "#contact", label: "Liên hệ" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-700 text-white font-black text-sm">
            V
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              VIET CITY WEAR
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-red-700 uppercase">
              Heritage Collection
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <button className="relative rounded-lg p-2.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              0
            </span>
          </button>
          <button className="rounded-lg p-2.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
            <User className="h-5 w-5" />
          </button>
          <a
            href="#products"
            className="ml-2 rounded-full bg-red-700 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-red-800 hover:shadow-lg hover:shadow-red-200"
          >
            Mua ngay
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-600 lg:hidden hover:bg-slate-100"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 lg:hidden",
          mobileOpen ? "max-h-96 border-t border-slate-100" : "max-h-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-4">
            <a
              href="#products"
              className="flex-1 rounded-full bg-red-700 py-2.5 text-center text-sm font-semibold text-white hover:bg-red-800"
            >
              Mua ngay
            </a>
            <button className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100">
              <ShoppingBag className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100">
              <User className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
