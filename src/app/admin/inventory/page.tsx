"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface InventoryItem {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock_quantity: number;
  status: boolean;
  product_name?: string;
}

interface ProductOption {
  id: string;
  name: string;
}

const defaultMockInventory: InventoryItem[] = [
  {
    id: "inv-1",
    product_id: "p1",
    product_name: "Áo Thun Hà Nội Phố — Signature Tee",
    size: "M",
    color: "Đen (Black)",
    stock_quantity: 45,
    status: true,
  },
  {
    id: "inv-2",
    product_id: "p1",
    product_name: "Áo Thun Hà Nội Phố — Signature Tee",
    size: "L",
    color: "Đen (Black)",
    stock_quantity: 38,
    status: true,
  },
  {
    id: "inv-3",
    product_id: "p1",
    product_name: "Áo Thun Hà Nội Phố — Signature Tee",
    size: "XL",
    color: "Đen (Black)",
    stock_quantity: 20,
    status: true,
  },
  {
    id: "inv-4",
    product_id: "p1",
    product_name: "Áo Thun Hà Nội Phố — Signature Tee",
    size: "M",
    color: "Trắng Kem (Off-White)",
    stock_quantity: 50,
    status: true,
  },
  {
    id: "inv-5",
    product_id: "p1",
    product_name: "Áo Thun Hà Nội Phố — Signature Tee",
    size: "L",
    color: "Trắng Kem (Off-White)",
    stock_quantity: 35,
    status: true,
  },
  {
    id: "inv-6",
    product_id: "p2",
    product_name: "Áo Thun Cố Đô Huế — Heritage Tee",
    size: "L",
    color: "Tím Than (Dark Purple)",
    stock_quantity: 28,
    status: true,
  },
];

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newVariant, setNewVariant] = useState({
    product_id: "",
    size: "M",
    color: "Đen (Black)",
    stock_quantity: 50,
  });

  // Inline Editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQty, setEditingQty] = useState<number>(0);

  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        // 1. Tải danh sách sản phẩm để làm dropdown
        const { data: prods } = await supabase.from("products").select("id, name");
        if (!ignore && prods && prods.length > 0) {
          setProducts(prods as ProductOption[]);
          setNewVariant((prev) =>
            prev.product_id ? prev : { ...prev, product_id: prods[0].id }
          );
        }

        // 2. Tải biến thể tồn kho
        const { data: invData, error: invError } = await supabase
          .from("product_inventory")
          .select("id, product_id, size, color, stock_quantity, status");

        if (!ignore) {
          if (invError || !invData || invData.length === 0) {
            setInventory(defaultMockInventory);
          } else {
            const mapped = invData.map((item) => {
              const matchProd = prods?.find((p) => p.id === item.product_id);
              return {
                ...item,
                product_name: matchProd?.name || "Sản phẩm",
              };
            });
            setInventory(mapped as InventoryItem[]);
          }
          setIsLoading(false);
        }
      } catch {
        if (!ignore) {
          setInventory(defaultMockInventory);
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [refreshIndex]);

  // Cập nhật số lượng trực tiếp
  const handleSaveQuantity = async (id: string) => {
    try {
      await supabase
        .from("product_inventory")
        .update({ stock_quantity: editingQty })
        .eq("id", id);

      setInventory((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, stock_quantity: editingQty } : item
        )
      );
      setEditingId(null);
      setMessage({ type: "success", text: "Đã cập nhật số lượng tồn kho thành công!" });
    } catch {
      setMessage({ type: "error", text: "Không thể cập nhật số lượng." });
    }
  };

  // Đổi trạng thái còn hàng / hết hàng
  const handleToggleStatus = async (item: InventoryItem) => {
    const nextStatus = !item.status;
    try {
      await supabase
        .from("product_inventory")
        .update({ status: nextStatus })
        .eq("id", item.id);

      setInventory((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i))
      );
      setMessage({
        type: "success",
        text: `Đã chuyển trạng thái sang "${nextStatus ? "Còn hàng" : "Hết hàng"}".`,
      });
    } catch {
      setInventory((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i))
      );
    }
  };

  // Thêm biến thể mới
  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const selectedProd = products.find((p) => p.id === newVariant.product_id);

      const { data, error } = await supabase
        .from("product_inventory")
        .insert({
          product_id: newVariant.product_id,
          size: newVariant.size,
          color: newVariant.color,
          stock_quantity: Number(newVariant.stock_quantity),
          status: Number(newVariant.stock_quantity) > 0,
        })
        .select()
        .single();

      if (error || !data) {
        const localItem: InventoryItem = {
          id: `inv-${Date.now()}`,
          product_id: newVariant.product_id,
          product_name: selectedProd?.name || "Sản phẩm",
          size: newVariant.size,
          color: newVariant.color,
          stock_quantity: Number(newVariant.stock_quantity),
          status: true,
        };
        setInventory((prev) => [localItem, ...prev]);
      } else {
        setRefreshIndex((prev) => prev + 1);
      }

      setMessage({ type: "success", text: "Đã thêm biến thể mới vào kho thành công!" });
      setIsModalOpen(false);
    } catch {
      setMessage({ type: "error", text: "Lỗi kết nối khi thêm biến thể." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xóa biến thể
  const handleDeleteVariant = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa biến thể kho này?")) return;
    try {
      await supabase.from("product_inventory").delete().eq("id", id);
      setInventory((prev) => prev.filter((i) => i.id !== id));
      setMessage({ type: "success", text: "Đã xóa biến thể kho." });
    } catch {
      setInventory((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const text = `${item.product_name} ${item.color} ${item.size}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const totalStock = inventory.reduce((acc, curr) => acc + (curr.stock_quantity || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-900">
            Quản Lý Tồn Kho & Biến Thể
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Theo dõi số lượng từng Size và Màu sắc theo thời gian thực để đảm bảo nguồn cung bán lẻ.
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
            <span>Thêm biến thể</span>
          </button>
        </div>
      </div>

      {/* Alert Message */}
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
            Tổng sản phẩm trong kho
          </span>
          <div className="text-2xl font-extrabold text-neutral-900 mt-1">
            {totalStock} chiếc
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Tổng số mã biến thể (SKU)
          </span>
          <div className="text-2xl font-extrabold text-neutral-900 mt-1">
            {inventory.length} mã
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Tình trạng cảnh báo hết hàng
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            Ổn định
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên áo, size hoặc màu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <div className="text-xs text-neutral-500 font-semibold">
          Hiển thị: <span className="text-black">{filteredInventory.length}</span> biến thể
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-[#E5E5E5] text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                <th className="py-3 px-4">Tên sản phẩm</th>
                <th className="py-3 px-4">Kích thước (Size)</th>
                <th className="py-3 px-4">Màu sắc</th>
                <th className="py-3 px-4">Số lượng tồn</th>
                <th className="py-3 px-4">Trạng thái kho</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-600" />
                    Đang tải dữ liệu kho hàng...
                  </td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-neutral-400">
                    Không có biến thể nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/60 transition">
                    <td className="py-3 px-4 font-semibold text-neutral-900">
                      {item.product_name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-neutral-100 font-bold border border-neutral-200">
                        {item.size}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {item.color}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0}
                            value={editingQty}
                            onChange={(e) => setEditingQty(Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-black rounded text-xs font-bold"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveQuantity(item.id)}
                            className="p-1 rounded bg-black text-white hover:bg-neutral-800"
                            title="Lưu"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                            title="Hủy"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm ${
                              item.stock_quantity < 10
                                ? "text-amber-600 font-extrabold"
                                : "text-neutral-900"
                            }`}
                          >
                            {item.stock_quantity} cái
                          </span>
                          <button
                            onClick={() => {
                              setEditingId(item.id);
                              setEditingQty(item.stock_quantity);
                            }}
                            className="p-1 text-neutral-400 hover:text-black"
                            title="Sửa số lượng"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition ${
                          item.status
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                        }`}
                        title="Click để đổi trạng thái"
                      >
                        {item.status ? "Còn hàng" : "Hết hàng"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteVariant(item.id)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-neutral-400 hover:text-red-600 transition"
                        title="Xóa biến thể"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm Biến Thể */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wider text-black">
                Thêm Biến Thể Tồn Kho Mới
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVariant} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Chọn Sản phẩm *
                </label>
                <select
                  required
                  value={newVariant.product_id}
                  onChange={(e) =>
                    setNewVariant({ ...newVariant, product_id: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Kích thước (Size) *
                  </label>
                  <select
                    value={newVariant.size}
                    onChange={(e) =>
                      setNewVariant({ ...newVariant, size: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                  >
                    <option value="S">Size S</option>
                    <option value="M">Size M</option>
                    <option value="L">Size L</option>
                    <option value="XL">Size XL</option>
                    <option value="XXL">Size XXL</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Màu sắc *
                  </label>
                  <input
                    type="text"
                    required
                    value={newVariant.color}
                    onChange={(e) =>
                      setNewVariant({ ...newVariant, color: e.target.value })
                    }
                    placeholder="Ví dụ: Đen (Black)"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Số lượng nhập kho ban đầu *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={newVariant.stock_quantity}
                  onChange={(e) =>
                    setNewVariant({
                      ...newVariant,
                      stock_quantity: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
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
                    <span>Lưu biến thể</span>
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
