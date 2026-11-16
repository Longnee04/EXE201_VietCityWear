"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Menu, X, User, ArrowRight, ShieldCheck } from "lucide-react";
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
    <header className="sticky top-0 z-50 bg-white border-b border-[#eaeaea]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-[60px] lg:h-[66px]">
          {/* LEFT — Mobile menu + [BLOCK_LOGO] + Brand Name */}
          <div className="flex items-center gap-3 sm:gap-4 lg:w-[260px]">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1 -ml-1 text-[#111] hover:text-[#555] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 stroke-[1.75]" />
            </button>
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div
                id="[BLOCK_LOGO]"
                className="block-logo relative w-9 h-9 sm:w-10 sm:h-10 overflow-hidden rounded-xs border border-[#eaeaea] bg-[#F7F4EE] flex-shrink-0"
              >
                <Image
                  src="/images/logo-vietcitywear.png"
                  alt="Logo VIET CITY WEAR"
                  fill
                  sizes="(max-width: 768px) 36px, 40px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="relative h-7 sm:h-8 w-[100px] sm:w-[115px] flex items-center">
                <Image
                  src="/images/logo-text-crisp.png"
                  alt="VIET CITY — WEAR —"
                  fill
                  sizes="(max-width: 768px) 100px, 115px"
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
                  className="px-3.5 py-2 text-[12px] font-semibold tracking-[0.12em] uppercase text-[#111] hover:text-[#777] transition-colors inline-flex items-center gap-1"
                >
                  <span>{link.label}</span>
                  {link.children && (
                    <span className="text-[8px] opacity-50 group-hover:rotate-180 transition-transform">▼</span>
                  )}
                </Link>

                {link.children && (
                  <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <div className="bg-white border border-[#eaeaea] shadow-md py-2 min-w-[200px]">
                      {link.children.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2 text-[12px] font-medium text-[#444] hover:text-black hover:bg-[#fafafa] transition-colors"
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
          <div className="flex items-center gap-1 lg:w-[260px] justify-end">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#111] hover:text-[#666] transition-colors"
              aria-label="Tìm kiếm sản phẩm"
              title="Tìm kiếm"
            >
              <Search className="w-[18px] h-[18px] stroke-[1.75]" />
            </button>
            {currentUser?.role === "admin" && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1 px-2.5 py-1 bg-[#111] text-white hover:bg-[#333] transition-colors text-[10px] font-bold uppercase tracking-wider mr-1"
                title="Vào Trang Quản Trị Hệ Thống"
              >
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Quản Trị</span>
              </Link>
            )}
            <Link
              href={currentUser ? (currentUser.role === "admin" ? "/admin/dashboard" : "/login") : "/login"}
              className="p-2 text-[#111] hover:text-[#666] transition-colors relative"
              aria-label="Tài khoản / Đăng nhập"
              title={currentUser ? `Tài khoản: ${currentUser.email} (${currentUser.role})` : "Đăng nhập tài khoản"}
            >
              <User className={cn("w-[18px] h-[18px] stroke-[1.75]", currentUser && "stroke-[2.5]")} />
              {currentUser && (
                <span className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-[#111] hover:text-[#666] transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.75]" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#111] text-white text-[9px] font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Header Search Dropdown Bar */}
      {searchOpen && (
        <div className="border-t border-[#eaeaea] bg-white py-4 px-4 sm:px-6 lg:px-10 shadow-sm">
          <div className="mx-auto max-w-[1440px]">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#888] absolute left-3" />
              <input
                type="text"
                autoFocus
                placeholder="Tìm kiếm mẫu áo theo tên, thành phố, địa danh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 text-xs border border-[#ddd] bg-[#fafafa] focus:bg-white focus:outline-none focus:border-[#111] transition-colors"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="absolute right-2.5 text-[#888] hover:text-[#111] p-1"
                aria-label="Đóng tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Live Results */}
            {searchQuery.trim() !== "" && (
              <div className="mt-3 pt-3 border-t border-[#f0f0f0]">
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-[#888] uppercase tracking-wider">
                      Gợi ý kết quả ({searchResults.length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 p-2 border border-[#eaeaea] hover:border-[#111] bg-white transition-colors"
                        >
                          <div className="relative w-12 h-12 bg-[#f5f5f5] flex-shrink-0">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-[#111] truncate">{product.name}</p>
                            <p className="text-[11px] font-semibold text-[#777]">{formatPrice(product.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="pt-2 text-right">
                      <Link
                        href="/#t-shirts"
                        onClick={() => setSearchOpen(false)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#111] hover:underline"
                      >
                        <span>Xem tất cả sản phẩm</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#888] py-2 text-center">
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
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-[300px] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 h-[60px] border-b border-[#eaeaea]">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-xs overflow-hidden border border-[#eaeaea] bg-[#F7F4EE] flex-shrink-0">
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
            <nav className="flex-1 px-5 py-6 flex flex-col gap-1 overflow-y-auto">
              <div className="mb-4 relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs border border-[#ddd] bg-[#fafafa] focus:bg-white focus:outline-none focus:border-[#111]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#888]"
                  >
                    ✕
                  </button>
                )}
              </div>

              {mainNav.map((link) => (
                <div key={link.href} className="border-b border-[#f0f0f0] last:border-0 py-2">
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-1 text-[13px] font-bold tracking-[0.08em] uppercase text-[#111] hover:text-[#555]"
                  >
                    <span>{link.label}</span>
                  </Link>

                  {link.children && (
                    <div className="pl-3 pt-1 pb-1 space-y-1">
                      {link.children.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-1 text-xs text-[#666] hover:text-black transition-colors"
                        >
                          • {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setCartOpen(true);
                }}
                className="py-3 text-[13px] font-bold tracking-[0.08em] uppercase text-black flex items-center justify-between border-b border-[#f0f0f0]"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
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
                  className="py-3 text-[13px] font-bold tracking-[0.08em] uppercase text-black flex items-center justify-between bg-amber-50 px-2 rounded-xs my-1"
                >
                  <span className="flex items-center gap-2 text-amber-800">
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
                <User className="w-4 h-4 stroke-[1.75]" />
              </Link>
            </nav>
            <div className="p-5 border-t border-[#eaeaea] text-[11px] text-[#777]">
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
