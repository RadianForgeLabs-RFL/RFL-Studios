import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth, useIsAdmin } from "@/lib/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, ShieldCheck, User as UserIcon, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/apps", label: "Apps" },
  { to: "/games", label: "Games" },
  { to: "/projects", label: "Projects" },
  { to: "/downloads", label: "Downloads" },
  { to: "/about", label: "About" },
  { to: "/support", label: "Support" },
] as const;

export function Header() {
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin(user?.id);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 glass-strong">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5">
          <Logo className="h-9 w-9" />
          <div className="hidden flex-col leading-none sm:flex">
            <span className="text-sm font-bold tracking-tight">RFL Studios</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Radian Forge Labs</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              activeProps={{ className: "rounded-md px-3 py-1.5 text-sm text-foreground bg-white/10" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-7 w-7"><AvatarFallback className="bg-gradient-brand text-xs text-brand-foreground">{(user.email ?? "?").slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
                  <span className="hidden max-w-[140px] truncate sm:inline">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-strong w-56 text-foreground">
                <DropdownMenuLabel className="truncate text-foreground">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-foreground focus:text-foreground"><Link to="/account"><UserIcon className="mr-2 h-4 w-4" />Account</Link></DropdownMenuItem>
                {isAdmin && <DropdownMenuItem asChild className="text-foreground focus:text-foreground"><Link to="/admin"><ShieldCheck className="mr-2 h-4 w-4" />Admin</Link></DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-foreground focus:text-foreground"><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="bg-gradient-brand text-brand-foreground shadow-glow hover:opacity-90">
              <Link to="/auth">Login</Link>
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-strong w-72 text-foreground">
              <nav className="mt-8 flex flex-col gap-1">
                {NAV.map((n) => (
                  <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-white/10 hover:text-foreground">
                    {n.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
