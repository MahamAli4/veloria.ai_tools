import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar_url: string;
  rating: number;
  sort_order: number;
  is_active: boolean;
};

async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}

export function useTestimonials() {
  return useQuery({ queryKey: ["testimonials"], queryFn: fetchTestimonials, staleTime: 60_000 });
}
