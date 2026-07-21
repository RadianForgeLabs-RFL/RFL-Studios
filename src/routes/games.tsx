import { createFileRoute } from "@tanstack/react-router";
import { ListingPage } from "@/components/site/ListingPage";

export const Route = createFileRoute("/games")({
  head: () => ({ meta: [{ title: "Games — RFL Studios" }, { name: "description", content: "Play games from RFL Studios — single player, LAN, and online." }] }),
  component: () => <ListingPage kind="game" title="Games" subtitle="Single-player, multiplayer, LAN and online — from casual to competitive." />,
});
