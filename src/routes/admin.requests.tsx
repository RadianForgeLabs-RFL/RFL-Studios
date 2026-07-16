import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/requests")({
  component: AdminRequests,
});

function AdminRequests() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-requests"],
    queryFn: async () => (await supabase.from("requests").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const set = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => { const { error } = await supabase.from("requests").update({ status }).eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-requests"] }); },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">Requests</h1>
      <div className="mt-6 space-y-3">
        {(data ?? []).length === 0 && <p className="text-muted-foreground">No requests.</p>}
        {(data ?? []).map((r: any) => (
          <Card key={r.id} className="glass border-white/5 bg-transparent p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs uppercase text-primary">{r.kind}</div>
                <div className="font-semibold">{r.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
                <div className="mt-1 text-xs text-muted-foreground">Status: {r.status}</div>
              </div>
              <div className="flex flex-col gap-1">
                <Button size="sm" variant="outline" className="border-white/10" onClick={() => set.mutate({ id: r.id, status: "in_progress" })}>In progress</Button>
                <Button size="sm" variant="outline" className="border-white/10" onClick={() => set.mutate({ id: r.id, status: "done" })}>Done</Button>
                <Button size="sm" variant="outline" className="border-white/10" onClick={() => set.mutate({ id: r.id, status: "closed" })}>Close</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
