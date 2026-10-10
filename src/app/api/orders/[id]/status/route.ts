import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "sepay_orders.json");

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    // 1. Kiểm tra trạng thái trong Supabase
    try {
      const { data: dbOrder } = await supabase
        .from("orders")
        .select("status")
        .eq("id", orderId)
        .maybeSingle();

      if (dbOrder) {
        return NextResponse.json({ success: true, status: dbOrder.status }, { status: 200 });
      }
    } catch {}

    // 2. Fallback sang file json
    if (fs.existsSync(dbPath)) {
      const orders = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      const order = orders.find((o: { orderId: number; supabaseId?: string; status: string }) => 
        String(o.orderId) === String(orderId) || o.supabaseId === orderId
      );

      if (order) {
        return NextResponse.json({ success: true, status: order.status }, { status: 200 });
      }
    }

    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching order status:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
