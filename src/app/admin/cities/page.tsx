"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Compass,
  Utensils,
  Clock,
  Edit2,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Landmark {
  id: string;
  name: string;
  story: string | null;
  history?: string | null;
  travel_timeline: string | null;
  food_suggestions: string | null;
  images?: string[];
}

interface City {
  id: string;
  name: string;
  description: string | null;
  cover_image?: string | null;
  image_url?: string | null;
  map_embed_url?: string | null;
  coordinates?: string | null;
  landmarks?: Landmark[];
}

function cleanMapUrl(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  const match = trimmed.match(/src=["']([^"']+)["']/i);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

const DEFAULT_MAP_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14896.793616641558!2d105.84310574999999!3d21.028779699999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd3861111%3A0x2a92e10697e88775!2zSOG7kyBIb8OgbiBLaeG6v20!5e0!3m2!1svi!2svn!4v1710000000000!5m2!1svi!2svn";
const DEFAULT_COORDINATES = "21.0285°N, 105.8542°E";

const mockDefaultCities: City[] = [
  {
    id: "c-hn",
    name: "Hà Nội",
    description: "Thủ đô nghìn năm văn hiến, nét trầm mặc của 36 phố phường và Hồ Gươm cổ kính.",
    cover_image: "/images/hanoi-banner.jpg",
    image_url: "/images/hanoi-banner.jpg",
    map_embed_url: DEFAULT_MAP_URL,
    coordinates: DEFAULT_COORDINATES,
    landmarks: [
      {
        id: "lm-1",
        name: "Hồ Gươm – Tháp Rùa",
        story: "Trái tim của thủ đô gắn liền truyền thuyết vua Lê Lợi trả gươm báu.",
        history: "Tháp Rùa xây dựng vào cuối thế kỷ 19, nằm trên gò đất nổi giữa hồ Hoàn Kiếm, hòa quyện kiến trúc bản địa và Gothic.",
        travel_timeline: "Sáng sớm (5:30 - 7:00) hoặc phố đi bộ tối cuối tuần",
        food_suggestions: "Kem Tràng Tiền, Cà phê Đinh, Nộm bò khô Bờ Hồ",
        images: ["/images/landmarks/ho-guom.jpg"],
      },
      {
        id: "lm-2",
        name: "Văn Miếu – Quốc Tử Giám",
        story: "Trường đại học đầu tiên của Việt Nam, biểu tượng truyền thống hiếu học nghìn năm văn hiến.",
        history: "Xây dựng năm 1070 dưới thời vua Lý Thánh Tông, bảo tồn 82 bia Tiến sĩ vinh danh hiền tài.",
        travel_timeline: "Sáng 8:00 - 11:30 hoặc chiều 14:00 - 16:30",
        food_suggestions: "Bún chả Sinh Từ, Phở Bát Đàn",
        images: ["/images/landmarks/van-mieu.jpg"],
      },
      {
        id: "lm-3",
        name: "Lăng Chủ tịch Hồ Chí Minh",
        story: "Nơi yên nghỉ vĩnh hằng của vị lãnh tụ kính yêu của dân tộc Việt Nam.",
        history: "Khởi công năm 1973 và khánh thành năm 1975, kiến trúc lấy cảm hứng từ lăng Lenin kết hợp hoa sen truyền thống.",
        travel_timeline: "Sáng 7:30 - 10:30 (Thứ 3, 4, 5, 7, CN)",
        food_suggestions: "Bánh cuốn Thanh Trì, Bún chả Đội Cấn",
        images: ["/images/landmarks/lang-bac.jpg"],
      },
      {
        id: "lm-4",
        name: "Nhà Thờ Lớn Hà Nội",
        story: "Giao thoa kiến trúc Gothic trung cổ châu Âu giữa lòng phố cổ phương Đông trầm mặc.",
        history: "Khánh thành vào dịp Giáng sinh năm 1887, mô phỏng theo mẫu Nhà thờ Đức Bà Paris.",
        travel_timeline: "Chiều tối 15:00 - 21:00",
        food_suggestions: "Trà chanh Nhà Thờ, Nem chua nướng Ấu Triệu",
        images: ["/images/landmarks/nha-tho-lon.jpg"],
      },
      {
        id: "lm-5",
        name: "Phố Cổ Hà Nội – 36 Phố Phường",
        story: "Mạng lưới phố nghề truyền thống lưu giữ nhịp sống kinh kỳ rộn rã qua hàng thế kỷ.",
        history: "Hình thành từ thời Lý - Trần, mỗi con phố mang tên mặt hàng thủ công buôn bán đặc trưng.",
        travel_timeline: "Cả ngày, đặc biệt náo nhiệt từ 17:00 - 23:00",
        food_suggestions: "Phở Bát Đàn, Bún chả Hàng Quạt, Chả cá Lã Vọng",
        images: ["/images/landmarks/pho-co.jpg"],
      },
    ],
  },
];

const CITIES_STORAGE_KEY = "vcw_admin_cities";

function getStoredCities(): City[] {
  if (typeof window === "undefined") return mockDefaultCities;
  try {
    const raw = localStorage.getItem(CITIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error reading localStorage:", e);
  }
  return mockDefaultCities;
}

function saveStoredCities(cities: City[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CITIES_STORAGE_KEY, JSON.stringify(cities));
  } catch (e) {
    console.error("Error writing localStorage:", e);
  }
}

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Modal Add City
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [cityName, setCityName] = useState("");
  const [cityDesc, setCityDesc] = useState("");
  const [cityCover, setCityCover] = useState("/images/hanoi-banner.jpg");
  const [cityMapUrl, setCityMapUrl] = useState(DEFAULT_MAP_URL);
  const [cityCoordinates, setCityCoordinates] = useState(DEFAULT_COORDINATES);

  // Modal Edit City
  const [isEditCityModalOpen, setIsEditCityModalOpen] = useState(false);
  const [editingCityName, setEditingCityName] = useState("");
  const [editingCityDesc, setEditingCityDesc] = useState("");
  const [editingCityCover, setEditingCityCover] = useState("");
  const [editingCityMapUrl, setEditingCityMapUrl] = useState("");
  const [editingCityCoordinates, setEditingCityCoordinates] = useState("");

  // Modal Add Landmark
  const [isLandmarkModalOpen, setIsLandmarkModalOpen] = useState(false);
  const [lmName, setLmName] = useState("");
  const [lmStory, setLmStory] = useState("");
  const [lmHistory, setLmHistory] = useState("");
  const [lmTimeline, setLmTimeline] = useState("");
  const [lmFood, setLmFood] = useState("");
  const [lmImage, setLmImage] = useState("");

  // Modal Edit Landmark
  const [isEditLandmarkModalOpen, setIsEditLandmarkModalOpen] = useState(false);
  const [editingLandmark, setEditingLandmark] = useState<Landmark | null>(null);
  const [editLmName, setEditLmName] = useState("");
  const [editLmStory, setEditLmStory] = useState("");
  const [editLmHistory, setEditLmHistory] = useState("");
  const [editLmTimeline, setEditLmTimeline] = useState("");
  const [editLmFood, setEditLmFood] = useState("");
  const [editLmImage, setEditLmImage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCities() {
      try {
        const [citiesRes, landmarksRes] = await Promise.all([
          supabase.from("cities").select("*").order("created_at", { ascending: true }),
          supabase.from("landmarks").select("*").order("order_index", { ascending: true }),
        ]);

        if (ignore) return;

        if (citiesRes.error || !citiesRes.data || citiesRes.data.length === 0) {
          const stored = getStoredCities();
          setCities(stored);
          setSelectedCity(stored[0] || null);
        } else {
          const allLandmarks = landmarksRes.data || [];
          const enriched: City[] = citiesRes.data.map((c) => {
            let mapEmbedUrl = DEFAULT_MAP_URL;
            let coordinates = DEFAULT_COORDINATES;

            if (c.image_url) {
              try {
                const parsed = JSON.parse(c.image_url);
                if (parsed.map_url) mapEmbedUrl = parsed.map_url;
                if (parsed.coordinates) coordinates = parsed.coordinates;
              } catch {
                if (
                  c.image_url.startsWith("http") &&
                  (c.image_url.includes("google.com/maps") || c.image_url.includes("embed"))
                ) {
                  mapEmbedUrl = c.image_url;
                }
              }
            }

            return {
              id: c.id,
              name: c.name,
              description: c.description,
              cover_image: c.cover_image || "/images/hanoi-banner.jpg",
              image_url: c.image_url,
              map_embed_url: mapEmbedUrl,
              coordinates: coordinates,
              landmarks: allLandmarks
                .filter((lm) => lm.city_id === c.id)
                .map((lm) => ({
                  id: lm.id,
                  name: lm.name,
                  story: lm.story,
                  history: lm.history,
                  travel_timeline: lm.travel_timeline || "Tham quan tự do",
                  food_suggestions: lm.food_suggestions || "Đặc sản địa phương",
                  images: Array.isArray(lm.images)
                    ? lm.images
                    : lm.images
                    ? [lm.images]
                    : ["/images/landmarks/ho-guom.jpg"],
                })),
            };
          });
          setCities(enriched);
          // Preserve currently selected city or default to first
          setSelectedCity((prev) => {
            if (prev) {
              const matched = enriched.find((c) => c.id === prev.id);
              if (matched) return matched;
            }
            return enriched[0] || null;
          });
          saveStoredCities(enriched);
        }
      } catch {
        if (!ignore) {
          const stored = getStoredCities();
          setCities(stored);
          setSelectedCity(stored[0] || null);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadCities();
    return () => {
      ignore = true;
    };
  }, [refreshIndex]);

  // ==================== CITY CRUD ====================

  // 1. Thêm thành phố
  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim()) return;

    let newCityId = `c-${Date.now()}`;
    const cleanedMap = cleanMapUrl(cityMapUrl) || DEFAULT_MAP_URL;
    const finalCoords = cityCoordinates.trim() || DEFAULT_COORDINATES;
    const mapPayload = JSON.stringify({
      map_url: cleanedMap,
      coordinates: finalCoords,
    });
    const coverImg = cityCover.trim() || "/images/hanoi-banner.jpg";

    try {
      const { data, error } = await supabase
        .from("cities")
        .insert({
          name: cityName.trim(),
          description: cityDesc.trim(),
          cover_image: coverImg,
          image_url: mapPayload,
        })
        .select()
        .single();
      if (!error && data) {
        newCityId = data.id;
      }
    } catch {
      // fallback
    }

    const newCity: City = {
      id: newCityId,
      name: cityName.trim(),
      description: cityDesc.trim(),
      cover_image: coverImg,
      image_url: mapPayload,
      map_embed_url: cleanedMap,
      coordinates: finalCoords,
      landmarks: [],
    };

    setCities((prev) => {
      const updated = [...prev, newCity];
      saveStoredCities(updated);
      return updated;
    });
    setSelectedCity(newCity);
    setIsCityModalOpen(false);
    setCityName("");
    setCityDesc("");
    setCityCover("/images/hanoi-banner.jpg");
    setCityMapUrl(DEFAULT_MAP_URL);
    setCityCoordinates(DEFAULT_COORDINATES);
    setMessage({ type: "success", text: `Đã thêm thành phố "${newCity.name}" thành công!` });
  };

  // 2. Chỉnh sửa thành phố
  const handleOpenEditCity = () => {
    if (!selectedCity) return;
    setEditingCityName(selectedCity.name);
    setEditingCityDesc(selectedCity.description || "");
    setEditingCityCover(selectedCity.cover_image || "/images/hanoi-banner.jpg");
    setEditingCityMapUrl(selectedCity.map_embed_url || DEFAULT_MAP_URL);
    setEditingCityCoordinates(selectedCity.coordinates || DEFAULT_COORDINATES);
    setIsEditCityModalOpen(true);
  };

  const handleUpdateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity || !editingCityName.trim()) return;

    const cleanedMap = cleanMapUrl(editingCityMapUrl) || selectedCity.map_embed_url || DEFAULT_MAP_URL;
    const finalCoords = editingCityCoordinates.trim() || selectedCity.coordinates || DEFAULT_COORDINATES;
    const mapPayload = JSON.stringify({
      map_url: cleanedMap,
      coordinates: finalCoords,
    });
    const coverImg = editingCityCover.trim() || selectedCity.cover_image || "/images/hanoi-banner.jpg";

    try {
      await supabase
        .from("cities")
        .update({
          name: editingCityName.trim(),
          description: editingCityDesc.trim(),
          cover_image: coverImg,
          image_url: mapPayload,
        })
        .eq("id", selectedCity.id);
    } catch {
      // fallback
    }

    const updatedCity: City = {
      ...selectedCity,
      name: editingCityName.trim(),
      description: editingCityDesc.trim(),
      cover_image: coverImg,
      image_url: mapPayload,
      map_embed_url: cleanedMap,
      coordinates: finalCoords,
    };

    setCities((prev) => {
      const updated = prev.map((c) => (c.id === selectedCity.id ? updatedCity : c));
      saveStoredCities(updated);
      return updated;
    });
    setSelectedCity(updatedCity);
    setIsEditCityModalOpen(false);
    setMessage({ type: "success", text: `Đã cập nhật thông tin và bản đồ thành phố "${updatedCity.name}"!` });
  };

  // 3. Xóa thành phố
  const handleDeleteCity = async () => {
    if (!selectedCity) return;
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa thành phố "${selectedCity.name}" cùng tất cả các địa danh trực thuộc?`
      )
    )
      return;

    try {
      // Delete landmarks first then city
      await supabase.from("landmarks").delete().eq("city_id", selectedCity.id);
      await supabase.from("cities").delete().eq("id", selectedCity.id);
    } catch {
      // fallback
    }

    setCities((prev) => {
      const updated = prev.filter((c) => c.id !== selectedCity.id);
      saveStoredCities(updated);
      setSelectedCity(updated[0] || null);
      return updated;
    });
    setMessage({ type: "success", text: `Đã xóa thành phố "${selectedCity.name}".` });
  };

  // ==================== LANDMARK CRUD ====================

  // 1. Thêm địa danh
  const handleAddLandmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity || !lmName.trim()) return;

    let newLmId = `lm-${Date.now()}`;
    const landmarkImg = lmImage.trim() || "/images/landmarks/ho-guom.jpg";
    try {
      const { data, error } = await supabase
        .from("landmarks")
        .insert({
          city_id: selectedCity.id,
          name: lmName.trim(),
          story: lmStory.trim(),
          history: lmHistory.trim() || lmStory.trim(),
          travel_timeline: lmTimeline.trim(),
          food_suggestions: lmFood.trim(),
          images: [landmarkImg],
          order_index: (selectedCity.landmarks?.length || 0) + 1,
        })
        .select()
        .single();
      if (!error && data) {
        newLmId = data.id;
      }
    } catch {
      // fallback
    }

    const newLm: Landmark = {
      id: newLmId,
      name: lmName.trim(),
      story: lmStory.trim(),
      history: lmHistory.trim() || lmStory.trim(),
      travel_timeline: lmTimeline.trim() || "Tham quan tự do",
      food_suggestions: lmFood.trim() || "Đặc sản địa phương",
      images: [landmarkImg],
    };

    setCities((prev) => {
      const updated = prev.map((c) =>
        c.id === selectedCity.id
          ? { ...c, landmarks: [...(c.landmarks || []), newLm] }
          : c
      );
      saveStoredCities(updated);
      return updated;
    });

    setSelectedCity((prev) =>
      prev ? { ...prev, landmarks: [...(prev.landmarks || []), newLm] } : null
    );

    setIsLandmarkModalOpen(false);
    setLmName("");
    setLmStory("");
    setLmHistory("");
    setLmTimeline("");
    setLmFood("");
    setLmImage("");
    setMessage({ type: "success", text: `Đã thêm địa danh "${newLm.name}"!` });
  };

  // 2. Chỉnh sửa địa danh
  const handleOpenEditLandmark = (lm: Landmark) => {
    setEditingLandmark(lm);
    setEditLmName(lm.name);
    setEditLmStory(lm.story || "");
    setEditLmHistory(lm.history || "");
    setEditLmTimeline(lm.travel_timeline || "");
    setEditLmFood(lm.food_suggestions || "");
    setEditLmImage((lm.images && lm.images[0]) || "");
    setIsEditLandmarkModalOpen(true);
  };

  const handleUpdateLandmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity || !editingLandmark || !editLmName.trim()) return;

    const landmarkImg = editLmImage.trim() || (editingLandmark.images && editingLandmark.images[0]) || "/images/landmarks/ho-guom.jpg";

    try {
      await supabase
        .from("landmarks")
        .update({
          name: editLmName.trim(),
          story: editLmStory.trim(),
          history: editLmHistory.trim() || editLmStory.trim(),
          travel_timeline: editLmTimeline.trim(),
          food_suggestions: editLmFood.trim(),
          images: [landmarkImg],
        })
        .eq("id", editingLandmark.id);
    } catch {
      // fallback
    }

    const updatedLm: Landmark = {
      ...editingLandmark,
      name: editLmName.trim(),
      story: editLmStory.trim(),
      history: editLmHistory.trim() || editLmStory.trim(),
      travel_timeline: editLmTimeline.trim(),
      food_suggestions: editLmFood.trim(),
      images: [landmarkImg],
    };

    setCities((prev) => {
      const updated = prev.map((c) =>
        c.id === selectedCity.id
          ? {
              ...c,
              landmarks: (c.landmarks || []).map((l) =>
                l.id === editingLandmark.id ? updatedLm : l
              ),
            }
          : c
      );
      saveStoredCities(updated);
      return updated;
    });

    setSelectedCity((prev) =>
      prev
        ? {
            ...prev,
            landmarks: (prev.landmarks || []).map((l) =>
              l.id === editingLandmark.id ? updatedLm : l
            ),
          }
        : null
    );

    setIsEditLandmarkModalOpen(false);
    setEditingLandmark(null);
    setMessage({ type: "success", text: `Đã cập nhật địa danh "${updatedLm.name}"!` });
  };

  // 3. Xóa địa danh
  const handleDeleteLandmark = async (lmId: string, lmName: string) => {
    if (!selectedCity) return;
    if (!confirm(`Bạn có chắc chắn muốn xóa địa danh "${lmName}"?`)) return;

    try {
      await supabase.from("landmarks").delete().eq("id", lmId);
    } catch {
      // fallback
    }

    setCities((prev) => {
      const updated = prev.map((c) =>
        c.id === selectedCity.id
          ? { ...c, landmarks: (c.landmarks || []).filter((l) => l.id !== lmId) }
          : c
      );
      saveStoredCities(updated);
      return updated;
    });

    setSelectedCity((prev) =>
      prev
        ? {
            ...prev,
            landmarks: (prev.landmarks || []).filter((l) => l.id !== lmId),
          }
        : null
    );

    setMessage({ type: "success", text: `Đã xóa địa danh "${lmName}".` });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-900">
            Quản Lý Thành Phố & Địa Danh Văn Hóa
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            CRUD đầy đủ: Thêm, sửa, xóa thành phố và địa danh di sản, lịch trình di chuyển và gợi ý ẩm thực.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsLoading(true);
              setRefreshIndex((prev) => prev + 1);
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Tải lại</span>
          </button>

          <button
            onClick={() => setIsCityModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111] hover:bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm thành phố</span>
          </button>
        </div>
      </div>

      {/* Alert */}
      {message && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm animate-fade-in ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* City Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {cities.map((city) => (
          <button
            key={city.id}
            onClick={() => setSelectedCity(city)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex-shrink-0 cursor-pointer border ${
              selectedCity?.id === city.id
                ? "bg-black text-white border-black shadow-xs"
                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 inline-block mr-1.5" />
            <span>{city.name}</span>
            <span className="ml-1.5 text-[10px] opacity-70">
              ({city.landmarks?.length || 0})
            </span>
          </button>
        ))}
      </div>

      {/* Selected City Details & Landmarks */}
      {selectedCity && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* City Info Card */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold uppercase">
                  Thành phố di sản
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleOpenEditCity}
                    className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-md transition"
                    title="Chỉnh sửa thông tin & bản đồ số"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleDeleteCity}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition"
                    title="Xóa thành phố này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Cover Banner Thumbnail */}
              {selectedCity.cover_image && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                  <img
                    src={selectedCity.cover_image}
                    alt={selectedCity.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                    <span className="text-white text-xs font-bold uppercase tracking-wider drop-shadow-sm">
                      {selectedCity.name}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-xl font-extrabold text-neutral-900 mb-1.5">
                  {selectedCity.name}
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-4">
                  {selectedCity.description || "Chưa có mô tả cho thành phố này."}
                </p>
              </div>

              {/* Digital Map Metadata Badge */}
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-neutral-700">
                  <MapPin className="w-3.5 h-3.5 text-black" />
                  <span>Bản đồ di sản số</span>
                </div>
                <div className="text-neutral-500 font-mono text-[10px] truncate">
                  Tọa độ: {selectedCity.coordinates || DEFAULT_COORDINATES}
                </div>
                {selectedCity.map_embed_url && (
                  <div className="text-emerald-700 font-medium text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Đã kết nối link nhúng Google Maps</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 mt-6 space-y-2">
              <button
                onClick={handleOpenEditCity}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa văn hóa & Bản đồ số</span>
              </button>
              <button
                onClick={() => setIsLandmarkModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm địa danh vào {selectedCity.name}</span>
              </button>
            </div>
          </div>

          {/* Landmarks List */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              <span>Danh sách địa danh thuộc {selectedCity.name}</span>
              <span>{selectedCity.landmarks?.length || 0} điểm đến</span>
            </div>

            {selectedCity.landmarks?.length === 0 ? (
              <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 text-center text-neutral-400 text-xs">
                Chưa có địa danh nào thuộc thành phố này. Bấm nút Thêm địa danh để bắt đầu.
              </div>
            ) : (
              selectedCity.landmarks?.map((lm) => (
                <div
                  key={lm.id}
                  className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5 shadow-xs hover:border-black/30 transition text-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {lm.images && lm.images.length > 0 ? (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 border border-neutral-200">
                          <img
                            src={lm.images[0]}
                            alt={lm.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-neutral-100 text-neutral-800 flex-shrink-0">
                          <Compass className="w-4 h-4" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-sm text-neutral-900">{lm.name}</h3>
                        <p className="text-neutral-600 leading-relaxed mt-1 line-clamp-2">{lm.story}</p>
                        {lm.history && (
                          <p className="text-neutral-500 text-[11px] mt-1 line-clamp-1 italic">
                            Kiến trúc & Lịch sử: {lm.history}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleOpenEditLandmark(lm)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition"
                        title="Chỉnh sửa địa danh"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLandmark(lm.id, lm.name)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition"
                        title="Xóa địa danh"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-neutral-100 text-[11px]">
                    <div className="flex items-center gap-1.5 text-neutral-500">
                      <Clock className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <span className="truncate">Lịch trình: {lm.travel_timeline}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-neutral-500">
                      <Utensils className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <span className="truncate">Ẩm thực: {lm.food_suggestions}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal 1: Thêm Thành Phố Mới (Rộng Rãi & Bản Đồ Số) */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-neutral-100 rounded-lg text-black">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base uppercase tracking-tight text-black">
                    Thêm Thành Phố Di Sản & Cấu Hình Bản Đồ Số
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Nhập bản sắc văn hóa và liên kết tọa độ Google Maps hiển thị ở trang Khám phá & NFC.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCityModalOpen(false)}
                className="p-1.5 rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCity} className="p-6 space-y-6 text-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Cột trái: Văn hóa & Mô tả (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                      Tên thành phố di sản *
                    </label>
                    <input
                      type="text"
                      required
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                      placeholder="Ví dụ: Đà Nẵng, Huế, Hải Phòng, TP. Hồ Chí Minh"
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                      Đường dẫn ảnh bìa thành phố (Cover Banner)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cityCover}
                        onChange={(e) => setCityCover(e.target.value)}
                        placeholder="Ví dụ: /images/hanoi-banner.jpg hoặc https://..."
                        className="flex-1 px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-xs"
                      />
                      {cityCover && (
                        <div className="w-12 h-10 rounded-md overflow-hidden bg-neutral-100 border border-neutral-300 flex-shrink-0">
                          <img src={cityCover} alt="Cover preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-bold uppercase tracking-wider text-neutral-800">
                        Mô tả bản sắc văn hóa & cảm hứng thiết kế *
                      </label>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {cityDesc.length} ký tự
                      </span>
                    </div>
                    <textarea
                      rows={7}
                      required
                      value={cityDesc}
                      onChange={(e) => setCityDesc(e.target.value)}
                      placeholder="Mô tả sâu sắc về lịch sử, nhịp sống, kiến trúc cổ, âm hưởng đường phố và tinh thần chiếc áo đại diện cho thành phố này..."
                      className="w-full px-3.5 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm leading-relaxed"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Khu vực viết văn mở rộng: Thoải mái trình bày câu chuyện di sản, văn hóa ẩm thực và chiều sâu câu chuyện thương hiệu.
                    </p>
                  </div>
                </div>

                {/* Cột phải: Bản đồ số di sản (5 cols) */}
                <div className="lg:col-span-5 bg-neutral-50 border border-neutral-200 rounded-xl p-4.5 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-black flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-black" />
                      Cấu hình Bản đồ số
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCityMapUrl(DEFAULT_MAP_URL);
                        setCityCoordinates(DEFAULT_COORDINATES);
                      }}
                      className="text-[11px] font-bold text-neutral-600 hover:text-black underline cursor-pointer"
                    >
                      Mẫu Hà Nội
                    </button>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Tọa độ địa lý (Coordinates)
                    </label>
                    <input
                      type="text"
                      value={cityCoordinates}
                      onChange={(e) => setCityCoordinates(e.target.value)}
                      placeholder="Ví dụ: 21.0285°N, 105.8542°E"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-mono text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Link nhúng Google Maps iframe (Embed URL)
                    </label>
                    <textarea
                      rows={3}
                      value={cityMapUrl}
                      onChange={(e) => setCityMapUrl(e.target.value)}
                      placeholder="Dán link https://www.google.com/maps/embed?... hoặc dán cả thẻ <iframe>"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-xs font-mono bg-white"
                    />
                    <p className="text-[10px] text-neutral-500 mt-1">
                      Mẹo: Vào Google Maps → Chia sẻ → Nhúng bản đồ → Sao chép HTML rồi dán vào đây (hệ thống tự động lọc URL sạch).
                    </p>
                  </div>

                  {/* Live Map Preview */}
                  {cleanMapUrl(cityMapUrl) && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                        Xem trước bản đồ trực tiếp:
                      </span>
                      <div className="relative w-full h-36 rounded-lg overflow-hidden border border-neutral-300 bg-neutral-200">
                        <iframe
                          src={cleanMapUrl(cityMapUrl)}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen={false}
                          loading="lazy"
                          title="Xem trước bản đồ số"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCityModalOpen(false)}
                  className="px-5 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold uppercase tracking-wider"
                >
                  Lưu thành phố & bản đồ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Chỉnh Sửa Thành Phố (Rộng Rãi & Bản Đồ Số) */}
      {isEditCityModalOpen && selectedCity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-neutral-100 rounded-lg text-black">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base uppercase tracking-tight text-black">
                    Chỉnh Sửa Bản Sắc & Bản Đồ Số: {selectedCity.name}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Cập nhật mô tả chi tiết, hình ảnh và tọa độ bản đồ hiển thị ra ngoài giao diện khách hàng.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditCityModalOpen(false)}
                className="p-1.5 rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCity} className="p-6 space-y-6 text-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Cột trái: Văn hóa & Mô tả rộng rãi (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                      Tên thành phố *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCityName}
                      onChange={(e) => setEditingCityName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                      Đường dẫn ảnh bìa thành phố (Cover Banner)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingCityCover}
                        onChange={(e) => setEditingCityCover(e.target.value)}
                        placeholder="Ví dụ: /images/hanoi-banner.jpg hoặc https://..."
                        className="flex-1 px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-xs"
                      />
                      {editingCityCover && (
                        <div className="w-12 h-10 rounded-md overflow-hidden bg-neutral-100 border border-neutral-300 flex-shrink-0">
                          <img src={editingCityCover} alt="Cover preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-bold uppercase tracking-wider text-neutral-800">
                        Mô tả bản sắc văn hóa thành phố *
                      </label>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {editingCityDesc.length} ký tự
                      </span>
                    </div>
                    <textarea
                      rows={7}
                      required
                      value={editingCityDesc}
                      onChange={(e) => setEditingCityDesc(e.target.value)}
                      placeholder="Mô tả câu chuyện di sản, dấu ấn kiến trúc, ẩm thực truyền thống..."
                      className="w-full px-3.5 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm leading-relaxed"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Form mở rộng giúp bạn viết văn mạch lạc, dễ dàng chỉnh sửa các đoạn văn bản dài mà không bị che khuất.
                    </p>
                  </div>
                </div>

                {/* Cột phải: Bản đồ số di sản (5 cols) */}
                <div className="lg:col-span-5 bg-neutral-50 border border-neutral-200 rounded-xl p-4.5 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-black flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-black" />
                      Cấu hình Bản đồ số
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCityMapUrl(DEFAULT_MAP_URL);
                        setEditingCityCoordinates(DEFAULT_COORDINATES);
                      }}
                      className="text-[11px] font-bold text-neutral-600 hover:text-black underline cursor-pointer"
                    >
                      Mẫu Hà Nội
                    </button>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Tọa độ địa lý (Coordinates)
                    </label>
                    <input
                      type="text"
                      value={editingCityCoordinates}
                      onChange={(e) => setEditingCityCoordinates(e.target.value)}
                      placeholder="Ví dụ: 21.0285°N, 105.8542°E"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-mono text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Link nhúng Google Maps iframe (Embed URL)
                    </label>
                    <textarea
                      rows={3}
                      value={editingCityMapUrl}
                      onChange={(e) => setEditingCityMapUrl(e.target.value)}
                      placeholder="Dán link https://www.google.com/maps/embed?... hoặc dán cả thẻ <iframe>"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-xs font-mono bg-white"
                    />
                    <p className="text-[10px] text-neutral-500 mt-1">
                      Mẹo: Vào Google Maps → Chia sẻ → Nhúng bản đồ → Sao chép HTML rồi dán vào đây (hệ thống tự động lọc URL sạch).
                    </p>
                  </div>

                  {/* Live Map Preview */}
                  {cleanMapUrl(editingCityMapUrl) && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                        Xem trước bản đồ trực tiếp:
                      </span>
                      <div className="relative w-full h-36 rounded-lg overflow-hidden border border-neutral-300 bg-neutral-200">
                        <iframe
                          src={cleanMapUrl(editingCityMapUrl)}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen={false}
                          loading="lazy"
                          title="Xem trước bản đồ số"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditCityModalOpen(false)}
                  className="px-5 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold uppercase tracking-wider"
                >
                  Cập nhật thành phố & bản đồ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Thêm Địa Danh (Rộng rãi & Dễ viết) */}
      {isLandmarkModalOpen && selectedCity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-neutral-100 rounded-lg text-black">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base uppercase tracking-tight text-black">
                    Thêm Địa Danh Di Sản vào {selectedCity.name}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Cung cấp câu chuyện lịch sử, hình ảnh và kinh nghiệm tham quan thực tế.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLandmarkModalOpen(false)}
                className="p-1.5 rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLandmark} className="p-6 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                    Tên địa danh *
                  </label>
                  <input
                    type="text"
                    required
                    value={lmName}
                    onChange={(e) => setLmName(e.target.value)}
                    placeholder="Ví dụ: Cầu Rồng, Chùa Linh Ứng, Ngọ Môn..."
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                    Đường dẫn ảnh đại diện (URL hoặc /images/landmarks/...)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={lmImage}
                      onChange={(e) => setLmImage(e.target.value)}
                      placeholder="Ví dụ: /images/landmarks/ho-guom.jpg hoặc https://..."
                      className="flex-1 px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-xs"
                    />
                    {lmImage && (
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-100 border border-neutral-300 flex-shrink-0">
                        <img src={lmImage} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold uppercase tracking-wider text-neutral-800">
                    Câu chuyện di sản & tóm tắt ý nghĩa văn hóa
                  </label>
                  <span className="text-[11px] text-neutral-400 font-mono">{lmStory.length} ký tự</span>
                </div>
                <textarea
                  rows={4}
                  value={lmStory}
                  onChange={(e) => setLmStory(e.target.value)}
                  placeholder="Ý nghĩa văn hóa, truyền thuyết lịch sử hoặc nguồn gốc tên gọi của địa danh này..."
                  className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold uppercase tracking-wider text-neutral-800">
                    Kiến trúc & Dấu ấn lịch sử chi tiết (Hiển thị ở trang Khám phá di sản)
                  </label>
                  <span className="text-[11px] text-neutral-400 font-mono">{lmHistory.length} ký tự</span>
                </div>
                <textarea
                  rows={4}
                  value={lmHistory}
                  onChange={(e) => setLmHistory(e.target.value)}
                  placeholder="Năm xây dựng, triều đại, các đặc trưng kiến trúc độc đáo (mái vòm, hoa văn, vật liệu cổ...)..."
                  className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                    Lịch trình di chuyển & thời điểm lý tưởng
                  </label>
                  <input
                    type="text"
                    value={lmTimeline}
                    onChange={(e) => setLmTimeline(e.target.value)}
                    placeholder="Ví dụ: Sáng sớm (5:30 - 7:00) hoặc tối cuối tuần..."
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                    Gợi ý quán ăn / ẩm thực lân cận
                  </label>
                  <input
                    type="text"
                    value={lmFood}
                    onChange={(e) => setLmFood(e.target.value)}
                    placeholder="Ví dụ: Kem Tràng Tiền, Cà phê Đinh, Nộm bò khô..."
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLandmarkModalOpen(false)}
                  className="px-5 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold uppercase tracking-wider"
                >
                  Lưu địa danh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Chỉnh Sửa Địa Danh (Rộng rãi & Dễ viết) */}
      {isEditLandmarkModalOpen && editingLandmark && selectedCity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-neutral-100 rounded-lg text-black">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base uppercase tracking-tight text-black">
                    Chỉnh Sửa Địa Danh: {editingLandmark.name}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Cập nhật nội dung, kiến trúc và hình ảnh của điểm đến thuộc {selectedCity.name}.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditLandmarkModalOpen(false);
                  setEditingLandmark(null);
                }}
                className="p-1.5 rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateLandmark} className="p-6 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                    Tên địa danh *
                  </label>
                  <input
                    type="text"
                    required
                    value={editLmName}
                    onChange={(e) => setEditLmName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                    Đường dẫn ảnh đại diện (URL hoặc /images/landmarks/...)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editLmImage}
                      onChange={(e) => setEditLmImage(e.target.value)}
                      placeholder="Ví dụ: /images/landmarks/ho-guom.jpg hoặc https://..."
                      className="flex-1 px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-xs"
                    />
                    {editLmImage && (
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-100 border border-neutral-300 flex-shrink-0">
                        <img src={editLmImage} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold uppercase tracking-wider text-neutral-800">
                    Câu chuyện di sản & tóm tắt ý nghĩa văn hóa
                  </label>
                  <span className="text-[11px] text-neutral-400 font-mono">{editLmStory.length} ký tự</span>
                </div>
                <textarea
                  rows={4}
                  value={editLmStory}
                  onChange={(e) => setEditLmStory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold uppercase tracking-wider text-neutral-800">
                    Kiến trúc & Dấu ấn lịch sử chi tiết (Hiển thị ở trang Khám phá)
                  </label>
                  <span className="text-[11px] text-neutral-400 font-mono">{editLmHistory.length} ký tự</span>
                </div>
                <textarea
                  rows={4}
                  value={editLmHistory}
                  onChange={(e) => setEditLmHistory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                    Lịch trình di chuyển & thời điểm lý tưởng
                  </label>
                  <input
                    type="text"
                    value={editLmTimeline}
                    onChange={(e) => setEditLmTimeline(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                    Gợi ý quán ăn / ẩm thực lân cận
                  </label>
                  <input
                    type="text"
                    value={editLmFood}
                    onChange={(e) => setEditLmFood(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditLandmarkModalOpen(false);
                    setEditingLandmark(null);
                  }}
                  className="px-5 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold uppercase tracking-wider"
                >
                  Cập nhật địa danh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
