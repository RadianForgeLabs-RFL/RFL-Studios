import { Badge } from "@/components/ui/badge";
import {
  Cloud, WifiOff, Users, User, Network, Globe, ShieldCheck,
  Sparkles, Package, GitBranch, Lock, Beaker, CircleDot, Archive,
} from "lucide-react";
import type { ReactNode } from "react";

const MAP: Record<string, { label: string; icon: ReactNode; className: string }> = {
  online: { label: "Online", icon: <Cloud className="h-3 w-3" />, className: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  offline: { label: "Offline", icon: <WifiOff className="h-3 w-3" />, className: "bg-slate-500/15 text-slate-300 border-slate-500/30" },
  lan: { label: "LAN", icon: <Network className="h-3 w-3" />, className: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" },
  single_player: { label: "Single Player", icon: <User className="h-3 w-3" />, className: "bg-violet-500/15 text-violet-300 border-violet-500/30" },
  multiplayer: { label: "Multiplayer", icon: <Users className="h-3 w-3" />, className: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30" },
  cross_platform: { label: "Cross Platform", icon: <Globe className="h-3 w-3" />, className: "bg-teal-500/15 text-teal-300 border-teal-500/30" },
  open_source: { label: "Open Source", icon: <GitBranch className="h-3 w-3" />, className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  closed_source: { label: "Closed Source", icon: <Lock className="h-3 w-3" />, className: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30" },
  mod: { label: "MOD", icon: <Package className="h-3 w-3" />, className: "bg-orange-500/15 text-orange-300 border-orange-500/30" },
  official: { label: "Official", icon: <ShieldCheck className="h-3 w-3" />, className: "bg-primary/15 text-primary border-primary/30" },
  community: { label: "Community", icon: <Users className="h-3 w-3" />, className: "bg-pink-500/15 text-pink-300 border-pink-500/30" },
  verified: { label: "Verified", icon: <ShieldCheck className="h-3 w-3" />, className: "bg-primary/15 text-primary border-primary/30" },
  stable: { label: "Stable", icon: <CircleDot className="h-3 w-3" />, className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  beta: { label: "Beta", icon: <Beaker className="h-3 w-3" />, className: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30" },
  experimental: { label: "Experimental", icon: <Sparkles className="h-3 w-3" />, className: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30" },
  deprecated: { label: "Deprecated", icon: <Archive className="h-3 w-3" />, className: "bg-slate-500/15 text-slate-400 border-slate-500/30" },
  abandoned: { label: "Abandoned", icon: <Archive className="h-3 w-3" />, className: "bg-red-500/15 text-red-300 border-red-500/30" },
};

export function StatusBadge({ value }: { value: string }) {
  const m = MAP[value] ?? { label: value, icon: null, className: "bg-muted text-muted-foreground" };
  return (
    <Badge variant="outline" className={`gap-1 border ${m.className} font-medium`}>
      {m.icon}{m.label}
    </Badge>
  );
}

export function BadgeRow({ values }: { values: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.filter(Boolean).map((v) => <StatusBadge key={v} value={v} />)}
    </div>
  );
}
