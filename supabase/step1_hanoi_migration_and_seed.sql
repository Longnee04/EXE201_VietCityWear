-- ==============================================================================
-- BƯỚC 1: MIGRATION & SEED DATA MẪU ÁO HÀ NỘI — VIET CITY WEAR
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- PHẦN 1: MIGRATION CẤU TRÚC (Bổ sung song ngữ, Slug, Soft Delete & Liên kết)
-- ------------------------------------------------------------------------------

-- 1. Bổ sung song ngữ & Soft Delete cho CITIES
ALTER TABLE public.cities 
  ADD COLUMN IF NOT EXISTS name_vi VARCHAR(100),
  ADD COLUMN IF NOT EXISTS name_en VARCHAR(100),
  ADD COLUMN IF NOT EXISTS description_vi TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ NULL;

-- 2. Bổ sung song ngữ & Soft Delete cho LANDMARKS
ALTER TABLE public.landmarks 
  ADD COLUMN IF NOT EXISTS name_vi VARCHAR(150),
  ADD COLUMN IF NOT EXISTS name_en VARCHAR(150),
  ADD COLUMN IF NOT EXISTS story_vi TEXT,
  ADD COLUMN IF NOT EXISTS story_en TEXT,
  ADD COLUMN IF NOT EXISTS history_vi TEXT,
  ADD COLUMN IF NOT EXISTS history_en TEXT,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ NULL;

-- 3. Bổ sung song ngữ, Slug & Soft Delete cho PRODUCTS
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS name_vi VARCHAR(150),
  ADD COLUMN IF NOT EXISTS name_en VARCHAR(150),
  ADD COLUMN IF NOT EXISTS description_vi TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS slug VARCHAR(150),
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ NULL;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_slug_key') THEN
    ALTER TABLE public.products ADD CONSTRAINT products_slug_key UNIQUE (slug);
  END IF;
END $$;

-- 4. Bổ sung SKU & Soft Delete cho PRODUCT_VARIANTS
ALTER TABLE public.product_variants 
  ADD COLUMN IF NOT EXISTS sku VARCHAR(50),
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ NULL;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'product_variants_sku_key') THEN
    ALTER TABLE public.product_variants ADD CONSTRAINT product_variants_sku_key UNIQUE (sku);
  END IF;
END $$;

-- 5. Bảng liên kết nhiều-nhiều: PRODUCT ↔ LANDMARKS (5 địa danh xuất hiện trên áo)
CREATE TABLE IF NOT EXISTS public.product_landmarks (
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    landmark_id UUID NOT NULL REFERENCES public.landmarks(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 1,
    PRIMARY KEY (product_id, landmark_id)
);

ALTER TABLE public.product_landmarks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read product_landmarks" ON public.product_landmarks;
CREATE POLICY "Public read product_landmarks" ON public.product_landmarks FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow CRUD product_landmarks" ON public.product_landmarks;
CREATE POLICY "Allow CRUD product_landmarks" ON public.product_landmarks FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- PHẦN 2: SEED DATA MẪU ÁO HÀ NỘI + 5 ĐỊA DANH + 10 BIẾN THỂ + PHỤ KIỆN + NFC
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_city_id UUID;
  v_prod_id UUID;
  v_lm1_id UUID;
  v_lm2_id UUID;
  v_lm3_id UUID;
  v_lm4_id UUID;
  v_lm5_id UUID;
  v_color TEXT;
  v_size TEXT;
  v_color_code TEXT;
BEGIN
  -- 1. THÀNH PHỐ HÀ NỘI
  INSERT INTO public.cities (
    name, name_vi, name_en, 
    description, description_vi, description_en, 
    cover_image
  ) VALUES (
    'Hà Nội', 'Hà Nội', 'Hanoi',
    'Thủ đô nghìn năm văn hiến, nơi giao thoa giữa nét trầm mặc cổ kính và nhịp sống hiện đại.',
    'Thủ đô nghìn năm văn hiến, nơi giao thoa giữa nét trầm mặc cổ kính và nhịp sống hiện đại.',
    'The thousand-year-old capital where ancient tranquility meets modern vibrant life.',
    '/images/cities/hanoi-cover.jpg'
  )
  ON CONFLICT (name) DO UPDATE 
  SET name_vi = EXCLUDED.name_vi, 
      name_en = EXCLUDED.name_en,
      description = EXCLUDED.description,
      description_vi = EXCLUDED.description_vi,
      description_en = EXCLUDED.description_en,
      cover_image = EXCLUDED.cover_image
  RETURNING id INTO v_city_id;

  -- 2. 5 ĐỊA DANH LIÊN KẾT VỚI ÁO HÀ NỘI
  -- (1) Hồ Gươm — Tháp Rùa
  INSERT INTO public.landmarks (city_id, name, name_vi, name_en, story, story_vi, story_en, order_index)
  VALUES (
    v_city_id, 
    'Hồ Gươm — Tháp Rùa', 'Hồ Gươm — Tháp Rùa', 'Hoan Kiem Lake — Turtle Tower',
    'Trái tim của thủ đô nghìn năm, gắn liền huyền tích vua Lê Lợi trả gươm báu cho Rùa Vàng thế kỷ 15.',
    'Trái tim của thủ đô nghìn năm, gắn liền huyền tích vua Lê Lợi trả gươm báu cho Rùa Vàng thế kỷ 15.',
    'The heart of the thousand-year-old capital, associated with the 15th-century legend of King Le Loi returning the magic sword to the Golden Turtle.',
    1
  ) 
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_lm1_id FROM public.landmarks WHERE city_id = v_city_id AND name = 'Hồ Gươm — Tháp Rùa' LIMIT 1;

  -- (2) Văn Miếu — Quốc Tử Giám
  INSERT INTO public.landmarks (city_id, name, name_vi, name_en, story, story_vi, story_en, order_index)
  VALUES (
    v_city_id, 
    'Văn Miếu — Quốc Tử Giám', 'Văn Miếu — Quốc Tử Giám', 'Temple of Literature',
    'Trường đại học đầu tiên của Việt Nam xây dựng năm 1070, biểu tượng đỉnh cao của tinh thần hiếu học và trọng đạo.',
    'Trường đại học đầu tiên của Việt Nam xây dựng năm 1070, biểu tượng đỉnh cao của tinh thần hiếu học và trọng đạo.',
    'Vietnam first university founded in 1070, the supreme symbol of traditional studiousness and veneration for education.',
    2
  ) 
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_lm2_id FROM public.landmarks WHERE city_id = v_city_id AND name = 'Văn Miếu — Quốc Tử Giám' LIMIT 1;

  -- (3) Lăng Chủ tịch Hồ Chí Minh
  INSERT INTO public.landmarks (city_id, name, name_vi, name_en, story, story_vi, story_en, order_index)
  VALUES (
    v_city_id, 
    'Lăng Chủ tịch Hồ Chí Minh', 'Lăng Chủ tịch Hồ Chí Minh', 'Ho Chi Minh Mausoleum',
    'Công trình lịch sử thiêng liêng tọa lạc tại Quảng trường Ba Đình lịch sử, nơi hội tụ tấm lòng tri ân của muôn triệu người con đất Việt.',
    'Công trình lịch sử thiêng liêng tọa lạc tại Quảng trường Ba Đình lịch sử, nơi hội tụ tấm lòng tri ân của muôn triệu người con đất Việt.',
    'The sacred historic monument in historic Ba Dinh Square, preserving the deep veneration of the Vietnamese people for President Ho Chi Minh.',
    3
  ) 
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_lm3_id FROM public.landmarks WHERE city_id = v_city_id AND name = 'Lăng Chủ tịch Hồ Chí Minh' LIMIT 1;

  -- (4) Nhà Thờ Lớn Hà Nội
  INSERT INTO public.landmarks (city_id, name, name_vi, name_en, story, story_vi, story_en, order_index)
  VALUES (
    v_city_id, 
    'Nhà Thờ Lớn Hà Nội', 'Nhà Thờ Lớn Hà Nội', 'St. Joseph Cathedral',
    'Kiệt tác kiến trúc Neo-Gothic thế kỷ 19, điểm giao thoa văn hóa độc đáo giữa nét cổ kính phương Tây và nhịp sống trà chanh vỉa hè Hà Nội.',
    'Kiệt tác kiến trúc Neo-Gothic thế kỷ 19, điểm giao thoa văn hóa độc đáo giữa nét cổ kính phương Tây và nhịp sống trà chanh vỉa hè Hà Nội.',
    'A 19th-century Neo-Gothic architectural masterpiece, a unique cultural intersection between European heritage and Hanoi sidewalk lifestyle.',
    4
  ) 
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_lm4_id FROM public.landmarks WHERE city_id = v_city_id AND name = 'Nhà Thờ Lớn Hà Nội' LIMIT 1;

  -- (5) Phố Cổ Hà Nội — 36 Phố Phường
  INSERT INTO public.landmarks (city_id, name, name_vi, name_en, story, story_vi, story_en, order_index)
  VALUES (
    v_city_id, 
    'Phố Cổ Hà Nội', 'Phố Cổ Hà Nội', 'Hanoi Old Quarter',
    'Mê cung 36 phố nghề truyền thống lưu giữ mái ngói rêu phong, tinh hoa ẩm thực đường phố và cái hồn kinh kỳ Thăng Long xưa.',
    'Mê cung 36 phố nghề truyền thống lưu giữ mái ngói rêu phong, tinh hoa ẩm thực đường phố và cái hồn kinh kỳ Thăng Long xưa.',
    'The labyrinth of 36 guild craft streets preserving mossy tiled roofs, culinary craftsmanship, and the ancient soul of Thang Long capital.',
    5
  ) 
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_lm5_id FROM public.landmarks WHERE city_id = v_city_id AND name = 'Phố Cổ Hà Nội' LIMIT 1;

  -- 3. SẢN PHẨM: ÁO THUN HÀ NỘI PHỐ (SIGNATURE TEE)
  INSERT INTO public.products (
    city_id, slug,
    name, name_vi, name_en,
    base_price,
    description, description_vi, description_en,
    size_guide_text, package_type,
    front_image, back_image, status
  ) VALUES (
    v_city_id, 'ao-thun-ha-noi-pho-signature-tee',
    'Áo Thun Hà Nội Phố — Signature Tee',
    'Áo Thun Hà Nội Phố — Signature Tee',
    'Hanoi Heritage Signature Tee',
    249000, -- Giá gói Cơ bản
    'Thiết kế lưu niệm độc quyền kết hợp 5 địa danh di sản Hà Nội, đi kèm bộ thẻ câu chuyện và chip NFC tương tác.',
    'Thiết kế lưu niệm độc quyền kết hợp 5 địa danh di sản Hà Nội, đi kèm bộ thẻ câu chuyện và chip NFC tương tác.',
    'Exclusive souvenir tee featuring 5 Hanoi heritage landmarks, complete with landmark story cards and interactive NFC tag.',
    'S: 45-55kg (Cao 1m50-1m60) | M: 55-65kg (Cao 1m60-1m70) | L: 65-75kg (Cao 1m70-1m78) | XL: 75-85kg (Cao 1m78-1m85) | XXL: 85-95kg (Cao trên 1m80)',
    'Tiêu chuẩn',
    '/images/products/tee-hanoi-front.jpg',
    '/images/products/tee-hanoi-back.jpg',
    'Active'
  )
  ON CONFLICT (slug) DO UPDATE SET 
    name_vi = EXCLUDED.name_vi,
    name_en = EXCLUDED.name_en,
    base_price = EXCLUDED.base_price,
    description = EXCLUDED.description,
    description_vi = EXCLUDED.description_vi,
    description_en = EXCLUDED.description_en,
    size_guide_text = EXCLUDED.size_guide_text
  RETURNING id INTO v_prod_id;

  -- 4. LIÊN KẾT ÁO HÀ NỘI VỚI 5 ĐỊA DANH
  DELETE FROM public.product_landmarks WHERE product_id = v_prod_id;
  INSERT INTO public.product_landmarks (product_id, landmark_id, display_order)
  VALUES 
    (v_prod_id, v_lm1_id, 1),
    (v_prod_id, v_lm2_id, 2),
    (v_prod_id, v_lm3_id, 3),
    (v_prod_id, v_lm4_id, 4),
    (v_prod_id, v_lm5_id, 5);

  -- 5. PHỤ KIỆN GÓI COMBO
  DELETE FROM public.product_accessories WHERE product_id = v_prod_id;
  INSERT INTO public.product_accessories (product_id, type, name, quantity)
  VALUES
    (v_prod_id, 'LandmarkCard', 'Bộ 5 Thẻ Địa Danh Hà Nội Song Ngữ', 5),
    (v_prod_id, 'NfcKeychain', 'Móc Khóa Gỗ Tích Hợp Chip NFC Hà Nội', 1),
    (v_prod_id, 'GiftBox', 'Hộp Quà Cao Cấp Viet City Wear', 1);

  -- 6. TẠO 10 BIẾN THỂ (2 Màu × 5 Size) — MỖI LOẠI 20 CÁI (TỔNG 200 ÁO)
  DELETE FROM public.product_variants WHERE product_id = v_prod_id;
  
  FOREACH v_color IN ARRAY ARRAY['Đen Onyx', 'Trắng Kem']
  LOOP
    v_color_code := CASE WHEN v_color = 'Đen Onyx' THEN 'BLK' ELSE 'CRM' END;
    FOREACH v_size IN ARRAY ARRAY['S', 'M', 'L', 'XL', 'XXL']
    LOOP
      INSERT INTO public.product_variants (
        product_id, sku, color, size, price, stock_quantity, image, is_active
      ) VALUES (
        v_prod_id,
        'VCW-HN-' || v_color_code || '-' || v_size,
        v_color,
        v_size,
        299000, -- Mặc định giá gói Tiêu Chuẩn phổ biến
        20,     -- Tồn kho khởi tạo 20 chiếc mỗi biến thể
        CASE 
          WHEN v_color = 'Đen Onyx' THEN '/images/products/tee-hanoi-black.jpg'
          ELSE '/images/products/tee-hanoi-cream.jpg'
        END,
        true
      );
    END LOOP;
  END LOOP;

  -- 7. MÃ NFC GẮN VỚI SẢN PHẨM HÀ NỘI
  INSERT INTO public.nfc_tags (nfc_code, product_id, city_id, scan_count, experience_url)
  VALUES ('VCW-HN-001', v_prod_id, v_city_id, 0, '/explore/hanoi')
  ON CONFLICT (nfc_code) DO UPDATE 
  SET product_id = EXCLUDED.product_id, 
      city_id = EXCLUDED.city_id,
      experience_url = EXCLUDED.experience_url;

END $$;
