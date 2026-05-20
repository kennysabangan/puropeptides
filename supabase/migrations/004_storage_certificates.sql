-- Storage bucket for Certificate of Analysis PDFs.
-- Run AFTER creating the bucket named "certificates" in the Supabase dashboard
-- (Storage → New bucket → name: certificates, public: yes).
-- Idempotent: safe to re-run.

DROP POLICY IF EXISTS "Public read certificates bucket" ON storage.objects;
CREATE POLICY "Public read certificates bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certificates');

DROP POLICY IF EXISTS "Admins write certificates bucket" ON storage.objects;
CREATE POLICY "Admins write certificates bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'certificates' AND public.is_admin());

DROP POLICY IF EXISTS "Admins update certificates bucket" ON storage.objects;
CREATE POLICY "Admins update certificates bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'certificates' AND public.is_admin())
  WITH CHECK (bucket_id = 'certificates' AND public.is_admin());

DROP POLICY IF EXISTS "Admins delete certificates bucket" ON storage.objects;
CREATE POLICY "Admins delete certificates bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'certificates' AND public.is_admin());

-- Link COA file paths to existing certificates rows
ALTER TABLE certificates
  ADD COLUMN IF NOT EXISTS file_path TEXT,
  ADD COLUMN IF NOT EXISTS file_name TEXT;
