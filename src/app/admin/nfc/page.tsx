"use client";

import { useEffect, useState } from "react";
import {
  QrCode,
  Plus,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface NfcTag {
  id: string;
  nfc_code: string;
  product_id: string | null;
  city_id: string | null;
  scan_count: number;
  experience_url: string;
  created_at: string;
  product_name?: string;
  city_name?: string;
}

const mockDefaultTags: NfcTag[] = [
  {
    id: "nfc-1",
    nfc_code: "VCW-HN-001",
    product_id: "p1",
    product_name: "Áo Thun Hà Nội Phố — Signature Tee",
    city_id: "c1",
    city_name: "Hà Nội",
    scan_count: 142,
    experience_url: "/explore/hanoi",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "nfc-2",
    nfc_code: "VCW-HUE-001",
    product_id: "p2",
    product_name: "Áo Thun Cố Đô Huế — Heritage Tee",
    city_id: "c2",
    city_name: "Huế",
    scan_count: 89,
    experience_url: "/explore/hue",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "nfc-3",
    nfc_code: "VCW-HOIAN-001",
    product_id: "p3",
    product_name: "Áo Thun Phố Hội Đèn Lồng — Golden Ancient Tee",
    city_id: "c3",
    city_name: "Hội An",
    scan_count: 215,
    experience_url: "/explore/hoian",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
];

export default function AdminNfcPage() {
  const [tags, setTags] = useState<NfcTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nfc_code: "",
    experience_url: "/explore/hanoi",
    product_name: "Áo Thun Hà Nội Phố — Signature Tee",
    city_name: "Hà Nội",
  });

  useEffect(() => {
    let ignore = false;

    async function loadNfcTags() {
      try {
        const { data, error } = await supabase
          .from("nfc_tags")
          .select("*")
          .order("created_at", { ascending: false });

        if (ignore) return;

        if (error || !data || data.length === 0) {
          setTags(mockDefaultTags);
        } else {
          const enriched: NfcTag[] = data.map((t) => ({
            ...t,
            product_name: "Áo Thun Văn Hóa (NFC)",
            city_name: "Hà Nội",
          }));
          setTags(enriched);
        }
      } catch {
        if (!ignore) {
          setTags(mockDefaultTags);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadNfcTags();
    return () => {
      ignore = true;
    };
  }, [refreshIndex]);

  // Giả lập quét thẻ NFC
  const handleSimulateScan = async (id: string, nfc_code: string) => {
    try {
      setTags((prev) =>
        prev.map((t) => (t.id === id ? { ...t, scan_count: t.scan_count + 1 } : t))
      );
      setMessage({
        type: "success",
        text: `Đã mô phỏng 1 lượt chạm NFC vào thẻ "${nfc_code}"! Lượt quét đã tăng.`,
      });
    } catch {
      // ignore
    }
  };

  // Thêm thẻ NFC mới
  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const newTag: NfcTag = {
        id: `nfc-${Date.now()}`,
        nfc_code: formData.nfc_code.toUpperCase().trim(),
        product_id: null,
        city_id: null,
        scan_count: 0,
        experience_url: formData.experience_url,
        product_name: formData.product_name,
        city_name: formData.city_name,
        created_at: new Date().toISOString(),
      };

      setTags((prev) => [newTag, ...prev]);
      setMessage({ type: "success", text: `Đã tạo mã thẻ NFC "${newTag.nfc_code}" thành công!` });
      setIsModalOpen(false);
      setFormData({
        nfc_code: "",
        experience_url: "/explore/hanoi",
        product_name: "Áo Thun Hà Nội Phố — Signature Tee",
        city_name: "Hà Nội",
      });
    } catch {
      setMessage({ type: "error", text: "Không thể tạo mã thẻ NFC." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xóa thẻ NFC
  const handleDeleteTag = async (id: string, code: string) => {
    if (!confirm(`Bạn có chắc muốn xóa mã thẻ NFC "${code}"?`)) return;
    setTags((prev) => prev.filter((t) => t.id !== id));
    setMessage({ type: "success", text: `Đã xóa mã thẻ NFC "${code}".` });
  };

  const totalScans = tags.reduce((acc, curr) => acc + (curr.scan_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-900">
            Quản Lý Thẻ Chip NFC & Trải Nghiệm Văn Hóa
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Gán chip NFC vào móc khóa áo, cấu hình trang đích hiển thị câu chuyện di sản và theo dõi số lượt tương tác.
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
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111] hover:bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo mã NFC</span>
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

      {/* Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Tổng lượt chạm NFC (Scan Count)
          </span>
          <div className="text-2xl font-extrabold text-neutral-900 mt-1 flex items-center gap-2">
            <span>{totalScans} lượt</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Số chip NFC đang phát hành
          </span>
          <div className="text-2xl font-extrabold text-neutral-900 mt-1">
            {tags.length} thẻ
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Công nghệ tích hợp
          </span>
          <div className="text-2xl font-extrabold text-purple-700 mt-1">
            NFC NTAG213 / 215
          </div>
        </div>
      </div>

      {/* NFC Tags Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-[#E5E5E5] text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                <th className="py-3 px-4">Mã thẻ NFC</th>
                <th className="py-3 px-4">Sản phẩm áo liên kết</th>
                <th className="py-3 px-4">Thành phố</th>
                <th className="py-3 px-4">URL trang trải nghiệm</th>
                <th className="py-3 px-4">Lượt chạm (Scans)</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-600" />
                    Đang tải danh sách thẻ NFC...
                  </td>
                </tr>
              ) : tags.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-neutral-400">
                    Chưa có thẻ NFC nào được tạo.
                  </td>
                </tr>
              ) : (
                tags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-neutral-50/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200">
                        <QrCode className="w-3.5 h-3.5 text-neutral-700" />
                        <span>{tag.nfc_code}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-neutral-800">
                      {tag.product_name}
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                        {tag.city_name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-600 font-mono text-[11px]">
                      <span className="text-neutral-500 hover:text-black">
                        {tag.experience_url}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-sm text-neutral-900">
                        {tag.scan_count}
                      </span>{" "}
                      <span className="text-neutral-400 text-[10px]">lượt</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleSimulateScan(tag.id, tag.nfc_code)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold transition text-[11px]"
                          title="Thử chạm NFC ảo"
                        >
                          <Smartphone className="w-3 h-3" />
                          <span>Test Chạm</span>
                        </button>

                        <button
                          onClick={() => handleDeleteTag(tag.id, tag.nfc_code)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-neutral-400 hover:text-red-600 transition"
                          title="Xóa mã thẻ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tạo Mã NFC */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wider text-black">
                Tạo Mã Thẻ Chip NFC Mới
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTag} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Mã NFC Code (Khắc trên móc khóa) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nfc_code}
                  onChange={(e) =>
                    setFormData({ ...formData, nfc_code: e.target.value })
                  }
                  placeholder="Ví dụ: VCW-HN-002 hoặc VCW-DN-001"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black uppercase font-mono"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Sản phẩm áo gắn kèm *
                </label>
                <input
                  type="text"
                  required
                  value={formData.product_name}
                  onChange={(e) =>
                    setFormData({ ...formData, product_name: e.target.value })
                  }
                  placeholder="Ví dụ: Áo Thun Hà Nội Phố — Signature Tee"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Thành phố tương ứng *
                </label>
                <select
                  value={formData.city_name}
                  onChange={(e) =>
                    setFormData({ ...formData, city_name: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                >
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Huế">Huế</option>
                  <option value="Hội An">Hội An</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  URL mở trang trải nghiệm khi chạm điện thoại *
                </label>
                <input
                  type="text"
                  required
                  value={formData.experience_url}
                  onChange={(e) =>
                    setFormData({ ...formData, experience_url: e.target.value })
                  }
                  placeholder="/explore/hanoi"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-mono"
                />
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>Lưu mã thẻ</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
