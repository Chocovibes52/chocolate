import { supabase } from "@/integrations/supabase/client";

import bar1 from "@/assets/bar-1.jpg";
import bar2 from "@/assets/bar-2.jpg";
import bar3 from "@/assets/bar-3.jpg";
import bar4 from "@/assets/bar-4.jpg";
import hamper1 from "@/assets/hamper-1.jpg";
import hamper2 from "@/assets/hamper-2.jpg";
import hamper3 from "@/assets/hamper-3.jpg";

export interface Product {
  slug: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  image: string;
  gallery: string[];
  shortDescription?: string | null;
  fullDescription?: string | null;
  ingredients?: string | null;
  nutrition?: Array<{ label: string; value: string }>;
  weight?: string | null;
  shelfLife?: string | null;
  inStock: boolean;
  bestSeller: boolean;
}

export interface Testimonial {
  id: string;
  author: string;
  role?: string | null;
  quote: string;
  rating: number;
}

const imageMap: Record<string, { image: string; gallery: string[] }> = {
  "cacao-noir-original": {
    image: bar1,
    gallery: [bar1, bar2, bar3],
  },
  "almond-sea-salt": {
    image: bar2,
    gallery: [bar2, bar1, bar4],
  },
  "hazelnut-cocoa-nib": {
    image: bar3,
    gallery: [bar3, bar1, bar2],
  },
  "pistachio-rose": {
    image: bar4,
    gallery: [bar4, bar1, bar3],
  },
  "the-noir-signature": {
    image: hamper1,
    gallery: [hamper1, hamper2, hamper3],
  },
  "grand-reserve-hamper": {
    image: hamper2,
    gallery: [hamper2, hamper1, hamper3],
  },
  "petit-noir-tin": {
    image: hamper3,
    gallery: [hamper3, hamper1, hamper2],
  },
};

const fallback = {
  image: bar1,
  gallery: [bar1],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapProduct(row: any): Product {
  const imgs = imageMap[row.slug] ?? fallback;
  return {
    slug: row.slug,
    name: row.name,
    category: row.category_slug,
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
    inStock: row.in_stock ?? true,
    bestSeller: row.best_seller ?? false,
  };
}

export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function fetchByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_slug", category)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function fetchProduct(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data) : null;
}

export const productsQuery = () => ({
  queryKey: ["products", "all"],
  queryFn: fetchAllProducts,
  staleTime: 60000,
});

export const productsByCategoryQuery = (category: string) => ({
  queryKey: ["products", "category", category],
  queryFn: () => fetchByCategory(category),
  staleTime: 60000,
});

export const productQuery = (slug: string) => ({
  queryKey: ["product", slug],
  queryFn: () => fetchProduct(slug),
  staleTime: 60000,
});

export const testimonialsQuery = () => ({
  queryKey: ["testimonials"],
  queryFn: async (): Promise<Testimonial[]> => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, author, role, quote, rating")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
  staleTime: 60000,
});
