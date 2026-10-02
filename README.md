# 🇻🇳 VIET CITY WEAR

> **Dự án Hệ thống thông tin (EXE201)**  
> Kết hợp áo thun di sản, thẻ địa danh văn hóa và công nghệ NFC mang lại trải nghiệm du lịch số độc đáo.

---

## 📌 1. Giới thiệu dự án

**VIET CITY WEAR** là dự án e-commerce kết hợp công nghệ tương tác thực tế dành cho du khách. Dự án bao gồm các trụ cột chính:
1. **NFC Landing Page (Trang đích NFC):** Khi du khách chạm điện thoại vào móc khóa NFC trên áo/thẻ, trang web mở ra giao diện văn hóa đa ngôn ngữ (Việt - Anh), câu chuyện lịch sử, cẩm nang du lịch và audio thuyết minh.
2. **E-Commerce Module:** Cung cấp 3 phân loại gói sản phẩm lưu niệm theo từng thành phố (Cơ bản: 249.000đ, Tiêu chuẩn: 299.000đ, Đặc biệt: 349.000đ), giỏ hàng và tích hợp cổng thanh toán trực tuyến.
3. **Tính năng mở rộng (Gamification & AI):**
   - **Hộ chiếu số (Digital Passport):** Nhập mã thẻ để đóng dấu mộc ảo sưu tầm các thành phố (Hà Nội, Huế, Hội An, v.v.).
   - **Trợ lý AI du lịch:** Tích hợp Google Gemini AI giải đáp thông tin bản địa.
   - **WebAR:** Trải nghiệm thực tế tăng cường quét thẻ địa danh.

---

## 🛠️ 2. Công nghệ sử dụng (Tech Stack)

- **Frontend & Backend:** [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma ORM](https://www.prisma.io/) (TypeScript Type Safety, Prisma Studio)
- **Icons & UI:** [Lucide React](https://lucide.dev/), `clsx`, `tailwind-merge`

---

## 📂 3. Cấu trúc thư mục

```text
EXE201/
├── prisma/
│   └── schema.prisma         # Định nghĩa Schema cơ sở dữ liệu PostgreSQL
├── public/                   # Tài nguyên tĩnh (ảnh, icon, font)
├── src/
│   ├── app/                  # Next.js App Router (pages & route handlers)
│   │   ├── api/              # API endpoints
│   │   ├── globals.css       # CSS toàn cục & cấu hình Tailwind
│   │   ├── layout.tsx        # Khung bố cục chính
│   │   └── page.tsx          # Trang chủ
│   ├── components/
│   │   ├── layout/           # Header, Footer, Sidebar...
│   │   └── ui/               # Button, Modal, Card, Input...
│   ├── lib/
│   │   ├── prisma.ts         # Prisma Client singleton
│   │   └── utils.ts          # Hàm tiện ích (cn, formatDate...)
│   └── types/                # Định nghĩa kiểu dữ liệu TypeScript dùng chung
├── .env.example              # Tệp mẫu cấu hình môi trường
├── .gitignore                # Danh sách file không đưa lên Git
├── package.json              # Quản lý thư viện và scripts
├── tsconfig.json             # Cấu hình TypeScript
└── README.md                 # Hướng dẫn dự án
```

---

## 🚀 4. Hướng dẫn cài đặt cho thành viên trong nhóm

### Yêu cầu tiên quyết
- **Node.js**: Phiên bản `>= 20.x` (khuyến nghị v20 trở lên)
- **PostgreSQL**: Đã cài PostgreSQL trên máy (cổng mặc định 5432) HOẶC sử dụng database miễn phí trên mây như [Supabase](https://supabase.com/) / [Neon](https://neon.tech/).

---

### Bước 1: Clone dự án về máy
```bash
git clone <URL_GITHUB_CUA_NHOM>
cd EXE201
```

---

### Bước 2: Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
```

---

### Bước 3: Cấu hình biến môi trường (.env)
Tạo một bản sao từ file `.env.example` thành `.env`:

- **Trên Windows PowerShell:**
  ```powershell
  Copy-Item .env.example .env
  ```
- **Trên macOS / Linux:**
  ```bash
  cp .env.example .env
  ```

Mở tệp `.env` vừa tạo và cập nhật chuỗi kết nối PostgreSQL của bạn tại dòng `DATABASE_URL`:
```env
DATABASE_URL="postgresql://postgres:matkhau@localhost:5432/vietcitywear?schema=public"
```

---

### Bước 4: Đồng bộ cơ sở dữ liệu (Prisma)
Chạy lệnh sau để Prisma tự động tạo các bảng trong PostgreSQL theo `schema.prisma`:
```bash
npx prisma db push
```

*(Tùy chọn)* Mở giao diện trực quan quản lý dữ liệu trên trình duyệt:
```bash
npx prisma studio
```

---

### Bước 5: Khởi chạy dự án ở môi trường phát triển
```bash
npm run dev
```

Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🤝 5. Quy ước làm việc nhóm với Git

Để tránh xung đột code (conflict) khi nhiều người làm chung:

1. **Không commit trực tiếp lên branch `main`:**
   - Tạo branch riêng cho từng tính năng:
     ```bash
     git checkout -b feature/nfc-landing-page
     git checkout -b feature/cart-checkout
     git checkout -b feature/auth
     ```
2. **Quy tắc đặt tên commit rõ ràng:**
   - `feat: thêm giao diện trang đích NFC`
   - `fix: sửa lỗi tính tổng tiền giỏ hàng`
   - `style: cập nhật màu sắc thương hiệu Viet City Wear`
3. **Trước khi push code:**
   - Luôn kéo code mới nhất từ nhánh chính về:
     ```bash
     git checkout main
     git pull origin main
     git checkout <nhanh-cua-ban>
     git merge main
     ```
   - Tạo Pull Request (PR) trên GitHub để nhóm cùng review trước khi gộp vào `main`.

---

## 📞 Hỗ trợ & Liên hệ
- **Đồ án:** EXE201 - Phát triển hệ thống thông tin
- **Nhóm thực hiện:** Nhóm Viet City Wear
