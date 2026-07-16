import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { productListQuery } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

function AdminProducts() {
  const qc = useQueryClient();
  const { data } = useQuery(productListQuery("all"));

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("products").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["products"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage apps, games, and AI tools.</p>
        </div>
        <ProductDialog trigger={<Button className="bg-gradient-brand text-brand-foreground shadow-glow"><Plus className="mr-2 h-4 w-4" />New product</Button>} />
      </div>

      <div className="mt-6 space-y-3">
        {(data ?? []).map((p) => (
          <Card key={p.id} className="glass border-white/5 bg-transparent p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
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
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [published, setPublished] = useState(product?.published ?? true);
  const qc = useQueryClient();

  const save = useMutation({
    mutationFn: async () => {
      const payload: any = {
        name, slug: slug || slugify(name), tagline, description, kind, status, source_type, latest_version, featured, published,
      };
      if (product?.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("Saved"); setOpen(false); qc.invalidateQueries({ queryKey: ["products"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="glass-strong max-w-2xl border-white/5 bg-background/90">
        <DialogHeader><DialogTitle>{product ? "Edit product" : "New product"}</DialogTitle></DialogHeader>
        <div className="grid gap-3 md:grid-cols-2">
          <F label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} /></F>
          <F label="Slug"><Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={slugify(name)} /></F>
          <F label="Kind" className="md:col-span-1">
            <select value={kind} onChange={(e) => setKind(e.target.value)} className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm">
              <option value="app">App</option><option value="game">Game</option><option value="ai">AI</option>
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
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />Published</label>
          </div>
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending} className="bg-gradient-brand text-brand-foreground shadow-glow">
          {save.isPending ? "Saving…" : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={className}><Label className="mb-1 block">{label}</Label>{children}</div>;
}
