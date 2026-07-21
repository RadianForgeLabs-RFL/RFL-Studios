import { Link } from "@tanstack/react-router";
import { Github, Instagram } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 glass">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <Logo className="h-10 w-10" />
            <div>
              <div className="font-bold">RFL Studios</div>
              <div className="text-xs text-muted-foreground">by Radian Forge Labs</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Creating games and apps. A single home for every project we ship.
          </p>

          <div className="mt-4 flex gap-2">
            <a href="https://github.com/RadianForgeLabs" target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-lg glass hover:text-primary"><Github className="h-4 w-4" /></a>
            <a href="https://instagram.com/radianforgelabs" target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-lg glass hover:text-primary"><Instagram className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/apps" className="hover:text-foreground">Apps</Link></li>
            <li><Link to="/games" className="hover:text-foreground">Games</Link></li>
            <li><Link to="/projects" className="hover:text-foreground">Projects</Link></li>
            <li><Link to="/downloads" className="hover:text-foreground">Downloads</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/support" className="hover:text-foreground">Support</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 px-4 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Radian Forge Labs. All rights reserved.
      </div>
    </footer>
  );
}
