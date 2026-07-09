ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

UPDATE public.tools SET status = CASE WHEN is_active THEN 'active' ELSE 'inactive' END;

ALTER TABLE public.tools
  ADD CONSTRAINT tools_status_check CHECK (status IN ('active','inactive','coming_soon'));