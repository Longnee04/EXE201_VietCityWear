-- ==============================================================================
-- VIET CITY WEAR — COMPLETE SYSTEM SCHEMA & ADMIN MODULES
-- Phục vụ đầy đủ 8 chức năng Admin theo PRD:
-- 1. Sản phẩm (Products) & Tồn kho (Product Inventory)
-- 2. Đơn hàng (Orders) & Chi tiết đơn hàng (Order Items)
-- 3. Thành phố (Cities) & Địa danh văn hóa (Landmarks)
-- 4. Thẻ NFC & Trải nghiệm (NFC Tags)
-- 5. Bài viết văn hóa (Articles) & Quản lý nội dung (Website Content)
-- 6. Quản lý người dùng & Phân quyền (Users & Roles)
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

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('processing', 'completed', 'canceled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 2. BẢNG CƠ SỞ DỮ LIỆU
-- ------------------------------------------------------------------------------

-- (1) BẢNG USERS (Profile đồng bộ từ auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (2) BẢNG CITIES (Thành phố văn hóa)
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (3) BẢNG LANDMARKS (Địa danh & Điểm đến văn hóa)
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

-- (4) BẢNG PRODUCTS (Danh mục sản phẩm áo lưu niệm)
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (5) BẢNG PRODUCT_INVENTORY (Quản lý tồn kho theo biến thể Size & Màu)
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

-- (6) BẢNG NFC_TAGS (Quản lý mã NFC & Trải nghiệm)
CREATE TABLE IF NOT EXISTS public.nfc_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nfc_code TEXT NOT NULL UNIQUE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    scan_count INTEGER NOT NULL DEFAULT 0,
    experience_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (7) BẢNG ORDERS (Đơn hàng khách đặt)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    receiver_name TEXT NOT NULL,
    receiver_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method TEXT NOT NULL DEFAULT 'COD',
    status order_status NOT NULL DEFAULT 'processing',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (8) BẢNG ORDER_ITEMS (Chi tiết từng món trong đơn)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    inventory_id UUID NOT NULL REFERENCES public.product_inventory(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase NUMERIC(12, 2) NOT NULL CHECK (price_at_purchase >= 0)
);

-- (9) BẢNG ARTICLES (Bài viết văn hóa, du lịch)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (10) BẢNG WEBSITE_CONTENT (Nội dung trang: điều khoản, chính sách, tuyển dụng)
CREATE TABLE IF NOT EXISTS public.website_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name TEXT NOT NULL UNIQUE,
    content_body JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. HÀM & TRIGGER TỰ ĐỘNG
-- ------------------------------------------------------------------------------

-- Hàm kiểm tra Admin (SECURITY DEFINER tránh đệ quy RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Trigger đồng bộ User khi đăng ký qua auth.users
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
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
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

-- Quyền Admin: Toàn quyền CRUD trên TẤT CẢ các bảng
CREATE POLICY "Admin CRUD all users" ON public.users FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin CRUD all cities" ON public.cities FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin CRUD all landmarks" ON public.landmarks FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin CRUD all products" ON public.products FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin CRUD all inventory" ON public.product_inventory FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin CRUD all nfc_tags" ON public.nfc_tags FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin CRUD all orders" ON public.orders FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin CRUD all order_items" ON public.order_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin CRUD all articles" ON public.articles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin CRUD all content" ON public.website_content FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Quyền Public/User: Đọc danh mục, thành phố, địa danh, bài viết
CREATE POLICY "Public read cities" ON public.cities FOR SELECT TO public USING (true);
CREATE POLICY "Public read landmarks" ON public.landmarks FOR SELECT TO public USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT TO public USING (true);
CREATE POLICY "Public read inventory" ON public.product_inventory FOR SELECT TO public USING (true);
CREATE POLICY "Public read articles" ON public.articles FOR SELECT TO public USING (true);
CREATE POLICY "Public read website_content" ON public.website_content FOR SELECT TO public USING (true);
CREATE POLICY "Public read nfc_tags" ON public.nfc_tags FOR SELECT TO public USING (true);

-- Quyền User: Đọc thông tin của chính mình & đặt hàng
CREATE POLICY "User read own profile" ON public.users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "User update own profile" ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "User create order" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Public create order" ON public.orders FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "User read own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. DỮ LIỆU KHỞI TẠO BAN ĐẦU (SEED DATA THEO PRD)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  hanoi_id UUID;
  hue_id UUID;
  hoian_id UUID;
  sp1_id UUID;
  sp2_id UUID;
  sp3_id UUID;
  inv1_id UUID;
  order1_id UUID;
BEGIN
  -- 1. Thành phố
  INSERT INTO public.cities (name, description, image_url)
  VALUES ('Hà Nội', 'Thủ đô nghìn năm văn hiến, nét trầm mặc của 36 phố phường và Hồ Gươm cổ kính.', '/images/hanoi-banner.jpg')
  ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
  RETURNING id INTO hanoi_id;

  INSERT INTO public.cities (name, description, image_url)
  VALUES ('Huế', 'Cố đô thơ mộng bên dòng sông Hương, lưu giữ nét đẹp cung đình trầm mặc.', '/images/hue-banner.jpg')
  ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
  RETURNING id INTO hue_id;

  INSERT INTO public.cities (name, description, image_url)
  VALUES ('Hội An', 'Phố cổ đèn lồng vàng son, di sản văn hóa thế giới bên dòng sông Hoài.', '/images/hoian-banner.jpg')
  ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
  RETURNING id INTO hoian_id;

  -- 2. Địa danh văn hóa thuộc Hà Nội (Theo PRD: Hồ Gươm, Văn Miếu, Phố cổ)
  INSERT INTO public.landmarks (city_id, name, story, images, travel_timeline, food_suggestions)
  VALUES 
    (hanoi_id, 'Hồ Gươm & Tháp Rùa', 'Trái tim của thủ đô gắn liền truyền thuyết vua Lê Lợi trả gươm báu cho Rùa Vàng.', ARRAY['/images/hoguom.jpg'], 'Khám phá từ 6:00 sáng hoặc đi dạo phố đi bộ cuối tuần.', 'Kem Tràng Tiền, Cà phê trứng Giảng'),
    (hanoi_id, 'Văn Miếu Quốc Tử Giám', 'Trường đại học đầu tiên của Việt Nam, biểu tượng truyền thống hiếu học.', ARRAY['/images/vanmieu.jpg'], 'Nên đi buổi sáng từ 8:00 - 11:30 để chụp ảnh đẹp.', 'Bún chả Sinh Từ, Phở Bát Đàn'),
    (hanoi_id, 'Phố Cổ Hà Nội (36 Phố Phường)', 'Mê cung những con phố nghề truyền thống mang đậm nét sinh hoạt kinh kỳ xưa.', ARRAY['/images/phoco.jpg'], 'Buổi chiều tối dạo ngắm đèn lồng và thưởng thức ẩm thực vỉa hè.', 'Chả cá Lã Vọng, Bún thang Cầu Gỗ')
  ON CONFLICT DO NOTHING;

  -- 3. Sản phẩm áo văn hóa (Theo PRD: 1 mẫu áo Hà Nội + Gói Cơ bản 249k, Tiêu chuẩn 299k, Đặc biệt 349k)
  INSERT INTO public.products (name, base_price, city_id, front_image, back_image, description, size_guide_text, package_type)
  VALUES 
    ('Áo Thun Hà Nội Phố — Signature Tee', 299000, hanoi_id, '/images/products/tee-hanoi-front.jpg', '/images/products/tee-hanoi-back.jpg', 'Chất liệu 100% Cotton 2 chiều định lượng 250gsm thoáng mát, form Oversize cá tính.', 'Size M: 50-65kg | Size L: 65-75kg | Size XL: 75-85kg', 'Tiêu chuẩn (Áo + 5 Thẻ + Móc khóa NFC)')
  RETURNING id INTO sp1_id;

  INSERT INTO public.products (name, base_price, city_id, front_image, back_image, description, size_guide_text, package_type)
  VALUES 
    ('Áo Thun Cố Đô Huế — Heritage Tee', 299000, hue_id, '/images/products/tee-hue-front.jpg', '/images/products/tee-hue-back.jpg', 'Họa tiết Ngọ Môn và hoa văn triều Nguyễn tinh xảo in lụa cao cấp.', 'Size M: 50-65kg | Size L: 65-75kg | Size XL: 75-85kg', 'Tiêu chuẩn (Áo + 5 Thẻ + Móc khóa NFC)')
  RETURNING id INTO sp2_id;

  INSERT INTO public.products (name, base_price, city_id, front_image, back_image, description, size_guide_text, package_type)
  VALUES 
    ('Áo Thun Phố Hội Đèn Lồng — Golden Ancient Tee', 349000, hoian_id, '/images/products/tee-hoian-front.jpg', '/images/products/tee-hoian-back.jpg', 'Phiên bản đặc biệt hộp quà tặng cao cấp, kèm thẻ NFC chạm mở bản đồ ẩm thực Hội An.', 'Size M: 50-65kg | Size L: 65-75kg | Size XL: 75-85kg', 'Phiên bản đặc biệt (Áo cao cấp + 5 Thẻ + NFC + Hộp đẹp)')
  RETURNING id INTO sp3_id;

  -- 4. Biến thể tồn kho (Inventory: Size S, M, L, XL với Màu Đen & Trắng Kem)
  IF sp1_id IS NOT NULL THEN
    INSERT INTO public.product_inventory (product_id, size, color, stock_quantity, status)
    VALUES 
      (sp1_id, 'M', 'Đen (Black)', 45, true),
      (sp1_id, 'L', 'Đen (Black)', 38, true),
      (sp1_id, 'XL', 'Đen (Black)', 20, true),
      (sp1_id, 'M', 'Trắng Kem (Off-White)', 50, true),
      (sp1_id, 'L', 'Trắng Kem (Off-White)', 35, true)
    RETURNING id INTO inv1_id;
  END IF;

  -- 5. Thẻ NFC (Theo PRD: Chạm NFC mở trang trải nghiệm văn hóa)
  IF sp1_id IS NOT NULL THEN
    INSERT INTO public.nfc_tags (nfc_code, product_id, city_id, scan_count, experience_url)
    VALUES ('VCW-HN-001', sp1_id, hanoi_id, 128, '/explore/hanoi')
    ON CONFLICT (nfc_code) DO NOTHING;
  END IF;

  -- 6. Đơn hàng mẫu ban đầu (COD)
  IF inv1_id IS NOT NULL THEN
    INSERT INTO public.orders (receiver_name, receiver_phone, shipping_address, total_amount, payment_method, status)
    VALUES ('Trần Hoàng Nam', '0912345678', 'Số 18 Hàng Bông, Quận Hoàn Kiếm, Hà Nội', 299000, 'COD', 'processing')
    RETURNING id INTO order1_id;

    INSERT INTO public.order_items (order_id, inventory_id, quantity, price_at_purchase)
    VALUES (order1_id, inv1_id, 1, 299000);
  END IF;

END $$;
