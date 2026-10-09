import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "sepay_orders.json");

export async function POST(req: Request) {
  try {
    const apiKey = process.env.SEPAY_WEBHOOK_SECRET;
    if (apiKey) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json();
    const description = body.transactionContent || body.content || "";
    
    const match = description.match(/\d+/);
    if (!match) {
      return NextResponse.json({ success: false, error: "No numeric OrderId found in description" }, { status: 400 });
    }
    const orderId = parseInt(match[0]);

    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ success: false, error: "DB not found" }, { status: 404 });
    }

    let orders = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    let found = false;
    
    orders = orders.map((o: { orderId: number; [key: string]: unknown }) => {
      if (o.orderId === orderId) {
        found = true;
        return { ...o, status: "paid" };
      }
      return o;
    });

    if (!found) {
       return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    fs.writeFileSync(dbPath, JSON.stringify(orders, null, 2));

    return NextResponse.json({ success: true, message: "Webhook processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("SePay Webhook error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
