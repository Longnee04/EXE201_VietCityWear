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

    // 1. If Goong API key configured, use Goong Reverse Geocode
    const goongKey = process.env.NEXT_PUBLIC_GOONG_API_KEY || process.env.GOONG_API_KEY;
    if (goongKey) {
      try {
        const goongUrl = `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${goongKey}`;
        const gRes = await fetch(goongUrl);
        if (gRes.ok) {
          const gData = await gRes.json();
          const first = gData?.results?.[0];
          if (first?.formatted_address) {
            return NextResponse.json({
              success: true,
              formatted_address: first.formatted_address,
              source: "goong",
            });
          }
        }
      } catch (err) {
        console.warn("Goong reverse fallback:", err);
      }
    }

    // 2. High-accuracy OpenStreetMap / Nominatim Reverse Geocoding
    try {
      const osmUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
      const osmRes = await fetch(osmUrl, {
        headers: {
          "User-Agent": "VietCityWear-Store/1.0 (contact@vietcitywear.com)",
        },
      });

      if (osmRes.ok) {
        const osmData = await osmRes.json();
        const addr = osmData.address || {};
        
        // Build clean Vietnamese address string: [House/POI, Road, Quarter/Ward, District/Suburb, City/Province]
        const houseOrPoi = addr.house_number || addr.shop || addr.amenity || addr.building || "";
        const road = addr.road || addr.street || "";
        const ward = addr.suburb || addr.quarter || addr.neighbourhood || "";
        const district = addr.city_district || addr.district || "";
        const city = addr.city || addr.state || addr.province || "";

        const parts = [
          houseOrPoi && road ? `${houseOrPoi} ${road}` : (road || houseOrPoi),
          ward,
          district !== city ? district : "",
          city,
        ].filter(Boolean);

        const formattedAddress = parts.length >= 2 ? parts.join(", ") : osmData.display_name;

        if (formattedAddress) {
          return NextResponse.json({
            success: true,
            formatted_address: formattedAddress,
            source: "nominatim",
          });
        }
      }
    } catch (err) {
      console.warn("Nominatim reverse fallback:", err);
    }

    // 3. Fallback to MapVina Reverse Geocoding
    const apiKey = process.env.NEXT_PUBLIC_MAPVINA_API_KEY || DEFAULT_MAPVINA_KEY;
    const url = new URL("https://maps.mapvina.com/api/v2/geocode/json");
    url.searchParams.set("latlng", `${lat},${lng}`);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("new_admin", "true");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const formattedAddress = data?.results?.[0]?.formatted_address || "";
      return NextResponse.json({
        success: true,
        formatted_address: formattedAddress,
        source: "mapvina",
      });
    }

    return NextResponse.json({ success: false, error: "Could not reverse geocode location" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal reverse geocode error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
