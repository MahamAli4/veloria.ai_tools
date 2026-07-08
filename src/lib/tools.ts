import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Tool, Plan } from "@/data/tools";

type ToolRow = Tables<"tools">;

const asStrings = (v: unknown): string[] =>
  Array.isArray(v) ? (v as unknown[]).map((x) => String(x)) : [];

export function mapTool(row: ToolRow): Tool & { id: string; isActive: boolean; sortOrder: number } {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    mark: row.mark,
    gradient: row.gradient,
    category: row.category,
    tagline: row.tagline,
    description: row.description,
    overview: row.overview,
    whatItDoes: row.what_it_does,
    whoFor: row.who_for,
    originalPrice: Number(row.original_price),
    ourPrice: Number(row.our_price),
    duration: row.duration,
    benefits: asStrings(row.benefits),
    features: asStrings(row.features),
    advantages: asStrings(row.advantages),
    useCases: asStrings(row.use_cases),
    plans: (Array.isArray(row.plans) ? row.plans : []) as unknown as Plan[],
    faqs: (Array.isArray(row.faqs) ? row.faqs : []) as unknown as { q: string; a: string }[],
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}

export type UITool = ReturnType<typeof mapTool>;

async function fetchTools(): Promise<UITool[]> {
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapTool);
}

export function useTools() {
  return useQuery({ queryKey: ["tools"], queryFn: fetchTools, staleTime: 60_000 });
}

export function useTool(slug: string) {
  const q = useTools();
  return { ...q, data: q.data?.find((t) => t.slug === slug) };
}
