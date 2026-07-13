import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteStats = {
  tools: number;
  customers: number;
};

async function fetchSiteStats(): Promise<SiteStats> {
  const [toolsRes, viewsRes] = await Promise.all([
    supabase.from("tools").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("page_views").select("*", { count: "exact", head: true }),
  ]);

  return {
    tools: toolsRes.count ?? 0,
    customers: viewsRes.count ?? 0,
  };
}

export function useSiteStats() {
  return useQuery({ queryKey: ["site-stats"], queryFn: fetchSiteStats, staleTime: 30_000 });
}
