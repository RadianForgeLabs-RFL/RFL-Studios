import { createFileRoute } from "@tanstack/react-router";
import { ListingPage } from "@/components/site/ListingPage";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — RFL Studios" }, { name: "description", content: "Every RFL project in one place." }] }),
  component: () => <ListingPage kind="all" title="All Projects" subtitle="The complete catalogue — apps, games, AI, tools." />,
});
