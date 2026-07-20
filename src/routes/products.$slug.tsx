import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { productBySlugQuery } from "@/lib/data";
import { StatusBadge } from "@/components/site/StatusBadges";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Heart, ExternalLink, Github, FileCode, Calendar } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ScreenshotGallery } from "@/components/site/ScreenshotViewer";
import { PreorderButton } from "@/components/site/PreorderButton";


export const Route = createFileRoute("/products/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productBySlugQuery(params.slug));
    if (!data) throw notFound();
    return { name: data.name as string, tagline: data.tagline as string | null, banner: data.banner_url as string | null };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} — RFL Studios` },
      { name: "description", content: loaderData.tagline ?? `${loaderData.name} on RFL Studios.` },
      { property: "og:title", content: `${loaderData.name} — RFL Studios` },
      { property: "og:description", content: loaderData.tagline ?? "" },
      ...(loaderData.banner ? [{ property: "og:image", content: loaderData.banner }] : []),
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

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: p } = useQuery(productBySlugQuery(slug));
  const { user } = useAuth();
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
  const screenshots: any[] = p.screenshots ?? [];

  return (
    <div>
      {/* HERO with banner background */}
      <section className="relative overflow-hidden">
        {p.banner_url ? (
          <>
            <div className="absolute inset-0">
              <img src={p.banner_url} alt="" className="h-full w-full object-cover" style={{ opacity: p.banner_opacity ?? 0.4 }} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-hero opacity-70" />
            <div className="absolute inset-0 grid-bg opacity-30" />
          </>
        )}
        <div className="relative mx-auto max-w-7xl px-4 py-14">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-6 sm:flex sm:justify-between">
            <div className="flex min-w-0 items-start gap-5">
              <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-glow">
                {p.icon_url ? (
                  <img src={p.icon_url} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-brand text-3xl font-bold text-brand-foreground">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-widest text-primary">{p.kind}</div>
                <h1 className="truncate text-3xl font-bold md:text-5xl">{p.name}</h1>
                <p className="mt-1 text-lg text-muted-foreground">{p.tagline}</p>
                {p.release_date && (
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{p.release_date}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              {p.coming_soon ? (
                <PreorderButton productId={p.id} size="lg" />
              ) : (
                <Button size="lg" className="bg-gradient-brand text-brand-foreground shadow-glow"><Download className="mr-2 h-4 w-4" />Download v{p.latest_version}</Button>
              )}
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
            {screenshots.length > 0 && <TabsTrigger value="screenshots">Screenshots ({screenshots.length})</TabsTrigger>}
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="changelog">Changelog</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="glass border-white/5 bg-transparent p-6 lg:col-span-2">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="mt-3 text-muted-foreground whitespace-pre-line">{p.description}</p>
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

                {screenshots.length > 0 && (
                  <div className="mt-8">
                    <h3 className="mb-3 font-semibold">Screenshots</h3>
                    <ScreenshotGallery screenshots={screenshots} />
                  </div>
                )}
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

          {screenshots.length > 0 && (
            <TabsContent value="screenshots" className="mt-6">
              <Card className="glass border-white/5 bg-transparent p-6">
                <ScreenshotGallery screenshots={screenshots} />
              </Card>
            </TabsContent>
          )}

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
        </Tabs>
      </section>
    </div>
  );
}

function Info({ k, v }: { k: string; v?: string | number | null }) {
  if (!v) return null;
  return (<div className="flex justify-between gap-4"><dt className="text-muted-foreground">{k}</dt><dd className="text-right">{v}</dd></div>);
}
