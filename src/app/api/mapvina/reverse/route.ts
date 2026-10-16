import { NextResponse } from "next/server";

const DEFAULT_MAPVINA_KEY = "3d1782815560911298d03b9ac0c68f4437";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng") || searchParams.get("lon");

    if (!lat || !lng) {
      return NextResponse.json({ success: false, error: "Missing coordinates" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_MAPVINA_API_KEY || DEFAULT_MAPVINA_KEY;
    const url = new URL("https://maps.mapvina.com/api/v2/geocode/json");
    url.searchParams.set("latlng", `${lat},${lng}`);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("new_admin", "true");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json({ success: false, error: `MapVina error: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    const formattedAddress = data?.results?.[0]?.formatted_address || "";

    return NextResponse.json({
      success: true,
      formatted_address: formattedAddress,
      results: data?.results || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal reverse geocode error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
