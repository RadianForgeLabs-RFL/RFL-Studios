import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  link?: string;
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: "1",
    title: "RFL Studios Launches New Developer Tools",
    summary: "We're excited to announce our new suite of developer tools designed to streamline your workflow.",
    date: "2026-08-01",
    category: "Studios",
  },
  {
    id: "2",
    title: "Mini Strike: Doodle Force Coming Soon",
    summary: "Get ready for our latest gaming adventure. Pre-order now to get notified at launch!",
    date: "2026-07-28",
    category: "Entertainment",
  },
  {
    id: "3",
    title: "Website Redesign Complete",
    summary: "Our new multi-brand website is now live with improved navigation and features.",
    date: "2026-07-25",
    category: "Company",
  },
];

export function NewsSection() {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Studios': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Entertainment': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Company': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Latest News</h2>
        <p className="mt-2 text-muted-foreground">Stay updated with our latest announcements and updates.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {NEWS_ITEMS.map((item) => (
          <Card key={item.id} className="glass border-white/5 bg-transparent p-6 hover:border-primary/30 transition-colors">
            <div className="mb-4 flex items-center justify-between">
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDate(item.date)}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{item.summary}</p>
            {item.link && (
              <a
                href={item.link}
                className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                Read more →
              </a>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
