import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { comingSoonProductsQuery, homeCountsQuery, newsQuery, productListQuery } from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";
import { PreorderButton } from "@/components/site/PreorderButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Compass, Gamepad2, Heart, MessagesSquare, Sparkles } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { BuyMeACoffeeButton, SupportModal } from "@/components/site/SupportModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RFL Studios — Apps & Games by Radian Forge Labs" },
      { name: "description", content: "Explore apps, games and software by Radian Forge Labs." },
    ],
  }),
  component: Home,
});

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="glass border-white/5 bg-transparent p-5 text-center">
      <div className="text-3xl font-bold gradient-text">{typeof value === "number" ? value.toLocaleString() : value}</div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </Card>
  );
}

function Home() {
  const comingSoon = useQuery(comingSoonProductsQuery());
  const latest = useQuery(productListQuery("all"));
  const news = useQuery(newsQuery());
  const counts = useQuery(homeCountsQuery());
  const c = counts.data ?? { apps: 0, games: 0 };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl animate-blob" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Welcome to the RFL Studios portal
            </span>
            <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              <span className="gradient-text">RFL Studios</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Creating games and apps. A unified home for every project we ship.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-brand text-brand-foreground shadow-glow hover:opacity-90">
                <Link to="/apps"><Compass className="mr-2 h-4 w-4" />Explore Apps</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/10 glass">
                <Link to="/games"><Gamepad2 className="mr-2 h-4 w-4" />Explore Games</Link>
              </Button>
              <BuyMeACoffeeButton size="lg" />
            </div>
          </div>

          <div className="pointer-events-none hidden justify-self-end lg:block">
            <div className="relative h-80 w-80">
              <div className="absolute inset-0 rounded-3xl bg-primary/25 blur-3xl" />
              <Logo className="relative h-full w-full drop-shadow-[0_20px_60px_rgba(56,189,248,0.35)]" />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto -mt-8 max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Apps" value={c.apps} />
          <StatCard label="Games" value={c.games} />
        </div>
      </section>

      {/* COMING SOON */}
      {(comingSoon.data ?? []).length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold">Coming Soon</h2>
              <p className="text-sm text-muted-foreground">Pre-order to be notified the moment we launch.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(comingSoon.data ?? []).map((p) => (
              <Card key={p.id} className="glass overflow-hidden border-white/5 bg-transparent">
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/25 to-primary/5">
                  {p.banner_url && (
                    <img src={p.banner_url} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: p.banner_opacity ?? 0.55 }} />
                  )}
                  <div className="absolute right-2 top-2 rounded-md bg-primary/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-foreground">Coming Soon</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {p.icon_url ? (
                      <img src={p.icon_url} alt={p.name} className="h-20 w-20 rounded-2xl border border-white/20 object-cover shadow-glow" />
                    ) : (
                      <div className="grid h-20 w-20 place-items-center rounded-2xl glass-strong text-2xl font-bold">{p.name.slice(0, 2).toUpperCase()}</div>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <Link to="/products/$slug" params={{ slug: p.slug }} className="text-lg font-semibold hover:text-primary">{p.name}</Link>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.tagline}</p>
                  <div className="mt-4">
                    <PreorderButton productId={p.id} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* LATEST RELEASES */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Latest Releases</h2>
            <p className="text-sm text-muted-foreground">Fresh out of the forge.</p>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to="/projects">All projects <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(latest.data ?? []).slice(0, 8).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* NEWS */}
      {(news.data ?? []).length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="mb-6 text-3xl font-bold">Latest News</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {(news.data ?? []).slice(0, 3).map((n: any) => (
              <Card key={n.id} className="glass border-white/5 bg-transparent p-6">
                <div className="text-xs uppercase tracking-widest text-primary">{new Date(n.created_at).toLocaleDateString()}</div>
                <h3 className="mt-2 text-lg font-semibold">{n.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{n.excerpt}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* SUPPORT */}
      <section id="support" className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass border-white/5 bg-transparent p-8">
            <MessagesSquare className="h-8 w-8 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Get in touch</h3>
            <p className="mt-2 text-sm text-muted-foreground">Have a question or feedback? Send us a message.</p>
            <Button asChild variant="outline" className="mt-4 border-white/10 glass"><Link to="/support">Contact support</Link></Button>
          </Card>
          <Card className="glass border-white/5 bg-transparent p-8">
            <Heart className="h-8 w-8 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Support RFL Studios</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              If you enjoy our apps, buy us a coffee. Every contribution helps us build and improve free apps and open-source projects.
            </p>
            <div className="mt-4">
              <SupportModal
                trigger={
                  <Button className="bg-gradient-brand text-brand-foreground shadow-glow">
                    <Heart className="mr-2 h-4 w-4" /> Buy Me a Coffee
                  </Button>
                }
              />
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
