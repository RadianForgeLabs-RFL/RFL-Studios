import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter,
  HeadContent, Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { ThemeProvider } from "@/components/site/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useMobile } from "@/hooks/use-mobile";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-gradient-brand px-4 py-2 text-sm font-medium text-brand-foreground shadow-glow">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try again or head home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-gradient-brand px-4 py-2 text-sm font-medium text-brand-foreground shadow-glow">Try again</button>
          <a href="/" className="rounded-md border border-white/10 px-4 py-2 text-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RFL Studios — Apps, Games, AI & Open Software" },
      { name: "description", content: "RFL Studios by Radian Forge Labs — the official portal for our apps and games." },
      { name: "author", content: "Radian Forge Labs" },
      { name: "theme-color", content: "#0b0f1e" },
      { property: "og:title", content: "RFL Studios — Apps, Games, AI & Open Software" },
      { property: "og:description", content: "Creating games and apps." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "RFL Studios" },
      { name: "twitter:card", content: "summary_large_image" },
      { httpEquiv: "X-DNS-Prefetch-Control", content: "on" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
      { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body className="min-h-screen">{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const { isMobile, isLowEnd } = useMobile();

  useEffect(() => {
    // Apply performance optimizations for mobile/low-end devices
    if (isMobile || isLowEnd) {
      document.documentElement.classList.add('reduce-motion');
      document.documentElement.classList.add('reduce-effects');
    } else {
      document.documentElement.classList.remove('reduce-motion');
      document.documentElement.classList.remove('reduce-effects');
    }
  }, [isMobile, isLowEnd]);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <MaintenanceWrapper>
        <ThemeProvider>
          <AnnouncementBar />
          <Header />
          <main className="min-h-[70vh]"><Outlet /></main>
          <Footer />
          <Toaster position="top-right" />
        </ThemeProvider>
      </MaintenanceWrapper>
    </QueryClientProvider>
  );
}

function MaintenanceWrapper({ children }: { children: ReactNode }) {
  const { data: settings } = useQuery({
    queryKey: ["settings-all"],
    queryFn: async () => (await supabase.from("settings").select("*")).data ?? [],
  });

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => (await supabase.auth.getSession()).data.session,
  });

  const router = useRouter();
  const currentPath = router.state.location.pathname;

  const maintenanceMode = settings?.find((s: any) => s.key === "maintenance_mode")?.value === true;
  const isAdmin = session?.user?.email?.endsWith('@radianforlabs.com') || session?.user?.email === 'krishnaramalesh8838@gmail.com' || currentPath.startsWith('/admin');

  // Allow admin access during maintenance
  if (maintenanceMode && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold gradient-text">Under Maintenance</h1>
          <p className="mt-4 text-sm text-muted-foreground">We're currently performing maintenance. Please check back soon.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
