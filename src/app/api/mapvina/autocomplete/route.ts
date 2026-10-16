import { NextResponse } from "next/server";

const DEFAULT_MAPVINA_KEY = "3d1782815560911298d03b9ac0c68f4437";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("text") || searchParams.get("q") || "";

    if (!query.trim() || query.trim().length < 2) {
      return NextResponse.json({ success: true, suggestions: [] });
    }

    const apiKey = process.env.NEXT_PUBLIC_MAPVINA_API_KEY || DEFAULT_MAPVINA_KEY;
    const url = new URL("https://maps.mapvina.com/api/v1/autocomplete");
    url.searchParams.set("text", query.trim());
    url.searchParams.set("key", apiKey);
    url.searchParams.set("lang", "vi");
    url.searchParams.set("size", "6");
    url.searchParams.set("new_admin", "true");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 }, // Cache identical queries for 60 seconds
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json({ success: false, suggestions: [], error: `MapVina error: ${res.status}` });
    }

    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features: any[] = data?.features || [];

    const suggestions = features.map((f) => ({
      id: f.properties?.id || f.properties?.gid || Math.random().toString(),
      name: f.properties?.name || "",
      label: f.properties?.label || f.properties?.name || "",
      housenumber: f.properties?.housenumber || "",
      street: f.properties?.street || "",
      locality: f.properties?.locality || "",
      region: f.properties?.region || "",
      coordinates: f.geometry?.coordinates || null,
    }));

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({
      success: false,
      suggestions: [],
      error: message,
    });
  }
}
