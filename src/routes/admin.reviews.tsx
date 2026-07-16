import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pin, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/reviews")({
  component: AdminReviews,
});

function AdminReviews() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*, product:products(name,slug), profile:profiles(display_name)").order("created_at", { ascending: false });
      if (error) throw error; return data ?? [];
    },
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("reviews").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-reviews"] }); },
  });
  const pin = useMutation({
    mutationFn: async ({ id, pinned }: { id: string; pinned: boolean }) => { const { error } = await supabase.from("reviews").update({ pinned }).eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-reviews"] }); },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">Reviews</h1>
      <div className="mt-6 space-y-3">
        {(data ?? []).map((r: any) => (
          <Card key={r.id} className="glass border-white/5 bg-transparent p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm text-muted-foreground">{r.product?.name} · by {r.profile?.display_name ?? "user"}</div>
                <div className="font-semibold">{r.title ?? "—"} <span className="text-yellow-400">{"★".repeat(r.rating)}</span></div>
                <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-white/10" onClick={() => pin.mutate({ id: r.id, pinned: !r.pinned })}><Pin className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" className="border-white/10 text-destructive" onClick={() => del.mutate(r.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
