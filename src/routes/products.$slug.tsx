import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { productBySlugQuery } from "@/lib/data";

import { StatusBadge } from "@/components/site/StatusBadges";

import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";

import { Download, ExternalLink, Github, FileCode, Share2, Calendar, User, Building, Shield, Tag, HardDrive, Cpu, Heart } from "lucide-react";

import { toast } from "sonner";

import { ScreenshotGallery } from "@/components/site/ScreenshotViewer";

import { PreorderButton } from "@/components/site/PreorderButton";

import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";



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



const KIND_LABEL: Record<string, string> = { app: "App", game: "Game", ai: "Tool" };



function ProductPage() {

  const { slug } = Route.useParams();

  const { data: p } = useQuery(productBySlugQuery(slug));

  const [activeTab, setActiveTab] = useState("overview");

  const qc = useQueryClient();



  // Check if product is favorited

  const { data: session } = useQuery({

    queryKey: ["session"],

    queryFn: async () => {

      const { data } = await supabase.auth.getSession();

      return data.session;

    },

  });



  const { data: isFavorited } = useQuery({

    queryKey: ["favorite", p?.id, session?.user?.id],

    queryFn: async () => {

      if (!p?.id || !session?.user?.id) return false;

      const { data } = await supabase

        .from("favorites")

        .select("user_id")

        .eq("product_id", p.id)

        .eq("user_id", session.user.id)

        .maybeSingle();

      return !!data;

    },

    enabled: !!p?.id && !!session?.user?.id,

  });



  const toggleFavorite = useMutation({

    mutationFn: async () => {

      if (!p?.id || !session?.user?.id) throw new Error("Must be logged in");

      if (isFavorited) {

        await supabase.from("favorites").delete().eq("product_id", p.id).eq("user_id", session.user.id);

      } else {

        await supabase.from("favorites").insert({ product_id: p.id, user_id: session.user.id });

      }

    },

    onSuccess: () => {

      qc.invalidateQueries({ queryKey: ["favorite", p?.id, session?.user?.id] });

      toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");

    },

    onError: (e: Error) => toast.error(e.message),

  });



  if (!p) return <div className="p-12 text-center text-muted-foreground">Loading…</div>;



  const downloads: any[] = p.downloads ?? [];

  const versions: any[] = p.versions ?? [];

  const screenshots: any[] = p.screenshots ?? [];

  

  // Detect user's platform

  const detectPlatform = (): string => {

    const ua = navigator.userAgent;

    const platform = navigator.platform.toLowerCase();

    

    if (/android/i.test(ua)) return "Android";

    if (/iphone|ipad|ipod/i.test(ua)) return "iOS";

    if (/mac/i.test(platform)) return "macOS";

    if (/win/i.test(platform)) return "Windows";

    if (/linux/i.test(platform)) return "Linux";

    return "Windows"; // Default fallback

  };

  

  const userPlatform = detectPlatform();

  

  // Find download for user's platform

  const platformDl = downloads.find((d) => 

    d.platform.toLowerCase() === userPlatform.toLowerCase()

  );

  

  // Use platform-specific download, fallback to primary, then first available

  const primaryDl = platformDl ?? downloads.find((d) => d.is_primary) ?? downloads[0];

  

  const share = async () => {

    const url = window.location.href;

    

    // Try native share (mobile only, typically)

    if (navigator.share && /Mobile|Android|iPhone/i.test(navigator.userAgent)) {

      try {

        await navigator.share({ title: p.name, url });

        return;

      } catch (err) {

        if (err instanceof Error && err.name === 'AbortError') {

          return; // User cancelled

        }

      }

    }

    

    // Use clipboard for desktop

    const textArea = document.createElement("textarea");

    textArea.value = url;

    textArea.style.position = "fixed";

    textArea.style.left = "-9999px";

    document.body.appendChild(textArea);

    textArea.select();

    

    try {

      document.execCommand("copy");

      toast.success("Link copied to clipboard");

    } catch (e) {

      toast.error("Failed to copy link");

    } finally {

      document.body.removeChild(textArea);

    }

  };

  

  const handleGetClick = () => {

    if (!platformDl && downloads.length > 0) {

      // No download for user's platform, switch to downloads tab

      setActiveTab("downloads");

      toast.info(`No download available for ${userPlatform}. See all downloads below.`);

    }

  };



  return (

    <div>

      {/* HERO — Microsoft Store style, banner-dominant */}

      <section className="relative overflow-hidden">

        {p.banner_url ? (

          <div className="absolute inset-0">

            <img src={p.banner_url} alt="" className="h-full w-full object-cover" style={{ opacity: p.banner_opacity ?? 0.85 }} />

            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />

            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          </div>

        ) : (

          <>

            <div className="absolute inset-0 bg-gradient-hero opacity-80" />

            <div className="absolute inset-0 grid-bg opacity-30" />

          </>

        )}

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 md:pt-32">

          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">

            <div className="max-w-3xl">
              <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)]">

                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-3xl border border-white/15 bg-black/40 shadow-glow">

                  {p.icon_url ? (

                    <img src={p.icon_url} alt={p.name} className="h-full w-full object-cover" />

                  ) : (

                    <div className="grid h-full w-full place-items-center bg-gradient-brand text-3xl font-bold text-brand-foreground">

                      {p.name.slice(0, 2).toUpperCase()}

                    </div>

                  )}

                </div>

                <div className="min-w-0">

                  <h1 className="text-4xl font-bold md:text-5xl">{p.name}</h1>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">

                    <span className="font-medium uppercase tracking-wider text-primary">

                      {p.developer?.name ?? p.publisher ?? "Radian Forge Labs"}

                    </span>

                    {p.category?.name && (

                      <>

                        <span className="text-muted-foreground">·</span>

                        <span className="text-primary">{p.category.name}</span>

                      </>

                    )}

                    <span className="text-muted-foreground">·</span>

                    <span className="text-muted-foreground">{KIND_LABEL[p.kind] ?? p.kind}</span>

                  </div>

                  {p.tagline && <p className="mt-4 max-w-2xl text-base text-foreground/80 md:text-lg">{p.tagline}</p>}

                </div>

              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {p.coming_soon ? (
                  <PreorderButton productId={p.id} size="lg" className="min-w-40" />
                ) : primaryDl ? (
                  !platformDl ? (
                    <Button
                      size="lg"
                      className="min-w-40 bg-gradient-brand text-brand-foreground shadow-glow"
                      onClick={handleGetClick}
                    >
                      <Download className="mr-2 h-4 w-4" /> Get
                    </Button>
                  ) : (
                    <Button asChild size="lg" className="min-w-40 bg-gradient-brand text-brand-foreground shadow-glow">
                      <a href={primaryDl.url} target="_blank" rel="noreferrer">
                        <Download className="mr-2 h-4 w-4" /> Get for {primaryDl.platform}{primaryDl.version && ` v${primaryDl.version}`}
                      </a>
                    </Button>
                  )
                ) : (
                  <Button size="lg" disabled className="min-w-40">No downloads yet</Button>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 glass"
                  onClick={() => session ? toggleFavorite.mutate() : toast.error("Please log in to favorite")}
                  disabled={toggleFavorite.isPending}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
                  {isFavorited ? "Favorited" : "Favorite"}
                </Button>
                <Button size="lg" variant="outline" className="border-white/10 glass" onClick={share}>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>

              <div className="mt-5 flex flex-wrap gap-1.5">
                <StatusBadge value={p.status} />
                <StatusBadge value={p.source_type} />
                {p.coming_soon && <StatusBadge value="coming_soon" />}
              </div>
            </div>

            {p.trailer_url && (
              <div className="w-full lg:w-[500px] lg:shrink-0">
                <div className="glass rounded-2xl border border-white/10 bg-black/20 p-3 shadow-2xl backdrop-blur-xl">
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-black/50">
                    <video
                      src={p.trailer_url}
                      className="h-full w-full"
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      title={`${p.name} trailer`}
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </section>



      <section className="mx-auto max-w-7xl px-4 py-10">

        <Tabs value={activeTab} onValueChange={setActiveTab}>

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

                {(p.play_modes ?? []).length > 0 && (

                  <><h3 className="mt-6 font-semibold">Play Modes</h3>

                  <div className="mt-2 flex flex-wrap gap-2">

                    {(p.play_modes ?? []).map((pm: string) => (

                      <Badge key={pm} variant="outline" className="border-white/10">

                        {pm.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}

                      </Badge>

                    ))}

                  </div></>

                )}

                {(p.dependencies ?? []).length > 0 && (

                  <><h3 className="mt-6 font-semibold">Dependencies</h3>

                  <div className="mt-2 flex flex-wrap gap-2">

                    {(p.dependencies ?? []).map((dep: string) => (

                      <Badge key={dep} variant="outline" className="border-white/10">{dep}</Badge>

                    ))}

                  </div></>

                )}

                {p.extra_guidance && (

                  <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">

                    <h3 className="font-semibold text-primary">Guidance</h3>

                    <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{p.extra_guidance}</p>

                  </div>

                )}



                {screenshots.length > 0 && (

                  <div className="mt-8">

                    <h3 className="mb-3 font-semibold">Screenshots</h3>

                    <ScreenshotGallery screenshots={screenshots} />

                  </div>

                )}

              </Card>

              <Card className="glass border-white/5 bg-transparent p-6">

                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Details</h3>

                <dl className="mt-4 space-y-4 text-sm">

                  {p.latest_version && (

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">

                        <Tag className="h-4 w-4" />

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="text-xs text-muted-foreground">Version</div>

                        <div className="font-medium">{p.latest_version}</div>

                      </div>

                    </div>

                  )}

                  {p.release_date && (

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">

                        <Calendar className="h-4 w-4" />

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="text-xs text-muted-foreground">Released</div>

                        <div className="font-medium">{p.release_date}</div>

                      </div>

                    </div>

                  )}

                  {p.developer?.name && (

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">

                        <User className="h-4 w-4" />

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="text-xs text-muted-foreground">Developer</div>

                        <div className="font-medium">{p.developer.name}</div>

                      </div>

                    </div>

                  )}

                  {p.publisher && (

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">

                        <Building className="h-4 w-4" />

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="text-xs text-muted-foreground">Publisher</div>

                        <div className="font-medium">{p.publisher}</div>

                      </div>

                    </div>

                  )}

                  {p.license && (

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">

                        <Shield className="h-4 w-4" />

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="text-xs text-muted-foreground">License</div>

                        <div className="font-medium">{p.license}</div>

                      </div>

                    </div>

                  )}

                  {p.category?.name && (

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">

                        <Tag className="h-4 w-4" />

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="text-xs text-muted-foreground">Category</div>

                        <div className="font-medium">{p.category.name}</div>

                      </div>

                    </div>

                  )}

                  {p.file_size && (

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">

                        <HardDrive className="h-4 w-4" />

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="text-xs text-muted-foreground">Size</div>

                        <div className="font-medium">{p.file_size}</div>

                      </div>

                    </div>

                  )}

                  {(p.platforms ?? []).length > 0 && (

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">

                        <Cpu className="h-4 w-4" />

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="text-xs text-muted-foreground">Platforms</div>

                        <div className="font-medium">{(p.platforms ?? []).join(", ")}</div>

                      </div>

                    </div>

                  )}

                  {(p.architectures ?? []).length > 0 && (

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">

                        <Cpu className="h-4 w-4" />

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="text-xs text-muted-foreground">Architectures</div>

                        <div className="font-medium">{(p.architectures ?? []).join(", ")}</div>

                      </div>

                    </div>

                  )}

                  {(p.tags ?? []).length > 0 && (

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">

                        <Tag className="h-4 w-4" />

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="text-xs text-muted-foreground">Tags</div>

                        <div className="mt-1 flex flex-wrap gap-1">

                          {(p.tags ?? []).map((t: any) => (

                            <Badge key={t.tag?.id} variant="outline" className="border-white/10 text-xs">

                              {t.tag?.name}

                            </Badge>

                          ))}

                        </div>

                      </div>

                    </div>

                  )}

                </dl>

                <div className="mt-6 flex flex-wrap gap-2">

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

