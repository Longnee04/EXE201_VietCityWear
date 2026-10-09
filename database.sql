-- ==============================================================================
-- VIET CITY WEAR — TỆP CƠ SỞ DỮ LIỆU CHUẨN HOÁ DUY NHẤT (DATABASE.SQL)
-- Hệ quản trị cơ sở dữ liệu: Supabase (PostgreSQL 15+)
-- 
-- Tệp này tổng hợp toàn bộ:
--   1. Tiện ích mở rộng (Extensions) & Kiểu dữ liệu (Enums)
--   2. Cấu trúc 10 bảng cốt lõi phục vụ 100% giao diện Next.js hiện tại
--   3. 4 bảng mở rộng (Media, Timelines, FoodSpots, Accessories) phục vụ tính năng tương lai
--   4. Các View tương thích ngược (product_inventory, articles)
--   5. Hàm & Trigger tự động đồng bộ tài khoản (auth.users -> public.users)
--   6. Phân quyền bảo mật hàng (Row Level Security - RLS)
--   7. Bộ dữ liệu mẫu đầy đủ (Seed Data) chuẩn theo PRD
-- 
-- Hướng dẫn triển khai:
--   Mở Supabase Studio -> SQL Editor -> Dán toàn bộ nội dung tệp này -> Bấm RUN.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TIỆN ÍCH MỞ RỘNG & KIỂU DỮ LIỆU (EXTENSIONS & ENUMS)
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('processing', 'completed', 'canceled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 2. CÁC BẢNG CỐT LÕI (CORE TABLES)
-- ------------------------------------------------------------------------------

-- (1) BẢNG USERS — Hồ sơ người dùng (Đồng bộ từ auth.users của Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(150) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (2) BẢNG CITIES — Thành phố văn hóa & di sản
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    cover_image VARCHAR(500) DEFAULT '/images/hanoi-banner.jpg',
    image_url VARCHAR(500) DEFAULT '/images/hanoi-banner.jpg',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (3) BẢNG LANDMARKS — Địa danh di sản & câu chuyện văn hóa
CREATE TABLE IF NOT EXISTS public.landmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    story TEXT,
    history TEXT,
    travel_timeline TEXT,
    food_suggestions TEXT,
    order_index INT NOT NULL DEFAULT 0,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    video_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (4) BẢNG PRODUCTS — Danh mục áo thun văn hóa
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    base_price NUMERIC(12, 2) NOT NULL CHECK (base_price >= 0),
    description TEXT,
    size_guide_text TEXT DEFAULT 'M: 50-65kg | L: 65-75kg | XL: 75-85kg',
    package_type VARCHAR(100) DEFAULT 'Tiêu chuẩn (Áo + 5 Thẻ + Móc khóa NFC)',
    front_image VARCHAR(500) DEFAULT '/images/products/tee-hanoi-front.jpg',
    back_image VARCHAR(500) DEFAULT '/images/products/tee-hanoi-back.jpg',
    is_active BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(30) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (5) BẢNG PRODUCT_VARIANTS — Biến thể áo theo Size, Màu & Số lượng tồn kho
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image VARCHAR(500),
    color VARCHAR(50) NOT NULL,
    size VARCHAR(20) NOT NULL,
    price NUMERIC(12, 2) NOT NULL DEFAULT 299000 CHECK (price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    status BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_product_variant UNIQUE (product_id, color, size)
);

-- (6) BẢNG NFC_TAGS — Mã định danh chip NFC & Trải nghiệm di sản
CREATE TABLE IF NOT EXISTS public.nfc_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nfc_code VARCHAR(50) NOT NULL UNIQUE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    scan_count INT NOT NULL DEFAULT 0 CHECK (scan_count >= 0),
    experience_url VARCHAR(500) NOT NULL DEFAULT '/explore/hanoi',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (7) BẢNG ORDERS — Đơn hàng & thông tin thanh toán COD
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    receiver_name VARCHAR(100) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'COD',
    status order_status NOT NULL DEFAULT 'processing',
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (8) BẢNG ORDER_ITEMS — Chi tiết từng món hàng trong đơn hàng
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    size VARCHAR(20) DEFAULT 'L',
    color VARCHAR(50) DEFAULT 'Tiêu chuẩn',
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (9) BẢNG BLOGS — Bài viết văn hóa, di sản & tin tức du lịch
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE,
    content TEXT,
    cover_image VARCHAR(500),
    category VARCHAR(50) DEFAULT 'Culture',
    status VARCHAR(30) NOT NULL DEFAULT 'Published',
    published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (10) BẢNG WEBSITE_CONTENT — Nội dung động các trang tĩnh (About, Terms, Privacy, Contact)
CREATE TABLE IF NOT EXISTS public.website_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name VARCHAR(100) NOT NULL UNIQUE,
    content_body JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. CÁC BẢNG PHỤ TRỢ MỞ RỘNG (EXTENDED TABLES CHO PHASE TIẾP THEO)
-- ------------------------------------------------------------------------------

-- Media mở rộng cho từng địa danh (Ảnh chi tiết, video tư liệu)
CREATE TABLE IF NOT EXISTS public.landmark_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landmark_id UUID NOT NULL REFERENCES public.landmarks(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL DEFAULT 'Image',
    url VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Lịch trình trải nghiệm theo khung thời gian
CREATE TABLE IF NOT EXISTS public.travel_timelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landmark_id UUID NOT NULL REFERENCES public.landmarks(id) ON DELETE CASCADE,
    step_order INT NOT NULL DEFAULT 1,
    duration VARCHAR(50),
    note VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Gợi ý quán ăn, ẩm thực địa phương theo thành phố
CREATE TABLE IF NOT EXISTS public.food_spots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    map_link VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Phụ kiện đi kèm trong từng combo sản phẩm (Thẻ địa danh, sticker...)
CREATE TABLE IF NOT EXISTS public.product_accessories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL DEFAULT 'LandmarkCard',
    name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 4. VIEW TƯƠNG THÍCH NGƯỢC (COMPATIBILITY VIEWS)
-- Giúp các phiên bản code cũ gọi product_inventory hoặc articles không bị lỗi
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.product_inventory AS 
SELECT 
    id,
    product_id,
    size,
    color,
    stock_quantity,
    status,
    created_at
FROM public.product_variants;

CREATE OR REPLACE VIEW public.articles AS 
SELECT 
    id,
    title,
    slug,
    content,
    cover_image AS thumbnail,
    author_id,
    (status = 'Published') AS is_published,
    created_at
FROM public.blogs;

-- ------------------------------------------------------------------------------
-- 5. FUNCTION & TRIGGER TỰ ĐỘNG ĐỒNG BỘ AUTH -> PUBLIC.USERS
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
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user'::user_role)
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

-- Hàm RPC tăng lượt quét NFC an toàn
CREATE OR REPLACE FUNCTION public.increment_nfc_scan(tag_code TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.nfc_tags
  SET scan_count = scan_count + 1
  WHERE nfc_code = tag_code;
END;
$$;

-- ------------------------------------------------------------------------------
-- 6. PHÂN QUYỀN TRUY CẬP (ROW LEVEL SECURITY - RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfc_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landmark_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_accessories ENABLE ROW LEVEL SECURITY;

-- Xóa các policy cũ để tránh trùng lặp khi chạy lại
DROP POLICY IF EXISTS "Public read users" ON public.users;
DROP POLICY IF EXISTS "Allow CRUD users" ON public.users;
DROP POLICY IF EXISTS "Public read cities" ON public.cities;
DROP POLICY IF EXISTS "Allow CRUD cities" ON public.cities;
DROP POLICY IF EXISTS "Public read landmarks" ON public.landmarks;
DROP POLICY IF EXISTS "Allow CRUD landmarks" ON public.landmarks;
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Allow CRUD products" ON public.products;
DROP POLICY IF EXISTS "Public read product_variants" ON public.product_variants;
DROP POLICY IF EXISTS "Allow CRUD product_variants" ON public.product_variants;
DROP POLICY IF EXISTS "Public read nfc_tags" ON public.nfc_tags;
DROP POLICY IF EXISTS "Allow CRUD nfc_tags" ON public.nfc_tags;
DROP POLICY IF EXISTS "Allow create orders" ON public.orders;
DROP POLICY IF EXISTS "Allow CRUD orders" ON public.orders;
DROP POLICY IF EXISTS "Allow create order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow CRUD order_items" ON public.order_items;
DROP POLICY IF EXISTS "Public read blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow CRUD blogs" ON public.blogs;
DROP POLICY IF EXISTS "Public read website_content" ON public.website_content;
DROP POLICY IF EXISTS "Allow CRUD website_content" ON public.website_content;

-- Quyền đọc công khai cho khách xem web & tra cứu
CREATE POLICY "Public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public read cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Public read landmarks" ON public.landmarks FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read product_variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Public read nfc_tags" ON public.nfc_tags FOR SELECT USING (true);
CREATE POLICY "Public read blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Public read website_content" ON public.website_content FOR SELECT USING (true);

-- Cho phép khách đặt đơn hàng COD (Checkout)
CREATE POLICY "Allow create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow create order_items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Toàn quyền cho Quản trị viên và xử lý nội bộ hệ thống (CRUD)
CREATE POLICY "Allow CRUD users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD cities" ON public.cities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD landmarks" ON public.landmarks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD product_variants" ON public.product_variants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD nfc_tags" ON public.nfc_tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD order_items" ON public.order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD blogs" ON public.blogs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow CRUD website_content" ON public.website_content FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 7. DỮ LIỆU MẪU ĐẦY ĐỦ (SEED DATA CHUẨN PRD)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  hn_id UUID;
  hue_id UUID;
  ha_id UUID;
  lm_guom_id UUID;
  lm_vanmieu_id UUID;
  lm_phoco_id UUID;
  prod_hn_id UUID;
  prod_hue_id UUID;
  prod_ha_id UUID;
  order_sample_id UUID;
BEGIN
  -- (1) Nạp 3 Thành phố di sản
  INSERT INTO public.cities (name, description, cover_image, image_url)
  VALUES 
    ('Hà Nội', 'Thủ đô nghìn năm văn hiến, nét trầm mặc của 36 phố phường và Hồ Gươm cổ kính.', '/images/hanoi-banner.jpg', '/images/hanoi-banner.jpg')
  ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
  RETURNING id INTO hn_id;

  INSERT INTO public.cities (name, description, cover_image, image_url)
  VALUES 
    ('Huế', 'Cố đô thơ mộng bên dòng sông Hương, lưu giữ nét đẹp cung đình triều Nguyễn uy nghiêm.', '/images/hue-banner.jpg', '/images/hue-banner.jpg')
  ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
  RETURNING id INTO hue_id;

  INSERT INTO public.cities (name, description, cover_image, image_url)
  VALUES 
    ('Hội An', 'Phố cổ đèn lồng vàng son, di sản văn hóa thế giới bên dòng sông Hoài hiền hòa.', '/images/hoian-banner.jpg', '/images/hoian-banner.jpg')
  ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
  RETURNING id INTO ha_id;

  -- (2) Nạp Địa danh văn hóa cho Hà Nội
  IF NOT EXISTS (SELECT 1 FROM public.landmarks WHERE name = 'Hồ Gươm & Tháp Rùa') THEN
    INSERT INTO public.landmarks (city_id, name, story, history, travel_timeline, food_suggestions, order_index)
    VALUES (
      hn_id,
      'Hồ Gươm & Tháp Rùa',
      'Trái tim của thủ đô gắn liền truyền thuyết vua Lê Lợi trả gươm báu cho Rùa Vàng thế kỷ 15.',
      'Được xây dựng vào thời kỳ vua Lê, biểu tượng ngàn năm văn hiến của Thăng Long - Hà Nội.',
      'Khám phá từ 6:00 sáng hoặc đi dạo phố đi bộ cuối tuần.',
      'Kem Tràng Tiền, Cà phê trứng Giảng, Bún chả Hàng Quạt',
      1
    ) RETURNING id INTO lm_guom_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.landmarks WHERE name = 'Văn Miếu Quốc Tử Giám') THEN
    INSERT INTO public.landmarks (city_id, name, story, history, travel_timeline, food_suggestions, order_index)
    VALUES (
      hn_id,
      'Văn Miếu Quốc Tử Giám',
      'Trường đại học đầu tiên của Việt Nam, biểu tượng truyền thống hiếu học và trọng hiền tài.',
      'Khởi dựng năm 1070 dưới thời vua Lý Thánh Tông, thờ Khổng Tử và các bậc hiền triết.',
      'Nên tham quan buổi sáng từ 8:00 - 11:30 để chụp ảnh kiến trúc cổng Khuê Văn Các.',
      'Bún chả Sinh Từ, Phở Bát Đàn, Bánh cuốn Thanh Trì',
      2
    ) RETURNING id INTO lm_vanmieu_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.landmarks WHERE name = '36 Phố Phường Hà Nội') THEN
    INSERT INTO public.landmarks (city_id, name, story, history, travel_timeline, food_suggestions, order_index)
    VALUES (
      hn_id,
      '36 Phố Phường Hà Nội',
      'Mỗi con phố gắn liền với một làng nghề thủ công truyền thống, kiến trúc nhà ống đặc trưng.',
      'Hình thành từ thời kỳ Thăng Long trung đại, nơi giao thương sầm uất bậc nhất phương Bắc.',
      'Đi bộ buổi chiều mát từ phố Hàng Mã qua Tạ Hiện ngắm phố phường lên đèn.',
      'Phở xào Bát Đàn, Chả cá Lã Vọng, Cà phê Đinh',
      3
    ) RETURNING id INTO lm_phoco_id;
  END IF;

  -- Địa danh Huế & Hội An
  IF NOT EXISTS (SELECT 1 FROM public.landmarks WHERE name = 'Đại Nội Huế') THEN
    INSERT INTO public.landmarks (city_id, name, story, history, travel_timeline, food_suggestions, order_index)
    VALUES (
      hue_id,
      'Đại Nội Huế',
      'Hoàng cung của 13 vị vua triều Nguyễn, đỉnh cao kiến trúc cung đình phong kiến Việt Nam.',
      'Xây dựng từ năm 1804 dưới thời vua Gia Long, được UNESCO công nhận là Di sản Văn hóa Thế giới.',
      'Khám phá từ 7:30 sáng, nên thuê áo dài cổ phục chụp ảnh lưu niệm.',
      'Bún bò Huế Mụ Rơi, Bánh bèo nậm lọc Bà Đỏ, Chè bột lọc heo quay',
      1
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.landmarks WHERE name = 'Chùa Cầu Hội An') THEN
    INSERT INTO public.landmarks (city_id, name, story, history, travel_timeline, food_suggestions, order_index)
    VALUES (
      ha_id,
      'Chùa Cầu Hội An',
      'Cây cầu ngói cổ kính nối liền thương cảng xưa, giao thoa kiến trúc Việt - Nhật - Hoa.',
      'Được các thương nhân Nhật Bản xây dựng vào khoảng thế kỷ 17.',
      'Ghé thăm lúc 18:00 khi phố cổ thắp đèn lồng và thả hoa đăng trên sông Hoài.',
      'Cao lầu Bá Lễ, Cơm gà Bà Buội, Bánh mì Phượng',
      1
    );
  END IF;

  -- (3) Nạp 3 Mẫu áo thun văn hóa chủ lực
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Áo Thun Hà Nội Phố — Signature Tee') THEN
    INSERT INTO public.products (city_id, name, base_price, front_image, back_image, description, size_guide_text, package_type)
    VALUES (
      hn_id,
      'Áo Thun Hà Nội Phố — Signature Tee',
      299000,
      '/images/products/tee-hanoi-front.jpg',
      '/images/products/tee-hanoi-back.jpg',
      'Lấy cảm hứng từ mái ngói rêu phong 36 phố phường và Tháp Rùa Hồ Gươm cổ kính. Chất liệu 100% cotton 2 chiều 250gsm thoáng mát.',
      'M: 50-65kg | L: 65-75kg | XL: 75-85kg',
      'Tiêu chuẩn (Áo + 5 Thẻ di sản + Móc khóa NFC)'
    ) RETURNING id INTO prod_hn_id;

    -- Biến thể Size & Màu cho áo Hà Nội
    INSERT INTO public.product_variants (product_id, size, color, price, stock_quantity) VALUES
      (prod_hn_id, 'S', 'Đen Tiêu Chuẩn', 299000, 25),
      (prod_hn_id, 'M', 'Đen Tiêu Chuẩn', 299000, 50),
      (prod_hn_id, 'L', 'Đen Tiêu Chuẩn', 299000, 60),
      (prod_hn_id, 'XL', 'Đen Tiêu Chuẩn', 299000, 30),
      (prod_hn_id, 'S', 'Trắng Kem Di Sản', 299000, 20),
      (prod_hn_id, 'M', 'Trắng Kem Di Sản', 299000, 45),
      (prod_hn_id, 'L', 'Trắng Kem Di Sản', 299000, 55),
      (prod_hn_id, 'XL', 'Trắng Kem Di Sản', 299000, 25);
  ELSE
    SELECT id INTO prod_hn_id FROM public.products WHERE name = 'Áo Thun Hà Nội Phố — Signature Tee' LIMIT 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Áo Thun Cố Đô Huế — Royal Heritage Tee') THEN
    INSERT INTO public.products (city_id, name, base_price, front_image, back_image, description, size_guide_text, package_type)
    VALUES (
      hue_id,
      'Áo Thun Cố Đô Huế — Royal Heritage Tee',
      329000,
      '/images/products/tee-hanoi-front.jpg',
      '/images/products/tee-hanoi-back.jpg',
      'Họa tiết hoa văn triều Nguyễn kết hợp phong cách streetwear hiện đại, gợi nhắc nét trầm mặc dòng sông Hương.',
      'M: 50-65kg | L: 65-75kg | XL: 75-85kg',
      'Cao cấp (Áo + Thẻ di sản Huế + Móc khóa NFC gỗ)'
    ) RETURNING id INTO prod_hue_id;

    INSERT INTO public.product_variants (product_id, size, color, price, stock_quantity) VALUES
      (prod_hue_id, 'M', 'Tím Cung Đình', 329000, 40),
      (prod_hue_id, 'L', 'Tím Cung Đình', 329000, 45),
      (prod_hue_id, 'XL', 'Tím Cung Đình', 329000, 20),
      (prod_hue_id, 'M', 'Đen Tiêu Chuẩn', 329000, 30),
      (prod_hue_id, 'L', 'Đen Tiêu Chuẩn', 329000, 35);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Áo Thun Phố Cổ Hội An — Lantern Glow Tee') THEN
    INSERT INTO public.products (city_id, name, base_price, front_image, back_image, description, size_guide_text, package_type)
    VALUES (
      ha_id,
      'Áo Thun Phố Cổ Hội An — Lantern Glow Tee',
      319000,
      '/images/products/tee-hanoi-front.jpg',
      '/images/products/tee-hanoi-back.jpg',
      'Tái hiện sắc vàng cổ kính và ánh sáng huyền ảo của lồng đèn phố Hội bên dòng sông Hoài êm ả.',
      'M: 50-65kg | L: 65-75kg | XL: 75-85kg',
      'Tiêu chuẩn (Áo + 5 Thẻ di sản Hội An + Móc khóa NFC)'
    ) RETURNING id INTO prod_ha_id;

    INSERT INTO public.product_variants (product_id, size, color, price, stock_quantity) VALUES
      (prod_ha_id, 'M', 'Vàng Cổ Điển', 319000, 35),
      (prod_ha_id, 'L', 'Vàng Cổ Điển', 319000, 40),
      (prod_ha_id, 'XL', 'Vàng Cổ Điển', 319000, 15);
  END IF;

  -- (4) Nạp Thẻ NFC & Liên kết trải nghiệm số
  INSERT INTO public.nfc_tags (nfc_code, product_id, city_id, scan_count, experience_url)
  VALUES 
    ('VCW-HN-001', prod_hn_id, hn_id, 42, '/explore/hanoi'),
    ('VCW-HN-DEFAULT', prod_hn_id, hn_id, 18, '/explore/hanoi'),
    ('VCW-HUE-001', prod_hue_id, hue_id, 15, '/explore/hanoi'),
    ('VCW-HA-001', prod_ha_id, ha_id, 27, '/explore/hanoi')
  ON CONFLICT (nfc_code) DO NOTHING;

  -- (5) Nạp Đơn hàng mẫu COD
  IF NOT EXISTS (SELECT 1 FROM public.orders WHERE receiver_name = 'Trần Hoàng Nam (Hà Nội)') THEN
    INSERT INTO public.orders (receiver_name, receiver_phone, shipping_address, payment_method, status, total_amount, note)
    VALUES (
      'Trần Hoàng Nam (Hà Nội)',
      '0987654321',
      'Số 12 Tràng Tiền, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
      'COD',
      'processing',
      299000,
      'Giao hàng giờ hành chính, gọi trước khi đến.'
    ) RETURNING id INTO order_sample_id;

    INSERT INTO public.order_items (order_id, product_id, size, color, quantity, unit_price)
    VALUES (
      order_sample_id,
      prod_hn_id,
      'L',
      'Đen Tiêu Chuẩn',
      1,
      299000
    );
  END IF;

  -- (6) Nạp Bài viết Blog văn hóa mẫu
  INSERT INTO public.blogs (title, slug, content, cover_image, category, status)
  VALUES 
    (
      'Hồ Gươm Ký Sự: Trái Tim Văn Hóa Ngàn Năm Của Thăng Long',
      'ho-guom-ky-su-trai-tim-van-hoa',
      'Hồ Gươm không chỉ là thắng cảnh giữa lòng Hà Nội, mà còn là nơi lưu giữ hồn cốt của đất kinh kỳ. Từ truyền thuyết rùa vàng trả gươm thần cho vua Lê Lợi đến nhịp sống phố đi bộ mỗi cuối tuần, Hồ Gươm là sự giao hòa tuyệt mỹ giữa dòng chảy lịch sử và hơi thở hiện đại.',
      '/images/hanoi-banner.jpg',
      'Culture',
      'Published'
    ),
    (
      '36 Phố Phường: Hành Trình Lưu Giữ Bản Sắc Nghề Xưa',
      '36-pho-phuong-hanh-trinh-luu-giu-ban-sac',
      'Mỗi tên phố Hàng Bạc, Hàng Đào, Hàng Gai là một bảo tàng sống về bàn tay tài hoa của người thợ thủ công Thăng Long xưa. Áo thun VIET CITY WEAR chắt lọc những đường nét kiến trúc ấy vào từng nét in thời thượng.',
      '/images/hanoi-banner.jpg',
      'Landmark',
      'Published'
    ),
    (
      'Cố Đô Huế: Sắc Tím Hoàng Triều Và Nét Đẹp Thời Gian',
      'co-do-hue-sac-tim-hoang-trieu',
      'Vẻ đẹp xứ Huế nằm ở sự trầm mặc, cổ kính và bề dày văn hóa cung đình. Từng viên ngói Đại Nội, từng điệu ca trên dòng sông Hương đều gợi nhắc nét thanh lịch vượt thời gian.',
      '/images/hue-banner.jpg',
      'Travel',
      'Published'
    )
  ON CONFLICT (slug) DO NOTHING;

  -- (7) Nạp Nội dung Website (About, Terms, Privacy, Contact)
  INSERT INTO public.website_content (page_name, content_body)
  VALUES
    (
      'about',
      jsonb_build_object(
        'title', 'Về Chúng Tôi — VIET CITY WEAR',
        'content', 'VIET CITY WEAR ra đời với sứ mệnh mang câu chuyện văn hóa, di sản của các thành phố Việt Nam vào từng sản phẩm thời trang đường phố chất lượng cao.\n\nChúng tôi tin rằng mỗi chiếc áo không chỉ là trang phục thường ngày, mà là một đại sứ văn hóa kết nối người mặc với linh hồn của từng vùng đất thông qua công nghệ chip NFC và thẻ di sản tương tác số.'
      )
    ),
    (
      'terms',
      jsonb_build_object(
        'title', 'Điều Khoản Dịch Vụ',
        'content', 'Chào mừng bạn đến với VIET CITY WEAR. Khi đặt mua sản phẩm và sử dụng dịch vụ trên nền tảng của chúng tôi, bạn đồng ý tuân thủ các quy định về đặt hàng, thanh toán COD và chính sách bảo hành đổi trả trong vòng 7 ngày đối với lỗi từ nhà sản xuất.'
      )
    ),
    (
      'privacy',
      jsonb_build_object(
        'title', 'Chính Sách Bảo Mật',
        'content', 'VIET CITY WEAR cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng bao gồm số điện thoại, địa chỉ nhận hàng và lịch sử đơn hàng. Thông tin chỉ được sử dụng cho mục đích xử lý vận chuyển và nâng cao trải nghiệm mua sắm của bạn.'
      )
    ),
    (
      'contact',
      jsonb_build_object(
        'title', 'Liên Hệ Với Chúng Tôi',
        'content', 'Mọi thắc mắc về đơn hàng, hợp tác thương hiệu hoặc hỗ trợ kỹ thuật chip NFC, xin vui lòng liên hệ:\n\nEmail: contact@vietcitywear.com\nHotline: 0987 654 321\nĐịa chỉ: Hà Nội, Việt Nam\nThời gian hỗ trợ: 8:30 - 18:00 (Thứ 2 - Thứ 7).'
      )
    )
  ON CONFLICT (page_name) DO UPDATE 
  SET content_body = EXCLUDED.content_body, updated_at = timezone('utc'::text, now());

END $$;

-- Hoàn tất thiết lập!
