CREATE POLICY "Anyone can read page views count"
  ON public.page_views FOR SELECT
  TO anon
  USING (true);