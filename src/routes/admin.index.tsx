import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [products, reviews, requests] = await Promise.all([
        supabase.from("products").select("id, kind, download_count"),
        supabase.from("reviews").select("id, rating"),
        supabase.from("requests").select("id, status"),
      ]);
      return {
        totalProducts: products.data?.length ?? 0,
        apps: products.data?.filter((p: any) => p.kind === "app").length ?? 0,
        games: products.data?.filter((p: any) => p.kind === "game").length ?? 0,
        ai: products.data?.filter((p: any) => p.kind === "ai").length ?? 0,
        downloads: products.data?.reduce((a: number, b: any) => a + (b.download_count ?? 0), 0) ?? 0,
        reviews: reviews.data?.length ?? 0,
        avgRating: reviews.data?.length ? (reviews.data.reduce((a: number, r: any) => a + r.rating, 0) / reviews.data.length) : 0,
        openRequests: requests.data?.filter((r: any) => r.status === "open").length ?? 0,
      };
    },
  });
  const s = stats.data;

  const cards = [
    ["Products", s?.totalProducts], ["Apps", s?.apps], ["Games", s?.games], ["AI Tools", s?.ai],
    ["Downloads", s?.downloads?.toLocaleString()], ["Reviews", s?.reviews],
    ["Avg. rating", s?.avgRating?.toFixed(2)], ["Open requests", s?.openRequests],
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Overview of your RFL Studios portal.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([l, v]) => (
          <Card key={l as string} className="glass border-white/5 bg-transparent p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{l}</div>
            <div className="mt-1 text-2xl font-bold gradient-text">{v ?? "—"}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
