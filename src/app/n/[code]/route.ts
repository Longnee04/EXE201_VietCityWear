import { NextRequest, NextResponse } from "next/server";

// Bảng tra cứu mặc định khi chưa có kết nối database động
const NFC_REGISTRY: Record<string, string> = {
  "VCW-HN-001": "/explore/hanoi",
  "VCW-HN-DEFAULT": "/explore/hanoi",
  "VCW-HP-001": "/explore/hanoi", // Sẽ cập nhật sang /explore/haiphong khi ra mắt BST 2
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;
  const normalizedCode = code ? code.toUpperCase() : "VCW-HN-001";

  // Tra cứu đích đến: ưu tiên mã cụ thể, nếu là mã Hà Nội thì trỏ về /explore/hanoi
  const targetUrl =
    NFC_REGISTRY[normalizedCode] ||
    (normalizedCode.startsWith("VCW-HN") ? "/explore/hanoi" : "/explore/hanoi");

  // Ghi log lượt chạm ẩn danh (Thời gian, User-Agent, Mã NFC)
  const userAgent = request.headers.get("user-agent") || "unknown";
  const acceptLanguage = request.headers.get("accept-language") || "vi";

  console.log(`[NFC SCAN EVENT] Tag: ${normalizedCode} | Time: ${new Date().toISOString()} | Lang: ${acceptLanguage} | UA: ${userAgent}`);

  // Chuyển hướng tới trang trải nghiệm
  const redirectUrl = new URL(targetUrl, request.url);
  redirectUrl.searchParams.set("source", "nfc");
  redirectUrl.searchParams.set("tag", normalizedCode);

  return NextResponse.redirect(redirectUrl);
}
