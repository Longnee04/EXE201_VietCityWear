"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

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

export default function LoginPage() {
  const router = useRouter();

  // Mode: "login" | "register" | "profile"
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<{
    full_name: string;
    phone: string;
    email: string;
    role: string;
  } | null>(null);

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

  // Check auth status on mount
  useEffect(() => {
    async function loadUserSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUser(session.user);
          // Query user profile
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
        }
      } catch (err) {
        console.error("Lỗi kiểm tra phiên:", err);
      }
    }
    loadUserSession();
  }, []);

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
        setSuccessMessage("Đăng nhập thành công! Chuyển hướng về trang chủ...");
        router.refresh();
        setTimeout(() => router.push("/"), 600);
      }
    } catch (err) {
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
        // Upsert into users table
        try {
          await supabase.from("users").upsert({
            id: authData.user.id,
            email: regEmail.trim(),
            full_name: regFullName.trim() || "Khách hàng",
            phone: regPhone.trim(),
            role: "user",
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
    } catch (err) {
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

      // Update in public.users
      await supabase
        .from("users")
        .update({
          full_name: editFullName.trim(),
          phone: editPhone.trim(),
        } as any)
        .eq("id", currentUser.id);

      // Update auth metadata
      await supabase.auth.updateUser({
        data: {
          full_name: editFullName.trim(),
          phone: editPhone.trim(),
        },
      });

      setUserProfile((prev) =>
        prev
          ? { ...prev, full_name: editFullName.trim(), phone: editPhone.trim() }
          : null
      );
      setIsEditingProfile(false);
      setSuccessMessage("Cập nhật thông tin tài khoản thành công!");
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
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
      setSuccessMessage("Đã đăng xuất thành công.");
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
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

          <div className="w-24 hidden sm:block text-right">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400">
              Bảo mật 256-bit
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-[460px]">
          <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-[0_12px_40px_-16px_rgba(0,0,0,0.08)] p-7 sm:p-9 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-800 via-neutral-900 to-black" />

            {/* IF USER IS ALREADY LOGGED IN: SHOW PROFILE VIEW */}
            {currentUser && userProfile ? (
              <div>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#111] text-white mb-3">
                    <User className="w-7 h-7" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight uppercase text-black">
                    TÀI KHOẢN CỦA BẠN
                  </h1>
                  <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#f0f0f0] text-[#555] rounded-full">
                    Vai trò: {userProfile.role === "admin" ? "Quản trị viên (Admin)" : "Khách hàng thân thiết"}
                  </span>
                </div>

                {successMessage && (
                  <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Profile Information List or Edit Form */}
                {!isEditingProfile ? (
                  <div className="space-y-3.5 mb-6 bg-[#fafafa] p-4 rounded-xl border border-[#eaeaea]">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#888]">Họ và tên</p>
                      <p className="text-sm font-semibold text-[#111] mt-0.5">{userProfile.full_name || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#888]">Số điện thoại</p>
                      <p className="text-sm font-semibold text-[#111] mt-0.5">{userProfile.phone || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#888]">Địa chỉ Email</p>
                      <p className="text-sm font-semibold text-[#111] mt-0.5">{userProfile.email}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="mt-2 w-full py-2 border border-[#111] text-[#111] text-xs font-bold uppercase tracking-wider hover:bg-[#111] hover:text-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Chỉnh sửa họ tên / SĐT</span>
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
                    href="/"
                    className="w-full py-2.5 border border-[#111] text-[#111] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#f5f5f5] rounded-lg transition-colors"
                  >
                    <span>Về trang chủ mua sắm</span>
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
            ) : (
              /* IF USER IS NOT LOGGED IN: TABS LOGIN / REGISTER */
              <div>
                {/* Tab switchers */}
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
                    ĐĂNG KÝ MỚI
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

                {/* LOGIN FORM */}
                {authMode === "login" ? (
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
                ) : (
                  /* REGISTER FORM */
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
                        Số điện thoại
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
