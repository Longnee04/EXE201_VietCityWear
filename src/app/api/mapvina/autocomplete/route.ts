import { NextResponse } from "next/server";

const DEFAULT_MAPVINA_KEY = "3d1782815560911298d03b9ac0c68f4437";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("text") || searchParams.get("q") || "";

    if (!query.trim() || query.trim().length < 2) {
      return NextResponse.json({ success: true, suggestions: [] });
    }

    const cleanQuery = query.trim();

    // 1. If Goong API key is configured, use Goong (Highest accuracy in VN)
    const goongKey = process.env.NEXT_PUBLIC_GOONG_API_KEY || process.env.GOONG_API_KEY;
    if (goongKey) {
      try {
        const goongUrl = `https://rsapi.goong.io/Place/AutoComplete?api_key=${goongKey}&input=${encodeURIComponent(cleanQuery)}&limit=5`;
        const gRes = await fetch(goongUrl);
        if (gRes.ok) {
          const gData = await gRes.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (Array.isArray(gData?.predictions) && gData.predictions.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const suggestions = gData.predictions.map((p: any) => ({
              id: p.place_id || Math.random().toString(),
              name: p.structured_formatting?.main_text || p.description,
              label: p.description,
              coordinates: null,
            }));
            return NextResponse.json({ success: true, suggestions, source: "goong" });
          }
        }
      } catch (err) {
        console.warn("Goong search fallback:", err);
      }
    }

    // 2. High-accuracy OpenStreetMap / Nominatim search for Vietnam
    try {
      const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        cleanQuery
      )}&format=json&addressdetails=1&countrycodes=vn&limit=5`;
      const osmRes = await fetch(osmUrl, {
        headers: {
          "User-Agent": "VietCityWear-Store/1.0 (contact@vietcitywear.com)",
        },
      });

      if (osmRes.ok) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const osmData: any[] = await osmRes.json();
        if (Array.isArray(osmData) && osmData.length > 0) {
          const suggestions = osmData.map((item) => {
            const addr = item.address || {};
            const road = addr.road || addr.street || "";
            const quarter = addr.quarter || addr.suburb || "";
            const city = addr.city || addr.state || addr.province || "";
            
            // Format nice compact Vietnamese label
            const labelParts = [road, quarter, city].filter(Boolean);
            const label = labelParts.length > 0 ? labelParts.join(", ") : item.display_name;

            return {
              id: `osm-${item.osm_id || Math.random().toString()}`,
              name: item.name || road || label,
              label: item.display_name,
              coordinates: [parseFloat(item.lon), parseFloat(item.lat)] as [number, number],
            };
          });

          return NextResponse.json({
            success: true,
            suggestions,
            source: "nominatim",
          });
        }
      }
    } catch (err) {
      console.warn("Nominatim search fallback:", err);
    }

    // 3. Fallback to MapVina Autocomplete API
    const apiKey = process.env.NEXT_PUBLIC_MAPVINA_API_KEY || DEFAULT_MAPVINA_KEY;
    const url = new URL("https://maps.mapvina.com/api/v1/autocomplete");
    url.searchParams.set("text", cleanQuery);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("lang", "vi");
    url.searchParams.set("size", "6");
    url.searchParams.set("new_admin", "true");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const features: any[] = data?.features || [];

      const suggestions = features.map((f) => ({
        id: f.properties?.id || f.properties?.gid || Math.random().toString(),
        name: f.properties?.name || "",
        label: f.properties?.label || f.properties?.name || "",
        coordinates: f.geometry?.coordinates || null,
      }));

      return NextResponse.json({
        success: true,
        suggestions,
        source: "mapvina",
      });
    }

    return NextResponse.json({ success: true, suggestions: [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, suggestions: [], error: message });
  }
}
