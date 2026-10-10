import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "sepay_orders.json");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { receiver_name, receiver_phone, shipping_address, total_amount, payment_method, items, note } = body;

    // 1. Lưu trực tiếp vào bảng orders trên Supabase (kết nối trực tiếp với Admin Dashboard & Admin Orders)
    let supabaseOrderId: string | null = null;
    try {
      const { data: dbOrder, error: orderErr } = await supabase
        .from("orders")
        .insert({
          receiver_name: receiver_name || "Khách Hàng",
          receiver_phone: receiver_phone || "",
          shipping_address: shipping_address || "",
          total_amount: Number(total_amount) || 0,
          payment_method: payment_method || "COD",
          status: "processing",
          note: note || "",
        })
        .select()
        .single();

      if (!orderErr && dbOrder) {
        supabaseOrderId = dbOrder.id;

        // Lưu chi tiết từng sản phẩm vào order_items
        if (items && Array.isArray(items) && items.length > 0) {
          const orderItemsPayload = items.map((it: { productId?: string; size?: string; color?: string; quantity?: number; price?: number }) => ({
            order_id: dbOrder.id,
            product_id: it.productId && it.productId.length > 20 ? it.productId : null,
            size: it.size || "L",
            color: it.color || "Tiêu chuẩn",
            quantity: Number(it.quantity) || 1,
            unit_price: Number(it.price) || 0,
          }));

          await supabase.from("order_items").insert(orderItemsPayload);
        }
      } else {
        console.warn("Lưu đơn Supabase cảnh báo:", orderErr?.message);
      }
    } catch (dbErr) {
      console.warn("Lỗi gọi Supabase orders:", dbErr);
    }

    // 2. Lưu dự phòng cho cơ chế SePay QR nếu có
    const numericId = Date.now();
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      let orders = [];
      if (fs.existsSync(dbPath)) {
        orders = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      }

      const newOrder = {
        orderId: numericId,
        supabaseId: supabaseOrderId,
        ...body,
        status: "processing",
        createdAt: new Date().toISOString(),
      };

      orders.push(newOrder);
      fs.writeFileSync(dbPath, JSON.stringify(orders, null, 2));
    } catch {}

    return NextResponse.json(
      {
        success: true,
        orderId: supabaseOrderId || numericId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}
