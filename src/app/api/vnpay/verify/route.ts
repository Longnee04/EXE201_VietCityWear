import { NextResponse } from "next/server";
import crypto from "crypto";

function sortObject(obj: any) {
  const sorted: any = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  });
  return sorted;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const vnp_Params: any = {};
    
    // Convert URL searchParams to object
    url.searchParams.forEach((value, key) => {
      vnp_Params[key] = value;
    });

    const secureHash = vnp_Params["vnp_SecureHash"];
    
    // Remove hash params for verification
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    const sortedParams = sortObject(vnp_Params);
    
    const secretKey = process.env.VNPAY_HASH_SECRET;
    if (!secretKey) {
      return NextResponse.json({ verified: false, message: "Missing secret key" }, { status: 500 });
    }

    const signData = Object.keys(sortedParams)
      .map((key) => `${key}=${sortedParams[key]}`)
      .join("&");

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      // Check response code
      if (vnp_Params["vnp_ResponseCode"] === "00") {
        return NextResponse.json({ verified: true, success: true });
      } else {
        return NextResponse.json({ verified: true, success: false, code: vnp_Params["vnp_ResponseCode"] });
      }
    } else {
      return NextResponse.json({ verified: false, message: "Invalid Signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("VNPAY Verify Error:", error);
    return NextResponse.json({ verified: false, message: "Internal Error" }, { status: 500 });
  }
}
