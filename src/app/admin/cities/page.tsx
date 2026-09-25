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
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Landmark {
  id: string;
  name: string;
  story: string | null;
  travel_timeline: string | null;
  food_suggestions: string | null;
}

interface City {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  landmarks?: Landmark[];
}

const mockDefaultCities: City[] = [
  {
    id: "c-hn",
    name: "Hà Nội",
    description: "Thủ đô nghìn năm văn hiến, nét trầm mặc của 36 phố phường và Hồ Gươm cổ kính.",
    image_url: "/images/hanoi-banner.jpg",
    landmarks: [
      {
        id: "lm-1",
        name: "Hồ Gươm & Tháp Rùa",
        story: "Trái tim của thủ đô gắn liền truyền thuyết vua Lê Lợi trả gươm báu.",
        travel_timeline: "Khám phá từ 6:00 sáng hoặc đi dạo phố đi bộ cuối tuần.",
        food_suggestions: "Kem Tràng Tiền, Cà phê trứng Giảng",
      },
      {
        id: "lm-2",
        name: "Văn Miếu Quốc Tử Giám",
        story: "Trường đại học đầu tiên của Việt Nam, biểu tượng truyền thống hiếu học.",
        travel_timeline: "Nên đi buổi sáng từ 8:00 - 11:30 để chụp ảnh đẹp.",
        food_suggestions: "Bún chả Sinh Từ, Phở Bát Đàn",
      },
      {
        id: "lm-3",
        name: "Phố Cổ Hà Nội (36 Phố Phường)",
        story: "Mê cung những con phố nghề truyền thống mang đậm nét kinh kỳ.",
        travel_timeline: "Buổi chiều tối dạo ngắm đèn lồng và ẩm thực vỉa hè.",
        food_suggestions: "Chả cá Lã Vọng, Bún thang Cầu Gỗ",
      },
    ],
  },
  {
    id: "c-hue",
    name: "Cố Đô Huế",
    description: "Cố đô thơ mộng bên dòng sông Hương, lưu giữ nét đẹp cung đình triều Nguyễn.",
    image_url: "/images/hue-banner.jpg",
    landmarks: [
      {
        id: "lm-4",
        name: "Đại Nội Kinh Thành Huế",
        story: "Quần thể di tích cung điện vàng son triều Nguyễn.",
        travel_timeline: "Buổi chiều 14:00 - 17:00 ngắm hoàng hôn Ngọ Môn.",
        food_suggestions: "Bún bò Huế Mụ Rơi, Bánh bèo nậm lọc",
      },
    ],
  },
  {
    id: "c-hoian",
    name: "Hội An",
    description: "Phố cổ đèn lồng vàng son, di sản văn hóa thế giới bên dòng sông Hoài.",
    image_url: "/images/hoian-banner.jpg",
    landmarks: [
      {
        id: "lm-5",
        name: "Chùa Cầu & Sông Hoài",
        story: "Cây cầu cổ kính biểu tượng giao thương Nhật - Việt thế kỷ 17.",
        travel_timeline: "Đẹp nhất từ 17:30 khi cả phố cổ thắp đèn lồng.",
        food_suggestions: "Cao lầu Thanh, Bánh mì Phượng",
      },
    ],
  },
];

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

  // Modal Add Landmark
  const [isLandmarkModalOpen, setIsLandmarkModalOpen] = useState(false);
  const [lmName, setLmName] = useState("");
  const [lmStory, setLmStory] = useState("");
  const [lmTimeline, setLmTimeline] = useState("");
  const [lmFood, setLmFood] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCities() {
      try {
        const { data, error } = await supabase.from("cities").select("*");

        if (ignore) return;

        if (error || !data || data.length === 0) {
          setCities(mockDefaultCities);
          setSelectedCity(mockDefaultCities[0]);
        } else {
          const enriched: City[] = data.map((c) => ({
            ...c,
            landmarks: mockDefaultCities.find((mc) => mc.name === c.name)?.landmarks || [],
          }));
          setCities(enriched);
          setSelectedCity(enriched[0]);
        }
      } catch {
        if (!ignore) {
          setCities(mockDefaultCities);
          setSelectedCity(mockDefaultCities[0]);
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

  // Thêm thành phố
  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim()) return;

    const newCity: City = {
      id: `c-${Date.now()}`,
      name: cityName.trim(),
      description: cityDesc,
      image_url: "/images/hanoi-banner.jpg",
      landmarks: [],
    };

    setCities((prev) => [...prev, newCity]);
    setSelectedCity(newCity);
    setIsCityModalOpen(false);
    setCityName("");
    setCityDesc("");
    setMessage({ type: "success", text: `Đã thêm thành phố "${newCity.name}" thành công!` });
  };

  // Thêm địa danh
  const handleAddLandmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity || !lmName.trim()) return;

    const newLm: Landmark = {
      id: `lm-${Date.now()}`,
      name: lmName.trim(),
      story: lmStory,
      travel_timeline: lmTimeline,
      food_suggestions: lmFood,
    };

    setCities((prev) =>
      prev.map((c) =>
        c.id === selectedCity.id
          ? { ...c, landmarks: [...(c.landmarks || []), newLm] }
          : c
      )
    );

    setSelectedCity((prev) =>
      prev ? { ...prev, landmarks: [...(prev.landmarks || []), newLm] } : null
    );

    setIsLandmarkModalOpen(false);
    setLmName("");
    setLmStory("");
    setLmTimeline("");
    setLmFood("");
    setMessage({ type: "success", text: `Đã thêm địa danh "${newLm.name}"!` });
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
            Mở rộng bản đồ du lịch di sản, thêm địa danh, lịch trình di chuyển và gợi ý ẩm thực cho trang trải nghiệm NFC.
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
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold uppercase mb-2">
                Thành phố du lịch
              </div>
              <h2 className="text-xl font-extrabold text-neutral-900 mb-2">
                {selectedCity.name}
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {selectedCity.description || "Chưa có mô tả cho thành phố này."}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 mt-6">
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
                  className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-xs hover:border-black/30 transition text-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-neutral-100 text-neutral-800">
                        <Compass className="w-4 h-4" />
                      </div>
                      <h3 className="font-extrabold text-sm text-neutral-900">{lm.name}</h3>
                    </div>
                  </div>

                  <p className="text-neutral-600 leading-relaxed">
                    {lm.story}
                  </p>

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

      {/* Modal Thêm Thành Phố */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wider text-black">
                Thêm Thành Phố Di Sản Mới
              </h3>
              <button
                onClick={() => setIsCityModalOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCity} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Tên thành phố *
                </label>
                <input
                  type="text"
                  required
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  placeholder="Ví dụ: Đà Nẵng hoặc Sài Gòn"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Mô tả bản sắc văn hóa thành phố
                </label>
                <textarea
                  rows={3}
                  value={cityDesc}
                  onChange={(e) => setCityDesc(e.target.value)}
                  placeholder="Văn hóa ẩm thực, địa danh nổi tiếng, dấu ấn lịch sử..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCityModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold uppercase tracking-wider"
                >
                  Lưu thành phố
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Thêm Địa Danh */}
      {isLandmarkModalOpen && selectedCity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wider text-black">
                Thêm Địa Danh vào {selectedCity.name}
              </h3>
              <button
                onClick={() => setIsLandmarkModalOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLandmark} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Tên địa danh *
                </label>
                <input
                  type="text"
                  required
                  value={lmName}
                  onChange={(e) => setLmName(e.target.value)}
                  placeholder="Ví dụ: Cầu Rồng hoặc Chùa Linh Ứng"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Câu chuyện lịch sử / văn hóa
                </label>
                <textarea
                  rows={2}
                  value={lmStory}
                  onChange={(e) => setLmStory(e.target.value)}
                  placeholder="Ý nghĩa văn hóa, truyền thuyết hoặc nguồn gốc..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Lịch trình di chuyển gợi ý
                </label>
                <input
                  type="text"
                  value={lmTimeline}
                  onChange={(e) => setLmTimeline(e.target.value)}
                  placeholder="Ví dụ: Nên tham quan lúc 21:00 tối để xem cầu phun lửa..."
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Gợi ý quán ăn / ẩm thực lân cận
                </label>
                <input
                  type="text"
                  value={lmFood}
                  onChange={(e) => setLmFood(e.target.value)}
                  placeholder="Ví dụ: Mì Quảng Bà Mua, Bánh tráng cuốn thịt heo..."
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLandmarkModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold uppercase tracking-wider"
                >
                  Lưu địa danh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
