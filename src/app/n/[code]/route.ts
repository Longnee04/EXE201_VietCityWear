import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

// Bảng tra cứu mặc định dự phòng khi không có mạng
const NFC_REGISTRY: Record<string, string> = {
  "VCW-HN-001": "/explore/hanoi",
  "VCW-HN-DEFAULT": "/explore/hanoi",
  "VCW-HP-001": "/explore/hanoi",
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;
  const normalizedCode = code ? code.toUpperCase() : "VCW-HN-001";

  let targetUrl = NFC_REGISTRY[normalizedCode] || "/explore/hanoi";

  // Tra cứu và tăng số lượt chạm (scan_count) trong Supabase Database
  try {
    const { data: tagData } = await supabase
      .from("nfc_tags")
      .select("id, experience_url, scan_count")
      .eq("nfc_code", normalizedCode)
      .maybeSingle();

    if (tagData) {
      if (tagData.experience_url) {
        targetUrl = tagData.experience_url;
      }
      // Tăng scan_count
      await supabase
        .from("nfc_tags")
        .update({ scan_count: (tagData.scan_count || 0) + 1 })
        .eq("id", tagData.id);
    }
  } catch (err) {
    console.warn("Lỗi tra cứu Supabase NFC, dùng cấu hình fallback:", err);
  }

  // Ghi log lượt chạm ẩn danh
  const userAgent = request.headers.get("user-agent") || "unknown";
  const acceptLanguage = request.headers.get("accept-language") || "vi";

  console.log(
    `[NFC SCAN EVENT] Tag: ${normalizedCode} | Target: ${targetUrl} | Time: ${new Date().toISOString()} | Lang: ${acceptLanguage} | UA: ${userAgent}`
  );

  // Chuyển hướng tới trang trải nghiệm
  const redirectUrl = new URL(targetUrl, request.url);
  redirectUrl.searchParams.set("source", "nfc");
  redirectUrl.searchParams.set("tag", normalizedCode);

  return NextResponse.redirect(redirectUrl);
}
