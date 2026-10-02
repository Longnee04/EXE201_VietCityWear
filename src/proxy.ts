import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Next.js 16 Proxy Convention (Thay thế cho Middleware cũ)
 * Bảo vệ tất cả các tuyến đường `/admin/*`
 * Nếu chưa đăng nhập -> Tự động chuyển hướng về `/login`
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Lấy thông tin người dùng từ cookie phiên Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Kiểm tra nếu đang truy cập vào khu vực Admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      // Chưa đăng nhập -> Chuyển hướng về trang đăng nhập với tham số redirectTo
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

// Cấu hình matcher chỉ áp dụng cho các route /admin/*
export const config = {
  matcher: ["/admin/:path*"],
};
