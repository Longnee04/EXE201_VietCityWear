import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/**
 * Khởi tạo Supabase client phía trình duyệt (Client Components).
 * Sử dụng `@supabase/ssr` để tự động lưu và đồng bộ Cookie phiên đăng nhập (session cookies)
 * giữa Client và Server (Middleware/Proxy, Server Components, Route Handlers).
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Singleton instance tiện lợi để import trực tiếp:
 * import { supabase } from "@/lib/supabase/client";
 */
export const supabase = createClient();
