import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const qc = useQueryClient();
  const [message, setMessage] = useState("");
  const [maintenance, setMaintenance] = useState(false);

  const ann = useQuery({ queryKey: ["ann-all"], queryFn: async () => (await supabase.from("announcements").select("*").order("created_at", { ascending: false })).data ?? [] });
  const set = useQuery({ queryKey: ["settings-all"], queryFn: async () => (await supabase.from("settings").select("*")).data ?? [] });

  useEffect(() => {
    const m = set.data?.find((s: any) => s.key === "maintenance_mode");
    setMaintenance(m?.value === true);
  }, [set.data]);

  const addAnn = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("announcements").insert({ message, variant: "info", active: true }); if (error) throw error; },
    onSuccess: () => { toast.success("Announcement added"); setMessage(""); qc.invalidateQueries({ queryKey: ["ann-all"] }); qc.invalidateQueries({ queryKey: ["announcement"] }); },
  });
  const toggleAnn = useMutation({
    mutationFn: async ({ id, active }: any) => { const { error } = await supabase.from("announcements").update({ active }).eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ann-all"] }); qc.invalidateQueries({ queryKey: ["announcement"] }); },
  });
  const deleteAnn = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("announcements").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Announcement deleted"); qc.invalidateQueries({ queryKey: ["ann-all"] }); qc.invalidateQueries({ queryKey: ["announcement"] }); },
  });
  const toggleMaintenance = useMutation({
    mutationFn: async (v: boolean) => { const { error } = await supabase.from("settings").upsert({ key: "maintenance_mode", value: v as any }); if (error) throw error; },
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["settings-all"] }); },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card className="glass mt-6 border-white/5 bg-transparent p-5">
        <h2 className="text-lg font-semibold">Site announcement</h2>
        <div className="mt-3 flex gap-2">
          <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="New announcement…" />
          <Button onClick={() => addAnn.mutate()} className="bg-gradient-brand text-brand-foreground shadow-glow">Add</Button>
        </div>
        <div className="mt-4 space-y-2">
          {(ann.data ?? []).map((a: any) => (
            <div key={a.id} className="flex items-center justify-between rounded border border-white/5 p-3 text-sm">
              <span>{a.message}</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={a.active} onChange={(e) => toggleAnn.mutate({ id: a.id, active: e.target.checked })} />Active
                </label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteAnn.mutate(a.id)}
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="glass mt-6 border-white/5 bg-transparent p-5">
        <h2 className="text-lg font-semibold">Maintenance mode</h2>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={maintenance} onChange={(e) => { setMaintenance(e.target.checked); toggleMaintenance.mutate(e.target.checked); }} />
          Enable maintenance mode
        </label>
      </Card>
    </div>
  );
}
