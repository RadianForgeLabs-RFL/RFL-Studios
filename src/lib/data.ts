import { supabase } from "@/integrations/supabase/client";
import { queryOptions } from "@tanstack/react-query";

export type ProductKind = "app" | "game" | "ai";

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  features: string[] | null;
  requirements: string | null;
  kind: ProductKind;
  category_id: string | null;
  developer_id: string | null;
  publisher: string | null;
  license: string | null;
  status: string;
  source_type: string;
  play_modes: string[] | null;
  platforms: string[] | null;
  architectures: string[] | null;
  icon_url: string | null;
  banner_url: string | null;
  banner_opacity: number | null;
  trailer_url: string | null;
  latest_version: string | null;
  release_date: string | null;
  file_size: string | null;
  changelog: string | null;
  known_issues: string | null;
  roadmap: string | null;
  dependencies: string[] | null;
  documentation_url: string | null;
  source_url: string | null;
  featured: boolean;
  coming_soon: boolean;
  published: boolean;
  download_count: number;
  created_at: string;
  updated_at: string;
};

// Released products only (published AND not coming soon)
export const productListQuery = (kind?: ProductKind | "all") =>
  queryOptions({
    queryKey: ["products", "released", kind ?? "all"],
    queryFn: async () => {
      let q = supabase
        .from("products")
        .select("*")
        .eq("published", true)
        .eq("coming_soon", false)
        .order("homepage_order");
      if (kind && kind !== "all") q = q.eq("kind", kind);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as Product[];
    },
  });

export const adminProductListQuery = () =>
  queryOptions({
    queryKey: ["products", "admin-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Product[];
    },
  });

export const comingSoonProductsQuery = () =>
  queryOptions({
    queryKey: ["products", "coming-soon"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("coming_soon", true)
        .order("homepage_order");
      if (error) throw error;
      return (data ?? []) as unknown as Product[];
    },
  });

export const productBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, developer:developers(*), category:categories(*), screenshots(*), downloads(*), versions(*), tags:product_tags(tag:tags(*))")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });

export const categoriesQuery = () =>
  queryOptions({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

export const newsQuery = () =>
  queryOptions({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news").select("*").eq("published", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const announcementQuery = () =>
  queryOptions({
    queryKey: ["announcement"],
    queryFn: async () => {
      const { data, error } = await supabase.from("announcements").select("*").eq("active", true).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

// Live counts from products (excludes coming-soon from the "released" tally)
export const homeCountsQuery = () =>
  queryOptions({
    queryKey: ["home-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("kind, coming_soon, published")
        .eq("published", true)
        .eq("coming_soon", false);
      if (error) throw error;
      const rows = data ?? [];
      return {
        apps: rows.filter((r: any) => r.kind === "app").length,
        games: rows.filter((r: any) => r.kind === "game").length,
      };
    },
  });
