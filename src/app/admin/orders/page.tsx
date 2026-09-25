"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  MapPin,
  Package,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface OrderItemDetail {
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  receiver_name: string;
  receiver_phone: string;
  shipping_address: string;
  total_amount: number;
  payment_method: string;
  status: "processing" | "completed" | "canceled";
  created_at: string;
  items?: OrderItemDetail[];
}

const mockDefaultOrders: Order[] = [
  {
    id: "ord-8801",
    receiver_name: "Trần Hoàng Nam",
    receiver_phone: "0912345678",
    shipping_address: "Số 18 Hàng Bông, Phường Hàng Gai, Quận Hoàn Kiếm, Hà Nội",
    total_amount: 299000,
    payment_method: "COD",
    status: "processing",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    items: [
      {
        product_name: "Áo Thun Hà Nội Phố — Signature Tee",
        size: "L",
        color: "Đen (Black)",
        quantity: 1,
        price: 299000,
      },
    ],
  },
  {
    id: "ord-8802",
    receiver_name: "Nguyễn Thu Thảo",
    receiver_phone: "0987654321",
    shipping_address: "24 Lê Lợi, Phường Vĩnh Ninh, TP. Huế",
    total_amount: 598000,
    payment_method: "COD",
    status: "completed",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    items: [
      {
        product_name: "Áo Thun Cố Đô Huế — Heritage Tee",
        size: "M",
        color: "Tím Than",
        quantity: 2,
        price: 299000,
      },
    ],
  },
  {
    id: "ord-8803",
    receiver_name: "Lê Văn Đức",
    receiver_phone: "0903112233",
    shipping_address: "105 Trần Phú, Phường Minh An, TP. Hội An, Quảng Nam",
    total_amount: 349000,
    payment_method: "COD",
    status: "canceled",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    items: [
      {
        product_name: "Áo Thun Phố Hội Đèn Lồng — Golden Ancient Tee",
        size: "XL",
        color: "Đen",
        quantity: 1,
        price: 349000,
      },
    ],
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "processing" | "completed" | "canceled">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadOrders() {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (!ignore) {
          if (error || !data || data.length === 0) {
            setOrders(mockDefaultOrders);
          } else {
            const enriched: Order[] = data.map((o) => ({
              ...o,
              status: o.status as "processing" | "completed" | "canceled",
              items: [
                {
                  product_name: "Áo Thun Văn Hóa VietCityWear",
                  size: "L",
                  color: "Đen Tiêu Chuẩn",
                  quantity: 1,
                  price: Number(o.total_amount),
                },
              ],
            }));
            setOrders(enriched);
          }
          setIsLoading(false);
        }
      } catch {
        if (!ignore) {
          setOrders(mockDefaultOrders);
          setIsLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      ignore = true;
    };
  }, [refreshIndex]);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: "processing" | "completed" | "canceled"
  ) => {
    try {
      setIsUpdatingStatus(true);
      await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      setMessage({
        type: "success",
        text: `Đã cập nhật trạng thái đơn sang "${
          newStatus === "completed"
            ? "Đã hoàn thành"
            : newStatus === "canceled"
            ? "Đã hủy"
            : "Chờ xử lý"
        }".`,
      });
    } catch {
      setMessage({ type: "error", text: "Không thể cập nhật trạng thái đơn hàng." });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const filteredOrders = orders
    .filter((o) => (activeTab === "all" ? true : o.status === activeTab))
    .filter(
      (o) =>
        o.receiver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.receiver_phone.includes(searchTerm) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
            Đã giao hàng
          </span>
        );
      case "canceled":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-800">
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
            Chờ xử lý (COD)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-900">
            Quản Lý Đơn Hàng (COD)
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Theo dõi, xử lý và cập nhật tiến độ giao hàng cho đơn khách đặt qua website.
          </p>
        </div>

        <button
          onClick={() => {
            setIsLoading(true);
            setRefreshIndex((prev) => prev + 1);
          }}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Làm mới</span>
        </button>
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

      {/* Tabs & Search */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              activeTab === "all" ? "bg-white text-black shadow-xs" : "text-neutral-600 hover:text-black"
            }`}
          >
            Tất cả ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("processing")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              activeTab === "processing" ? "bg-white text-black shadow-xs" : "text-neutral-600 hover:text-black"
            }`}
          >
            Chờ xử lý ({orders.filter((o) => o.status === "processing").length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              activeTab === "completed" ? "bg-white text-black shadow-xs" : "text-neutral-600 hover:text-black"
            }`}
          >
            Đã giao ({orders.filter((o) => o.status === "completed").length})
          </button>
          <button
            onClick={() => setActiveTab("canceled")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              activeTab === "canceled" ? "bg-white text-black shadow-xs" : "text-neutral-600 hover:text-black"
            }`}
          >
            Đã hủy ({orders.filter((o) => o.status === "canceled").length})
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT hoặc mã đơn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-[#E5E5E5] text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                <th className="py-3 px-4">Mã đơn</th>
                <th className="py-3 px-4">Khách hàng / SĐT</th>
                <th className="py-3 px-4">Địa chỉ giao hàng</th>
                <th className="py-3 px-4">Tổng tiền (COD)</th>
                <th className="py-3 px-4">Ngày đặt</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-600" />
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-neutral-400">
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-800">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-900">{order.receiver_name}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        {order.receiver_phone}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-[220px] truncate text-neutral-600" title={order.shipping_address}>
                      {order.shipping_address}
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-900">
                      {Number(order.total_amount).toLocaleString("vi-VN")} đ
                    </td>
                    <td className="py-3 px-4 text-neutral-500 text-[11px]">
                      {new Date(order.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-semibold transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-black">
                  Chi tiết đơn hàng #{selectedOrder.id.slice(0, 8)}
                </h3>
                <span className="text-[11px] text-neutral-500">
                  Ngày đặt: {new Date(selectedOrder.created_at).toLocaleString("vi-VN")}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {/* Receiver Info */}
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/80 space-y-2">
                <div className="font-bold uppercase tracking-wider text-neutral-700 text-[11px] mb-1">
                  Thông tin người nhận hàng
                </div>
                <div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
                  <span>{selectedOrder.receiver_name}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{selectedOrder.receiver_phone}</span>
                </div>
                <div className="flex items-start gap-2 text-neutral-600">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0" />
                  <span>{selectedOrder.shipping_address}</span>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <div className="font-bold uppercase tracking-wider text-neutral-700 text-[11px] mb-2">
                  Sản phẩm trong đơn
                </div>
                <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded bg-neutral-100 text-neutral-700">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900">{item.product_name}</div>
                          <div className="text-[11px] text-neutral-500">
                            Size: {item.size} • Màu: {item.color} • SL: x{item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-neutral-900">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                <div>
                  <span className="text-neutral-500">Phương thức:</span>{" "}
                  <span className="font-bold text-black uppercase">Thanh toán khi nhận (COD)</span>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-neutral-500">Tổng thanh toán:</div>
                  <div className="text-lg font-extrabold text-neutral-900">
                    {Number(selectedOrder.total_amount).toLocaleString("vi-VN")} đ
                  </div>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="pt-4 border-t border-neutral-200">
                <label className="block font-bold uppercase tracking-wider text-neutral-700 text-[11px] mb-2">
                  Cập nhật trạng thái đơn hàng:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    disabled={isUpdatingStatus || selectedOrder.status === "processing"}
                    onClick={() => handleUpdateStatus(selectedOrder.id, "processing")}
                    className={`py-2 px-2 rounded-lg font-bold text-xs uppercase transition border ${
                      selectedOrder.status === "processing"
                        ? "bg-amber-100 border-amber-300 text-amber-900 shadow-xs"
                        : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    Chờ xử lý
                  </button>
                  <button
                    disabled={isUpdatingStatus || selectedOrder.status === "completed"}
                    onClick={() => handleUpdateStatus(selectedOrder.id, "completed")}
                    className={`py-2 px-2 rounded-lg font-bold text-xs uppercase transition border ${
                      selectedOrder.status === "completed"
                        ? "bg-emerald-100 border-emerald-300 text-emerald-900 shadow-xs"
                        : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    Đã hoàn thành
                  </button>
                  <button
                    disabled={isUpdatingStatus || selectedOrder.status === "canceled"}
                    onClick={() => handleUpdateStatus(selectedOrder.id, "canceled")}
                    className={`py-2 px-2 rounded-lg font-bold text-xs uppercase transition border ${
                      selectedOrder.status === "canceled"
                        ? "bg-red-100 border-red-300 text-red-900 shadow-xs"
                        : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    Hủy đơn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
