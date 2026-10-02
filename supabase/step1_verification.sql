-- ==============================================================================
-- SQL KIỂM TRA KẾT QUẢ BƯỚC 1 (VERIFICATION QUERY)
-- ==============================================================================

-- 1. Kiểm tra Sản phẩm Áo Hà Nội & Thống kê tổng hợp
SELECT 
    p.id AS product_id,
    p.slug,
    p.name_vi,
    p.name_en,
    p.base_price,
    c.name_vi AS city_name,
    COUNT(DISTINCT pl.landmark_id) AS total_connected_landmarks,
    COUNT(DISTINCT pv.id) AS total_variants,
    SUM(pv.stock_quantity) AS total_stock
FROM public.products p
JOIN public.cities c ON c.id = p.city_id
LEFT JOIN public.product_landmarks pl ON pl.product_id = p.id
LEFT JOIN public.product_variants pv ON pv.product_id = p.id
WHERE p.slug = 'ao-thun-ha-noi-pho-signature-tee'
GROUP BY p.id, p.slug, p.name_vi, p.name_en, p.base_price, c.name_vi;

-- 2. Kiểm tra danh sách 5 Địa danh liên kết theo thứ tự hiển thị
SELECT 
    pl.display_order,
    l.name_vi,
    l.name_en,
    l.story_vi
FROM public.product_landmarks pl
JOIN public.landmarks l ON l.id = pl.landmark_id
JOIN public.products p ON p.id = pl.product_id
WHERE p.slug = 'ao-thun-ha-noi-pho-signature-tee'
ORDER BY pl.display_order ASC;

-- 3. Kiểm tra chi tiết 10 Biến thể Tồn kho (Màu × Size)
SELECT 
    sku,
    color,
    size,
    price,
    stock_quantity,
    is_active
FROM public.product_variants
WHERE product_id = (SELECT id FROM public.products WHERE slug = 'ao-thun-ha-noi-pho-signature-tee')
ORDER BY color, size;

-- 4. Kiểm tra Phụ kiện đi kèm trong combo
SELECT 
    type,
    name,
    quantity
FROM public.product_accessories
WHERE product_id = (SELECT id FROM public.products WHERE slug = 'ao-thun-ha-noi-pho-signature-tee')
ORDER BY quantity DESC;

-- 5. Kiểm tra Mã chip NFC liên kết
SELECT 
    nfc_code,
    scan_count,
    experience_url
FROM public.nfc_tags
WHERE nfc_code = 'VCW-HN-001';
