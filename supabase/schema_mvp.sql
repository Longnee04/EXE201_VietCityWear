-- ==============================================================================
-- VIET CITY WEAR — MVP DATABASE SCHEMA (PHASE 1)
-- Focus: User Authentication (Profiles) & Basic Inventory Management
-- Supabase PostgreSQL Environment with RLS & Auto-Sync Trigger
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ENUMS & EXTENSIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Roles Enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 2. TABLES DEFINITIONS
-- ------------------------------------------------------------------------------

-- (1) USERS PROFILE TABLE: Synced with Supabase auth.users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (2) PRODUCTS TABLE: Core catalog details
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    base_price NUMERIC(12, 2) NOT NULL CHECK (base_price >= 0),
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- (3) PRODUCT INVENTORY TABLE: Stock levels per size and color variant
CREATE TABLE IF NOT EXISTS public.product_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    status BOOLEAN NOT NULL DEFAULT true, -- in_stock flag
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_product_variant UNIQUE (product_id, size, color)
);

-- ------------------------------------------------------------------------------
-- 3. INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.product_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ------------------------------------------------------------------------------
-- 4. HELPER FUNCTIONS & TRIGGERS
-- ------------------------------------------------------------------------------

-- Admin check helper function (SECURITY DEFINER to avoid RLS recursion on public.users)
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

-- Trigger: Automatically insert a profile row when a user signs up via Supabase Auth
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
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all 3 tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_inventory ENABLE ROW LEVEL SECURITY;

-- (A) ADMIN ACCESS: Admins have full CRUD access on ALL tables
CREATE POLICY "Admins full access users" 
    ON public.users FOR ALL TO authenticated 
    USING (public.is_admin()) 
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins full access products" 
    ON public.products FOR ALL TO authenticated 
    USING (public.is_admin()) 
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins full access inventory" 
    ON public.product_inventory FOR ALL TO authenticated 
    USING (public.is_admin()) 
    WITH CHECK (public.is_admin());

-- (B) PUBLIC READ ACCESS: Public & unauthenticated users can read catalog & inventory
CREATE POLICY "Public read products" 
    ON public.products FOR SELECT TO public 
    USING (true);

CREATE POLICY "Public read inventory" 
    ON public.product_inventory FOR SELECT TO public 
    USING (true);

-- (C) USER PROFILE ACCESS: Authenticated users can view and update their own profile
CREATE POLICY "Users read own profile" 
    ON public.users FOR SELECT TO authenticated 
    USING (auth.uid() = id);

CREATE POLICY "Users update own profile" 
    ON public.users FOR UPDATE TO authenticated 
    USING (auth.uid() = id) 
    WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 6. DỮ LIỆU MẪU (SEED DATA) CHO AUTH & USERS (ĐÃ SỬA LỖI PROVIDER_ID)
-- Mật khẩu cho tài khoản: password123
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  admin_uid UUID := gen_random_uuid();
  user_uid UUID := gen_random_uuid();
BEGIN
  -- Dọn dẹp tài khoản cũ nếu đã tồn tại để tránh trùng email
  DELETE FROM auth.users WHERE email IN ('admin@vietcitywear.com', 'khachhang@gmail.com');

  -- 1. TẠO TÀI KHOẢN ADMIN (admin@vietcitywear.com)
  INSERT INTO auth.users (
    id, 
    instance_id, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    raw_app_meta_data, 
    raw_user_meta_data, 
    aud, 
    role, 
    created_at, 
    updated_at
  ) VALUES (
    admin_uid, 
    '00000000-0000-0000-0000-000000000000', 
    'admin@vietcitywear.com', 
    crypt('password123', gen_salt('bf')), 
    now(), 
    '{"provider": "email", "providers": ["email"]}', 
    '{"full_name": "Quản trị viên"}', 
    'authenticated', 
    'authenticated', 
    now(), 
    now()
  );

  INSERT INTO auth.identities (
    id,
    provider_id,
    user_id, 
    identity_data, 
    provider, 
    last_sign_in_at, 
    created_at, 
    updated_at
  ) VALUES (
    gen_random_uuid(),
    admin_uid::text, -- <-- Bắt buộc trong Supabase Auth
    admin_uid, 
    format('{"sub":"%s","email":"%s"}', admin_uid::text, 'admin@vietcitywear.com')::jsonb, 
    'email', 
    now(), 
    now(), 
    now()
  );

