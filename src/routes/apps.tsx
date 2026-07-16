import { createFileRoute } from "@tanstack/react-router";
import { ListingPage } from "@/components/site/ListingPage";

export const Route = createFileRoute("/apps")({
  head: () => ({ meta: [{ title: "Apps — RFL Studios" }, { name: "description", content: "Discover apps built by Radian Forge Labs and the RFL community." }] }),
  component: () => <ListingPage kind="app" title="Apps" subtitle="Discover apps built by Radian Forge Labs and our community." />,
});
