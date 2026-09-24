"use client";

import { useState } from "react";
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
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

/**
 * Hàm hỗ trợ dịch các mã lỗi phổ biến từ Supabase Auth sang tiếng Việt thân thiện
 */
function formatAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.";
  }
  if (message.includes("Email not confirmed")) {
    return "Tài khoản chưa được xác nhận qua Email. Vui lòng kiểm tra hộp thư.";
  }
  if (message.includes("Too many requests") || message.includes("rate limit")) {
    return "Bạn đã thử đăng nhập quá nhiều lần. Vui lòng chờ ít phút rồi thử lại.";
  }
  if (message.includes("Database error querying schema")) {
    return "Lỗi dữ liệu hệ thống xác thực (auth.users có trường token NULL do chèn trực tiếp bằng SQL). Vui lòng cập nhật token rỗng trong Supabase SQL Editor hoặc tạo User qua Supabase Dashboard.";
  }
  return message || "Đã có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.";
}

export default function LoginPage() {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Xử lý xác thực người dùng và phân quyền chuyển hướng (Role-Based Redirection)
   */
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate cơ bản phía Client
    if (!email.trim() || !password) {
      setErrorMessage("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }

    try {
      setIsLoading(true);

      // 1. Xác thực tài khoản với Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

      if (authError) {
        setErrorMessage(formatAuthError(authError.message));
        setIsLoading(false);
        return;
      }

      if (!authData?.user) {
        setErrorMessage("Không tìm thấy thông tin tài khoản sau khi đăng nhập.");
        setIsLoading(false);
        return;
      }

      const userId = authData.user.id;

      // 2. Truy vấn trực tiếp quyền người dùng (role) từ bảng custom `public.users`
      const { data: userProfile, error: profileError } = (await supabase
        .from("users")
        .select("role, full_name")
        .eq("id", userId)
        .maybeSingle()) as {
        data: { role?: string; full_name?: string | null } | null;
        error: { message?: string } | null;
      };

      if (profileError) {
        console.warn("Lưu ý khi đọc bảng public.users:", profileError.message);
      }

      // Xác định role: Ưu tiên bảng `public.users`, fallback sang `user_metadata.role`, mặc định là 'user'
      const assignedRole =
        userProfile?.role ||
        (authData.user.user_metadata?.role as string) ||
        "user";

      // 3. Phân luồng điều hướng dựa trên Role
      if (assignedRole === "admin") {
        setSuccessMessage(
          "Xác thực thành công với quyền Quản trị viên! Đang chuyển đến Trang quản trị..."
        );
        // Refresh router để cập nhật Server Components/Cookies rồi điều hướng
        router.refresh();
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 600);
      } else {
        setSuccessMessage("Đăng nhập thành công! Đang chuyển hướng về Trang chủ...");
        router.refresh();
        setTimeout(() => {
          router.push("/");
        }, 600);
      }
    } catch (err) {
      console.error("Lỗi đăng nhập không mong muốn:", err);
      setErrorMessage("Đã xảy ra lỗi kết nối. Vui lòng kiểm tra lại đường truyền mạng.");
      setIsLoading(false);
    }
  };

  /**
   * Hỗ trợ điền nhanh tài khoản thử nghiệm (Admin / User)
   */
  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-between text-[#111111] antialiased selection:bg-black selection:text-white">
      {/* Top Bar / Navigation Header */}
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

      {/* Main Content Form Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-[440px]">
          {/* Card Container */}
          <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-[0_12px_40px_-16px_rgba(0,0,0,0.08)] p-7 sm:p-9 relative overflow-hidden">
            {/* Streetwear Decorative Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-800 via-neutral-900 to-black" />

            {/* Header info */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F7F4EE] border border-[#EAEAEA] mb-3 text-black">
                <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight uppercase text-black">
                Đăng Nhập Tài Khoản
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed">
                Khám phá phong cách thời trang đường phố giao thoa văn hóa Việt Nam.
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-5 p-3.5 bg-red-50/90 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-xs sm:text-sm animate-fade-in"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                <div className="flex-1 leading-snug">{errorMessage}</div>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div
                role="status"
                className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-800 text-xs sm:text-sm animate-fade-in"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
                <div className="flex-1 leading-snug">{successMessage}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-700 mb-1.5"
                >
                  Email đăng nhập
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tenban@example.com"
                    className="w-full pl-10 pr-3.5 py-3 text-sm bg-neutral-50/60 border border-[#E0E0E0] rounded-lg text-black placeholder-neutral-400 transition focus:bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-700"
                  >
                    Mật khẩu
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Vui lòng liên hệ ban quản trị để khôi phục mật khẩu.");
                    }}
                    className="text-[11px] text-neutral-500 hover:text-black transition-colors"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 text-sm bg-neutral-50/60 border border-[#E0E0E0] rounded-lg text-black placeholder-neutral-400 transition focus:bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 focus:outline-none"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 bg-[#111] hover:bg-black text-white font-bold text-xs uppercase tracking-[0.16em] rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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
            </form>

            {/* Quick Demo Pre-fill section */}
            <div className="mt-7 pt-5 border-t border-[#EAEAEA]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                  Tài khoản thử nghiệm nhanh:
                </span>
                <span className="text-[10px] text-neutral-400">(Click để điền)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickFill("admin@vietcitywear.com", "password123")
                  }
                  className="p-2.5 rounded-lg border border-[#E5E5E5] bg-neutral-50 hover:bg-neutral-100 hover:border-black/30 transition text-left group"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-800 group-hover:text-black">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Admin</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate mt-0.5">
                    admin@vietcitywear.com
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickFill("khachhang@gmail.com", "password123")
                  }
                  className="p-2.5 rounded-lg border border-[#E5E5E5] bg-neutral-50 hover:bg-neutral-100 hover:border-black/30 transition text-left group"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-800 group-hover:text-black">
                    <User className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Khách hàng</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate mt-0.5">
                    khachhang@gmail.com
                  </div>
                </button>
              </div>
            </div>

            {/* Footer note inside card */}
            <div className="mt-6 text-center text-xs text-neutral-500">
              Chưa có tài khoản?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Tính năng Đăng ký tài khoản đang được hoàn thiện trong giai đoạn kế tiếp!");
                }}
                className="font-semibold text-black underline underline-offset-4 hover:text-neutral-700"
              >
                Đăng ký thành viên
              </a>
            </div>
          </div>

          {/* Cultural Brand Slogan */}
          <div className="text-center mt-6 text-[11px] tracking-[0.2em] uppercase text-neutral-400 font-medium">
            VIET CITY WEAR — BẢN SẮC TRÊN TỪNG THỚ VẢI
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
