import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/admin/news")({
  component: AdminNews,
});

function AdminNews() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-news"], queryFn: async () => (await supabase.from("news").select("*").order("created_at", { ascending: false })).data ?? [] });
  const [slug, setSlug] = useState(""); const [title, setTitle] = useState(""); const [excerpt, setExcerpt] = useState(""); const [body, setBody] = useState("");
  const create = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("news").insert({ slug, title, excerpt, body }); if (error) throw error; },
    onSuccess: () => { toast.success("Published"); setSlug(""); setTitle(""); setExcerpt(""); setBody(""); qc.invalidateQueries({ queryKey: ["admin-news"] }); qc.invalidateQueries({ queryKey: ["news"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("news").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-news"] }),
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">News</h1>
      <Card className="glass mt-6 border-white/5 bg-transparent p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <div><Label>Slug</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
          <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="md:col-span-2"><Label>Excerpt</Label><Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} /></div>
          <div className="md:col-span-2"><Label>Body</Label><Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} /></div>
        </div>
        <Button onClick={() => create.mutate()} disabled={create.isPending} className="mt-3 bg-gradient-brand text-brand-foreground shadow-glow">Publish</Button>
      </Card>
      <div className="mt-6 space-y-3">
        {(data ?? []).map((n: any) => (
          <Card key={n.id} className="glass flex items-center justify-between border-white/5 bg-transparent p-4">
            <div><div className="font-semibold">{n.title}</div><div className="text-xs text-muted-foreground">{n.slug}</div></div>
            <Button size="sm" variant="outline" className="border-white/10 text-destructive" onClick={() => del.mutate(n.id)}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
