import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "sepay_orders.json");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Đọc db giả lập
    let orders = [];
    if (fs.existsSync(dbPath)) {
      orders = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    }

    const newOrder = {
      orderId: Date.now(), // Random numeric ID
      ...body,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    fs.writeFileSync(dbPath, JSON.stringify(orders, null, 2));

    return NextResponse.json({ success: true, orderId: newOrder.orderId }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}
