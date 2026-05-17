-- Storage bucket for Certificate of Analysis PDFs.
-- Run after creating the bucket named "certificates" in the Supabase dashboard.
-- The bucket should be set to "public" so COA links work for unauthenticated users.

-- Public read of any object in the certificates bucket
CREATE POLICY "Public read certificates bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certificates');

-- Admins manage objects in the certificates bucket
CREATE POLICY "Admins write certificates bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'certificates' AND public.is_admin());

CREATE POLICY "Admins update certificates bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'certificates' AND public.is_admin())
  WITH CHECK (bucket_id = 'certificates' AND public.is_admin());

CREATE POLICY "Admins delete certificates bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'certificates' AND public.is_admin());

-- Link COA file paths to existing certificates rows
ALTER TABLE certificates
  ADD COLUMN IF NOT EXISTS file_path TEXT,
  ADD COLUMN IF NOT EXISTS file_name TEXT;
