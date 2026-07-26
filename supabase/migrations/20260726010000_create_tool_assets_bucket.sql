-- The "Admins manage tool assets" RLS policy (20260709103616) references a
-- 'tool-assets' storage bucket that was never actually created. Public = true
-- so uploaded tool/logo/testimonial images are readable via getPublicUrl()
-- without needing signed URLs; writes still go through the existing
-- admin-only RLS policy on storage.objects.
insert into storage.buckets (id, name, public)
values ('tool-assets', 'tool-assets', true)
on conflict (id) do update set public = true;
