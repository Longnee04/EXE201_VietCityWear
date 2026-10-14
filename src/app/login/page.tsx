"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  User,
  Phone,
  LogOut,
  Edit2,
  Save,
  Package,
  ShoppingBag,
  Search,
  Clock,
  MapPin,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { type User as SupabaseUser } from "@supabase/supabase-js";
import { formatPrice } from "@/data/products";

function formatAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.";
  }
  if (message.includes("User already registered")) {
    return "Email này đã được đăng ký tài khoản. Vui lòng chuyển sang Đăng nhập.";
  }
  if (message.includes("Password should be at least")) {
    return "Mật khẩu phải có ít nhất 6 ký tự.";
  }
  if (message.includes("Email not confirmed")) {
    return "Tài khoản chưa được xác nhận qua Email. Vui lòng kiểm tra hộp thư.";
  }
  if (message.includes("Too many requests") || message.includes("rate limit")) {
    return "Bạn đã thử quá nhiều lần. Vui lòng chờ ít phút rồi thử lại.";
  }
  return message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
}

interface OrderItemDetail {
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface UserOrder {
  id: string;
  receiver_name: string;
  receiver_phone: string;
  shipping_address: string;
  total_amount: number;
  payment_method: string;
  status: "processing" | "completed" | "canceled";
  created_at: string;
  note?: string | null;
  items?: OrderItemDetail[];
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Params: ?tab=orders | ?tab=tracking&phone=0912...
  const queryTab = searchParams.get("tab");
  const queryPhone = searchParams.get("phone") || "";

  // Auth Modes when logged out: "login" | "register" | "tracking"
  const [authMode, setAuthMode] = useState<"login" | "register" | "tracking">(
    queryTab === "tracking" ? "tracking" : "login"
  );

  // User state
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<{
    full_name: string;
    phone: string;
    email: string;
    role: string;
  } | null>(null);

  // Dashboard Tabs when logged in: "profile" | "orders"
  const [userDashboardTab, setUserDashboardTab] = useState<"profile" | "orders">(
    queryTab === "orders" ? "orders" : "profile"
  );

  // Orders list for logged in user
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Guest order tracking states
  const [trackingPhone, setTrackingPhone] = useState(queryPhone);
  const [guestOrders, setGuestOrders] = useState<UserOrder[] | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  // Login inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register inputs
  const [regFullName, setRegFullName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Edit Profile inputs
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Helper to fetch orders with items
  const loadOrdersByFilter = async (filter: { userId?: string; phone?: string }): Promise<UserOrder[]> => {
    try {
      let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (filter.userId && filter.phone) {
        query = query.or(`user_id.eq.${filter.userId},receiver_phone.eq.${filter.phone}`);
      } else if (filter.userId) {
        query = query.eq("user_id", filter.userId);
      } else if (filter.phone) {
        query = query.eq("receiver_phone", filter.phone);
      } else {
        return [];
      }

      const { data: ordersData, error: ordersErr } = await query;
      if (ordersErr || !ordersData || ordersData.length === 0) {
        return [];
      }

      const orderIds = ordersData.map((o) => o.id);
      const [{ data: itemsData }, { data: prodsData }] = await Promise.all([
        supabase.from("order_items").select("*").in("order_id", orderIds),
        supabase.from("products").select("id, name"),
      ]);

      return ordersData.map((ord) => {
        const matched = (itemsData || []).filter((it) => it.order_id === ord.id);
        const items: OrderItemDetail[] =
          matched.length > 0
            ? matched.map((it) => {
                const p = (prodsData || []).find((pr) => pr.id === it.product_id);
                return {
                  product_name: p?.name || "Áo Thun Văn Hóa VietCityWear",
                  size: it.size || "L",
                  color: it.color || "Tiêu chuẩn",
                  quantity: Number(it.quantity) || 1,
                  price: Number(it.unit_price) || Number(ord.total_amount),
                };
              })
            : [
                {
                  product_name: "Bộ Áo Thun Di Sản & Quà Tặng (COD)",
                  size: "L",
                  color: "Tiêu chuẩn",
                  quantity: 1,
                  price: Number(ord.total_amount),
                },
              ];

        return {
          ...ord,
          items,
        };
      });
    } catch (e) {
      console.warn("Lỗi tải danh sách đơn hàng:", e);
      return [];
    }
  };

  // Check auth session on mount
  useEffect(() => {
    async function loadUserSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUser(session.user);
          const { data: profile } = await supabase
            .from("users")
            .select("full_name, phone, email, role")
            .eq("id", session.user.id)
            .maybeSingle();

          const resolvedProfile = {
            full_name: profile?.full_name || session.user.user_metadata?.full_name || "Khách hàng",
            phone: profile?.phone || session.user.user_metadata?.phone || "",
            email: session.user.email || "",
            role: profile?.role || session.user.user_metadata?.role || "user",
          };

          setUserProfile(resolvedProfile);
          setEditFullName(resolvedProfile.full_name);
          setEditPhone(resolvedProfile.phone);

          // Fetch orders for this user
          setIsLoadingOrders(true);
          const orders = await loadOrdersByFilter({
            userId: session.user.id,
            phone: resolvedProfile.phone,
          });
          setUserOrders(orders);
          setIsLoadingOrders(false);
        }
      } catch (err) {
        console.error("Lỗi kiểm tra phiên:", err);
      }
    }
    loadUserSession();
  }, []);

  // Auto trigger tracking if phone param was passed in URL
  useEffect(() => {
    if (queryPhone && !currentUser) {
      setAuthMode("tracking");
      setTrackingPhone(queryPhone);
      handleTrackGuestOrders(queryPhone);
    }
  }, [queryPhone, currentUser]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }

    try {
      setIsLoading(true);
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        setErrorMessage(formatAuthError(authError.message));
        setIsLoading(false);
        return;
      }

      if (!authData?.user) {
        setErrorMessage("Không tìm thấy thông tin tài khoản.");
        setIsLoading(false);
        return;
      }

      const userId = authData.user.id;
      const { data: profile } = await supabase
        .from("users")
        .select("role, full_name, phone")
        .eq("id", userId)
        .maybeSingle();

      const assignedRole = profile?.role || authData.user.user_metadata?.role || "user";

      if (assignedRole === "admin") {
        setSuccessMessage("Đăng nhập Admin thành công! Chuyển hướng...");
        router.refresh();
        setTimeout(() => router.push("/admin/dashboard"), 600);
      } else {
        setSuccessMessage("Đăng nhập thành công! Đang tải dữ liệu tài khoản...");
        setCurrentUser(authData.user);
        const resolvedProfile = {
          full_name: profile?.full_name || authData.user.user_metadata?.full_name || "Khách hàng",
          phone: profile?.phone || authData.user.user_metadata?.phone || "",
          email: authData.user.email || "",
          role: assignedRole,
        };
        setUserProfile(resolvedProfile);
        setEditFullName(resolvedProfile.full_name);
        setEditPhone(resolvedProfile.phone);

        // Fetch user orders
        setIsLoadingOrders(true);
        const orders = await loadOrdersByFilter({ userId, phone: resolvedProfile.phone });
        setUserOrders(orders);
        setIsLoadingOrders(false);
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("Đã có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.");
      setIsLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regEmail.trim() || !regPassword) {
      setErrorMessage("Vui lòng nhập Email và Mật khẩu.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    try {
      setIsLoading(true);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: regEmail.trim(),
        password: regPassword,
        options: {
          data: {
            full_name: regFullName.trim() || "Khách hàng",
            phone: regPhone.trim(),
            role: "user",
          },
        },
      });

      if (authError) {
        setErrorMessage(formatAuthError(authError.message));
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        try {
          await supabase.from("users").upsert({
            id: authData.user.id,
            email: regEmail.trim(),
            full_name: regFullName.trim() || "Khách hàng",
            phone: regPhone.trim(),
            role: "user",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any);
        } catch (dbErr) {
          console.warn("Không thể ghi vào public.users, tiếp tục phiên:", dbErr);
        }

        setSuccessMessage("Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.");
        setIsLoading(false);
        setEmail(regEmail);
        setPassword(regPassword);
        setAuthMode("login");
      }
    } catch {
      setErrorMessage("Không thể tạo tài khoản. Vui lòng thử lại sau.");
      setIsLoading(false);
    }
  };

  // Handle Update Profile
  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      setErrorMessage(null);

      await supabase
        .from("users")
        .update({
          full_name: editFullName.trim(),
          phone: editPhone.trim(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        .eq("id", currentUser.id);

      await supabase.auth.updateUser({
        data: {
          full_name: editFullName.trim(),
          phone: editPhone.trim(),
        },
      });

      setUserProfile((prev) =>
        prev ? { ...prev, full_name: editFullName.trim(), phone: editPhone.trim() } : null
      );
      setIsEditingProfile(false);
      setSuccessMessage("Cập nhật thông tin tài khoản thành công!");
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setErrorMessage("Không thể lưu thông tin. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setCurrentUser(null);
      setUserProfile(null);
      setUserOrders([]);
      setSuccessMessage("Đã đăng xuất thành công.");
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  // Handle Guest Tracking lookup
  const handleTrackGuestOrders = async (phoneToTrack?: string) => {
    const targetPhone = (typeof phoneToTrack === "string" ? phoneToTrack : trackingPhone).trim();
    if (!targetPhone) {
      setTrackingError("Vui lòng nhập số điện thoại dùng để đặt hàng.");
      return;
    }

    setIsTracking(true);
    setTrackingError(null);
    setGuestOrders(null);

    try {
      const orders = await loadOrdersByFilter({ phone: targetPhone });
      if (orders.length === 0) {
        setTrackingError("Không tìm thấy đơn hàng nào ứng với số điện thoại này.");
      } else {
        setGuestOrders(orders);
      }
    } catch {
      setTrackingError("Không thể tra cứu đơn hàng lúc này. Vui lòng thử lại.");
    } finally {
      setIsTracking(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  const renderStatusBadge = (status: "processing" | "completed" | "canceled") => {
    if (status === "completed") {
      return (
        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-sm">
          Đã nhận hàng / Hoàn tất
        </span>
      );
    }
    if (status === "canceled") {
      return (
        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-800 border border-red-200 rounded-sm">
          Đã hủy đơn
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200 rounded-sm">
        Đang xử lý / Chuẩn bị giao
      </span>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-between text-[#111111] antialiased selection:bg-black selection:text-white">
      {/* Top Header */}
      <header className="w-full border-b border-[#EAEAEA] bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#555] hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Trang chủ</span>
          </Link>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-md overflow-hidden border border-[#EAEAEA] bg-[#F7F4EE] flex-shrink-0">
              <Image
                src="/images/logo-vietcitywear.png"
                alt="Logo VIET CITY WEAR"
                fill
                className="object-cover"
                sizes="32px"
                priority
              />
            </div>
            <span className="font-extrabold tracking-[0.18em] uppercase text-sm">
              VIET CITY WEAR
            </span>
          </Link>

          <Link
            href="/products"
            className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] hover:text-black transition-colors hidden sm:block"
          >
            Cửa hàng
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div
          className={`w-full transition-all duration-300 ${
            currentUser && userDashboardTab === "orders"
              ? "max-w-[680px]"
              : authMode === "tracking" && guestOrders && guestOrders.length > 0
              ? "max-w-[680px]"
              : "max-w-[500px]"
          }`}
        >
          <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-[0_12px_40px_-16px_rgba(0,0,0,0.08)] p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-800 via-neutral-900 to-black" />

            {/* ============================================================== */}
            {/* VIEW A: IF USER IS LOGGED IN -> PROFILE OR MY ORDERS           */}
            {/* ============================================================== */}
            {currentUser && userProfile ? (
              <div>
                {/* Header User info */}
                <div className="flex items-center justify-between pb-5 border-b border-[#eaeaea] mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#111] text-white flex items-center justify-center font-bold text-lg">
                      {userProfile.full_name ? userProfile.full_name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <h1 className="text-base font-bold uppercase tracking-tight text-black">
                        {userProfile.full_name || "Tài khoản thành viên"}
                      </h1>
                      <p className="text-xs text-[#666]">{userProfile.email}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#f0f0f0] text-[#555] rounded-full">
                    {userProfile.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                  </span>
                </div>

                {/* Dashboard Tabs: Hồ Sơ vs Đơn Hàng Của Tôi */}
                <div className="flex border-b border-[#eaeaea] mb-6">
                  <button
                    onClick={() => setUserDashboardTab("profile")}
                    className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center justify-center gap-2 ${
                      userDashboardTab === "profile"
                        ? "border-[#111] text-[#111]"
                        : "border-transparent text-[#888] hover:text-[#111]"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Thông tin cá nhân</span>
                  </button>
                  <button
                    onClick={() => setUserDashboardTab("orders")}
                    className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center justify-center gap-2 ${
                      userDashboardTab === "orders"
                        ? "border-[#111] text-[#111]"
                        : "border-transparent text-[#888] hover:text-[#111]"
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Đơn hàng của tôi ({userOrders.length})</span>
                  </button>
                </div>

                {successMessage && (
                  <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* TAB 1: USER PROFILE */}
                {userDashboardTab === "profile" && (
                  <div>
                    {!isEditingProfile ? (
                      <div className="space-y-3.5 mb-6 bg-[#fafafa] p-4 rounded-xl border border-[#eaeaea]">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                            Họ và tên
                          </p>
                          <p className="text-sm font-semibold text-[#111] mt-0.5">
                            {userProfile.full_name || "Chưa cập nhật"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                            Số điện thoại nhận hàng
                          </p>
                          <p className="text-sm font-semibold text-[#111] mt-0.5">
                            {userProfile.phone || "Chưa cập nhật"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                            Địa chỉ Email
                          </p>
                          <p className="text-sm font-semibold text-[#111] mt-0.5">
                            {userProfile.email}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(true)}
                          className="mt-2 w-full py-2 border border-[#111] text-[#111] text-xs font-bold uppercase tracking-wider hover:bg-[#111] hover:text-white transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Chỉnh sửa họ tên / Số điện thoại</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 mb-6 bg-[#fafafa] p-4 rounded-xl border border-[#eaeaea]">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#888] block mb-1">
                            Họ và tên
                          </label>
                          <input
                            type="text"
                            value={editFullName}
                            onChange={(e) => setEditFullName(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-[#ddd] bg-white rounded-md focus:outline-none focus:border-[#111]"
                            placeholder="Nhập họ và tên mới"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#888] block mb-1">
                            Số điện thoại nhận hàng
                          </label>
                          <input
                            type="text"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-[#ddd] bg-white rounded-md focus:outline-none focus:border-[#111]"
                            placeholder="Nhập số điện thoại"
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleUpdateProfile}
                            disabled={isLoading}
                            className="flex-1 py-2 bg-[#111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333] transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Lưu thay đổi</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingProfile(false)}
                            className="px-3 py-2 border border-[#ddd] text-xs font-bold uppercase hover:bg-white"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Quick actions for Logged in user */}
                    <div className="space-y-2">
                      {userProfile.role === "admin" && (
                        <Link
                          href="/admin/dashboard"
                          className="w-full py-2.5 bg-[#111] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#333] rounded-lg transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Vào trang quản trị Admin</span>
                        </Link>
                      )}
                      <Link
                        href="/products"
                        className="w-full py-2.5 border border-[#111] text-[#111] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#f5f5f5] rounded-lg transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Khám phá Cửa hàng mua sắm</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="w-full py-2.5 text-red-600 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất tài khoản</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: MY ORDERS */}
                {userDashboardTab === "orders" && (
                  <div>
                    {isLoadingOrders ? (
                      <div className="py-12 text-center text-gray-500">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#888]" />
                        <p className="text-xs font-semibold uppercase tracking-wider">
                          Đang tải danh sách đơn hàng...
                        </p>
                      </div>
                    ) : userOrders.length === 0 ? (
                      <div className="py-12 text-center">
                        <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                        <h3 className="text-sm font-bold uppercase tracking-wide text-stone-800 mb-1">
                          Bạn chưa có đơn hàng nào
                        </h3>
                        <p className="text-xs text-stone-500 mb-6 max-w-xs mx-auto">
                          Khám phá các thiết kế áo thun di sản Hà Nội, Huế, Hội An và đặt hàng nhận ưu đãi ngay hôm nay.
                        </p>
                        <Link
                          href="/products"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111] text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 rounded-sm transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Khám phá Cửa Hàng</span>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                        {userOrders.map((ord) => (
                          <div
                            key={ord.id}
                            className="p-4 rounded-xl border border-[#eaeaea] bg-[#fafafa] hover:border-[#111] transition-colors"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#eaeaea]">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#888] block">
                                  Mã đơn hàng
                                </span>
                                <span className="text-xs font-mono font-bold text-black">
                                  #{ord.id.slice(0, 10).toUpperCase()}
                                </span>
                              </div>
                              <div className="text-right">
                                {renderStatusBadge(ord.status)}
                                <span className="text-[10px] text-gray-400 block mt-1">
                                  {new Date(ord.created_at).toLocaleDateString("vi-VN", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>

                            {/* Items list */}
                            <div className="py-3 space-y-2 border-b border-[#eaeaea]">
                              {ord.items &&
                                ord.items.map((it, idx) => (
                                  <div key={idx} className="flex justify-between items-start text-xs">
                                    <div>
                                      <p className="font-semibold text-stone-900">{it.product_name}</p>
                                      <p className="text-[11px] text-stone-500">
                                        Màu: {it.color} • Size: {it.size} • SL: {it.quantity}
                                      </p>
                                    </div>
                                    <span className="font-medium text-stone-800">
                                      {formatPrice(it.price * it.quantity)}
                                    </span>
                                  </div>
                                ))}
                            </div>

                            {/* Footer Info */}
                            <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="text-[11px] text-stone-600 max-w-[280px]">
                                <p className="truncate">
                                  <MapPin className="w-3 h-3 inline mr-1 text-stone-400" />
                                  {ord.shipping_address}
                                </p>
                                <p className="text-stone-500 mt-0.5">
                                  Người nhận: {ord.receiver_name} ({ord.receiver_phone})
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] uppercase font-bold text-stone-500 block">
                                  Thanh toán COD
                                </span>
                                <span className="text-sm font-extrabold text-black">
                                  {formatPrice(ord.total_amount)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* ============================================================== */
              /* VIEW B: IF USER IS NOT LOGGED IN -> LOGIN / REGISTER / TRACK   */
              /* ============================================================== */
              <div>
                {/* 3 Tab switchers for Guests */}
                <div className="flex border-b border-[#eaeaea] mb-6">
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setErrorMessage(null);
                    }}
                    className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                      authMode === "login"
                        ? "border-[#111] text-[#111]"
                        : "border-transparent text-[#888] hover:text-[#111]"
                    }`}
                  >
                    ĐĂNG NHẬP
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("register");
                      setErrorMessage(null);
                    }}
                    className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                      authMode === "register"
                        ? "border-[#111] text-[#111]"
                        : "border-transparent text-[#888] hover:text-[#111]"
                    }`}
                  >
                    ĐĂNG KÝ
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("tracking");
                      setErrorMessage(null);
                    }}
                    className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center justify-center gap-1 ${
                      authMode === "tracking"
                        ? "border-[#111] text-[#111]"
                        : "border-transparent text-[#888] hover:text-[#111]"
                    }`}
                  >
                    <Search className="w-3 h-3" />
                    <span>TRA CỨU ĐƠN</span>
                  </button>
                </div>

                {/* Status messages */}
                {errorMessage && (
                  <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                {successMessage && (
                  <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* TAB 1: LOGIN FORM */}
                {authMode === "login" && (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#333] block mb-1">
                        Email đăng nhập
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#ddd] bg-[#fafafa] focus:bg-white focus:outline-none focus:border-[#111] rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#333] block mb-1">
                        Mật khẩu
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-10 py-2.5 text-xs border border-[#ddd] bg-[#fafafa] focus:bg-white focus:outline-none focus:border-[#111] rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888]"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 py-3.5 bg-[#111] text-white text-xs font-bold uppercase tracking-widest hover:bg-black rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>ĐANG XÁC THỰC...</span>
                        </>
                      ) : (
                        <>
                          <span>ĐĂNG NHẬP</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Quick Demo Pre-fill */}
                    <div className="mt-6 pt-5 border-t border-[#eaeaea]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                          Tài khoản thử nghiệm:
                        </span>
                        <span className="text-[10px] text-[#aaa]">(Click để điền)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuickFill("admin@vietcitywear.com", "password123")}
                          className="p-2 border border-[#eaeaea] bg-[#fafafa] hover:border-[#111] rounded-md text-left transition-colors"
                        >
                          <div className="text-[11px] font-bold text-[#111]">Admin</div>
                          <div className="text-[10px] text-[#777] truncate">admin@vietcitywear.com</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickFill("khachhang@gmail.com", "password123")}
                          className="p-2 border border-[#eaeaea] bg-[#fafafa] hover:border-[#111] rounded-md text-left transition-colors"
                        >
                          <div className="text-[11px] font-bold text-[#111]">Khách hàng</div>
                          <div className="text-[10px] text-[#777] truncate">khachhang@gmail.com</div>
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* TAB 2: REGISTER FORM */}
                {authMode === "register" && (
                  <form onSubmit={handleRegister} className="space-y-3.5">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#333] block mb-1">
                        Họ và tên
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="Ví dụ: Nguyễn Văn A"
                          className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#ddd] bg-[#fafafa] focus:bg-white focus:outline-none focus:border-[#111] rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#333] block mb-1">
                        Số điện thoại nhận hàng
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="0912 345 678"
                          className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#ddd] bg-[#fafafa] focus:bg-white focus:outline-none focus:border-[#111] rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#333] block mb-1">
                        Địa chỉ Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#ddd] bg-[#fafafa] focus:bg-white focus:outline-none focus:border-[#111] rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#333] block mb-1">
                        Mật khẩu (tối thiểu 6 ký tự)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-10 py-2.5 text-xs border border-[#ddd] bg-[#fafafa] focus:bg-white focus:outline-none focus:border-[#111] rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888]"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 py-3.5 bg-[#111] text-white text-xs font-bold uppercase tracking-widest hover:bg-black rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>ĐANG TẠO TÀI KHOẢN...</span>
                        </>
                      ) : (
                        <>
                          <span>TẠO TÀI KHOẢN THÀNH VIÊN</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* TAB 3: GUEST ORDER TRACKING */}
                {authMode === "tracking" && (
                  <div>
                    <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                      Dành cho khách hàng chưa đăng ký tài khoản. Nhập <strong>Số điện thoại nhận hàng</strong> để tra cứu tiến độ xử lý và hành trình đơn hàng COD của bạn.
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleTrackGuestOrders();
                      }}
                      className="space-y-3 mb-6"
                    >
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={trackingPhone}
                          onChange={(e) => setTrackingPhone(e.target.value)}
                          placeholder="Nhập số điện thoại đặt hàng (ví dụ: 0912345678)"
                          className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#ddd] bg-[#fafafa] focus:bg-white focus:outline-none focus:border-[#111] rounded-md"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isTracking}
                        className="w-full py-3 bg-[#111] text-white text-xs font-bold uppercase tracking-widest hover:bg-black rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                      >
                        {isTracking ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>ĐANG TRA CỨU ĐƠN HÀNG...</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4" />
                            <span>TRA CỨU TIẾN ĐỘ ĐƠN HÀNG</span>
                          </>
                        )}
                      </button>
                    </form>

                    {trackingError && (
                      <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                        <span>{trackingError}</span>
                      </div>
                    )}

                    {/* Guest Results */}
                    {guestOrders && guestOrders.length > 0 && (
                      <div className="space-y-3.5 pt-2 border-t border-[#eaeaea]">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                          Kết quả tra cứu ({guestOrders.length} đơn hàng)
                        </h3>
                        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                          {guestOrders.map((ord) => (
                            <div
                              key={ord.id}
                              className="p-3.5 rounded-lg border border-[#eaeaea] bg-[#fafafa]"
                            >
                              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#eaeaea]">
                                <div>
                                  <span className="text-[10px] text-gray-500 uppercase font-semibold">
                                    Mã đơn: #{ord.id.slice(0, 10).toUpperCase()}
                                  </span>
                                  <span className="text-[10px] text-gray-400 block">
                                    {new Date(ord.created_at).toLocaleDateString("vi-VN")}
                                  </span>
                                </div>
                                {renderStatusBadge(ord.status)}
                              </div>

                              <div className="py-2.5 space-y-1.5 text-xs border-b border-[#eaeaea]">
                                {ord.items &&
                                  ord.items.map((it, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                      <span className="text-stone-800 font-medium">
                                        {it.product_name} (Size: {it.size}, {it.color}) × {it.quantity}
                                      </span>
                                      <span className="font-semibold text-stone-900">
                                        {formatPrice(it.price * it.quantity)}
                                      </span>
                                    </div>
                                  ))}
                              </div>

                              <div className="pt-2 flex justify-between items-center text-xs">
                                <span className="text-[11px] text-stone-500">Hình thức: Ship COD</span>
                                <span className="font-bold text-black">
                                  Tổng: {formatPrice(ord.total_amount)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-center mt-6 text-[11px] tracking-[0.2em] uppercase text-neutral-400 font-medium">
            VIET CITY WEAR — LOCAL CITIES • REAL STORIES • WEAR IT
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-[11px] text-neutral-400 border-t border-[#EAEAEA] bg-white">
        © {new Date().getFullYear()} VIET CITY WEAR. All rights reserved.
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFA]">
          <Loader2 className="w-8 h-8 animate-spin text-[#888]" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
