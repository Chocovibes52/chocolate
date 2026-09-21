import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/products";
import { CollectionView } from "@/components/CollectionView";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All Chocolates — ChocoVibes" },
      {
        name: "description",
        content:
          "Shop the full ChocoVibes collection — dark, milk, and white chocolate creations, hand-tempered in small batches.",
      },
      { property: "og:title", content: "Shop All Chocolates — ChocoVibes" },
      {
        property: "og:description",
        content:
          "Shop the full ChocoVibes collection — dark, milk, and white chocolate creations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { data: all = [], isLoading } = useQuery(productsQuery());
  return (
    <CollectionView
      eyebrow="Shop"
      title="The Full Collection"
      subtitle="Browse every ChocoVibes creation — filter by dark, milk, or white to find your favourite."
      products={all}
      isLoading={isLoading}
      showFlavour={true}
    />
  );
}
