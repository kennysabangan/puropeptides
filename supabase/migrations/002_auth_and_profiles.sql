-- Auth: profiles, addresses, and order ownership
-- Idempotent: safe to re-run.

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = true;

CREATE TABLE IF NOT EXISTS addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  phone TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_addresses_one_default_per_user
  ON addresses(user_id) WHERE is_default = true;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS tracking_carrier TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

-- Admin helper, used by RLS policies below
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- New-user trigger: mirror auth.users into profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- profiles
DROP POLICY IF EXISTS "Users read own profile" ON profiles;
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Admins update any profile" ON profiles;
CREATE POLICY "Admins update any profile"
  ON profiles FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Block self-promotion: non-admins cannot flip their own is_admin to true.
CREATE OR REPLACE FUNCTION public.prevent_admin_self_promotion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'is_admin can only be changed by an admin';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_block_self_promotion ON profiles;
CREATE TRIGGER profiles_block_self_promotion
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_admin_self_promotion();

-- addresses
DROP POLICY IF EXISTS "Users CRUD own addresses select" ON addresses;
CREATE POLICY "Users CRUD own addresses select"
  ON addresses FOR SELECT USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Users CRUD own addresses insert" ON addresses;
CREATE POLICY "Users CRUD own addresses insert"
  ON addresses FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Users CRUD own addresses update" ON addresses;
CREATE POLICY "Users CRUD own addresses update"
  ON addresses FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Users CRUD own addresses delete" ON addresses;
CREATE POLICY "Users CRUD own addresses delete"
  ON addresses FOR DELETE USING (user_id = auth.uid());

-- orders: existing "Anyone can create" policy stays for guest checkout.
-- Add owner reads + admin reads/updates.
DROP POLICY IF EXISTS "Users read own orders" ON orders;
CREATE POLICY "Users read own orders"
  ON orders FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins update any order" ON orders;
CREATE POLICY "Admins update any order"
  ON orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- order_items: visible if parent order is visible to the caller
DROP POLICY IF EXISTS "Users read own order_items" ON order_items;
CREATE POLICY "Users read own order_items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
        AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );

-- subscribers: admin read + delete
DROP POLICY IF EXISTS "Admins read subscribers" ON subscribers;
CREATE POLICY "Admins read subscribers"
  ON subscribers FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS "Admins delete subscribers" ON subscribers;
CREATE POLICY "Admins delete subscribers"
  ON subscribers FOR DELETE USING (public.is_admin());

-- products: admin write
DROP POLICY IF EXISTS "Admins insert products" ON products;
CREATE POLICY "Admins insert products"
  ON products FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admins update products" ON products;
CREATE POLICY "Admins update products"
  ON products FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admins delete products" ON products;
CREATE POLICY "Admins delete products"
  ON products FOR DELETE USING (public.is_admin());

-- certificates: admin write
DROP POLICY IF EXISTS "Admins insert certificates" ON certificates;
CREATE POLICY "Admins insert certificates"
  ON certificates FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admins update certificates" ON certificates;
CREATE POLICY "Admins update certificates"
  ON certificates FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admins delete certificates" ON certificates;
CREATE POLICY "Admins delete certificates"
  ON certificates FOR DELETE USING (public.is_admin());
