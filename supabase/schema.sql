-- ==============================================================================
-- VIET CITY WEAR — COMPLETE SUPABASE DATABASE SCHEMA
-- Architecture: E-Commerce + Heritage Culture + Digital Tourism + NFC Tech
-- Compatible with Supabase PostgreSQL (with RLS, Indexes, Triggers & Auth)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS & CUSTOM ENUMS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Order Status Enum
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('processing', 'completed', 'canceled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Roles Enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 2. TABLES DEFINITIONS
-- ------------------------------------------------------------------------------

-- (1) USERS TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (2) CITIES TABLE (Hanoi, Hue, Hoi An, Hai Phong, Da Nang, etc.)
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (3) LANDMARKS TABLE (Places, cultural stories, and itinerary guide)
CREATE TABLE IF NOT EXISTS public.landmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    story TEXT,
    images TEXT[] DEFAULT '{}'::TEXT[],
    video_url TEXT,
    travel_timeline TEXT,
    food_suggestions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (4) PRODUCTS TABLE (T-shirts & Packages: Basic 249k, Standard 299k, Special 349k)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    base_price NUMERIC(12, 2) NOT NULL CHECK (base_price >= 0),
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    front_image TEXT,
    back_image TEXT,
    description TEXT,
    size_guide_text TEXT,
    package_type TEXT DEFAULT 'standard', -- 'basic', 'standard', 'special'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (5) PRODUCT INVENTORY TABLE (Stock management per size & color)
CREATE TABLE IF NOT EXISTS public.product_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    status BOOLEAN NOT NULL DEFAULT true, -- in_stock flag
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_product_size_color UNIQUE (product_id, size, color)
);

-- (6) NFC TAGS TABLE (NFC Keychain experience connecting physical to digital)
CREATE TABLE IF NOT EXISTS public.nfc_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nfc_code TEXT NOT NULL UNIQUE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    scan_count INTEGER NOT NULL DEFAULT 0 CHECK (scan_count >= 0),
    experience_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (7) ORDERS TABLE (Guest & Authenticated user purchases)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- nullable for guest checkout
    receiver_name TEXT NOT NULL,
    receiver_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method TEXT NOT NULL DEFAULT 'COD',
    status order_status NOT NULL DEFAULT 'processing',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (8) ORDER ITEMS TABLE (Items inside an order)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    inventory_id UUID NOT NULL REFERENCES public.product_inventory(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price_at_purchase NUMERIC(12, 2) NOT NULL CHECK (price_at_purchase >= 0)
);

-- (9) ARTICLES TABLE (Cultural, tourism and heritage stories)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (10) WEBSITE CONTENT TABLE (Dynamic content: Terms, Policy, Contact, About)
CREATE TABLE IF NOT EXISTS public.website_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name TEXT NOT NULL UNIQUE,
    content_body JSONB NOT NULL DEFAULT '{}'::JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. PERFORMANCE INDEXES (Optimized for Read & Query speed)
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_landmarks_city_id ON public.landmarks(city_id);
CREATE INDEX IF NOT EXISTS idx_products_city_id ON public.products(city_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.product_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_nfc_tags_code ON public.nfc_tags(nfc_code);
CREATE INDEX IF NOT EXISTS idx_nfc_tags_product ON public.nfc_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_nfc_tags_city ON public.nfc_tags(city_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_inventory_id ON public.order_items(inventory_id);

-- ------------------------------------------------------------------------------
-- 4. HELPER FUNCTIONS & TRIGGERS
-- ------------------------------------------------------------------------------

-- Helper Function: Check if currently authenticated user is an Admin
-- (Using SECURITY DEFINER to bypass recursive RLS on public.users)
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

-- Trigger Function: Auto-create public.users record when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'user'::user_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- NFC Scan Incrementor RPC: Fast public endpoint to log physical NFC taps
CREATE OR REPLACE FUNCTION public.increment_nfc_scan(tag_code TEXT)
RETURNS void
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
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS across ALL tables
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

-- -----------------
-- (A) ADMIN ACCESS (Admins have full CRUD access to ALL tables)
-- -----------------
CREATE POLICY "Admins full access users" ON public.users FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access cities" ON public.cities FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access landmarks" ON public.landmarks FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access products" ON public.products FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access inventory" ON public.product_inventory FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access nfc_tags" ON public.nfc_tags FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access orders" ON public.orders FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access order_items" ON public.order_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access articles" ON public.articles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access website_content" ON public.website_content FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- -----------------
-- (B) PUBLIC / USER READ POLICIES (Catalog & Content)
-- -----------------
CREATE POLICY "Public read cities" ON public.cities FOR SELECT TO public USING (true);
CREATE POLICY "Public read landmarks" ON public.landmarks FOR SELECT TO public USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT TO public USING (true);
CREATE POLICY "Public read inventory" ON public.product_inventory FOR SELECT TO public USING (true);
CREATE POLICY "Public read articles" ON public.articles FOR SELECT TO public USING (true);
CREATE POLICY "Public read website_content" ON public.website_content FOR SELECT TO public USING (true);
CREATE POLICY "Public read nfc_tags" ON public.nfc_tags FOR SELECT TO public USING (true);

-- -----------------
-- (C) USERS PROFILE POLICIES
-- -----------------
CREATE POLICY "Users read own profile" ON public.users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- -----------------
-- (D) ORDERS & ORDER ITEMS POLICIES
-- -----------------
-- Authenticated Users can create orders
CREATE POLICY "Users create orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Authenticated Users can read their own orders
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Authenticated Users can create order items corresponding to their own orders
CREATE POLICY "Users create order items" ON public.order_items FOR INSERT TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
  )
);

-- Authenticated Users can read order items of their own orders
CREATE POLICY "Users read own order items" ON public.order_items FOR SELECT TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
  )
);
