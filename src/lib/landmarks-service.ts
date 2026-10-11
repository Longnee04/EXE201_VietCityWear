import { supabase } from "@/lib/supabase/client";
import { HANOI_GUIDE, type CityGuide, type Landmark, type LandmarkFood } from "@/data/landmarks";
import { slugify } from "@/data/products";

/**
 * Tải hướng dẫn di sản thành phố & danh sách địa danh trực tiếp từ Supabase (kèm dự phòng HANOI_GUIDE)
 */
export async function fetchLiveCityGuide(cityName = "Hà Nội"): Promise<CityGuide> {
  try {
    const { data: dbCity, error: cityError } = await supabase
      .from("cities")
      .select("*")
      .ilike("name", `%${cityName}%`)
      .maybeSingle();

    if (cityError || !dbCity) {
      return HANOI_GUIDE;
    }

    const { data: dbLandmarks, error: lmError } = await supabase
      .from("landmarks")
      .select("*")
      .eq("city_id", dbCity.id)
      .order("order_index", { ascending: true });

    // Phân tích dữ liệu bản đồ số từ dbCity (nếu admin có cấu hình)
    let mapEmbedUrl = HANOI_GUIDE.map_embed_url;
    let coordinates = HANOI_GUIDE.coordinates;

    if (dbCity.image_url) {
      try {
        const parsed = JSON.parse(dbCity.image_url);
        if (parsed.map_url) mapEmbedUrl = parsed.map_url;
        if (parsed.coordinates) coordinates = parsed.coordinates;
      } catch {
        if (
          dbCity.image_url.startsWith("http") &&
          (dbCity.image_url.includes("google.com/maps") || dbCity.image_url.includes("embed"))
        ) {
          mapEmbedUrl = dbCity.image_url;
        }
      }
    }

    if (lmError || !dbLandmarks || dbLandmarks.length === 0) {
      return {
        ...HANOI_GUIDE,
        city_name_vi: dbCity.name,
        description_vi: dbCity.description || HANOI_GUIDE.description_vi,
        cover_image: dbCity.cover_image || "/images/hanoi-banner.jpg",
        map_embed_url: mapEmbedUrl,
        coordinates: coordinates,
      };
    }

    // Ánh xạ danh sách địa danh từ Supabase sang kiểu dữ liệu giao diện Landmark
    const mappedLandmarks: Landmark[] = dbLandmarks.map((lm, idx) => {
      // Tìm dữ liệu tĩnh tương ứng để lấy bản dịch tiếng Anh & audio nếu có
      const staticMatch = HANOI_GUIDE.landmarks.find(
        (slm) =>
          slm.name_vi.toLowerCase().includes(lm.name.toLowerCase()) ||
          lm.name.toLowerCase().includes(slm.name_vi.toLowerCase())
      );

      const landmarkImage =
        (Array.isArray(lm.images) && lm.images.length > 0 && lm.images[0]) ||
        staticMatch?.image ||
        "/images/landmarks/ho-guom.jpg";

      // Phân tích gợi ý quán ăn ẩm thực
      let foods: LandmarkFood[] = staticMatch?.foods || [];
      if (lm.food_suggestions && (!foods || foods.length === 0)) {
        foods = lm.food_suggestions.split(",").map((item: string) => ({
          name_vi: item.trim(),
          name_en: item.trim(),
          dish_vi: item.trim(),
          dish_en: item.trim(),
          address: "Khu vực lân cận",
          distance: "Cách 150m",
        }));
      }

      return {
        id: lm.id,
        slug: slugify(lm.name) || `landmark-${idx + 1}`,
        name_vi: lm.name,
        name_en: staticMatch?.name_en || lm.name,
        order: lm.order_index || idx + 1,
        highlight_vi: staticMatch?.highlight_vi || lm.story?.slice(0, 60) || "Địa danh di sản",
        highlight_en: staticMatch?.highlight_en || "Heritage Landmark",
        story_vi: lm.story || staticMatch?.story_vi || "",
        story_en: staticMatch?.story_en || lm.story || "",
        history_vi: lm.history || staticMatch?.history_vi || "",
        history_en: staticMatch?.history_en || lm.history || "",
        address: staticMatch?.address || "Hà Nội, Việt Nam",
        best_time_vi: lm.travel_timeline || staticMatch?.best_time_vi || "Tham quan tự do",
        best_time_en: staticMatch?.best_time_en || "Free visit",
        image: landmarkImage,
        audio_title_vi: staticMatch?.audio_title_vi || `Thuyết minh di sản ${lm.name}`,
        audio_title_en: staticMatch?.audio_title_en || `Audio guide for ${lm.name}`,
        duration: staticMatch?.duration || "03:30",
        foods: foods,
      };
    });

    return {
      city_name_vi: dbCity.name,
      city_name_en: cityName === "Hà Nội" ? "Hanoi" : dbCity.name,
      slogan_vi: HANOI_GUIDE.slogan_vi,
      slogan_en: HANOI_GUIDE.slogan_en,
      description_vi: dbCity.description || HANOI_GUIDE.description_vi,
      description_en: HANOI_GUIDE.description_en,
      cover_image: dbCity.cover_image || "/images/hanoi-banner.jpg",
      map_embed_url: mapEmbedUrl,
      coordinates: coordinates,
      landmarks: mappedLandmarks,
    };
  } catch (err) {
    console.warn("Lỗi đồng bộ dữ liệu di sản từ Supabase:", err);
    return HANOI_GUIDE;
  }
}
