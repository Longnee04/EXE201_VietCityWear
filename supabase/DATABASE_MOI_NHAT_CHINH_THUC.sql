-- ==============================================================================
-- VIET CITY WEAR — DATABASE CHÍNH THỨC MỚI NHẤT (ALL-IN-ONE)
-- File này đã gộp toàn bộ cấu trúc bảng, trigger, phân quyền và dữ liệu mẫu.
-- ĐẶC BIỆT: Có cơ chế tự động sửa lỗi và bổ sung cột nếu bạn đã từng chạy bản cũ!
-- Hướng dẫn: Chỉ cần Copy toàn bộ nội dung file này dán vào Supabase SQL Editor và bấm RUN.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS & ENUMS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 2. ĐỊNH NGHĨA CÁC BẢNG (TABLES)
-- ------------------------------------------------------------------------------

-- (1) BẢNG USERS (Hồ sơ người dùng đồng bộ từ auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (2) BẢNG CITIES (Thành phố văn hóa & di sản)
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (3) BẢNG LANDMARKS (Địa danh, câu chuyện di sản, ẩm thực)
CREATE TABLE IF NOT EXISTS public.landmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    story TEXT,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    video_url TEXT,
    travel_timeline TEXT,
    food_suggestions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (4) BẢNG PRODUCTS (Danh mục áo thun văn hóa)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    base_price NUMERIC(12, 2) NOT NULL CHECK (base_price >= 0),
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    front_image TEXT,
    back_image TEXT,
    description TEXT,
    size_guide_text TEXT,
    package_type TEXT DEFAULT 'Tiêu chuẩn',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (5) BẢNG PRODUCT_INVENTORY (Tồn kho theo biến thể Size & Màu)
CREATE TABLE IF NOT EXISTS public.product_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    status BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_product_variant UNIQUE (product_id, size, color)
);

-- (6) BẢNG NFC_TAGS (Mã chip NFC & liên kết trải nghiệm văn hóa)
CREATE TABLE IF NOT EXISTS public.nfc_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nfc_code TEXT NOT NULL UNIQUE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    scan_count INTEGER NOT NULL DEFAULT 0,
    experience_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (7) BẢNG ORDERS (Đơn đặt hàng COD)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    receiver_name TEXT NOT NULL,
    receiver_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'COD',
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'canceled')),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (8) BẢNG ORDER_ITEMS (Chi tiết từng món trong đơn)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase NUMERIC(12, 2) NOT NULL CHECK (price_at_purchase >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (9) BẢNG ARTICLES & WEBSITE CONTENT (Bài viết văn hóa & Banner)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    thumbnail TEXT,
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.website_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT NOT NULL UNIQUE,
    title TEXT,
    subtitle TEXT,
    image_url TEXT,
    content_json JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. TỰ ĐỘNG BỔ SUNG CỘT CHO BẢNG CŨ (NẾU BẠN ĐÃ TẠO TỪ BẢN PHASE 1 TRƯỚC ĐÓ)
-- ------------------------------------------------------------------------------
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS front_image TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS back_image TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS package_type TEXT DEFAULT 'Tiêu chuẩn';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size_guide_text TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS address TEXT;

-- ------------------------------------------------------------------------------
-- 4. FUNCTION & TRIGGER TỰ ĐỘNG ĐỒNG BỘ TÀI KHOẢN (AUTH -> USERS)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    'user'::user_role
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = CASE WHEN EXCLUDED.full_name <> '' THEN EXCLUDED.full_name ELSE public.users.full_name END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 5. PHÂN QUYỀN TRUY CẬP (ROW LEVEL SECURITY - RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfc_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- Xóa các policy cũ để tránh trùng lặp
DROP POLICY IF EXISTS "Public read all products" ON public.products;
DROP POLICY IF EXISTS "Allow CRUD products" ON public.products;
DROP POLICY IF EXISTS "Public read all cities" ON public.cities;
DROP POLICY IF EXISTS "Allow CRUD cities" ON public.cities;
DROP POLICY IF EXISTS "Public read all landmarks" ON public.landmarks;
DROP POLICY IF EXISTS "Allow CRUD landmarks" ON public.landmarks;
DROP POLICY IF EXISTS "Public read all inventory" ON public.product_inventory;
DROP POLICY IF EXISTS "Allow CRUD inventory" ON public.product_inventory;
DROP POLICY IF EXISTS "Public read all nfc_tags" ON public.nfc_tags;
DROP POLICY IF EXISTS "Allow CRUD nfc_tags" ON public.nfc_tags;
DROP POLICY IF EXISTS "Allow CRUD orders" ON public.orders;
DROP POLICY IF EXISTS "Allow CRUD order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow CRUD users" ON public.users;

-- Cấp quyền đọc công khai (Cho khách hàng xem sản phẩm, văn hóa, nfc)
CREATE POLICY "Public read all products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read all cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Public read all landmarks" ON public.landmarks FOR SELECT USING (true);
CREATE POLICY "Public read all inventory" ON public.product_inventory FOR SELECT USING (true);
CREATE POLICY "Public read all nfc_tags" ON public.nfc_tags FOR SELECT USING (true);
CREATE POLICY "Public read all users" ON public.users FOR SELECT USING (true);

-- Cấp quyền Thêm / Sửa / Xóa cho quản trị viên và hệ thống
CREATE POLICY "Allow CRUD products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD inventory" ON public.product_inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD cities" ON public.cities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD landmarks" ON public.landmarks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD nfc_tags" ON public.nfc_tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD order_items" ON public.order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 6. NẠP DỮ LIỆU MẪU CHUẨN (SEED DATA THEO PRD)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  hn_id UUID;
  hue_id UUID;
  hoian_id UUID;
  sp1_id UUID;
  sp2_id UUID;
  sp3_id UUID;
  ord1_id UUID;
BEGIN
  -- 1. Thêm 3 Thành phố di sản
  INSERT INTO public.cities (name, description, image_url)
  VALUES ('Hà Nội', 'Thủ đô nghìn năm văn hiến, nét trầm mặc của 36 phố phường và Hồ Gươm cổ kính.', '/images/hanoi-banner.jpg')
  ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
  RETURNING id INTO hn_id;

  INSERT INTO public.cities (name, description, image_url)
  VALUES ('Huế', 'Cố đô thơ mộng bên dòng sông Hương, lưu giữ nét đẹp cung đình triều Nguyễn.', '/images/hue-banner.jpg')
  ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
  RETURNING id INTO hue_id;

  INSERT INTO public.cities (name, description, image_url)
  VALUES ('Hội An', 'Phố cổ đèn lồng vàng son, di sản văn hóa thế giới bên dòng sông Hoài.', '/images/hoian-banner.jpg')
  ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
  RETURNING id INTO hoian_id;

  -- 2. Thêm Địa danh văn hóa cho Hà Nội
  IF NOT EXISTS (SELECT 1 FROM public.landmarks WHERE name = 'Hồ Gươm & Tháp Rùa') THEN
    INSERT INTO public.landmarks (city_id, name, story, travel_timeline, food_suggestions)
    VALUES (
      hn_id,
      'Hồ Gươm & Tháp Rùa',
      'Trái tim của thủ đô gắn liền truyền thuyết vua Lê Lợi trả gươm báu cho Rùa Vàng.',
      'Khám phá từ 6:00 sáng hoặc đi dạo phố đi bộ cuối tuần.',
      'Kem Tràng Tiền, Cà phê trứng Giảng'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.landmarks WHERE name = 'Văn Miếu Quốc Tử Giám') THEN
    INSERT INTO public.landmarks (city_id, name, story, travel_timeline, food_suggestions)
    VALUES (
      hn_id,
      'Văn Miếu Quốc Tử Giám',
      'Trường đại học đầu tiên của Việt Nam, biểu tượng truyền thống hiếu học nghìn năm.',
      'Nên đi buổi sáng từ 8:00 - 11:30 để chụp ảnh đẹp.',
      'Bún chả Sinh Từ, Phở Bát Đàn'
    );
  END IF;

  -- 3. Thêm Sản phẩm áo thun văn hóa
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name LIKE 'Áo Thun Hà Nội Phố%') THEN
    INSERT INTO public.products (name, base_price, city_id, front_image, back_image, description, size_guide_text, package_type)
    VALUES (
      'Áo Thun Hà Nội Phố — Signature Tee',
      299000,
      hn_id,
      '/images/products/tee-hanoi-front.jpg',
      '/images/products/tee-hanoi-back.jpg',
      'Lấy cảm hứng từ mái ngói rêu phong 36 phố phường và Tháp Rùa Hồ Gươm cổ kính.',
      'M: 50-65kg | L: 65-75kg | XL: 75-85kg',
      'Tiêu chuẩn (Áo + Thẻ NFC + Hộp)'
    ) RETURNING id INTO sp1_id;

    -- Thêm biến thể tồn kho
    INSERT INTO public.product_inventory (product_id, size, color, stock_quantity, status)
    VALUES 
      (sp1_id, 'M', 'Đen Onyx', 50, true),
      (sp1_id, 'L', 'Đen Onyx', 45, true),
      (sp1_id, 'XL', 'Đen Onyx', 30, true),
      (sp1_id, 'L', 'Trắng Kem', 25, true);

    -- Gán chip NFC cho áo Hà Nội
    INSERT INTO public.nfc_tags (nfc_code, product_id, city_id, scan_count, experience_url)
    VALUES ('VCW-HN-001', sp1_id, hn_id, 142, '/explore/hanoi')
    ON CONFLICT (nfc_code) DO NOTHING;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name LIKE 'Áo Thun Cố Đô Huế%') THEN
    INSERT INTO public.products (name, base_price, city_id, front_image, back_image, description, size_guide_text, package_type)
    VALUES (
      'Áo Thun Cố Đô Huế — Heritage Tee',
      299000,
      hue_id,
      '/images/products/tee-hue-front.jpg',
      '/images/products/tee-hue-back.jpg',
      'Họa tiết rồng chầu Ngọ Môn và sắc tím hoàng cung trầm mặc xứ Huế.',
      'M: 50-65kg | L: 65-75kg | XL: 75-85kg',
      'Tiêu chuẩn (Áo + Thẻ NFC + Hộp)'
    ) RETURNING id INTO sp2_id;

    INSERT INTO public.product_inventory (product_id, size, color, stock_quantity, status)
    VALUES 
      (sp2_id, 'M', 'Tím Than', 40, true),
      (sp2_id, 'L', 'Tím Than', 35, true);

    INSERT INTO public.nfc_tags (nfc_code, product_id, city_id, scan_count, experience_url)
    VALUES ('VCW-HUE-001', sp2_id, hue_id, 89, '/explore/hue')
    ON CONFLICT (nfc_code) DO NOTHING;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name LIKE 'Áo Thun Phố Hội%') THEN
    INSERT INTO public.products (name, base_price, city_id, front_image, back_image, description, size_guide_text, package_type)
    VALUES (
      'Áo Thun Phố Hội Đèn Lồng — Golden Ancient Tee',
      349000,
      hoian_id,
      '/images/products/tee-hoian-front.jpg',
      '/images/products/tee-hoian-back.jpg',
      'Màu vàng hoài niệm của những bức tường cổ rêu phong và đèn lồng sông Hoài.',
      'M: 50-65kg | L: 65-75kg | XL: 75-85kg',
      'Đặc biệt (Áo + NFC + Postcard + Hộp quà)'
    ) RETURNING id INTO sp3_id;

    INSERT INTO public.product_inventory (product_id, size, color, stock_quantity, status)
    VALUES 
      (sp3_id, 'L', 'Vàng Cổ', 60, true),
      (sp3_id, 'XL', 'Vàng Cổ', 20, true);

    INSERT INTO public.nfc_tags (nfc_code, product_id, city_id, scan_count, experience_url)
    VALUES ('VCW-HOIAN-001', sp3_id, hoian_id, 215, '/explore/hoian')
    ON CONFLICT (nfc_code) DO NOTHING;
  END IF;

  -- 4. Thêm đơn hàng demo
  IF NOT EXISTS (SELECT 1 FROM public.orders WHERE receiver_name = 'Nguyễn Văn Long') THEN
    INSERT INTO public.orders (receiver_name, receiver_phone, shipping_address, payment_method, status, total_amount, note)
    VALUES (
      'Nguyễn Văn Long',
      '0987654321',
      'Tòa nhà Innovation Hub, Quận Cầu Giấy, Hà Nội',
      'COD',
      'processing',
      598000,
      'Giao hàng giờ hành chính giúp tôi'
    ) RETURNING id INTO ord1_id;

    IF sp1_id IS NOT NULL THEN
      INSERT INTO public.order_items (order_id, product_id, size, color, quantity, price_at_purchase)
      VALUES (ord1_id, sp1_id, 'L', 'Đen Onyx', 2, 299000);
    END IF;
  END IF;

END $$;

-- THÔNG BÁO HOÀN TẤT
SELECT 'Database Viet City Wear đã được cập nhật thành công 100%!' AS status;
