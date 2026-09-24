import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey || anonKey === "placeholder-anon-key") {
    return NextResponse.json(
      {
        success: false,
        message: "Chưa cấu hình NEXT_PUBLIC_SUPABASE_ANON_KEY trong file .env!",
        instruction:
          "Vui lòng vào Supabase Dashboard -> Project Settings -> API -> Copy anon key và dán vào file .env",
      },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase.from("products").select("*").limit(5);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Lỗi kết nối tới Supabase",
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "🎉 Kết nối Supabase thành công 100%!",
      productsCount: data?.length || 0,
      products: data,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi server",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
