import { ShoppingBag, Compass, Sparkles, Database, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-wider text-rose-700">VIET CITY WEAR</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold">
              NFC Heritage
            </span>
          </div>
          <nav className="text-sm font-medium text-slate-500 flex items-center gap-6">
            <span>Dự án EXE201</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Khung dự án sẵn sàng
            </span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600 mb-6">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Hệ thống Áo thun lưu niệm kết hợp Thẻ địa danh & Công nghệ NFC
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-2xl">
          Chào mừng nhóm đến với <span className="text-rose-700">VIET CITY WEAR</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
          Khung dự án (Scaffolding) đã được thiết lập hoàn chỉnh với Next.js, React, Tailwind CSS và Prisma kết nối PostgreSQL.
        </p>

        {/* Tech Stack Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-10 text-left">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900">E-Commerce Module</h3>
            <p className="text-xs text-slate-500 mt-1">
              3 phân loại gói sản phẩm (249k, 299k, 349k), giỏ hàng, thanh toán và quản lý đơn.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900">NFC Landing Page</h3>
            <p className="text-xs text-slate-500 mt-1">
              Trang đích khi chạm móc khóa NFC: đa ngôn ngữ, câu chuyện văn hóa, cẩm nang du lịch.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900">PostgreSQL + Prisma</h3>
            <p className="text-xs text-slate-500 mt-1">
              Cơ sở dữ liệu quan hệ hoàn chỉnh đã cấu hình sẵn schema cho người dùng, sản phẩm và hộ chiếu số.
            </p>
          </div>
        </div>

        {/* Quick Check List for Team */}
        <div className="w-full mt-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm text-left">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            Checklist cho thành viên nhóm khi clone:
          </h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Chạy <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">npm install</code> để cài đặt các gói phụ thuộc.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Sao chép <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">.env.example</code> thành <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">.env</code> và cấu hình PostgreSQL.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Chạy <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">npx prisma db push</code> để tạo bảng trong database.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Xem chi tiết hướng dẫn tại file <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">README.md</code>.</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6 text-center text-xs text-slate-500">
        VIET CITY WEAR © 2025 • Đồ án Hệ thống thông tin (EXE201)
      </footer>
    </div>
  );
}
