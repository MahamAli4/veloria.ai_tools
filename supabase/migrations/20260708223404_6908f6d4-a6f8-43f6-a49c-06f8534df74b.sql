UPDATE public.user_roles SET role = 'admin' WHERE user_id = 'f8578a2b-a4f7-48a1-8fa9-4a1fe25d622c';
INSERT INTO public.user_roles (user_id, role)
SELECT 'f8578a2b-a4f7-48a1-8fa9-4a1fe25d622c', 'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = 'f8578a2b-a4f7-48a1-8fa9-4a1fe25d622c' AND role = 'admin'
);