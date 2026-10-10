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
          </nav>

          {/* RIGHT — Actions (Icons & Cart badge) */}
          <div className="flex items-center gap-1 lg:w-[260px] justify-end">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-[#555] hover:text-[#111] transition-colors"
              aria-label="Tìm kiếm sản phẩm"
              title="Tìm kiếm"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            {currentUser?.role === "admin" && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111] text-white hover:bg-neutral-800 transition-colors text-[11px] font-bold uppercase tracking-wider mr-1 shadow-2xs"
                title="Vào Trang Quản Trị Hệ Thống"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Quản Trị</span>
              </Link>
            )}
            <Link
              href={currentUser ? (currentUser.role === "admin" ? "/admin/dashboard" : "/login") : "/login"}
              className="p-2.5 text-[#555] hover:text-[#111] transition-colors relative"
              aria-label="Tài khoản / Đăng nhập"
              title={currentUser ? `Tài khoản: ${currentUser.email} (${currentUser.role})` : "Đăng nhập tài khoản"}
            >
              <User className={cn("w-[18px] h-[18px]", currentUser && "text-black stroke-[2.5]")} />
              {currentUser && (
                <span className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
              )}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
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

      {/* Header Search Dropdown Bar */}
      {searchOpen && (
        <div className="border-t border-[#eaeaea] bg-white py-4 px-4 sm:px-6 lg:px-10 shadow-md">
          <div className="mx-auto max-w-[1440px]">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#888] absolute left-3.5" />
              <input
                type="text"
                autoFocus
                placeholder="Tìm kiếm mẫu áo theo tên, thành phố, hoặc địa danh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-[#ddd] bg-[#fafafa] focus:bg-white focus:outline-none focus:border-[#111]"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="absolute right-3 text-[#888] hover:text-[#111] p-1"
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
                    <p className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">
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
                            <p className="text-xs font-semibold text-[#111] truncate">{product.name}</p>
                            <p className="text-[11px] text-[#777]">{formatPrice(product.price)}</p>
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
                  <p className="text-xs text-[#888] py-2">
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
            <nav className="flex-1 px-5 py-6 flex flex-col gap-1 overflow-y-auto">
              {/* Mobile Search Input */}
              <div className="mb-4 relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs border border-[#ddd] bg-[#fafafa] focus:bg-white focus:outline-none"
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

              {/* Mobile Live Search Results */}
              {searchQuery.trim() !== "" && (
                <div className="mb-4 pb-3 border-b border-[#eaeaea] space-y-2">
                  <p className="text-[10px] font-semibold text-[#888] uppercase">
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
                      className="flex items-center gap-2 p-1.5 hover:bg-[#f5f5f5]"
                    >
                      <div className="relative w-9 h-9 bg-[#f5f5f5] flex-shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain p-0.5"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-[#111] truncate">{product.name}</p>
                        <p className="text-[10px] text-[#777]">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

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
                <User className="w-4 h-4" />
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
