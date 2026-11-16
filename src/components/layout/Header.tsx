"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Menu, X, User, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { mainNav } from "@/data/navigation";
import { useCart } from "@/lib/cart-context";
import { BRAND_SLOGAN } from "@/data/brand";
import { products as defaultProducts, formatPrice, type Product } from "@/data/products";
import { supabase } from "@/lib/supabase/client";
import { fetchLiveProducts } from "@/lib/products-service";
import { cn } from "@/lib/utils";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>(defaultProducts);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    role: string;
    fullName?: string;
  } | null>(null);
  const { itemCount } = useCart();

  // Kiểm tra phiên đăng nhập để nhận diện Quản trị viên
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from("users")
            .select("role, full_name, email")
            .eq("id", session.user.id)
            .single();

          setCurrentUser({
            id: session.user.id,
            email: session.user.email || "",
            role: profile?.role || "user",
            fullName: profile?.full_name || session.user.email?.split("@")[0],
          });
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    }

    checkAuth();
    fetchLiveProducts().then((data) => {
      if (data && data.length > 0) setAllProducts(data);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => subscription.unsubscribe();
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.city && p.city.toLowerCase().includes(q))
      )
      .slice(0, 4);
  }, [searchQuery, allProducts]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-[62px] lg:h-[68px]">
          {/* LEFT — Mobile menu + [BLOCK_LOGO] + Brand Name */}
          <div className="flex items-center gap-3 sm:gap-4 lg:w-[280px]">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 -ml-1 text-neutral-700 hover:text-black transition-colors rounded-md hover:bg-neutral-100"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group transition-transform hover:opacity-95">
              <div
                id="[BLOCK_LOGO]"
                className="block-logo relative w-10 h-10 sm:w-11 sm:h-11 overflow-hidden rounded-md border border-neutral-200 bg-[#F7F4EE] shadow-xs flex-shrink-0 transition-transform group-hover:scale-105"
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
              <div key={link.href} className="relative group">
                <Link
                  href={link.href}
                  className="relative px-4 py-2 text-[12px] font-semibold tracking-[0.12em] uppercase text-neutral-600 transition-colors hover:text-black inline-flex items-center gap-1.5 after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
                >
                  <span>{link.label}</span>
                  {link.children && (
                    <span className="text-[8px] opacity-60 group-hover:rotate-180 transition-transform">▼</span>
                  )}
                </Link>

                {link.children && (
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-white border border-neutral-200 shadow-xl rounded-md py-2 min-w-[210px] backdrop-blur-md">
                      {link.children.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2.5 text-[12px] font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* RIGHT — Actions (Icons & Cart badge) */}
          <div className="flex items-center gap-1.5 lg:w-[280px] justify-end">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-full transition-all"
              aria-label="Tìm kiếm sản phẩm"
              title="Tìm kiếm"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            {currentUser?.role === "admin" && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black text-white hover:bg-neutral-800 transition-colors text-[11px] font-bold uppercase tracking-wider mr-1 shadow-xs"
                title="Vào Trang Quản Trị Hệ Thống"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Quản Trị</span>
              </Link>
            )}
            <Link
              href={currentUser ? (currentUser.role === "admin" ? "/admin/dashboard" : "/login") : "/login"}
              className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-full transition-all relative"
              aria-label="Tài khoản / Đăng nhập"
              title={currentUser ? `Tài khoản: ${currentUser.email} (${currentUser.role})` : "Đăng nhập tài khoản"}
            >
              <User className={cn("w-[18px] h-[18px]", currentUser && "text-black stroke-[2.5]")} />
              {currentUser && (
                <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-full transition-all"
              aria-label="Cart"
            >
              <ShoppingBag className="w-[19px] h-[19px]" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-black text-white text-[10px] font-bold shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Header Search Dropdown Bar */}
      {searchOpen && (
        <div className="border-t border-neutral-200 bg-white/95 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-10 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="mx-auto max-w-[1440px]">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4" />
              <input
                type="text"
                autoFocus
                placeholder="Tìm kiếm mẫu áo theo tên, thành phố, hoặc địa danh di sản..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 text-sm rounded-full border border-neutral-300 bg-neutral-50/80 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-inner"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="absolute right-3.5 text-neutral-400 hover:text-black p-1 transition-colors"
                aria-label="Đóng tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Live Results */}
            {searchQuery.trim() !== "" && (
              <div className="mt-4 pt-3 border-t border-neutral-100">
                {searchResults.length > 0 ? (
                  <div className="space-y-2.5">
                    <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      Gợi ý kết quả ({searchResults.length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 p-2.5 rounded-lg border border-neutral-200 hover:border-black bg-white transition-all shadow-xs hover:shadow-sm group"
                        >
                          <div className="relative w-12 h-12 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-contain p-1 group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-neutral-900 truncate group-hover:text-black">{product.name}</p>
                            <p className="text-[11px] font-bold text-neutral-600">{formatPrice(product.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="pt-2 text-right">
                      <Link
                        href="/#t-shirts"
                        onClick={() => setSearchOpen(false)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline uppercase tracking-wider"
                      >
                        <span>Xem tất cả sản phẩm</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 py-3 text-center">
                    Không tìm thấy sản phẩm nào khớp với &quot;{searchQuery}&quot;.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden animate-in fade-in duration-200">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-0 left-0 h-full w-[310px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between px-5 h-[64px] border-b border-neutral-200">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-md overflow-hidden border border-neutral-200 bg-[#F7F4EE] flex-shrink-0">
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
                className="p-1.5 text-neutral-500 hover:text-black rounded-md hover:bg-neutral-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-5 py-6 flex flex-col gap-1 overflow-y-auto">
              {/* Mobile Search Input */}
              <div className="mb-4 relative">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 text-xs rounded-full border border-neutral-300 bg-neutral-50 focus:bg-white focus:outline-none focus:border-black"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 hover:text-black"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Mobile Live Search Results */}
              {searchQuery.trim() !== "" && (
                <div className="mb-4 pb-3 border-b border-neutral-200 space-y-2">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    Kết quả ({searchResults.length})
                  </p>
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        setMobileOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-md hover:bg-neutral-100 transition-colors"
                    >
                      <div className="relative w-10 h-10 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain p-0.5"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-neutral-900 truncate">{product.name}</p>
                        <p className="text-[10px] font-bold text-neutral-600">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {mainNav.map((link) => (
                <div key={link.href} className="border-b border-neutral-100 last:border-0 py-2">
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-1.5 text-[13px] font-bold tracking-[0.08em] uppercase text-neutral-900 hover:text-black transition-colors"
                  >
                    <span>{link.label}</span>
                  </Link>

                  {link.children && (
                    <div className="pl-3 pt-1.5 pb-1 space-y-1.5">
                      {link.children.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-1 text-xs text-neutral-600 hover:text-black transition-colors"
                        >
                          • {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Quick Cart Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setCartOpen(true);
                }}
                className="py-3 text-[13px] font-bold tracking-[0.08em] uppercase text-black flex items-center justify-between border-b border-neutral-100"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  GIỎ HÀNG
                </span>
                {itemCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
              {currentUser?.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-[13px] font-bold tracking-[0.08em] uppercase text-black flex items-center justify-between bg-amber-50 px-2.5 rounded-md my-1.5"
                >
                  <span className="flex items-center gap-2 text-amber-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    TRANG QUẢN TRỊ ADMIN
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-600" />
                </Link>
              )}
              <Link
                href={currentUser ? (currentUser.role === "admin" ? "/admin/dashboard" : "/login") : "/login"}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-[13px] font-bold tracking-[0.08em] uppercase text-black flex items-center justify-between"
              >
                <span>{currentUser ? `TÀI KHOẢN (${currentUser.role.toUpperCase()})` : "ĐĂNG NHẬP / TÀI KHOẢN"}</span>
                <User className="w-4 h-4" />
              </Link>
            </nav>
            <div className="p-5 border-t border-neutral-200 text-[11px] text-neutral-500 font-medium">
              {BRAND_SLOGAN.vi}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
