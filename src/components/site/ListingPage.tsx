import { useQuery } from "@tanstack/react-query";
import { productListQuery, type ProductKind } from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

export function ListingPage({
  kind, title, subtitle,
}: {
  kind?: ProductKind | "all";
  title: string;
  subtitle: string;
}) {
  const { data, isLoading } = useQuery(productListQuery(kind));
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");
  const filtered = useMemo(() => {
    let list = data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(s) || (p.tagline ?? "").toLowerCase().includes(s));
    }
    if (status) list = list.filter((p) => p.status === status);
    return list;
  }, [data, q, status]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="animate-fade-up">
        <h1 className="text-4xl font-bold md:text-5xl gradient-text">{title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="glass border-white/10 bg-transparent pl-9" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="glass rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="stable">Stable</option>
          <option value="beta">Beta</option>
          <option value="experimental">Experimental</option>
          <option value="deprecated">Deprecated</option>
        </select>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading && Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass h-64 animate-pulse rounded-xl border-white/5" />
        ))}
        {filtered.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
      {!isLoading && filtered.length === 0 && (
        <div className="mt-16 text-center text-muted-foreground">Nothing here yet.</div>
      )}
    </div>
  );
}
