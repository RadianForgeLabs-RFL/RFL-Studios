import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/sitemap/xml")({
  loader: async () => {
    const baseUrl = "https://rfl-studios.com";

    // Fetch all published products
    const { data: products } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("published", true)
      .eq("coming_soon", false);

    const staticPages = [
      { path: "", priority: "1.0", changefreq: "daily" },
      { path: "/studios", priority: "0.9", changefreq: "weekly" },
      { path: "/entertainment", priority: "0.9", changefreq: "weekly" },
      { path: "/about", priority: "0.5", changefreq: "monthly" },
      { path: "/support", priority: "0.5", changefreq: "monthly" },
      { path: "/privacy", priority: "0.3", changefreq: "monthly" },
      { path: "/terms", priority: "0.3", changefreq: "monthly" },
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static pages
    staticPages.forEach((page) => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Add product pages
    products?.forEach((product) => {
      sitemap += `
  <url>
    <loc>${baseUrl}/products/${product.slug}</loc>
    <lastmod>${new Date(product.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
});
