import logoAsset from "@/assets/rfl-logo.png.asset.json";

export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return <img src={logoAsset.url} alt="RFL Studios" className={`${className} object-contain`} />;
}
