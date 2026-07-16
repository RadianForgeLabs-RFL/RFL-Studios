import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { featuredProductsQuery, newsQuery, productListQuery, statsQuery } from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Compass, Gamepad2, Github, Heart, MessagesSquare, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RFL Studios — Apps, Games, AI & Open Software" },
      { name: "description", content: "Explore apps, games, AI tools and open-source projects by Radian Forge Labs." },
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
  const featured = useQuery(featuredProductsQuery());
  const latest = useQuery(productListQuery("all"));
  const news = useQuery(newsQuery());
  const stats = useQuery(statsQuery());
  const s = stats.data ?? {};

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl animate-blob" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Welcome to the RFL Studios portal
            </span>
            <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              <span className="gradient-text">RFL Studios</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Creating games, apps, AI tools and open software. A unified home for every project we ship.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-brand text-brand-foreground shadow-glow hover:opacity-90">
                <Link to="/apps"><Compass className="mr-2 h-4 w-4" />Explore Apps</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/10 glass">
                <Link to="/games"><Gamepad2 className="mr-2 h-4 w-4" />Explore Games</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <a href="https://github.com" target="_blank" rel="noreferrer"><Github className="mr-2 h-4 w-4" />GitHub</a>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <a href="https://discord.com" target="_blank" rel="noreferrer"><MessagesSquare className="mr-2 h-4 w-4" />Discord</a>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <a href="#donate"><Heart className="mr-2 h-4 w-4" />Donate</a>
              </Button>
            </div>
          </div>

          {/* Illustration area */}
          <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 lg:block">
            <div className="relative h-72 w-72">
              <div className="absolute inset-0 rounded-3xl bg-gradient-brand opacity-30 blur-2xl" />
              <div className="glass-strong shadow-glow relative grid h-full w-full place-items-center rounded-3xl">
                <div className="text-8xl font-bold gradient-text animate-float">RFL</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto -mt-8 max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Apps" value={s.apps_published ?? 0} />
          <StatCard label="Games" value={s.games_published ?? 0} />
          <StatCard label="Downloads" value={s.downloads ?? 0} />
          <StatCard label="Users" value={s.users ?? 0} />
          <StatCard label="Community" value={s.community_members ?? 0} />
          <StatCard label="Open Source" value={s.open_source_projects ?? 0} />
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-sm text-muted-foreground">Hand-picked from across the RFL ecosystem.</p>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to="/projects">All projects <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(featured.data ?? []).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* LATEST RELEASES */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Latest Releases</h2>
          <p className="text-sm text-muted-foreground">Fresh out of the forge.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(latest.data ?? []).slice(0, 8).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* NEWS */}
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

      {/* COMMUNITY / DEV / OSS */}
      <section id="donate" className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass border-white/5 bg-transparent p-8">
            <MessagesSquare className="h-8 w-8 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Community</h3>
            <p className="mt-2 text-sm text-muted-foreground">Join thousands of players, developers, and researchers on our Discord.</p>
            <Button asChild variant="outline" className="mt-4 border-white/10 glass"><a href="https://discord.com">Join Discord</a></Button>
          </Card>
          <Card className="glass border-white/5 bg-transparent p-8">
            <Github className="h-8 w-8 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Developers</h3>
            <p className="mt-2 text-sm text-muted-foreground">Contribute to open-source RFL projects and build the next chapter with us.</p>
            <Button asChild variant="outline" className="mt-4 border-white/10 glass"><a href="https://github.com">View GitHub</a></Button>
          </Card>
          <Card className="glass border-white/5 bg-transparent p-8">
            <Heart className="h-8 w-8 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Support Us</h3>
            <p className="mt-2 text-sm text-muted-foreground">Every donation keeps our open-source work independent and free.</p>
            <Button asChild className="mt-4 bg-gradient-brand text-brand-foreground shadow-glow"><a href="#">Donate</a></Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
