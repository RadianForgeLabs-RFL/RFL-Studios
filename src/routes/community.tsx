import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, MessagesSquare, Heart } from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "Community — RFL Studios" }, { name: "description", content: "Join the RFL Studios community — Discord, GitHub, and more." }] }),
  component: () => (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-bold md:text-5xl gradient-text">Community</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Come build, play, and ship with us.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Card className="glass border-white/5 bg-transparent p-8"><MessagesSquare className="h-8 w-8 text-primary" /><h3 className="mt-4 text-xl font-semibold">Discord</h3><p className="mt-2 text-sm text-muted-foreground">Chat with the team and other builders.</p><Button asChild className="mt-4 bg-gradient-brand text-brand-foreground shadow-glow"><a href="https://discord.com">Join</a></Button></Card>
        <Card className="glass border-white/5 bg-transparent p-8"><Github className="h-8 w-8 text-primary" /><h3 className="mt-4 text-xl font-semibold">GitHub</h3><p className="mt-2 text-sm text-muted-foreground">Contribute to open-source RFL projects.</p><Button asChild variant="outline" className="mt-4 border-white/10 glass"><a href="https://github.com">Contribute</a></Button></Card>
        <Card className="glass border-white/5 bg-transparent p-8"><Heart className="h-8 w-8 text-primary" /><h3 className="mt-4 text-xl font-semibold">Support</h3><p className="mt-2 text-sm text-muted-foreground">Sponsor our open-source work.</p><Button asChild variant="outline" className="mt-4 border-white/10 glass"><a href="#">Sponsor</a></Button></Card>
      </div>
    </div>
  ),
});
