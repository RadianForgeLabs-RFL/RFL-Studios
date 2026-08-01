import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coffee, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const UPI_ID = "8838214174@yapl";
const QR_CODE_URL = "/upi-qr.jpg";

export function SupportModal({ trigger, title = "Support RFL Studios" }: { trigger: React.ReactNode; title?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      toast.success("UPI ID copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed — please copy manually");
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="glass-strong max-w-md border-white/10 bg-background/95 text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Coffee className="h-6 w-6 text-primary" /> {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl border border-white/10 bg-white p-3 shadow-glow">
            <img src={QR_CODE_URL} alt="UPI QR code" className="h-56 w-56 object-contain" />
          </div>
          <div className="w-full">
            <div className="text-center text-xs uppercase tracking-widest text-muted-foreground">UPI ID</div>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2">
              <code className="flex-1 truncate px-2 text-sm font-medium text-foreground">{UPI_ID}</code>
              <Button size="sm" variant="outline" className="border-white/10" onClick={copy}>
                {copied ? <Check className="mr-1 h-4 w-4 text-emerald-400" /> : <Copy className="mr-1 h-4 w-4" />}
                {copied ? "Copied" : "Copy UPI ID"}
              </Button>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Your support helps us build and improve free apps and open-source projects.
            Every contribution, big or small, is greatly appreciated. Thank you for supporting us!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function BuyMeACoffeeButton({ className = "", size = "sm" }: { className?: string; size?: "sm" | "lg" | "default" }) {
  return (
    <SupportModal
      trigger={
        <Button size={size} className={`bg-gradient-brand text-brand-foreground shadow-glow hover:opacity-90 ${className}`}>
          <Coffee className="mr-2 h-4 w-4" /> Buy Me a Coffee
        </Button>
      }
    />
  );
}
