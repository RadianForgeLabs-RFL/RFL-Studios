import { Badge } from "@/components/ui/badge";
import {
  Cloud, WifiOff, Users, User, Network, Globe, ShieldCheck,
  Sparkles, Package, GitBranch, Lock, Beaker, CircleDot, Archive,
} from "lucide-react";
import type { ReactNode } from "react";

const MAP: Record<string, { label: string; icon: ReactNode; className: string }> = {
  online: { label: "Online", icon: <Cloud className="h-3 w-3" />, className: "bg-blue-500/20 text-blue-700 dark:text-blue-200 border-blue-500/40" },
  offline: { label: "Offline", icon: <WifiOff className="h-3 w-3" />, className: "bg-slate-500/20 text-slate-700 dark:text-slate-200 border-slate-500/40" },
  lan: { label: "LAN", icon: <Network className="h-3 w-3" />, className: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-200 border-cyan-500/40" },
  single_player: { label: "Single Player", icon: <User className="h-3 w-3" />, className: "bg-violet-500/20 text-violet-700 dark:text-violet-200 border-violet-500/40" },
  multiplayer: { label: "Multiplayer", icon: <Users className="h-3 w-3" />, className: "bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-200 border-fuchsia-500/40" },
  cross_platform: { label: "Cross Platform", icon: <Globe className="h-3 w-3" />, className: "bg-teal-500/20 text-teal-700 dark:text-teal-200 border-teal-500/40" },
  open_source: { label: "Open Source", icon: <GitBranch className="h-3 w-3" />, className: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-200 border-emerald-500/40" },
  closed_source: { label: "Closed Source", icon: <Lock className="h-3 w-3" />, className: "bg-zinc-500/25 text-zinc-800 dark:text-zinc-100 border-zinc-500/50" },
  mod: { label: "MOD", icon: <Package className="h-3 w-3" />, className: "bg-orange-500/20 text-orange-700 dark:text-orange-200 border-orange-500/40" },
  official: { label: "Official", icon: <ShieldCheck className="h-3 w-3" />, className: "bg-primary/20 text-primary border-primary/40" },
  community: { label: "Community", icon: <Users className="h-3 w-3" />, className: "bg-pink-500/20 text-pink-700 dark:text-pink-200 border-pink-500/40" },
  verified: { label: "Verified", icon: <ShieldCheck className="h-3 w-3" />, className: "bg-primary/20 text-primary border-primary/40" },
  stable: { label: "Stable", icon: <CircleDot className="h-3 w-3" />, className: "bg-emerald-500/25 text-emerald-800 dark:text-emerald-100 border-emerald-500/50" },
  beta: { label: "Beta", icon: <Beaker className="h-3 w-3" />, className: "bg-yellow-500/25 text-yellow-800 dark:text-yellow-100 border-yellow-500/50" },
  experimental: { label: "Experimental", icon: <Sparkles className="h-3 w-3" />, className: "bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-200 border-fuchsia-500/40" },
  deprecated: { label: "Deprecated", icon: <Archive className="h-3 w-3" />, className: "bg-slate-500/20 text-slate-700 dark:text-slate-200 border-slate-500/40" },
  abandoned: { label: "Abandoned", icon: <Archive className="h-3 w-3" />, className: "bg-red-500/20 text-red-700 dark:text-red-200 border-red-500/40" },
  coming_soon: { label: "Coming Soon", icon: <Sparkles className="h-3 w-3" />, className: "bg-primary/25 text-primary border-primary/50" },
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
