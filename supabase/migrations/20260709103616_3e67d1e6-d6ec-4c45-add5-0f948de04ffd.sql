CREATE POLICY "Admins manage tool assets"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'tool-assets' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'tool-assets' AND public.has_role(auth.uid(), 'admin'));