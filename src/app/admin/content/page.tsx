"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Edit2,
  Save,
  X,
  Info,
  Shield,
  Mail,
  Briefcase,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface ContentPage {
  id: string;
  type: "about" | "terms" | "privacy" | "contact" | "careers";
  title: string;
  content: string;
  updatedAt: string;
}

const CONTENT_STORAGE_KEY = "vcw_admin_content";

function getStoredContents(fallback: ContentPage[]): ContentPage[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(CONTENT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error reading localStorage:", e);
  }
  return fallback;
}

function saveStoredContents(items: ContentPage[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Error writing localStorage:", e);
  }
}

export default function ContentManagementPage() {
  const [contents, setContents] = useState<ContentPage[]>([]);
  const [editingContent, setEditingContent] = useState<ContentPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const contentTypes = [
    { type: "about", label: "Giới thiệu / Dịch vụ", icon: Info, color: "blue" },
    { type: "terms", label: "Điều khoản sử dụng", icon: FileText, color: "purple" },
    { type: "privacy", label: "Chính sách bảo mật", icon: Shield, color: "emerald" },
    { type: "contact", label: "Liên hệ với chúng tôi", icon: Mail, color: "amber" },
    { type: "careers", label: "Tuyển dụng", icon: Briefcase, color: "red" },
  ];

  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockContents: ContentPage[] = [
        {
          id: "1",
          type: "about",
          title: "Giới thiệu VIET CITY WEAR",
          content: `VIET CITY WEAR là thương hiệu thời trang văn hóa độc đáo, kết hợp áo thun lưu niệm với công nghệ NFC để mang đến trải nghiệm khám phá di sản Việt Nam.

**Sứ mệnh:** Mặc thành phố – Chạm câu chuyện

**Sản phẩm:**
- Áo thun văn hóa theo từng thành phố
- Thẻ địa danh và móc khóa NFC
- Trải nghiệm văn hóa số qua công nghệ

**Liên hệ:**
Email: contact@vietcitywear.com
Hotline: 0901 234 567`,
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          type: "terms",
          title: "Điều khoản sử dụng",
          content: `**1. Giới thiệu**
Chào mừng bạn đến với VIET CITY WEAR. Khi sử dụng website và dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản sau.

**2. Sử dụng dịch vụ**
- Bạn phải từ 18 tuổi trở lên để mua hàng
- Thông tin cung cấp phải chính xác và trung thực
- Không sử dụng website cho mục đích bất hợp pháp

**3. Đặt hàng và thanh toán**
- Đơn hàng được xác nhận qua email
- Hiện chỉ hỗ trợ thanh toán COD (tiền mặt khi nhận hàng)
- Giá sản phẩm có thể thay đổi mà không cần báo trước

**4. Chính sách đổi trả**
- Đổi size trong vòng 7 ngày nếu sản phẩm chưa sử dụng
- Không hỗ trợ hoàn tiền
- Khách hàng chịu phí vận chuyển đổi hàng

**5. Quyền sở hữu trí tuệ**
- Mọi nội dung trên website thuộc quyền sở hữu của VIET CITY WEAR
- Không được sao chép, sử dụng trái phép các thiết kế và nội dung`,
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          type: "privacy",
          title: "Chính sách bảo mật",
          content: `**1. Thu thập thông tin**
Chúng tôi thu thập các thông tin sau:
- Họ tên, số điện thoại, địa chỉ email
- Địa chỉ giao hàng
- Lịch sử mua hàng và tương tác NFC

**2. Sử dụng thông tin**
Thông tin được sử dụng để:
- Xử lý đơn hàng và giao hàng
- Liên hệ hỗ trợ khách hàng
- Cải thiện trải nghiệm người dùng
- Gửi thông tin khuyến mãi (nếu đồng ý)

**3. Bảo mật thông tin**
- Thông tin được mã hóa và lưu trữ an toàn
- Không chia sẻ thông tin cho bên thứ ba
- Tuân thủ các quy định về bảo vệ dữ liệu cá nhân

**4. Cookie và công nghệ theo dõi**
- Website sử dụng cookie để cải thiện trải nghiệm
- Bạn có thể tắt cookie trong trình duyệt

**5. Quyền của bạn**
Bạn có quyền:
- Truy cập và cập nhật thông tin cá nhân
- Yêu cầu xóa dữ liệu
- Từ chối nhận email marketing`,
          updatedAt: new Date().toISOString(),
        },
        {
          id: "4",
          type: "contact",
          title: "Liên hệ với VIET CITY WEAR",
          content: `**Thông tin liên hệ:**

**Địa chỉ văn phòng:**
Số 123, Đường ABC, Quận XYZ, Hà Nội, Việt Nam

**Hotline/Zalo:**
0901 234 567 (8:00 - 20:00 hàng ngày)

**Email:**
- Hỗ trợ khách hàng: support@vietcitywear.com
- Hợp tác kinh doanh: business@vietcitywear.com
- Báo chí truyền thông: pr@vietcitywear.com

**Mạng xã hội:**
- Facebook: facebook.com/vietcitywear
- Instagram: @vietcitywear
- TikTok: @vietcitywear

**Thời gian làm việc:**
Thứ 2 - Thứ 6: 8:00 - 18:00
Thứ 7 - Chủ nhật: 9:00 - 17:00

Chúng tôi luôn sẵn sàng hỗ trợ và lắng nghe ý kiến của bạn!`,
          updatedAt: new Date().toISOString(),
        },
        {
          id: "5",
          type: "careers",
          title: "Tuyển dụng tại VIET CITY WEAR",
          content: `**Tham gia đội ngũ VIET CITY WEAR!**

Chúng tôi đang tìm kiếm những người đam mê văn hóa Việt Nam và muốn góp phần quảng bá di sản qua thời trang.

**Vị trí đang tuyển:**

**1. Nhân viên Marketing (2 vị trí)**
- Kinh nghiệm: 1-2 năm
- Yêu cầu: Am hiểu Social Media, Content Marketing
- Mức lương: 8-12 triệu VNĐ

**2. Nhân viên Thiết kế Đồ họa (1 vị trí)**
- Kinh nghiệm: 1-3 năm
- Yêu cầu: Thành thạo Adobe Creative Suite
- Mức lương: 10-15 triệu VNĐ

**3. Nhân viên Chăm sóc khách hàng (2 vị trí)**
- Kinh nghiệm: Không yêu cầu
- Yêu cầu: Giao tiếp tốt, nhiệt tình
- Mức lương: 7-10 triệu VNĐ

**Quyền lợi:**
- Lương tháng 13, thưởng hiệu suất
- Bảo hiểm đầy đủ theo luật
- Nghỉ phép 12 ngày/năm
- Team building, du lịch hàng năm
- Môi trường trẻ trung, sáng tạo

**Cách thức ứng tuyển:**
Gửi CV về email: hr@vietcitywear.com
Tiêu đề: [Vị trí ứng tuyển] - [Họ tên]`,
          updatedAt: new Date().toISOString(),
        },
      ];

      let loadedFromDb = false;
      try {
        const { data, error } = await supabase.from("website_content").select("*");
        if (!error && data && data.length > 0) {
          const dbContents: ContentPage[] = mockContents.map((mc) => {
            const match = data.find((row) => row.page_name === mc.type);
            if (match && typeof match.content_body === "object" && match.content_body !== null) {
              const body = match.content_body as { title?: string; content?: string };
              return {
                ...mc,
                id: match.id || mc.id,
                title: body.title || mc.title,
                content: body.content || mc.content,
                updatedAt: match.updated_at || mc.updatedAt,
              };
            }
            return mc;
          });
          setContents(dbContents);
          saveStoredContents(dbContents);
          loadedFromDb = true;
        }
      } catch {
        // Supabase table not created yet
      }

      if (!loadedFromDb) {
        setContents(getStoredContents(mockContents));
      }
    } catch (error) {
      console.error("Error loading contents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (content: ContentPage) => {
    setEditingContent({ ...content });
  };

  const handleSave = async () => {
    if (!editingContent) return;

    setIsSaving(true);
    try {
      const updated = contents.map((c) =>
        c.id === editingContent.id
          ? { ...editingContent, updatedAt: new Date().toISOString() }
          : c
      );
      setContents(updated);
      saveStoredContents(updated);

      let savedToCloud = false;
      try {
        const { error } = await supabase
          .from("website_content")
          .upsert(
            {
              page_name: editingContent.type,
              content_body: {
                title: editingContent.title,
                content: editingContent.content,
              },
              updated_at: new Date().toISOString(),
            },
            { onConflict: "page_name" }
          );
        if (!error) savedToCloud = true;
      } catch {
        // fallback
      }

      setEditingContent(null);
      if (savedToCloud) {
        alert("Đã lưu nội dung thành công lên Supabase Cloud!");
      } else {
        alert("Đã lưu nội dung thành công vào bộ nhớ hệ thống (F5 không mất)!");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Có lỗi xảy ra khi lưu nội dung!");
    } finally {
      setIsSaving(false);
    }
  };

  const getContentTypeConfig = (type: string) => {
    const config = contentTypes.find((ct) => ct.type === type);
    return config || contentTypes[0];
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          iconBg: "bg-blue-100",
        };
      case "purple":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
          iconBg: "bg-purple-100",
        };
      case "emerald":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          iconBg: "bg-emerald-100",
        };
      case "amber":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          iconBg: "bg-amber-100",
        };
      case "red":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          iconBg: "bg-red-100",
        };
      default:
        return {
          bg: "bg-neutral-50",
          text: "text-neutral-700",
          border: "border-neutral-200",
          iconBg: "bg-neutral-100",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-neutral-700" />
          <h1 className="text-xl font-bold text-neutral-900">Quản lý Nội dung Website</h1>
        </div>
        <p className="text-sm text-neutral-600">
          Chỉnh sửa các trang thông tin: Giới thiệu, Điều khoản, Chính sách, Liên hệ và Tuyển dụng
        </p>
      </div>

      {/* Content Cards */}
      {isLoading ? (
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mx-auto mb-3" />
          <p className="text-sm text-neutral-600">Đang tải nội dung...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contents.map((content) => {
            const config = getContentTypeConfig(content.type);
            const colors = getColorClasses(config.color);
            const Icon = config.icon;

            return (
              <div
                key={content.id}
                className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-xs hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${colors.iconBg}`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">{config.label}</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Cập nhật: {new Date(content.updatedAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(content)}
                    className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg transition"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                  <pre className="text-xs text-neutral-700 whitespace-pre-wrap font-sans line-clamp-6">
                    {content.content}
                  </pre>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Đã cấu hình
                  </span>
                  <span className="text-xs text-neutral-500">
                    {content.content.length} ký tự
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Chỉnh sửa nội dung</h2>
                  <p className="text-sm text-neutral-600 mt-1">
                    {getContentTypeConfig(editingContent.type).label}
                  </p>
                </div>
                <button
                  onClick={() => setEditingContent(null)}
                  className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Tiêu đề trang
                </label>
                <input
                  type="text"
                  value={editingContent.title}
                  onChange={(e) =>
                    setEditingContent({ ...editingContent, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Nhập tiêu đề trang..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Nội dung (Hỗ trợ Markdown)
                </label>
                <textarea
                  value={editingContent.content}
                  onChange={(e) =>
                    setEditingContent({ ...editingContent, content: e.target.value })
                  }
                  rows={16}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-mono"
                  placeholder="Nhập nội dung trang..."
                />
                <p className="text-xs text-neutral-500 mt-2">
                  {editingContent.content.length} ký tự · Hỗ trợ định dạng Markdown (**, ##, -, etc.)
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-neutral-200 bg-neutral-50">
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setEditingContent(null)}
                  className="px-4 py-2.5 border border-neutral-300 rounded-lg text-sm font-semibold hover:bg-white transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-neutral-800 transition disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Lưu thay đổi</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
