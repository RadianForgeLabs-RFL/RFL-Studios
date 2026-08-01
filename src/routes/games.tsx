import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { allProductsQuery } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const ProductCard = lazy(() => import("@/components/site/ProductCard").then(m => ({ default: m.ProductCard })));

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "All Games — RFL Entertainment" },
      { name: "description", content: "Browse all games from RFL Entertainment, including released and coming soon games." },
    ],
  }),
  component: Games,
});

function Games() {
  const games = useQuery(allProductsQuery("game"));

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-purple-500/10 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              <span className="bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent">All Games</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-muted-foreground md:text-2xl">
              Browse all games from RFL Entertainment, including released and coming soon projects.
            </p>
          </div>
        </div>
      </section>

      {/* GAMES GRID */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={Array(6).fill(0).map((_, i) => (
            <Card key={i} className="border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent p-6">
              <div className="h-40 bg-purple-500/10 rounded animate-pulse" />
              <div className="mt-4 h-4 w-3/4 bg-purple-500/10 rounded" />
            </Card>
          ))}>
            {(games.data ?? []).map((p) => <ProductCard key={p.id} p={p} />)}
          </Suspense>
        </div>
        {games.data?.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No games available yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
