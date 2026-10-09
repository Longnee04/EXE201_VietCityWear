/**
 * VIET CITY WEAR - HẰNG SỐ & DỮ LIỆU ĐỊNH CẤU HÌNH HỆ THỐNG
 * 
 * QUY TẮC BẮT BUỘC:
 * 1. Không bịa số liệu hoặc chính sách.
 * 2. Thông tin chưa có (chất liệu, đổi trả, thời gian giao, địa chỉ, link MXH...)
 *    dùng placeholder dạng `[CẦN XÁC NHẬN: ...]`, gom tại đây để người dùng thay thế.
 * 3. Tuyệt đối không tạo review/đánh giá giả.
 * 4. Thanh toán duy nhất: COD. Freeship từ 500.000đ.
 */

export interface PricingPackage {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  badge?: string;
  isPopular?: boolean;
  description: string;
  includes: string[];
}

export const BRAND_CONFIG = {
  name: "VIET CITY WEAR",
  website: "https://vietcitywear.vercel.app/",
  
  // Thanh toán & Vận chuyển
  payment: {
    method: "COD",
    label: "Thanh toán khi nhận hàng (COD)",
    description: "Thanh toán bằng tiền mặt khi nhận hàng và kiểm tra sản phẩm.",
  },
  shipping: {
    freeShippingThreshold: 500000, // Freeship từ 500.000đ
    standardFee: 30000,
    estimatedTime: "[CẦN XÁC NHẬN: 1-2 ngày đối với nội thành Hà Nội, 2-4 ngày đối với các tỉnh/thành khác]",
  },

  // 3 Gói sản phẩm chính thức MVP
  packages: [
    {
      id: "pkg-basic",
      name: "Gói Cơ bản",
      price: 249000,
      formattedPrice: "249.000đ",
      isPopular: false,
      description: "Lựa chọn khởi đầu lưu giữ kỷ niệm thành phố",
      includes: [
        "01 Áo thun văn hóa Hà Nội",
        "03 Thẻ địa danh Hà Nội (tích hợp QR)",
      ],
    },
    {
      id: "pkg-standard",
      name: "Gói Tiêu chuẩn",
      price: 299000,
      formattedPrice: "299.000đ",
      badge: "PHỔ BIẾN NHẤT",
      isPopular: true,
      description: "Trọn vẹn trải nghiệm công nghệ chạm di sản số",
      includes: [
        "01 Áo thun văn hóa Hà Nội",
        "05 Thẻ địa danh Hà Nội chính thức",
        "01 Móc khóa gỗ khắc CNC tích hợp chip NFC",
      ],
    },
    {
      id: "pkg-special",
      name: "Gói Đặc biệt",
      price: 349000,
      formattedPrice: "349.000đ",
      badge: "PHIÊN BẢN ĐẶC BIỆT",
      isPopular: false,
      description: "Chất liệu cao cấp & hộp quà tặng thủ công sang trọng",
      includes: [
        "01 Áo thun chất liệu tốt hơn (dày dặn, giữ form)",
        "05 Thẻ địa danh Hà Nội chính thức",
        "01 Móc khóa gỗ khắc CNC tích hợp chip NFC",
        "01 Hộp quà tặng thiết kế thủ công đặc biệt",
      ],
    },
  ] as PricingPackage[],

  // Các bộ sưu tập thành phố
  collections: {
    mvp: {
      id: "hanoi",
      name: "Hà Nội",
      status: "active",
      description: "Bộ sưu tập mở màn – Hà Nội nghìn năm văn hiến",
      landmarks: [
        "Hồ Gươm – Tháp Rùa",
        "Văn Miếu – Quốc Tử Giám",
        "Lăng Chủ tịch Hồ Chí Minh",
        "Nhà Thờ Lớn Hà Nội",
        "Phố Cổ Hà Nội (36 Phố Phường)",
      ],
    },
    second: {
      id: "haiphong",
      name: "Hải Phòng",
      status: "second_collection",
      description: "Bộ sưu tập thứ hai – Thành phố hoa phượng đỏ",
    },
    upcoming: [
      { id: "hue", name: "Huế", status: "coming_soon" },
      { id: "hoian", name: "Hội An", status: "coming_soon" },
      { id: "danang", name: "Đà Nẵng", status: "coming_soon" },
      { id: "saigon", name: "TP. Hồ Chí Minh", status: "coming_soon" },
    ],
  },

  // Bộ sưu tập thẻ riêng
  storyCardsCollection: {
    name: "Bộ HANOI STORY CARDS (10 thẻ)",
    totalCards: 10,
    note: "Bộ HANOI STORY CARDS (10 thẻ) là sản phẩm sưu tập riêng; gói áo chỉ kèm 3 hoặc 5 thẻ.",
  },

  // Thông tin liên hệ & Cửa hàng (Placeholder [CẦN XÁC NHẬN: ...])
  contact: {
    hotline: "[CẦN XÁC NHẬN: Hotline 09xx xxx xxx]",
    email: "[CẦN XÁC NHẬN: contact@vietcitywear.com]",
    address: "[CẦN XÁC NHẬN: Địa chỉ trụ sở / không gian trải nghiệm tại Hà Nội]",
    workingHours: "[CẦN XÁC NHẬN: 08:30 – 21:30 hàng ngày]",
  },

  // Mạng xã hội (Placeholder [CẦN XÁC NHẬN: ...])
  social: {
    facebook: "[CẦN XÁC NHẬN: https://facebook.com/vietcitywear]",
    instagram: "[CẦN XÁC NHẬN: https://instagram.com/vietcitywear]",
    tiktok: "[CẦN XÁC NHẬN: https://tiktok.com/@vietcitywear]",
  },

  // Chính sách sản phẩm (Placeholder [CẦN XÁC NHẬN: ...])
  policies: {
    material: "[CẦN XÁC NHẬN: 100% Cotton định lượng 250gsm, xử lý bề mặt mềm mịn, thoáng mát]",
    returnPolicy: "[CẦN XÁC NHẬN: Đổi trả trong 7 ngày đối với sản phẩm còn nguyên tem mác và thẻ NFC]",
    warranty: "[CẦN XÁC NHẬN: Bảo hành lỗi kỹ thuật chip NFC trong 30 ngày]",
  },
} as const;
