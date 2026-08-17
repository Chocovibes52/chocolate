import { supabase } from "@/integrations/supabase/client";
import bar1 from "@/assets/bar-1.jpg";
import bar2 from "@/assets/bar-2.jpg";
import bar3 from "@/assets/bar-3.jpg";
import bar4 from "@/assets/bar-4.jpg";
import hamper1 from "@/assets/hamper-1.jpg";
import hamper2 from "@/assets/hamper-2.jpg";
import hamper3 from "@/assets/hamper-3.jpg";

export type Category = "energy-bars" | "gift-hampers" | "shop";

export type Product = {
  slug: string;
  name: string;
  category: Category;
  price: number;
  salePrice?: number;
  image: string;
  gallery: string[];
  shortDescription: string;
  fullDescription: string;
  ingredients: string;
  nutrition: { label: string; value: string }[];
  weight: string;
  shelfLife: string;
  inStock: boolean;
  bestSeller?: boolean;
};

// Local image mapping keyed by product slug — used for both DB-backed and
// fallback rendering. Any new product slug can add its image here.
const imageMap: Record<string, { image: string; gallery: string[] }> = {
  "cacao-noir-original": { image: bar1, gallery: [bar1, bar2, bar3] },
  "almond-sea-salt": { image: bar2, gallery: [bar2, bar1, bar4] },
  "hazelnut-cocoa-nib": { image: bar3, gallery: [bar3, bar1, bar2] },
  "pistachio-rose": { image: bar4, gallery: [bar4, bar1, bar3] },
  "the-noir-signature": { image: hamper1, gallery: [hamper1, hamper2, hamper3] },
  "grand-reserve-hamper": { image: hamper2, gallery: [hamper2, hamper1, hamper3] },
  "petit-noir-tin": { image: hamper3, gallery: [hamper3, hamper1, hamper2] },
};

const fallback = { image: bar1, gallery: [bar1] };

type DbProduct = {
  slug: string;
  name: string;
  category_slug: string;
  price: string | number;
  sale_price: string | number | null;
  short_description: string;
  full_description: string;
  ingredients: string;
  nutrition: { label: string; value: string }[] | null;
  weight: string;
  shelf_life: string;
  in_stock: boolean;
  best_seller: boolean;
  image_url: string | null;
};

function mapProduct(row: DbProduct): Product {
  const imgs = imageMap[row.slug] ?? fallback;
  return {
    slug: row.slug,
    name: row.name,
    category: row.category_slug as Category,
    price: Number(row.price),
    salePrice: row.sale_price != null ? Number(row.sale_price) : undefined,
    image: row.image_url ?? imgs.image,
    gallery: row.image_url ? [row.image_url, ...imgs.gallery] : imgs.gallery,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    ingredients: row.ingredients,
    nutrition: Array.isArray(row.nutrition) ? row.nutrition : [],
    weight: row.weight,
    shelfLife: row.shelf_life,
    inStock: row.in_stock,
    bestSeller: row.best_seller,
  };
}

export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as unknown as DbProduct[]).map(mapProduct);
}

export async function fetchByCategory(category: Category): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_slug", category)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as unknown as DbProduct[]).map(mapProduct);
}

export async function fetchProduct(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data as unknown as DbProduct) : null;
}

export const productsQuery = () => ({
  queryKey: ["products", "all"] as const,
  queryFn: fetchAllProducts,
  staleTime: 60_000,
});

export const productsByCategoryQuery = (c: Category) => ({
  queryKey: ["products", "category", c] as const,
  queryFn: () => fetchByCategory(c),
  staleTime: 60_000,
});

export const productQuery = (slug: string) => ({
  queryKey: ["product", slug] as const,
  queryFn: () => fetchProduct(slug),
  staleTime: 60_000,
});

export type Testimonial = {
  id: string;
  author: string;
  role: string | null;
  quote: string;
  rating: number;
};

export const testimonialsQuery = () => ({
  queryKey: ["testimonials"] as const,
  queryFn: async (): Promise<Testimonial[]> => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, author, role, quote, rating")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Testimonial[];
  },
  staleTime: 60_000,
});
