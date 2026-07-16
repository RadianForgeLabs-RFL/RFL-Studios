import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  kind: z.enum(["bug", "feature", "app_request", "game_request", "review_request"]),
  title: z.string().trim().min(3).max(150),
  body: z.string().trim().min(10).max(4000),
});

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support — RFL Studios" }, { name: "description", content: "Submit a bug report, feature request, or app/game request." }] }),
  component: Support,
});

function Support() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [kind, setKind] = useState<z.infer<typeof schema>["kind"]>("bug");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const parsed = schema.parse({ kind, title, body });
      if (!user) throw new Error("Please sign in first.");
      const { error } = await supabase.from("requests").insert({
        kind: parsed.kind, title: parsed.title, body: parsed.body, user_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Request submitted. Thank you!"); setTitle(""); setBody(""); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold md:text-5xl gradient-text">Support & Requests</h1>
      <p className="mt-2 text-muted-foreground">Report a bug, request a feature, or ask us to review something.</p>
      {!user ? (
        <Card className="glass mt-6 border-white/5 bg-transparent p-6">
          <p>You must be signed in to submit a request.</p>
          <Button className="mt-4 bg-gradient-brand text-brand-foreground shadow-glow" onClick={() => nav({ to: "/auth" })}>Sign in</Button>
        </Card>
      ) : (
        <Card className="glass mt-6 border-white/5 bg-transparent p-6">
          <div className="space-y-4">
            <div>
              <Label>Type</Label>
              <select value={kind} onChange={(e) => setKind(e.target.value as any)} className="mt-1 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm">
                <option value="bug">Bug report</option>
                <option value="feature">Feature request</option>
                <option value="app_request">App request</option>
                <option value="game_request">Game request</option>
                <option value="review_request">Review request</option>
              </select>
            </div>
            <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} className="mt-1" /></div>
            <div><Label>Details</Label><Textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={4000} rows={6} className="mt-1" /></div>
            <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="bg-gradient-brand text-brand-foreground shadow-glow">
              {mutation.isPending ? "Submitting…" : "Submit request"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
