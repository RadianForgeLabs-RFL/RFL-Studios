import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — RFL Studios" }, { name: "description", content: "About Radian Forge Labs and the RFL Studios portal." }] }),
  component: () => (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold md:text-5xl gradient-text">About RFL Studios</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        RFL Studios is the official portal for <strong className="text-foreground">Radian Forge Labs</strong> — an independent
        research and engineering studio building games and apps.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card className="glass border-white/5 bg-transparent p-6">
          <h2 className="text-xl font-semibold">Our mission</h2>
          <p className="mt-2 text-sm text-muted-foreground">Ship independent software that is fast, open where possible, and delightful everywhere.</p>
        </Card>
        <Card className="glass border-white/5 bg-transparent p-6">
          <h2 className="text-xl font-semibold">What we build</h2>
          <p className="mt-2 text-sm text-muted-foreground">Everything from LAN-first multiplayer games to local-first AI and communication tools.</p>
        </Card>
      </div>
    </div>
  ),
});
