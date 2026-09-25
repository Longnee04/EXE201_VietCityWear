"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Shirt,
  Boxes,
  ClipboardList,
  Users,
  QrCode,
  MapPin,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const adminNavItems = [
  {
    href: "/admin/dashboard",
    label: "Tổng quan",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/products",
    label: "Sản phẩm",
    icon: Shirt,
  },
  {
    href: "/admin/inventory",
    label: "Kho & Tồn kho",
    icon: Boxes,
  },
  {
    href: "/admin/orders",
    label: "Đơn hàng",
    icon: ClipboardList,
  },
  {
    href: "/admin/users",
    label: "Tài khoản",
    icon: Users,
  },
  {
    href: "/admin/nfc",
    label: "Thẻ NFC",
    icon: QrCode,
  },
  {
    href: "/admin/cities",
    label: "Thành phố & Địa danh",
    icon: MapPin,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<{
    email: string | null;
    role: string;
    full_name: string | null;
  } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Kiểm tra phiên đăng nhập Admin
  useEffect(() => {
    async function checkAuth() {
      try {
        setIsLoadingAuth(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          router.replace("/login");
          return;
        }

        const user = session.user;
        const { data: profile } = (await supabase
          .from("users")
          .select("role, full_name, email")
          .eq("id", user.id)
          .maybeSingle()) as {
          data: { role?: string; full_name?: string | null; email?: string | null } | null;
          error: unknown;
        };

        const role = profile?.role || (user.user_metadata?.role as string) || "user";

        if (role !== "admin") {
          alert("Khu vực giới hạn: Yêu cầu quyền Quản trị viên (Admin).");
          router.replace("/");
          return;
        }

        setCurrentUser({
          email: profile?.email || user.email || null,
          role: "admin",
          full_name: profile?.full_name || user.user_metadata?.full_name || null,
        });
      } catch (err) {
        console.error("Lỗi xác minh phiên Admin:", err);
        router.replace("/login");
      } finally {
        setIsLoadingAuth(false);
      }
    }

    checkAuth();
  }, [router]);

  // Đăng xuất
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      startTransition(() => {
        router.refresh();
        router.replace("/login");
      });
    } catch (e) {
      console.error("Lỗi đăng xuất:", e);
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center text-neutral-800">
        <Loader2 className="w-8 h-8 animate-spin text-black mb-3" />
        <p className="text-xs uppercase tracking-[0.16em] font-semibold text-neutral-500">
          Đang xác thực quyền Quản trị viên...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex text-[#111111] antialiased">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-[#E5E5E5] flex-shrink-0 z-30">
        {/* Brand Header */}
        <div className="h-16 border-b border-[#E5E5E5] px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-md overflow-hidden border border-[#EAEAEA] bg-[#F7F4EE] flex-shrink-0">
              <Image
                src="/images/logo-vietcitywear.png"
                alt="Logo VIET CITY WEAR"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <div>
              <div className="font-extrabold tracking-[0.14em] uppercase text-xs text-black">
                VIET CITY WEAR
              </div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-600 font-bold">
                Admin Console
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-600">
            Phân hệ Quản trị
          </div>

          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-[#111] text-white shadow-xs"
                    : "text-neutral-700 hover:text-black hover:bg-neutral-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-neutral-600"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout Bottom */}
        <div className="p-3 border-t border-[#E5E5E5] bg-neutral-50/60">
          <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-800 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
              {currentUser?.full_name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-neutral-900 truncate">
                {currentUser?.full_name || "Quản trị viên"}
              </div>
              <div className="text-[10px] text-neutral-500 truncate font-mono">
                {currentUser?.email}
              </div>
            </div>
            <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-amber-100 text-amber-800 border border-amber-200">
              Admin
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-md border border-[#E0E0E0] bg-white hover:bg-neutral-100 text-[11px] font-semibold text-neutral-700 transition"
              title="Mở trang chủ bán hàng"
            >
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
              <span>Xem Web</span>
            </Link>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut || isPending}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-md border border-red-200 bg-red-50 hover:bg-red-100 text-[11px] font-semibold text-red-700 transition disabled:opacity-50 cursor-pointer"
              title="Đăng xuất khỏi hệ thống"
            >
              {isLoggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white border-r border-[#E5E5E5] flex flex-col p-4 shadow-xl z-50">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-md overflow-hidden border border-[#EAEAEA] bg-[#F7F4EE]">
                  <Image
                    src="/images/logo-vietcitywear.png"
                    alt="Logo"
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <span className="font-extrabold tracking-wider text-xs uppercase">
                  Admin Console
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-neutral-500 hover:text-black hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                      isActive
                        ? "bg-[#111] text-white"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[#E5E5E5]">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#E5E5E5] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100"
              aria-label="Mở menu quản trị"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
              <span>Admin</span>
              <span>/</span>
              <span className="text-black capitalize font-bold">
                {pathname.split("/")[2] || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hệ thống bảo vệ (Active)</span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-black px-2.5 py-1.5 rounded-md hover:bg-neutral-100 transition"
            >
              <span>Xem trang mua sắm</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
