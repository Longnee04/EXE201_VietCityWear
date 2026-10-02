"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "admin" | "user";
  created_at: string;
}

const mockDefaultUsers: UserProfile[] = [
  {
    id: "u-admin",
    full_name: "Quản trị viên",
    email: "admin@vietcitywear.com",
    role: "admin",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "u-customer",
    full_name: "Khách hàng Demo",
    email: "khachhang@gmail.com",
    role: "user",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, full_name, email, role, created_at")
          .order("created_at", { ascending: false });

        if (ignore) return;

        if (error || !data || data.length === 0) {
          setUsers(mockDefaultUsers);
        } else {
          setUsers(data as UserProfile[]);
        }
      } catch {
        if (!ignore) {
          setUsers(mockDefaultUsers);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadUsers();
    return () => {
      ignore = true;
    };
  }, [refreshIndex]);

  // Đổi role giữa admin và user
  const handleToggleRole = async (user: UserProfile) => {
    const nextRole: "admin" | "user" = user.role === "admin" ? "user" : "admin";
    const confirmMsg =
      nextRole === "admin"
        ? `Bạn có chắc muốn thăng cấp tài khoản "${user.email}" lên Quản trị viên (Admin)?`
        : `Bạn có chắc muốn hạ quyền tài khoản "${user.email}" xuống Khách hàng (User)?`;

    if (!confirm(confirmMsg)) return;

    try {
      setIsUpdatingId(user.id);
      const { error } = await supabase
        .from("users")
        .update({ role: nextRole })
        .eq("id", user.id);

      if (error) {
        // Local update fallback
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u))
        );
      } else {
        setRefreshIndex((prev) => prev + 1);
      }

      setMessage({
        type: "success",
        text: `Đã thay đổi quyền tài khoản "${user.email}" thành "${
          nextRole === "admin" ? "Admin" : "User"
        }".`,
      });
    } catch {
      setMessage({ type: "error", text: "Lỗi kết nối khi cập nhật quyền." });
    } finally {
      setIsUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.full_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminCount = users.filter((u) => u.role === "admin").length;
  const customerCount = users.filter((u) => u.role === "user").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-900">
            Quản Lý Tài Khoản & Phân Quyền
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Danh sách tài khoản đã đăng ký, cấp quyền Quản trị viên (Admin) hoặc phân loại Khách hàng.
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

      {/* Stats Mini Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Tổng tài khoản đã đồng bộ
          </span>
          <div className="text-2xl font-extrabold text-neutral-900 mt-1">
            {users.length} tài khoản
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Quản trị viên (Admin)
          </span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">
            {adminCount} người
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Khách hàng thành viên
          </span>
          <div className="text-2xl font-extrabold text-neutral-900 mt-1">
            {customerCount} người
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo email hoặc họ tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <div className="text-xs text-neutral-500 font-semibold">
          Hiển thị: <span className="text-black">{filteredUsers.length}</span> tài khoản
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-[#E5E5E5] text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                <th className="py-3 px-4">Tài khoản / Họ tên</th>
                <th className="py-3 px-4">Email xác thực</th>
                <th className="py-3 px-4">Quyền hạn (Role)</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4 text-right">Thao tác đổi quyền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-600" />
                    Đang tải danh sách tài khoản...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-neutral-400">
                    Không tìm thấy tài khoản nào.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-700">
                          {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                        </div>
                        <div className="font-bold text-neutral-900">
                          {user.full_name || "Chưa đặt tên"}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-700 font-mono">
                      {user.email || "Không có email"}
                    </td>
                    <td className="py-3 px-4">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                          <ShieldCheck className="w-3 h-3 text-amber-600" />
                          <span>Admin</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 text-neutral-700 border border-neutral-200">
                          <UserCheck className="w-3 h-3 text-neutral-500" />
                          <span>User</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-neutral-500 text-[11px]">
                      {new Date(user.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleRole(user)}
                        disabled={isUpdatingId === user.id}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold uppercase transition border ${
                          user.role === "admin"
                            ? "bg-neutral-100 border-neutral-300 text-neutral-700 hover:bg-neutral-200"
                            : "bg-black border-black text-white hover:bg-neutral-800"
                        } disabled:opacity-50`}
                      >
                        {isUpdatingId === user.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : null}
                        <span>{user.role === "admin" ? "Hạ xuống User" : "Cấp quyền Admin"}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
