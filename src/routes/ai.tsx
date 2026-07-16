import { createFileRoute } from "@tanstack/react-router";
import { ListingPage } from "@/components/site/ListingPage";

export const Route = createFileRoute("/ai")({
  head: () => ({ meta: [{ title: "AI Tools — RFL Studios" }, { name: "description", content: "AI tools, models, and assistants from Radian Forge Labs." }] }),
  component: () => <ListingPage kind="ai" title="AI Tools" subtitle="Local-first assistants, models, and research tools." />,
});
