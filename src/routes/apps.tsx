import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { allProductsQuery } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const ProductCard = lazy(() => import("@/components/site/ProductCard").then(m => ({ default: m.ProductCard })));

export const Route = createFileRoute("/apps")({
  head: () => ({
    meta: [
      { title: "All Apps — RFL Studios" },
      { name: "description", content: "Browse all applications from RFL Studios, including released and coming soon apps." },
    ],
  }),
  component: Apps,
});

function Apps() {
  const apps = useQuery(allProductsQuery("app"));

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-blue-500/10 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">All Apps</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-muted-foreground md:text-2xl">
              Browse all applications from RFL Studios, including released and coming soon projects.
            </p>
          </div>
        </div>
      </section>

      {/* APPS GRID */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={Array(6).fill(0).map((_, i) => (
            <Card key={i} className="border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent p-6">
              <div className="h-40 bg-blue-500/10 rounded animate-pulse" />
              <div className="mt-4 h-4 w-3/4 bg-blue-500/10 rounded" />
            </Card>
          ))}>
            {(apps.data ?? []).map((p) => <ProductCard key={p.id} p={p} />)}
          </Suspense>
        </div>
        {apps.data?.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No apps available yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
