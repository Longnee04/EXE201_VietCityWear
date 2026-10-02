import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Kiểm tra bảng users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .limit(10);

    // Kiểm tra auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

    return NextResponse.json({
      success: true,
      publicUsers: {
        data: users,
        error: usersError?.message,
      },
      authUsers: {
        data: authData?.users || null,
        error: authError?.message,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({
      success: false,
      error: errorMessage,
    });
  }
}
