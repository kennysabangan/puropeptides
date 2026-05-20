-- Product image storage + columns.
-- Run AFTER creating the bucket named "product-images" in the Supabase dashboard
-- (Storage → New bucket → name: product-images, public: yes).
-- Idempotent: safe to re-run.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS gallery_urls JSONB NOT NULL DEFAULT '[]'::jsonb;

DROP POLICY IF EXISTS "Public read product-images bucket" ON storage.objects;
CREATE POLICY "Public read product-images bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins write product-images bucket" ON storage.objects;
CREATE POLICY "Admins write product-images bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins update product-images bucket" ON storage.objects;
CREATE POLICY "Admins update product-images bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins delete product-images bucket" ON storage.objects;
CREATE POLICY "Admins delete product-images bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());
