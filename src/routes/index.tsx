import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { homeCountsQuery, productListQuery } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Code, Gamepad2, Building2, Users, Download, Star, Zap, Github, Mail } from "lucide-react";

const ProductCard = lazy(() => import("@/components/site/ProductCard").then(m => ({ default: m.ProductCard })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Radian Forge Labs — Professional Software & Gaming" },
      { name: "description", content: "Radian Forge Labs is a technology company building professional software through RFL Studios and immersive games through RFL Entertainment." },
    ],
  }),
  component: Home,
});

function DivisionCard({ 
  title, 
  description, 
  icon: Icon, 
  to, 
  color, 
  stats 
}: { 
  title: string; 
  description: string; 
  icon: any; 
  to: string; 
  color: string;
  stats: { label: string; value: string | number }[];
}) {
  return (
    <Link to={to} className="group">
      <Card className={`relative overflow-hidden border-${color}-500/20 bg-gradient-to-br from-${color}-500/5 to-transparent transition-all hover:border-${color}-500/40 hover:shadow-xl hover:shadow-${color}-500/10`}>
        <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100`} />
        <div className="relative p-8 md:p-12">
          <div className={`mb-6 inline-flex rounded-2xl border border-${color}-500/30 bg-${color}-500/10 p-4`}>
            <Icon className={`h-12 w-12 text-${color}-500`} />
          </div>
          <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">{description}</p>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className={`text-2xl font-bold text-${color}-500`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <Button className={`mt-8 bg-gradient-to-r from-${color}-500 to-${color}-400 text-white hover:opacity-90`}>
            Explore <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </Link>
  );
}

function Home() {
  const counts = useQuery(homeCountsQuery());
  const latestApps = useQuery(productListQuery("app"));
  const latestGames = useQuery(productListQuery("game"));

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Radian Forge Labs</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-muted-foreground md:text-2xl">
              Building the future through professional software and immersive gaming experiences.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90">
                <Link to="/studios">RFL Studios</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                <Link to="/entertainment">RFL Entertainment</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* DIVISIONS */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold">Our Divisions</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <DivisionCard
            title="RFL Studios"
            description="Professional Windows and Android applications, AI tools, utilities, and developer software."
            icon={Code}
            to="/studios"
            color="blue"
            stats={[
              { label: "Applications", value: counts.data?.apps ?? 0 },
              { label: "AI Tools", value: "5+" },
            ]}
          />
          <DivisionCard
            title="RFL Entertainment"
            description="Immersive PC and Android games, from casual play to epic adventures."
            icon={Gamepad2}
            to="/entertainment"
            color="purple"
            stats={[
              { label: "Games", value: counts.data?.games ?? 0 },
              { label: "Players", value: "10K+" },
            ]}
          />
        </div>
      </section>

      {/* COMPANY STATS */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 text-center">
            <Building2 className="mx-auto h-8 w-8 text-primary" />
            <div className="mt-4 text-3xl font-bold">2</div>
            <div className="mt-2 text-sm text-muted-foreground">Divisions</div>
          </Card>
          <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 text-center">
            <Download className="mx-auto h-8 w-8 text-primary" />
            <div className="mt-4 text-3xl font-bold">50K+</div>
            <div className="mt-2 text-sm text-muted-foreground">Downloads</div>
          </Card>
          <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 text-center">
            <Users className="mx-auto h-8 w-8 text-primary" />
            <div className="mt-4 text-3xl font-bold">10K+</div>
            <div className="mt-2 text-sm text-muted-foreground">Users</div>
          </Card>
          <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 text-center">
            <Star className="mx-auto h-8 w-8 text-primary" />
            <div className="mt-4 text-3xl font-bold">4.8</div>
            <div className="mt-2 text-sm text-muted-foreground">Avg Rating</div>
          </Card>
        </div>
      </section>

      {/* LATEST FROM STUDIOS */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Latest from RFL Studios</h2>
            <p className="mt-2 text-sm text-muted-foreground">Fresh applications and tools.</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/studios">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Suspense fallback={Array(4).fill(0).map((_, i) => (
            <Card key={i} className="border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent p-6">
              <div className="h-32 bg-blue-500/10 rounded animate-pulse" />
              <div className="mt-4 h-4 w-3/4 bg-blue-500/10 rounded" />
            </Card>
          ))}>
            {(latestApps.data ?? []).slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}
          </Suspense>
        </div>
      </section>

      {/* LATEST FROM ENTERTAINMENT */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Latest from RFL Entertainment</h2>
            <p className="mt-2 text-sm text-muted-foreground">New games and experiences.</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/entertainment">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Suspense fallback={Array(4).fill(0).map((_, i) => (
            <Card key={i} className="border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent p-6">
              <div className="h-32 bg-purple-500/10 rounded animate-pulse" />
              <div className="mt-4 h-4 w-3/4 bg-purple-500/10 rounded" />
            </Card>
          ))}>
            {(latestGames.data ?? []).slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}
          </Suspense>
        </div>
      </section>

      {/* MISSION */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <Zap className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-6 text-3xl font-bold">Our Mission</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              To create innovative software and gaming experiences that empower users and bring joy to millions. 
              We believe in open-source, accessibility, and the power of technology to transform lives.
            </p>
          </div>
        </Card>
      </section>

      {/* FOOTER CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
            <Github className="h-8 w-8 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Open Source</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Many of our projects are open source. Contribute or star us on GitHub.
            </p>
            <Button asChild variant="outline" className="mt-4 border-white/10">
              <a href="https://github.com/RadianForgeLabs-RFL" target="_blank" rel="noopener noreferrer">
                View GitHub <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </Card>
          <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
            <Mail className="h-8 w-8 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Get in Touch</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Have questions or feedback? We'd love to hear from you.
            </p>
            <Button asChild variant="outline" className="mt-4 border-white/10">
              <Link to="/support">Contact Us <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
