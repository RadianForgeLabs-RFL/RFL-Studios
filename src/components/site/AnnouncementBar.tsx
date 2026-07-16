import { useQuery } from "@tanstack/react-query";
import { announcementQuery } from "@/lib/data";
import { Megaphone } from "lucide-react";

export function AnnouncementBar() {
  const { data } = useQuery(announcementQuery());
  if (!data) return null;
  return (
    <div className="border-b border-white/5 bg-gradient-brand/10">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-xs text-foreground/90">
        <Megaphone className="h-3.5 w-3.5 text-primary" />
        <span className="truncate">{data.message}</span>
      </div>
    </div>
  );
}
