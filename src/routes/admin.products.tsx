import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { adminProductListQuery } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { ImageUpload, MultiImageUpload } from "@/components/admin/MediaUpload";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function AdminProducts() {
  const qc = useQueryClient();
  const { data } = useQuery(adminProductListQuery());

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["products"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage apps and games.</p>
        </div>
        <ProductDialog trigger={<Button className="bg-gradient-brand text-brand-foreground shadow-glow"><Plus className="mr-2 h-4 w-4" />New product</Button>} />
      </div>

      <div className="mt-6 space-y-3">
        {(data ?? []).map((p) => (
          <Card key={p.id} className="glass border-white/5 bg-transparent p-4">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                {p.icon_url ? <img src={p.icon_url} alt="" className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold">{p.name} <span className="text-xs uppercase text-muted-foreground">· {p.kind}</span></div>
                <div className="text-xs text-muted-foreground">{p.slug} · v{p.latest_version} · {p.status}</div>
              </div>
              <div className="flex gap-2">
                <ProductDialog product={p} trigger={<Button size="sm" variant="outline" className="border-white/10"><Pencil className="h-4 w-4" /></Button>} />
                <Button size="sm" variant="outline" className="border-white/10 text-destructive" onClick={() => { if (confirm("Delete?")) del.mutate(p.id); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProductDialog({ product, trigger }: { product?: any; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [tagline, setTagline] = useState(product?.tagline ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [kind, setKind] = useState(product?.kind ?? "app");
  const [status, setStatus] = useState(product?.status ?? "stable");
  const [source_type, setSourceType] = useState(product?.source_type ?? "closed_source");
  const [latest_version, setVersion] = useState(product?.latest_version ?? "1.0.0");
  const [coming_soon, setComingSoon] = useState(product?.coming_soon ?? false);
  const [published, setPublished] = useState(product?.published ?? true);
  const [icon_url, setIconUrl] = useState<string | null>(product?.icon_url ?? null);
  const [banner_url, setBannerUrl] = useState<string | null>(product?.banner_url ?? null);
  const [banner_opacity, setBannerOpacity] = useState<number>(product?.banner_opacity ?? 0.4);
  const [productId, setProductId] = useState<string | null>(product?.id ?? null);
  const qc = useQueryClient();

  useEffect(() => {
    if (!open) return;
    setProductId(product?.id ?? null);
    setIconUrl(product?.icon_url ?? null);
    setBannerUrl(product?.banner_url ?? null);
    setBannerOpacity(product?.banner_opacity ?? 0.4);
  }, [open, product]);

  const save = useMutation({
    mutationFn: async () => {
      const payload: any = {
        name, slug: slug || slugify(name), tagline, description, kind, status, source_type,
        latest_version, coming_soon, published, icon_url, banner_url, banner_opacity,
      };
      if (productId) {
        const { error } = await supabase.from("products").update(payload).eq("id", productId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("products").insert(payload).select("id").single();
        if (error) throw error;
        setProductId(data.id);
      }
    },
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["products"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="glass-strong max-h-[90vh] max-w-3xl overflow-y-auto border-white/5 bg-background/95">
        <DialogHeader><DialogTitle>{product ? "Edit product" : "New product"}</DialogTitle></DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="media" disabled={!productId}>Media</TabsTrigger>
            <TabsTrigger value="downloads" disabled={!productId}>Downloads</TabsTrigger>
            <TabsTrigger value="versions" disabled={!productId}>Old Versions</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2">
              <F label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} /></F>
              <F label="Slug"><Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={slugify(name)} /></F>
              <F label="Kind">
                <select value={kind} onChange={(e) => setKind(e.target.value)} className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm">
                  <option value="app">App</option><option value="game">Game</option>
                </select>
              </F>
              <F label="Status">
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm">
                  <option value="stable">Stable</option><option value="beta">Beta</option><option value="experimental">Experimental</option>
                  <option value="deprecated">Deprecated</option><option value="abandoned">Abandoned</option>
                </select>
              </F>
              <F label="Source">
                <select value={source_type} onChange={(e) => setSourceType(e.target.value)} className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm">
                  <option value="open_source">Open Source</option><option value="closed_source">Closed Source</option>
                  <option value="mod">MOD</option><option value="official">Official</option><option value="community">Community</option>
                </select>
              </F>
              <F label="Version"><Input value={latest_version} onChange={(e) => setVersion(e.target.value)} /></F>
              <F label="Tagline" className="md:col-span-2"><Input value={tagline} onChange={(e) => setTagline(e.target.value)} /></F>
              <F label="Description" className="md:col-span-2"><Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} /></F>
              <div className="flex gap-6 md:col-span-2">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />Featured</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />Published</label>
              </div>
            </div>
            <Button onClick={() => save.mutate()} disabled={save.isPending} className="mt-4 bg-gradient-brand text-brand-foreground shadow-glow">
              {save.isPending ? "Saving…" : productId ? "Save changes" : "Create & continue"}
            </Button>
            {!productId && <p className="mt-2 text-xs text-muted-foreground">Save first to unlock media, downloads, and version tabs.</p>}
          </TabsContent>

          <TabsContent value="media" className="mt-4 space-y-6">
            <div>
              <Label className="mb-2 block">Icon</Label>
              <ImageUpload value={icon_url} label="Icon" folder="icons" onChange={async (url) => {
                setIconUrl(url);
                if (productId) await supabase.from("products").update({ icon_url: url }).eq("id", productId);
                qc.invalidateQueries({ queryKey: ["products"] });
              }} />
            </div>
            <div>
              <Label className="mb-2 block">Banner</Label>
              <ImageUpload value={banner_url} label="Banner" aspect="aspect-video" folder="banners" onChange={async (url) => {
                setBannerUrl(url);
                if (productId) await supabase.from("products").update({ banner_url: url }).eq("id", productId);
                qc.invalidateQueries({ queryKey: ["products"] });
              }} />
            </div>
            <div>
              <Label className="mb-2 block">Banner transparency ({Math.round(banner_opacity * 100)}%)</Label>
              <input
                type="range" min={0} max={1} step={0.05} value={banner_opacity}
                onChange={async (e) => {
                  const v = parseFloat(e.target.value);
                  setBannerOpacity(v);
                  if (productId) await supabase.from("products").update({ banner_opacity: v }).eq("id", productId);
                  qc.invalidateQueries({ queryKey: ["products"] });
                }}
                className="w-full accent-primary"
              />
              {banner_url && (
                <div className="relative mt-2 h-32 overflow-hidden rounded-lg border border-white/10 bg-black">
                  <img src={banner_url} alt="" className="h-full w-full object-cover" style={{ opacity: banner_opacity }} />
                </div>
              )}
            </div>
            <ScreenshotsEditor productId={productId!} />
          </TabsContent>

          <TabsContent value="downloads" className="mt-4">
            <DownloadsEditor productId={productId!} defaultVersion={latest_version} />
          </TabsContent>

          <TabsContent value="versions" className="mt-4">
            <VersionsEditor productId={productId!} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={className}><Label className="mb-1 block">{label}</Label>{children}</div>;
}

// ---------- Screenshots ----------
function ScreenshotsEditor({ productId }: { productId: string }) {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["screenshots", productId],
    queryFn: async () => {
      const { data, error } = await supabase.from("screenshots").select("*").eq("product_id", productId).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!productId,
  });
  return (
    <div>
      <Label className="mb-2 block">Screenshots</Label>
      <MultiImageUpload
        folder="screenshots"
        items={(data ?? []).map((s: any) => ({ id: s.id, url: s.url }))}
        onAdd={async (url) => {
          const { error } = await supabase.from("screenshots").insert({ product_id: productId, url });
          if (error) throw error;
          qc.invalidateQueries({ queryKey: ["screenshots", productId] });
        }}
        onRemove={async (it) => {
          if (!it.id) return;
          const { error } = await supabase.from("screenshots").delete().eq("id", it.id);
          if (error) { toast.error(error.message); return; }
          qc.invalidateQueries({ queryKey: ["screenshots", productId] });
        }}
      />
    </div>
  );
}

// ---------- Downloads ----------
const PLATFORMS = ["windows", "macos", "linux", "android", "ios", "web"];
const FORMATS = ["exe", "msi", "dmg", "pkg", "deb", "rpm", "appimage", "apk", "aab", "zip", "tar.gz", "web", "other"];

function DownloadsEditor({ productId, defaultVersion }: { productId: string; defaultVersion: string }) {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["downloads", productId],
    queryFn: async () => {
      const { data, error } = await supabase.from("downloads").select("*").eq("product_id", productId).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!productId,
  });

  const [platform, setPlatform] = useState("windows");
  const [format, setFormat] = useState("exe");
  const [url, setUrl] = useState("");
  const [version, setVersion] = useState(defaultVersion);
  const [mirror, setMirror] = useState("");

  const add = useMutation({
    mutationFn: async () => {
      if (!url) throw new Error("URL required");
      const { error } = await supabase.from("downloads").insert({
        product_id: productId, platform, format, url, version, mirror_name: mirror || null, is_primary: false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Download link added");
      setUrl(""); setMirror("");
      qc.invalidateQueries({ queryKey: ["downloads", productId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("downloads").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["downloads", productId] }),
  });

  return (
    <div className="space-y-4">
      <Card className="glass border-white/5 bg-transparent p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <F label="Platform">
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm">
              {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </F>
          <F label="Format">
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm">
              {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </F>
          <F label="Version"><Input value={version} onChange={(e) => setVersion(e.target.value)} /></F>
          <F label="Mirror name (optional)"><Input value={mirror} onChange={(e) => setMirror(e.target.value)} placeholder="e.g. GitHub, CDN" /></F>
          <F label="Download URL" className="sm:col-span-2">
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
          </F>
        </div>
        <Button onClick={() => add.mutate()} disabled={add.isPending} className="mt-3 bg-gradient-brand text-brand-foreground shadow-glow">
          <Plus className="mr-2 h-4 w-4" />Add download link
        </Button>
      </Card>

      <div className="space-y-2">
        {(data ?? []).map((d: any) => (
          <div key={d.id} className="glass flex items-center justify-between gap-3 rounded-md border border-white/5 p-3 text-sm">
            <div className="min-w-0">
              <div className="font-medium">
                {d.platform} · {d.format} · v{d.version} {d.mirror_name && <span className="text-muted-foreground">· {d.mirror_name}</span>}
              </div>
              <div className="truncate text-xs text-muted-foreground">{d.url}</div>
            </div>
            <Button size="sm" variant="outline" className="border-white/10 text-destructive" onClick={() => del.mutate(d.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {!data?.length && <p className="text-sm text-muted-foreground">No download links yet.</p>}
      </div>
    </div>
  );
}

// ---------- Versions (changelog / historical) ----------
function VersionsEditor({ productId }: { productId: string }) {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["versions", productId],
    queryFn: async () => {
      const { data, error } = await supabase.from("versions").select("*").eq("product_id", productId).order("released_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!productId,
  });

  const [version, setVersion] = useState("");
  const [changelog, setChangelog] = useState("");
  const [isLatest, setIsLatest] = useState(false);

  const add = useMutation({
    mutationFn: async () => {
      if (!version) throw new Error("Version required");
      const { error } = await supabase.from("versions").insert({
        product_id: productId, version, changelog: changelog || null, is_latest: isLatest, released_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Version added");
      setVersion(""); setChangelog(""); setIsLatest(false);
      qc.invalidateQueries({ queryKey: ["versions", productId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("versions").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["versions", productId] }),
  });

  return (
    <div className="space-y-4">
      <Card className="glass border-white/5 bg-transparent p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <F label="Version tag"><Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="e.g. 1.2.3" /></F>
          <label className="mt-6 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isLatest} onChange={(e) => setIsLatest(e.target.checked)} />Mark as latest
          </label>
          <F label="Changelog" className="sm:col-span-2"><Textarea rows={3} value={changelog} onChange={(e) => setChangelog(e.target.value)} /></F>
        </div>
        <Button onClick={() => add.mutate()} disabled={add.isPending} className="mt-3 bg-gradient-brand text-brand-foreground shadow-glow">
          <Plus className="mr-2 h-4 w-4" />Add version
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          To attach a download link for an older version, add it in the Downloads tab with the matching version tag.
        </p>
      </Card>

      <div className="space-y-2">
        {(data ?? []).map((v: any) => (
          <div key={v.id} className="glass flex items-start justify-between gap-3 rounded-md border border-white/5 p-3 text-sm">
            <div className="min-w-0">
              <div className="font-medium">v{v.version} {v.is_latest && <span className="ml-2 rounded bg-gradient-brand px-1.5 py-0.5 text-[10px] text-brand-foreground">LATEST</span>}</div>
              {v.changelog && <div className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">{v.changelog}</div>}
              <div className="mt-1 text-[10px] text-muted-foreground">{new Date(v.released_at).toLocaleDateString()}</div>
            </div>
            <Button size="sm" variant="outline" className="border-white/10 text-destructive" onClick={() => del.mutate(v.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {!data?.length && <p className="text-sm text-muted-foreground">No versions logged yet.</p>}
      </div>
    </div>
  );
}
