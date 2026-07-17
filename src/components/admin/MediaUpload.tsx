import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

const BUCKET = "product-media";
// ~100 years — private bucket needs signed URLs
const SIGNED_EXPIRY = 60 * 60 * 24 * 365 * 100;

export async function uploadToBucket(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  const { data, error: sErr } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_EXPIRY);
  if (sErr) throw sErr;
  return data.signedUrl;
}

export function ImageUpload({
  value,
  onChange,
  folder,
  label = "Image",
  aspect = "aspect-square",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  label?: string;
  aspect?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const url = await uploadToBucket(f, folder);
      onChange(url);
      toast.success(`${label} uploaded`);
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };
  return (
    <div className="flex items-start gap-3">
      <div className={`${aspect} w-24 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5`}>
        {value ? (
          <img src={value} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-[10px] text-muted-foreground">No {label}</div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <input ref={ref} type="file" accept="image/*" onChange={handle} className="hidden" />
        <Button type="button" size="sm" variant="outline" className="border-white/10" disabled={busy} onClick={() => ref.current?.click()}>
          <Upload className="mr-2 h-4 w-4" />{busy ? "Uploading…" : `Upload ${label}`}
        </Button>
        {value && (
          <Button type="button" size="sm" variant="ghost" className="text-destructive" onClick={() => onChange(null)}>
            <X className="mr-2 h-4 w-4" />Remove
          </Button>
        )}
      </div>
    </div>
  );
}

export function MultiImageUpload({
  items,
  onAdd,
  onRemove,
  folder,
}: {
  items: { id?: string; url: string }[];
  onAdd: (url: string) => Promise<void> | void;
  onRemove: (item: { id?: string; url: string }) => Promise<void> | void;
  folder: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    try {
      for (const f of files) {
        const url = await uploadToBucket(f, folder);
        await onAdd(url);
      }
      toast.success(`${files.length} screenshot(s) uploaded`);
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {items.map((it) => (
          <div key={it.url} className="group relative aspect-video overflow-hidden rounded-md border border-white/10 bg-white/5">
            <img src={it.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(it)}
              className="absolute right-1 top-1 rounded-md bg-black/70 p-1 opacity-0 transition group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <input ref={ref} type="file" accept="image/*" multiple onChange={handle} className="hidden" />
      <Button type="button" size="sm" variant="outline" className="mt-2 border-white/10" disabled={busy} onClick={() => ref.current?.click()}>
        <Upload className="mr-2 h-4 w-4" />{busy ? "Uploading…" : "Add screenshots"}
      </Button>
    </div>
  );
}
