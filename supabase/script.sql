-- ==============================================================================
-- VIET CITY WEAR — DATABASE CHUẨN HOÁ CHO SUPABASE
-- Được nâng cấp & chuẩn hoá từ bản thiết kế của nhóm:
--  + Giữ nguyên 100% nghiệp vụ: Media, Timeline, FoodSpot, Variant, Accessory, Blog...
--  + Chuẩn hoá Supabase Auth: Kết nối auth.users qua UUID (Bỏ Password tự chế)
--  + Chuẩn hoá PostgreSQL: Dùng snake_case thay vì PascalCase ngoặc kép
--  + Bổ sung Row Level Security (RLS) & Trigger tự động đồng bộ tài khoản
-- ==============================================================================

-- ==============================================================================
-- 0. DỌN SẠCH TOÀN BỘ CÁC BẢNG CŨ (CẢ VIẾT HOA VÀ VIẾT THƯỜNG)
-- ==============================================================================
DROP TABLE IF EXISTS "OrderItem" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "NFCTag" CASCADE;
DROP TABLE IF EXISTS "ProductAccessory" CASCADE;
DROP TABLE IF EXISTS "ProductVariant" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "FoodSpot" CASCADE;
DROP TABLE IF EXISTS "TravelTimeline" CASCADE;
DROP TABLE IF EXISTS "LandmarkMedia" CASCADE;
DROP TABLE IF EXISTS "Landmark" CASCADE;
DROP TABLE IF EXISTS "City" CASCADE;
DROP TABLE IF EXISTS "Blog" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.nfc_tags CASCADE;
DROP TABLE IF EXISTS public.product_accessories CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.product_inventory CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.food_spots CASCADE;
DROP TABLE IF EXISTS public.travel_timelines CASCADE;
DROP TABLE IF EXISTS public.landmark_media CASCADE;
DROP TABLE IF EXISTS public.landmarks CASCADE;
DROP TABLE IF EXISTS public.cities CASCADE;
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.website_content CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 2. BẢNG USERS (Hồ sơ người dùng — Liên kết trực tiếp với Supabase auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(150) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    role VARCHAR(30) NOT NULL DEFAULT 'user', -- 'admin', 'user'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. CITIES (Thành phố văn hoá)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    cover_image VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. LANDMARKS (Địa danh di sản)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.landmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    story TEXT,
    history TEXT,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. LANDMARK MEDIA (Ảnh & Video di sản)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.landmark_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landmark_id UUID NOT NULL REFERENCES public.landmarks(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL DEFAULT 'Image', -- 'Image', 'Video'
    url VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. TRAVEL TIMELINES (Lịch trình khám phá theo khung giờ)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.travel_timelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landmark_id UUID NOT NULL REFERENCES public.landmarks(id) ON DELETE CASCADE,
    step_order INT NOT NULL DEFAULT 1,
    duration VARCHAR(50),
    note VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. FOOD SPOTS (Quán ăn & Ẩm thực đặc sản địa phương)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.food_spots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    map_link VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. PRODUCTS (Danh mục sản phẩm áo thun văn hoá)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    base_price NUMERIC(18,2) NOT NULL CHECK (base_price >= 0),
    description TEXT,
    size_guide_text TEXT,
    package_type VARCHAR(100) DEFAULT 'Tiêu chuẩn',
    front_image VARCHAR(500),
    back_image VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'Active', -- 'Active', 'Inactive', 'OutOfStock'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. PRODUCT VARIANTS (Biến thể theo Màu sắc, Size & Tồn kho)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image VARCHAR(500),
    color VARCHAR(50) NOT NULL,
    size VARCHAR(20) NOT NULL,
    price NUMERIC(18,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_variant UNIQUE (product_id, color, size)
);

-- ------------------------------------------------------------------------------
-- 10. PRODUCT ACCESSORIES (Phụ kiện đi kèm trong Combo)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_accessories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL, -- 'LandmarkCard', 'NfcKeychain', 'Sticker'
    name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. NFC TAGS (Quản lý mã chip NFC gắn trên áo/móc khóa)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.nfc_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nfc_code VARCHAR(50) NOT NULL UNIQUE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    scan_count INT NOT NULL DEFAULT 0,
    experience_url VARCHAR(500) NOT NULL DEFAULT '/explore/hanoi',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. ORDERS (Đơn hàng & Thanh toán COD)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    receiver_name VARCHAR(100) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    total_amount NUMERIC(18,2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'processing', -- 'processing', 'completed', 'canceled'
    payment_method VARCHAR(30) NOT NULL DEFAULT 'COD',
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 13. ORDER ITEMS (Chi tiết từng biến thể trong đơn hàng)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(18,2) NOT NULL CHECK (unit_price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 14. BLOGS (Bài viết văn hoá, tin tức du lịch di sản)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE,
    content TEXT,
    cover_image VARCHAR(500),
    category VARCHAR(50) DEFAULT 'Culture', -- 'Culture', 'Travel', 'Landmark'
    status VARCHAR(30) NOT NULL DEFAULT 'Published', -- 'Draft', 'Published'
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 15. TỰ ĐỘNG ĐỒNG BỘ SUPABASE AUTH -> PUBLIC.USERS
-- Khi người dùng đăng ký qua Supabase Auth, tự động tạo profile tương ứng
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
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
-- 16. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landmark_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfc_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Cho phép đọc công khai (Public Read)
CREATE POLICY "Public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public read cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Public read landmarks" ON public.landmarks FOR SELECT USING (true);
CREATE POLICY "Public read landmark_media" ON public.landmark_media FOR SELECT USING (true);
CREATE POLICY "Public read travel_timelines" ON public.travel_timelines FOR SELECT USING (true);
CREATE POLICY "Public read food_spots" ON public.food_spots FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read product_variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Public read product_accessories" ON public.product_accessories FOR SELECT USING (true);
CREATE POLICY "Public read nfc_tags" ON public.nfc_tags FOR SELECT USING (true);
CREATE POLICY "Public read blogs" ON public.blogs FOR SELECT USING (true);

-- Cho phép Quản trị viên (Admin) & Hệ thống toàn quyền Thêm/Sửa/Xóa (CRUD)
CREATE POLICY "Allow CRUD users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD cities" ON public.cities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD landmarks" ON public.landmarks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD landmark_media" ON public.landmark_media FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD travel_timelines" ON public.travel_timelines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD food_spots" ON public.food_spots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD product_variants" ON public.product_variants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD product_accessories" ON public.product_accessories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD nfc_tags" ON public.nfc_tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD order_items" ON public.order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD blogs" ON public.blogs FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 17. SEED DATA MẪU KHỞI TẠO (Dành cho bản demo)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  hn_id UUID;
  sp1_id UUID;
  var1_id UUID;
BEGIN
  -- 1. Thành phố Hà Nội
  INSERT INTO public.cities (name, description, cover_image)
  VALUES ('Hà Nội', 'Thủ đô nghìn năm văn hiến, nét trầm mặc của 36 phố phường và Hồ Gươm cổ kính.', '/images/hanoi-banner.jpg')
  ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
  RETURNING id INTO hn_id;

  -- 2. Sản phẩm Áo thun Hà Nội
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name LIKE 'Áo Thun Hà Nội Phố%') THEN
    INSERT INTO public.products (city_id, name, base_price, description, size_guide_text, package_type, front_image, back_image, status)
    VALUES (
      hn_id,
      'Áo Thun Hà Nội Phố — Signature Tee',
      299000,
      'Lấy cảm hứng từ mái ngói rêu phong 36 phố phường và Tháp Rùa Hồ Gươm cổ kính.',
      'M: 50-65kg | L: 65-75kg | XL: 75-85kg',
      'Tiêu chuẩn (Áo + Thẻ NFC + Hộp)',
      '/images/products/tee-hanoi-front.jpg',
      '/images/products/tee-hanoi-back.jpg',
      'Active'
    ) RETURNING id INTO sp1_id;

    -- Biến thể màu sắc & size
    INSERT INTO public.product_variants (product_id, color, size, price, stock_quantity, image)
    VALUES 
      (sp1_id, 'Đen Onyx', 'M', 299000, 50, '/images/products/tee-hanoi-front.jpg'),
      (sp1_id, 'Đen Onyx', 'L', 299000, 45, '/images/products/tee-hanoi-front.jpg')
    RETURNING id INTO var1_id;

    -- Thẻ NFC
    INSERT INTO public.nfc_tags (nfc_code, product_id, city_id, scan_count, experience_url)
    VALUES ('VCW-HN-001', sp1_id, hn_id, 142, '/explore/hanoi')
    ON CONFLICT (nfc_code) DO NOTHING;
  END IF;
END $$;
