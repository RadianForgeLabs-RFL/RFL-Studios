import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "Account — RFL Studios" }, { name: "robots", content: "noindex" }] }),
  component: Account,
});

function Account() {
  const { user } = useAuth();
  const favs = useQuery({
    queryKey: ["favorites", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("favorites").select("product:products(*)").eq("user_id", user!.id);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl font-bold md:text-5xl gradient-text">Account</h1>
      <p className="mt-2 text-muted-foreground">{user?.email}</p>

      <h2 className="mt-10 flex items-center gap-2 text-xl font-semibold"><Heart className="h-5 w-5 text-pink-400" /> Favorites</h2>
      <div className="mt-4 grid gap-3">
        {(favs.data ?? []).length === 0 && <p className="text-muted-foreground">No favorites yet — browse products and hit ❤️.</p>}
        {(favs.data ?? []).map((row: any) => (
          <Card key={row.product.id} className="glass border-white/5 bg-transparent p-4">
            <Link to="/products/$slug" params={{ slug: row.product.slug }} className="font-semibold hover:text-primary">{row.product.name}</Link>
            <div className="text-sm text-muted-foreground">{row.product.tagline}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
