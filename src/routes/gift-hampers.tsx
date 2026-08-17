import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "./energy-bars";

export const Route = createFileRoute("/gift-hampers")({
  head: () => ({
    meta: [
      { title: "Gift Hampers — ChocoVibes" },
      { name: "description", content: "Curated chocolate hampers, hand-tied in silk. Corporate and personal gifting." },
      { property: "og:title", content: "Gift Hampers — ChocoVibes" },
      { property: "og:description", content: "Curated chocolate hampers, hand-tied in silk. Corporate and personal gifting." },
    ],
  }),
  component: () => (
    <CategoryPage
      category="gift-hampers"
      title="Gift Hampers"
      subtitle="Curated boxes, hand-finished for the moments that matter."
    />
  ),
});
