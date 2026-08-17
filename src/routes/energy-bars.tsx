import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CollectionView } from "@/components/CollectionView";
import { productsByCategoryQuery, type Category, type Product } from "@/lib/products";

export const Route = createFileRoute("/energy-bars")({
  head: () => ({
    meta: [
      { title: "Energy Bars — ChocoVibes" },
      { name: "description", content: "Single-origin dark chocolate energy bars, hand-tempered in small batches." },
      { property: "og:title", content: "Energy Bars — ChocoVibes" },
      { property: "og:description", content: "Single-origin dark chocolate energy bars, hand-tempered in small batches." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CategoryPage
      category="energy-bars"
      title="Energy Bars"
      subtitle="Clean fuel, deep chocolate. Small-batch craftsmanship in every bite."
    />
  ),
});

export function CategoryPage({
  category,
  title,
  subtitle,
}: {
  category: Category;
  title: string;
  subtitle: string;
}) {
  const { data: all = [], isLoading } = useQuery(productsByCategoryQuery(category));
  return (
    <CollectionView
      eyebrow="Collection"
      title={title}
      subtitle={subtitle}
      products={all as Product[]}
      isLoading={isLoading}
      showFlavour
    />
  );
}
