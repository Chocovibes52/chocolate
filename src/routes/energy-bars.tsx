import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsByCategoryQuery } from "@/lib/products";
import { CollectionView } from "@/components/CollectionView";

export const Route = createFileRoute("/energy-bars")({
  head: () => ({
    meta: [
      { title: "Energy Bars — ChocoVibes" },
      {
        name: "description",
        content:
          "Single-origin dark chocolate energy bars, hand-tempered in small batches.",
      },
      { property: "og:title", content: "Energy Bars — ChocoVibes" },
      {
        property: "og:description",
        content:
          "Single-origin dark chocolate energy bars, hand-tempered in small batches.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EnergyBarsPage,
});

export function CategoryPage({
  category,
  title,
  subtitle,
}: {
  category: string;
  title: string;
  subtitle: string;
}) {
  const { data: all = [], isLoading } = useQuery(
    productsByCategoryQuery(category),
  );
  return (
    <CollectionView
      eyebrow="Collection"
      title={title}
      subtitle={subtitle}
      products={all}
      isLoading={isLoading}
      showFlavour={true}
    />
  );
}

function EnergyBarsPage() {
  return (
    <CategoryPage
      category="energy-bars"
      title="Energy Bars"
      subtitle="Clean fuel, deep chocolate. Small-batch craftsmanship in every bite."
    />
  );
}
