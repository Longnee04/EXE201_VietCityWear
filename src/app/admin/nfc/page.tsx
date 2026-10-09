"use client";

import { useEffect, useState, useMemo } from "react";
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
  Edit3,
  ExternalLink,
  Copy,
  Check,
  Radio,
  BookOpen,
  Search,
  ShieldCheck,
  Cpu,
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

interface ProductOption {
  id: string;
  name: string;
}

interface CityOption {
  id: string;
  name: string;
}

export default function AdminNfcPage() {
  const [tags, setTags] = useState<NfcTag[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Modal Create State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    nfc_code: "",
    product_id: "",
    city_id: "",
    experience_url: "/explore/hanoi",
  });

  // Modal Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editForm, setEditForm] = useState<{
    id: string;
    nfc_code: string;
    product_id: string;
    city_id: string;
    experience_url: string;
    scan_count: number;
  }>({
    id: "",
    nfc_code: "",
    product_id: "",
    city_id: "",
    experience_url: "",
    scan_count: 0,
  });

  // Load Data directly from Supabase
  const loadData = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const [tagsRes, prodsRes, citiesRes] = await Promise.all([
        supabase.from("nfc_tags").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("id, name"),
        supabase.from("cities").select("id, name"),
      ]);

      const prodMap = new Map((prodsRes.data || []).map((p) => [p.id, p.name]));
      const cityMap = new Map((citiesRes.data || []).map((c) => [c.id, c.name]));

      setProducts(prodsRes.data || []);
      setCities(citiesRes.data || []);

      const rawTags = tagsRes.data || [];
      const enriched: NfcTag[] = rawTags.map((t) => ({
        ...t,
        product_name: t.product_id ? prodMap.get(t.product_id) || "Sản phẩm khác" : "Chưa gán áo",
        city_name: t.city_id ? cityMap.get(t.city_id) || "Khác" : "Chưa chọn",
      }));

      setTags(enriched);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu thẻ NFC:", err);
      setMessage({ type: "error", text: "Không thể kết nối đến Supabase để tải danh sách NFC." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => loadData());
  }, []);

  // Filtered Tags
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags;
    const q = searchQuery.toLowerCase();
    return tags.filter(
      (t) =>
        t.nfc_code.toLowerCase().includes(q) ||
        (t.product_name && t.product_name.toLowerCase().includes(q)) ||
        (t.city_name && t.city_name.toLowerCase().includes(q)) ||
        t.experience_url.toLowerCase().includes(q)
    );
  }, [tags, searchQuery]);

  // Total Scans
  const totalScans = useMemo(
    () => tags.reduce((acc, curr) => acc + (curr.scan_count || 0), 0),
    [tags]
  );

  // Copy Direct Link
  const handleCopyScanUrl = (nfcCode: string, id: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://vietcitywear.vercel.app";
    const fullUrl = `${origin}/n/${nfcCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
    setMessage({
      type: "success",
      text: `Đã sao chép link quét NFC: ${fullUrl} (Ghi link này vào chip NFC qua app NFC Tools)`,
    });
  };

  // Giả lập quét thẻ NFC (cập nhật trực tiếp lên Supabase)
  const handleSimulateScan = async (tag: NfcTag) => {
    const newCount = (tag.scan_count || 0) + 1;
    try {
      const { error } = await supabase
        .from("nfc_tags")
        .update({ scan_count: newCount })
        .eq("id", tag.id);

      if (error) throw error;

      setTags((prev) =>
        prev.map((t) => (t.id === tag.id ? { ...t, scan_count: newCount } : t))
      );

      setMessage({
        type: "success",
        text: `Mô phỏng 1 lượt chạm NFC vào "${tag.nfc_code}" thành công! Lượt quét Supabase hiện tại: ${newCount}.`,
      });
    } catch (err) {
      console.error("Lỗi khi mô phỏng lượt chạm:", err);
      setMessage({ type: "error", text: "Không thể cập nhật lượt quét lên Supabase." });
    }
  };

  // Thêm thẻ NFC mới lên Supabase
  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCreate(true);
    setMessage(null);

    const code = createForm.nfc_code.toUpperCase().trim();
    if (!code) {
      setMessage({ type: "error", text: "Vui lòng nhập mã NFC." });
      setIsSubmittingCreate(false);
      return;
    }

    try {
      const payload = {
        nfc_code: code,
        product_id: createForm.product_id ? createForm.product_id : null,
        city_id: createForm.city_id ? createForm.city_id : null,
        experience_url: createForm.experience_url.trim() || "/explore/hanoi",
        scan_count: 0,
      };

      const { data, error } = await supabase
        .from("nfc_tags")
        .insert(payload)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const prodName = products.find((p) => p.id === data.product_id)?.name || "Chưa gán áo";
      const cityName = cities.find((c) => c.id === data.city_id)?.name || "Chưa chọn";

      const newTag: NfcTag = {
        ...data,
        product_name: prodName,
        city_name: cityName,
      };

      setTags((prev) => [newTag, ...prev]);
      setMessage({
        type: "success",
        text: `Đã khởi tạo thẻ chip NFC "${code}" thành công trên Supabase!`,
      });
      setIsCreateModalOpen(false);
      setCreateForm({
        nfc_code: "",
        product_id: "",
        city_id: "",
        experience_url: "/explore/hanoi",
      });
    } catch (err: unknown) {
      console.error("Lỗi khi tạo mã thẻ NFC:", err);
      const errMsg = err && typeof err === "object" && "message" in err ? String(err.message) : "Lỗi không xác định";
      setMessage({
        type: "error",
        text: `Không thể tạo mã thẻ NFC: ${errMsg}. (Kiểm tra xem mã có bị trùng lặp không).`,
      });
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // Mở modal Sửa Thẻ
  const openEditModal = (tag: NfcTag) => {
    setEditForm({
      id: tag.id,
      nfc_code: tag.nfc_code,
      product_id: tag.product_id || "",
      city_id: tag.city_id || "",
      experience_url: tag.experience_url,
      scan_count: tag.scan_count || 0,
    });
    setIsEditModalOpen(true);
  };

  // Cập nhật Thẻ NFC trên Supabase
  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingEdit(true);
    setMessage(null);

    const code = editForm.nfc_code.toUpperCase().trim();
    if (!code) {
      setMessage({ type: "error", text: "Vui lòng nhập mã NFC." });
      setIsSubmittingEdit(false);
      return;
    }

    try {
      const payload = {
        nfc_code: code,
        product_id: editForm.product_id ? editForm.product_id : null,
        city_id: editForm.city_id ? editForm.city_id : null,
        experience_url: editForm.experience_url.trim() || "/explore/hanoi",
        scan_count: Number(editForm.scan_count) || 0,
      };

      const { data, error } = await supabase
        .from("nfc_tags")
        .update(payload)
        .eq("id", editForm.id)
        .select()
        .single();

      if (error) throw error;

      const prodName = products.find((p) => p.id === data.product_id)?.name || "Chưa gán áo";
      const cityName = cities.find((c) => c.id === data.city_id)?.name || "Chưa chọn";

      setTags((prev) =>
        prev.map((t) =>
          t.id === data.id
            ? {
                ...data,
                product_name: prodName,
                city_name: cityName,
              }
            : t
        )
      );

      setMessage({
        type: "success",
        text: `Đã cập nhật thông tin thẻ NFC "${code}" thành công!`,
      });
      setIsEditModalOpen(false);
    } catch (err: unknown) {
      console.error("Lỗi khi cập nhật thẻ NFC:", err);
      const errMsg = err && typeof err === "object" && "message" in err ? String(err.message) : "Lỗi không xác định";
      setMessage({
        type: "error",
        text: `Không thể cập nhật thẻ NFC: ${errMsg}`,
      });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Xóa thẻ NFC trên Supabase
  const handleDeleteTag = async (id: string, code: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa mã thẻ NFC "${code}" khỏi cơ sở dữ liệu Supabase?`)) {
      return;
    }
    try {
      const { error } = await supabase.from("nfc_tags").delete().eq("id", id);
      if (error) throw error;

      setTags((prev) => prev.filter((t) => t.id !== id));
      setMessage({ type: "success", text: `Đã xóa mã thẻ NFC "${code}" thành công!` });
    } catch (err) {
      console.error("Lỗi khi xóa thẻ NFC:", err);
      setMessage({ type: "error", text: "Không thể xóa mã thẻ NFC trên Supabase." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-900">
              Quản Lý Thẻ Chip NFC & Trải Nghiệm Di Sản
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Supabase Live
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Gán mã chip NTAG vào móc khóa gỗ, cấu hình URL trải nghiệm di sản và theo dõi số lượt quét thực tế.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>{showGuide ? "Đóng hướng dẫn" : "Hướng dẫn làm móc khóa"}</span>
          </button>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Đồng bộ</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111] hover:bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo mã NFC mới</span>
          </button>
        </div>
      </div>

      {/* Alert Notifications */}
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
            <span className="font-medium">{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hardware Keychain Integration Guide (Collapsible or Expandable) */}
      {showGuide && (
        <div className="bg-[#111] text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-neutral-800 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold uppercase tracking-wider text-white">
                  Quy Trình Tích Hợp Chip NFC Vào Móc Khóa Gỗ & Quét Mở Web
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Dành cho team sản xuất VIET CITY WEAR — Thực hiện 1 lần cho từng chiếc móc khóa
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">
                BƯỚC 1: PHẦN CỨNG
              </div>
              <h4 className="font-bold text-white text-sm">Chuẩn bị chip & gỗ</h4>
              <p className="text-neutral-400 leading-relaxed">
                Dùng chip <strong>NTAG213</strong> hoặc <strong>NTAG215</strong> dạng decal dán mỏng (đường kính 25mm, tần số 13.56 MHz).
                Dán chìm vào khe lõm bên trong móc khóa gỗ hoặc ép giữa 2 lớp gỗ.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-[10px]">
                BƯỚC 2: CÀI APP
              </div>
              <h4 className="font-bold text-white text-sm">Tải app NFC Tools</h4>
              <p className="text-neutral-400 leading-relaxed">
                Tải ứng dụng <strong>NFC Tools</strong> (hoàn toàn miễn phí trên cả App Store cho iPhone và Google Play cho Android).
                Bật tính năng NFC trên cài đặt điện thoại.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">
                BƯỚC 3: GHI URL VÀO CHIP
              </div>
              <h4 className="font-bold text-white text-sm">Ghi link định danh</h4>
              <p className="text-neutral-400 leading-relaxed">
                Mở NFC Tools → chọn <strong>Write</strong> → <strong>Add a record</strong> → <strong>URL / URI</strong>.
                Nhập link: <br />
                <code className="text-amber-300 font-mono text-[10px] bg-neutral-800 px-1 py-0.5 rounded block mt-1 break-all">
                  https://vietcitywear.vercel.app/n/VCW-HN-001
                </code>
                Bấm <strong>Write</strong> và áp lưng máy vào móc khóa.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold text-[10px]">
                BƯỚC 4: KHÓA CHỐNG GHI ĐÈ
              </div>
              <h4 className="font-bold text-white text-sm">Khóa chỉ đọc (Lock Tag)</h4>
              <p className="text-neutral-400 leading-relaxed">
                Trong NFC Tools, vào <strong>Other options</strong> → chọn <strong>Lock tag</strong> (Read-Only) để khách mua áo không thể xóa hoặc đổi URL.
                Khách chạm máy là tự động nhảy vào web!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Tổng lượt chạm NFC
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 mt-2">
            {totalScans.toLocaleString("vi-VN")}{" "}
            <span className="text-xs font-normal text-neutral-500">lượt</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Số chip đã kích hoạt
            </span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 mt-2">
            {tags.length}{" "}
            <span className="text-xs font-normal text-neutral-500">mã thẻ</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Chuẩn chip đề xuất
            </span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-lg font-extrabold text-purple-700 mt-2">
            NTAG213 / 215
          </div>
          <p className="text-[10px] text-neutral-400 mt-0.5">Tần số 13.56 MHz (ISO 14443A)</p>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Định tuyến tự động
            </span>
            <ExternalLink className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-sm font-mono font-bold text-neutral-800 mt-2 break-all">
            /n/[code] → /explore/*
          </div>
          <p className="text-[10px] text-emerald-600 mt-0.5">Tự động tăng scan_count</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E5E5E5]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã NFC, tên áo, thành phố..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="text-xs text-neutral-500 font-medium">
          Hiển thị <strong>{filteredTags.length}</strong> / {tags.length} mã chip NFC
        </div>
      </div>

      {/* NFC Tags Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-[#E5E5E5] text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                <th className="py-3 px-4">Mã NFC (Khắc Móc Khóa)</th>
                <th className="py-3 px-4">Sản Phẩm Áo Liên Kết</th>
                <th className="py-3 px-4">Thành Phố</th>
                <th className="py-3 px-4">URL Trải Nghiệm Đích</th>
                <th className="py-3 px-4 text-center">Lượt Chạm</th>
                <th className="py-3 px-4 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-600" />
                    Đang kết nối cơ sở dữ liệu Supabase...
                  </td>
                </tr>
              ) : filteredTags.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    {searchQuery ? "Không tìm thấy thẻ NFC nào phù hợp với từ khóa." : "Chưa có thẻ NFC nào được tạo."}
                  </td>
                </tr>
              ) : (
                filteredTags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-neutral-50/80 transition">
                    {/* NFC Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200">
                        <QrCode className="w-3.5 h-3.5 text-neutral-700" />
                        <span>{tag.nfc_code}</span>
                      </div>
                    </td>

                    {/* Product */}
                    <td className="py-3.5 px-4 font-medium text-neutral-800 max-w-[220px] truncate">
                      {tag.product_name}
                    </td>

                    {/* City */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                        {tag.city_name}
                      </span>
                    </td>

                    {/* Target Experience URL */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600 max-w-[200px] truncate">
                      <a
                        href={tag.experience_url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-black hover:underline inline-flex items-center gap-1"
                      >
                        <span>{tag.experience_url}</span>
                        <ExternalLink className="w-3 h-3 text-neutral-400" />
                      </a>
                    </td>

                    {/* Scans */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-extrabold text-sm text-neutral-900">
                        {tag.scan_count || 0}
                      </span>{" "}
                      <span className="text-neutral-400 text-[10px]">lượt</span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Copy URL */}
                        <button
                          onClick={() => handleCopyScanUrl(tag.nfc_code, tag.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition ${
                            copiedId === tag.id
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : "bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200"
                          }`}
                          title="Sao chép Link ghi vào chip NFC"
                        >
                          {copiedId === tag.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Link Chip</span>
                            </>
                          )}
                        </button>

                        {/* Simulate Scan */}
                        <button
                          onClick={() => handleSimulateScan(tag)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold transition text-[11px]"
                          title="Giả lập 1 lượt quét điện thoại thực tế (Tăng scan_count trong database)"
                        >
                          <Smartphone className="w-3 h-3 text-neutral-700" />
                          <span>Test Chạm</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(tag)}
                          className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600 hover:text-black transition"
                          title="Chỉnh sửa mã thẻ"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
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

      {/* Modal Tạo Mã NFC Mới */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-black" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-black">
                  Tạo Mã Chip NFC Mới
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
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
                  value={createForm.nfc_code}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, nfc_code: e.target.value })
                  }
                  placeholder="Ví dụ: VCW-HN-002 hoặc VCW-DN-001"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black uppercase font-mono font-bold"
                />
                <p className="text-[10px] text-neutral-400 mt-1">
                  Mã này sẽ tạo thành URL chuyển hướng: <code>https://vietcitywear.vercel.app/n/[MÃ]</code>
                </p>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Sản phẩm áo liên kết
                </label>
                <select
                  value={createForm.product_id}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, product_id: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                >
                  <option value="">-- Chọn sản phẩm áo (tùy chọn) --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Thành phố đại diện
                </label>
                <select
                  value={createForm.city_id}
                  onChange={(e) => {
                    const cityId = e.target.value;
                    const selectedCity = cities.find((c) => c.id === cityId);
                    let expUrl = "/explore/hanoi";
                    if (selectedCity) {
                      const slug = selectedCity.name
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9]/g, "");
                      if (slug.includes("hanoi")) expUrl = "/explore/hanoi";
                      else if (slug.includes("hue")) expUrl = "/explore/hue";
                      else if (slug.includes("hoian")) expUrl = "/explore/hoian";
                      else if (slug.includes("danang")) expUrl = "/explore/danang";
                      else if (slug.includes("hochiminh") || slug.includes("hcm")) expUrl = "/explore/saigon";
                    }
                    setCreateForm({
                      ...createForm,
                      city_id: cityId,
                      experience_url: expUrl,
                    });
                  }}
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                >
                  <option value="">-- Chọn thành phố (tùy chọn) --</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  URL đích trang trải nghiệm *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.experience_url}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, experience_url: e.target.value })
                  }
                  placeholder="/explore/hanoi"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-mono"
                />
                <p className="text-[10px] text-neutral-400 mt-1">
                  Khi người dùng chạm điện thoại, hệ thống sẽ tự động chuyển hướng đến URL này.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="px-5 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isSubmittingCreate ? (
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

      {/* Modal Chỉnh Sửa Thẻ NFC */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-black" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-black">
                  Chỉnh Sửa Thẻ Chip NFC
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateTag} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Mã NFC Code *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.nfc_code}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nfc_code: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black uppercase font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Sản phẩm áo liên kết
                </label>
                <select
                  value={editForm.product_id}
                  onChange={(e) =>
                    setEditForm({ ...editForm, product_id: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                >
                  <option value="">-- Chọn sản phẩm áo (tùy chọn) --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Thành phố đại diện
                </label>
                <select
                  value={editForm.city_id}
                  onChange={(e) =>
                    setEditForm({ ...editForm, city_id: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                >
                  <option value="">-- Chọn thành phố (tùy chọn) --</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  URL đích trang trải nghiệm *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.experience_url}
                  onChange={(e) =>
                    setEditForm({ ...editForm, experience_url: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-mono"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Lượt chạm thực tế (Scan Count)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editForm.scan_count}
                  onChange={(e) =>
                    setEditForm({ ...editForm, scan_count: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-mono font-bold"
                />
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-5 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isSubmittingEdit ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>Cập nhật</span>
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
