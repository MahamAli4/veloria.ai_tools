CREATE TABLE public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  quote text NOT NULL,
  avatar_url text NOT NULL DEFAULT '',
  rating int NOT NULL DEFAULT 5,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active testimonials"
ON public.testimonials FOR SELECT TO anon, authenticated
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert testimonials"
ON public.testimonials FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update testimonials"
ON public.testimonials FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete testimonials"
ON public.testimonials FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.testimonials (name, role, quote, rating, sort_order) VALUES
('Sarah Chen', 'Product Designer', 'Got my ChatGPT Plus in 5 minutes for half the price. The whole experience felt premium.', 5, 1),
('Marcus Reid', 'Startup Founder', 'AI Vault is how I subscribe to every tool now. Original accounts, instant delivery, zero hassle.', 5, 2),
('Priya Nair', 'Content Strategist', 'The savings across Canva, Grammarly and Notion AI paid for my entire toolkit.', 5, 3),
('Diego Alvarez', 'Software Engineer', 'Cursor and Copilot at these prices is unreal. Support answered me at 2am.', 5, 4),
('Lena Ford', 'Marketing Lead', 'Beautiful storefront, honest pricing, and everything just works. Highly recommend.', 5, 5),
('Tom Becker', 'Freelance Writer', 'Perplexity Pro with citations changed my research workflow. Delivery was instant.', 5, 6);