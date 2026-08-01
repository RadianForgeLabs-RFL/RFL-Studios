import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessagesSquare, Heart, Coffee } from "lucide-react";
import { SupportModal } from "@/components/site/SupportModal";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support & Contact — Radian Forge Labs" },
      { name: "description", content: "Contact Radian Forge Labs, get support, or support us with a coffee." },
    ],
  }),
  component: SupportPage,
});

const CONTACTS = [
  { label: "Primary Contact", email: "radianforgelabs@gmail.com" },
  { label: "Secondary Contact", email: "krishnaramalesh8838@gmail.com" },
];

function SupportPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          Get in <span className="gradient-text">touch</span>
        </h1>
        <p className="mt-3 text-muted-foreground">Questions, ideas, or feedback? We'd love to hear from you.</p>
      </div>

      <div className="mt-10 space-y-3">
        {CONTACTS.map((c) => (
          <Card key={c.email} className="glass flex items-center gap-4 border-white/5 bg-transparent p-5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-glow">
              <Mail className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
              <a href={`mailto:${c.email}`} className="block truncate text-base font-semibold text-foreground hover:text-primary">
                {c.email}
              </a>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Card className="glass border-white/5 bg-transparent p-6">
          <MessagesSquare className="h-8 w-8 text-primary" />
          <h2 className="mt-3 text-xl font-semibold">Feedback & bug reports</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Found a bug or have an idea? Email us at{" "}
            <a href="mailto:radianforgelabs@gmail.com" className="text-primary hover:underline">radianforgelabs@gmail.com</a>.
          </p>
        </Card>
        <Card className="glass border-white/5 bg-transparent p-6">
          <Heart className="h-8 w-8 text-primary" />
          <h2 className="mt-3 text-xl font-semibold">Support Radian Forge Labs</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            If you enjoy our apps and games and would like to support future development, you can buy us a coffee.
          </p>
          <div className="mt-4 flex gap-2">
            <SupportModal
              title="Support RadianForgeLabs"
              trigger={
                <Button className="bg-gradient-brand text-brand-foreground shadow-glow">
                  <Coffee className="mr-2 h-4 w-4" /> Buy Me a Coffee
                </Button>
              }
            />
            <Button asChild variant="outline" className="border-white/10 glass">
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
