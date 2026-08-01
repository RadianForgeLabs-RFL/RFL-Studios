import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Radian Forge Labs" }, { name: "description", content: "About Radian Forge Labs and our divisions: RFL Studios and RFL Entertainment." }] }),
  component: () => (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold md:text-5xl gradient-text">About Radian Forge Labs</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        <strong className="text-foreground">Radian Forge Labs</strong> is a technology company building professional software through
        <strong className="text-foreground">RFL Studios</strong> and immersive gaming experiences through
        <strong className="text-foreground">RFL Entertainment</strong>.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card className="glass border-white/5 bg-transparent p-6">
          <h2 className="text-xl font-semibold">Our mission</h2>
          <p className="mt-2 text-sm text-muted-foreground">To create innovative software and gaming experiences that empower users and bring joy to millions. We believe in open-source, accessibility, and the power of technology to transform lives.</p>
        </Card>
        <Card className="glass border-white/5 bg-transparent p-6">
          <h2 className="text-xl font-semibold">Our divisions</h2>
          <p className="mt-2 text-sm text-muted-foreground"><strong className="text-foreground">RFL Studios</strong> builds professional Windows and Android applications. <strong className="text-foreground">RFL Entertainment</strong> creates immersive PC and Android games.</p>
        </Card>
      </div>
    </div>
  ),
});
