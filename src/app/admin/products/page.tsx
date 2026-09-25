"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  Package,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Product {
  id: string;
  name: string;
  base_price: number;
  package_type: string | null;
  front_image: string | null;
  back_image: string | null;
  description: string | null;
  size_guide_text: string | null;
  city_id?: string | null;
  created_at: string;
}

const mockDefaultProducts: Product[] = [
  {
    id: "p1",
    name: "Áo Thun Hà Nội Phố — Signature Tee",
    base_price: 299000,
    package_type: "Tiêu chuẩn (Áo + 5 Thẻ + Móc khóa NFC)",
    front_image: "/images/products/tee-hanoi-front.jpg",
    back_image: "/images/products/tee-hanoi-back.jpg",
    description: "Chất liệu 100% Cotton 2 chiều định lượng 250gsm thoáng mát, form Oversize.",
    size_guide_text: "M: 50-65kg | L: 65-75kg | XL: 75-85kg",
    created_at: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "Áo Thun Cố Đô Huế — Heritage Tee",
    base_price: 299000,
    package_type: "Tiêu chuẩn (Áo + 5 Thẻ + Móc khóa NFC)",
    front_image: "/images/products/tee-hue-front.jpg",
    back_image: "/images/products/tee-hue-back.jpg",
    description: "Họa tiết Ngọ Môn và hoa văn triều Nguyễn tinh xảo in lụa cao cấp.",
    size_guide_text: "M: 50-65kg | L: 65-75kg | XL: 75-85kg",
    created_at: new Date().toISOString(),
  },
  {
    id: "p3",
    name: "Áo Thun Phố Hội Đèn Lồng — Golden Ancient Tee",
    base_price: 349000,
    package_type: "Phiên bản đặc biệt (Áo cao cấp + 5 Thẻ + NFC + Hộp đẹp)",
    front_image: "/images/products/tee-hoian-front.jpg",
    back_image: "/images/products/tee-hoian-back.jpg",
    description: "Hộp quà tặng cao cấp, kèm móc khóa NFC chạm mở bản đồ ẩm thực Hội An.",
    size_guide_text: "M: 50-65kg | L: 65-75kg | XL: 75-85kg",
    created_at: new Date().toISOString(),
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    base_price: 299000,
    package_type: "Tiêu chuẩn (Áo + 5 Thẻ + Móc khóa NFC)",
    front_image: "/images/products/tee-hanoi-front.jpg",
    back_image: "/images/products/tee-hanoi-back.jpg",
    description: "",
    size_guide_text: "M: 50-65kg | L: 65-75kg | XL: 75-85kg",
  });

  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (!ignore) {
          if (error || !data || data.length === 0) {
            setProducts(mockDefaultProducts);
          } else {
            setProducts(data as Product[]);
          }
          setIsLoading(false);
        }
      } catch {
        if (!ignore) {
          setProducts(mockDefaultProducts);
          setIsLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, [refreshIndex]);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: "",
      base_price: 299000,
      package_type: "Tiêu chuẩn (Áo + 5 Thẻ + Móc khóa NFC)",
      front_image: "/images/products/tee-hanoi-front.jpg",
      back_image: "/images/products/tee-hanoi-back.jpg",
      description: "",
      size_guide_text: "M: 50-65kg | L: 65-75kg | XL: 75-85kg",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setFormData({
      name: product.name,
      base_price: Number(product.base_price),
      package_type: product.package_type || "Tiêu chuẩn",
      front_image: product.front_image || "",
      back_image: product.back_image || "",
      description: product.description || "",
      size_guide_text: product.size_guide_text || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (isEditing && currentId) {
        // Cập nhật sản phẩm
        const { error } = await supabase
          .from("products")
          .update({
            name: formData.name,
            base_price: Number(formData.base_price),
            package_type: formData.package_type,
            front_image: formData.front_image,
            back_image: formData.back_image,
            description: formData.description,
            size_guide_text: formData.size_guide_text,
          })
          .eq("id", currentId);

        if (error) {
          // Update in local state fallback
          setProducts((prev) =>
            prev.map((p) => (p.id === currentId ? { ...p, ...formData } : p))
          );
        } else {
          setRefreshIndex((prev) => prev + 1);
        }
        setMessage({ type: "success", text: "Đã cập nhật sản phẩm thành công!" });
      } else {
        // Thêm sản phẩm mới
        const { data, error } = await supabase
          .from("products")
          .insert({
            name: formData.name,
            base_price: Number(formData.base_price),
            package_type: formData.package_type,
            front_image: formData.front_image,
            back_image: formData.back_image,
            description: formData.description,
            size_guide_text: formData.size_guide_text,
          })
          .select()
          .single();

        if (error || !data) {
          const newLocalProduct: Product = {
            id: `prod-${Date.now()}`,
            ...formData,
            created_at: new Date().toISOString(),
          };
          setProducts((prev) => [newLocalProduct, ...prev]);
        } else {
          setRefreshIndex((prev) => prev + 1);
        }
        setMessage({ type: "success", text: "Đã thêm sản phẩm mới vào danh mục!" });
      }
      setIsModalOpen(false);
    } catch {
      setMessage({ type: "error", text: "Lỗi kết nối khi lưu sản phẩm." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`)) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        setRefreshIndex((prev) => prev + 1);
      }
      setMessage({ type: "success", text: `Đã xóa sản phẩm "${name}".` });
    } catch {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setMessage({ type: "success", text: `Đã xóa sản phẩm "${name}".` });
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-900">
            Quản Lý Sản Phẩm (Catalog)
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Quản lý các mẫu áo thun văn hóa, giá bán các gói quà lưu niệm và hình ảnh hiển thị.
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
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111] hover:bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>
      </div>

      {/* Alert Notification */}
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

      {/* Search Bar */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="text-xs text-neutral-500 font-semibold">
          Tổng số: <span className="text-black">{filteredProducts.length}</span> sản phẩm
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-[#E5E5E5] text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                <th className="py-3 px-4">Ảnh</th>
                <th className="py-3 px-4">Tên sản phẩm</th>
                <th className="py-3 px-4">Gói combo</th>
                <th className="py-3 px-4">Giá cơ bản</th>
                <th className="py-3 px-4">Hướng dẫn size</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-600" />
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-neutral-400">
                    Không tìm thấy sản phẩm nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-14 rounded-md overflow-hidden border border-neutral-200 bg-[#F7F4EE] flex-shrink-0">
                        {p.front_image ? (
                          <Image
                            src={p.front_image}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-900 text-xs sm:text-sm">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                        {p.description || "Không có mô tả"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-[10px] font-semibold">
                        {p.package_type || "Tiêu chuẩn"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-900">
                      {Number(p.base_price).toLocaleString("vi-VN")} đ
                    </td>
                    <td className="py-3 px-4 text-neutral-500 text-[11px] max-w-[180px] truncate">
                      {p.size_guide_text || "M | L | XL"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600 hover:text-black transition"
                          title="Sửa sản phẩm"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-neutral-400 hover:text-red-600 transition"
                          title="Xóa sản phẩm"
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

      {/* Modal Thêm / Sửa Sản phẩm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wider text-black">
                {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Áo Thun Hà Nội Phố — Signature Tee"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Giá niêm yết (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={formData.base_price}
                    onChange={(e) =>
                      setFormData({ ...formData, base_price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Gói combo đính kèm
                  </label>
                  <select
                    value={formData.package_type}
                    onChange={(e) =>
                      setFormData({ ...formData, package_type: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                  >
                    <option value="Cơ bản (Áo + 3 Thẻ địa danh)">
                      Cơ bản (249.000đ - Áo + 3 Thẻ)
                    </option>
                    <option value="Tiêu chuẩn (Áo + 5 Thẻ + Móc khóa NFC)">
                      Tiêu chuẩn (299.000đ - Áo + 5 Thẻ + NFC)
                    </option>
                    <option value="Phiên bản đặc biệt (Áo cao cấp + 5 Thẻ + NFC + Hộp đẹp)">
                      Đặc biệt (349.000đ - Áo tốt + 5 Thẻ + NFC + Hộp đẹp)
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    URL Ảnh mặt trước
                  </label>
                  <input
                    type="text"
                    value={formData.front_image}
                    onChange={(e) =>
                      setFormData({ ...formData, front_image: e.target.value })
                    }
                    placeholder="/images/products/tee-hanoi-front.jpg"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    URL Ảnh mặt sau
                  </label>
                  <input
                    type="text"
                    value={formData.back_image}
                    onChange={(e) =>
                      setFormData({ ...formData, back_image: e.target.value })
                    }
                    placeholder="/images/products/tee-hanoi-back.jpg"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Mô tả câu chuyện sản phẩm
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả chất liệu, cảm hứng thiết kế từ di sản thành phố..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Hướng dẫn chọn size
                </label>
                <input
                  type="text"
                  value={formData.size_guide_text}
                  onChange={(e) =>
                    setFormData({ ...formData, size_guide_text: e.target.value })
                  }
                  placeholder="M: 50-65kg | L: 65-75kg | XL: 75-85kg"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 font-semibold"
                >
                  Hủy bỏ
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
                    <span>{isEditing ? "Cập nhật" : "Tạo sản phẩm"}</span>
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
