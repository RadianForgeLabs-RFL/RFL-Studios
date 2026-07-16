import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productBySlugQuery, reviewsQuery } from "@/lib/data";
import { BadgeRow, StatusBadge } from "@/components/site/StatusBadges";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Star, Heart, ExternalLink, Github, FileCode, Calendar } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productBySlugQuery(params.slug));
    if (!data) throw notFound();
    return { name: data.name as string, tagline: data.tagline as string | null };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} — RFL Studios` },
      { name: "description", content: loaderData.tagline ?? `${loaderData.name} on RFL Studios.` },
      { property: "og:title", content: `${loaderData.name} — RFL Studios` },
      { property: "og:description", content: loaderData.tagline ?? "" },
    ] : [{ title: "Not found" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-4xl font-bold gradient-text">Product not found</h1>
      <p className="mt-2 text-muted-foreground">This product doesn't exist or was unpublished.</p>
      <Button asChild className="mt-6 bg-gradient-brand text-brand-foreground shadow-glow"><Link to="/projects">All projects</Link></Button>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-12 text-center text-destructive">{error.message}</div>,
});

function StarBar({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < Math.round(value) ? "fill-yellow-400 stroke-yellow-400" : "stroke-muted-foreground"}`} />
      ))}
    </div>
  );
}

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: p } = useQuery(productBySlugQuery(slug));
  const { data: reviews } = useQuery(reviewsQuery(p?.id ?? ""));
  const { user } = useAuth();
  const qc = useQueryClient();
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (!user || !p?.id) { setFavorited(false); return; }
    supabase.from("favorites").select("product_id").eq("user_id", user.id).eq("product_id", p.id).maybeSingle()
      .then(({ data }) => setFavorited(!!data));
  }, [user, p?.id]);

  const toggleFav = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please sign in to save favorites.");
      if (favorited) {
        await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", p.id);
      } else {
        await supabase.from("favorites").insert({ user_id: user.id, product_id: p.id });
      }
    },
    onSuccess: () => { setFavorited(!favorited); toast.success(favorited ? "Removed from favorites" : "Added to favorites"); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!p) return <div className="p-12 text-center text-muted-foreground">Loading…</div>;

  const downloads: any[] = p.downloads ?? [];
  const versions: any[] = p.versions ?? [];

  return (
    <div>
      {/* Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-70" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-14">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-6 sm:flex sm:justify-between">
            <div className="flex min-w-0 items-start gap-5">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-3xl font-bold text-brand-foreground shadow-glow">
                {p.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-widest text-primary">{p.kind}</div>
                <h1 className="truncate text-3xl font-bold md:text-5xl">{p.name}</h1>
                <p className="mt-1 text-lg text-muted-foreground">{p.tagline}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />{Number(p.rating_avg).toFixed(1)} ({p.rating_count})</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Download className="h-4 w-4" />{p.download_count.toLocaleString()}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{p.release_date}</span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <Button size="lg" className="bg-gradient-brand text-brand-foreground shadow-glow"><Download className="mr-2 h-4 w-4" />Download v{p.latest_version}</Button>
              <Button size="sm" variant="outline" className="border-white/10 glass" onClick={() => toggleFav.mutate()}>
                <Heart className={`mr-2 h-4 w-4 ${favorited ? "fill-pink-400 stroke-pink-400" : ""}`} />
                {favorited ? "Favorited" : "Add to favorites"}
              </Button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-1.5">
            <StatusBadge value={p.status} />
            <StatusBadge value={p.source_type} />
            {(p.play_modes ?? []).map((m: string) => <StatusBadge key={m} value={m} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <Tabs defaultValue="overview">
          <TabsList className="glass border border-white/5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="changelog">Changelog</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({p.rating_count})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="glass border-white/5 bg-transparent p-6 lg:col-span-2">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="mt-3 text-muted-foreground">{p.description}</p>
                {(p.features ?? []).length > 0 && (
                  <><h3 className="mt-6 font-semibold">Features</h3>
                  <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                    {(p.features ?? []).map((f: string) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />{f}</li>
                    ))}
                  </ul></>
                )}
                {p.requirements && <><h3 className="mt-6 font-semibold">Requirements</h3><p className="mt-2 text-sm text-muted-foreground">{p.requirements}</p></>}
                {p.known_issues && <><h3 className="mt-6 font-semibold">Known issues</h3><p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{p.known_issues}</p></>}
                {p.roadmap && <><h3 className="mt-6 font-semibold">Roadmap</h3><p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{p.roadmap}</p></>}
              </Card>
              <Card className="glass border-white/5 bg-transparent p-6">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Details</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <Info k="Version" v={p.latest_version} />
                  <Info k="Released" v={p.release_date} />
                  <Info k="Developer" v={p.developer?.name} />
                  <Info k="Publisher" v={p.publisher} />
                  <Info k="License" v={p.license} />
                  <Info k="Category" v={p.category?.name} />
                  <Info k="Size" v={p.file_size} />
                  <Info k="Platforms" v={(p.platforms ?? []).join(", ")} />
                  <Info k="Architectures" v={(p.architectures ?? []).join(", ")} />
                </dl>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.source_url && <Button size="sm" variant="outline" asChild className="border-white/10 glass"><a href={p.source_url} target="_blank" rel="noreferrer"><Github className="mr-2 h-4 w-4" />Source</a></Button>}
                  {p.documentation_url && <Button size="sm" variant="outline" asChild className="border-white/10 glass"><a href={p.documentation_url} target="_blank" rel="noreferrer"><FileCode className="mr-2 h-4 w-4" />Docs</a></Button>}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="downloads" className="mt-6">
            <div className="space-y-3">
              {downloads.length === 0 && <p className="text-muted-foreground">No downloads yet.</p>}
              {downloads.map((d) => (
                <Card key={d.id} className="glass border-white/5 bg-transparent p-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
                    <div className="min-w-0">
                      <div className="font-medium">{d.platform} <span className="text-muted-foreground">· {d.format.toUpperCase()}</span></div>
                      <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                        {d.architecture && <Badge variant="outline" className="border-white/10">{d.architecture}</Badge>}
                        {d.mirror_name && <Badge variant="outline" className="border-white/10">{d.mirror_name}</Badge>}
                        {d.is_primary && <Badge className="bg-gradient-brand text-brand-foreground">Primary</Badge>}
                        {d.version && <Badge variant="outline" className="border-white/10">v{d.version}</Badge>}
                      </div>
                    </div>
                    <Button asChild className="bg-gradient-brand text-brand-foreground shadow-glow">
                      <a href={d.url} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" />Download</a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="changelog" className="mt-6">
            <Card className="glass border-white/5 bg-transparent p-6">
              {p.changelog ? <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{p.changelog}</pre>
                : <p className="text-muted-foreground">No changelog yet.</p>}
              {versions.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold">Versions</h3>
                  {versions.map((v: any) => (
                    <div key={v.id} className="rounded-lg border border-white/5 p-3">
                      <div className="flex items-center justify-between text-sm"><strong>v{v.version}</strong><span className="text-muted-foreground">{new Date(v.released_at).toLocaleDateString()}</span></div>
                      {v.changelog && <p className="mt-1 text-sm text-muted-foreground">{v.changelog}</p>}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Reviews productId={p.id} rating={p.rating_avg} count={p.rating_count} reviews={reviews ?? []} onChanged={() => qc.invalidateQueries({ queryKey: ["reviews", p.id] })} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

function Info({ k, v }: { k: string; v?: string | number | null }) {
  if (!v) return null;
  return (<div className="flex justify-between gap-4"><dt className="text-muted-foreground">{k}</dt><dd className="text-right">{v}</dd></div>);
}

function Reviews({ productId, rating, count, reviews, onChanged }: { productId: string; rating: number; count: number; reviews: any[]; onChanged: () => void }) {
  const { user } = useAuth();
  const [my, setMy] = useState<any | null>(null);
  const [ratingIn, setRatingIn] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!user) return;
    const r = reviews.find((r) => r.user_id === user.id);
    if (r) { setMy(r); setRatingIn(r.rating); setTitle(r.title ?? ""); setBody(r.body ?? ""); }
  }, [user, reviews]);

  const emailVerified = !!user?.email_confirmed_at;

  const submit = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in required.");
      if (!emailVerified) throw new Error("Please verify your email first.");
      const payload = { product_id: productId, user_id: user.id, rating: ratingIn, title: title || null, body: body || null };
      const { error } = await supabase.from("reviews").upsert(payload, { onConflict: "product_id,user_id" });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Review saved"); onChanged(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {reviews.length === 0 && <p className="text-muted-foreground">No reviews yet — be the first.</p>}
        {reviews.map((r) => (
          <Card key={r.id} className="glass border-white/5 bg-transparent p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{r.profile?.display_name ?? "Anonymous"}</div>
              <StarBar value={r.rating} />
            </div>
            {r.title && <div className="mt-1 font-semibold">{r.title}</div>}
            {r.body && <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>}
            <div className="mt-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</div>
          </Card>
        ))}
      </div>
      <Card className="glass sticky top-24 h-fit border-white/5 bg-transparent p-5">
        <h3 className="font-semibold">{my ? "Your review" : "Write a review"}</h3>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">Overall <StarBar value={rating} /> · {count}</div>
        {!user && <p className="mt-4 text-sm text-muted-foreground">Please <Link to="/auth" className="text-primary">sign in</Link> to review.</p>}
        {user && !emailVerified && <p className="mt-4 text-sm text-yellow-300">Verify your email to review.</p>}
        {user && emailVerified && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Your rating</label>
              <div className="mt-1 flex gap-1">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} onClick={() => setRatingIn(n)}>
                    <Star className={`h-6 w-6 ${n <= ratingIn ? "fill-yellow-400 stroke-yellow-400" : "stroke-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)" maxLength={150} className="glass border-white/10 bg-transparent" />
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your experience" rows={4} maxLength={2000} className="glass border-white/10 bg-transparent" />
            <Button onClick={() => submit.mutate()} disabled={submit.isPending} className="w-full bg-gradient-brand text-brand-foreground shadow-glow">{submit.isPending ? "Saving…" : my ? "Update review" : "Submit review"}</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
