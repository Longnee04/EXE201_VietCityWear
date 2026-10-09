import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "sepay_orders.json");

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const orderId = parseInt(resolvedParams.id);
    
    if (isNaN(orderId)) {
      return NextResponse.json({ success: false, error: "Invalid order ID" }, { status: 400 });
    }

    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ success: false, error: "Database not found" }, { status: 404 });
    }

    const orders = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    const order = orders.find((o: any) => o.orderId === orderId);

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, status: order.status }, { status: 200 });
  } catch (error) {
    console.error("Error fetching order status:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
