ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS image_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS logo_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS categories jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS post_link text NOT NULL DEFAULT '';

-- backfill categories from existing single category
UPDATE public.tools
SET categories = to_jsonb(ARRAY[category])
WHERE (categories = '[]'::jsonb OR categories IS NULL) AND coalesce(category,'') <> '';