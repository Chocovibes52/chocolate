import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronRight, Minus, Plus, ShoppingBag } from "lucide-react";
import { productQuery, productsByCategoryQuery, type Product } from "@/lib/products";
import { formatINR, useCart } from "@/lib/cart-context";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/products/$slug")({
  head: () => ({
    meta: [
      { title: "Product — ChocoVibes" },
      { name: "description", content: "Discover artisan chocolate crafted with obsession." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useQuery(productQuery(slug));
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const { add } = useCart();
  const navigate = useNavigate();

  const { data: siblings = [] } = useQuery({
    ...productsByCategoryQuery((product?.category ?? "energy-bars") as Product["category"]),
    enabled: !!product,
  });

  if (isLoading) {
    return <main className="container-luxe py-24 text-center text-muted-foreground">Loading…</main>;
  }
  if (!product) {
    return (
      <main className="container-luxe py-24 text-center">
        <h1 className="font-display text-4xl text-primary">Product not found</h1>
        <Link to="/" className="btn-cocoa mt-6 inline-flex">Back home</Link>
      </main>
    );
  }

  const related = siblings.filter((p: Product) => p.slug !== product.slug).slice(0, 3);
  const price = product.salePrice ?? product.price;

  return (
    <main>
      <div className="container-luxe pt-8 text-xs text-muted-foreground flex items-center gap-2">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={12} />
        <Link to={product.category === "energy-bars" ? "/energy-bars" : "/gift-hampers"} className="hover:text-primary">
          {product.category === "energy-bars" ? "Energy Bars" : "Gift Hampers"}
        </Link>
        <ChevronRight size={12} />
        <span className="text-primary">{product.name}</span>
      </div>

      <section className="container-luxe py-10 grid lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] group">
            <img src={product.gallery[active]} alt={product.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.gallery.map((src: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={`aspect-square overflow-hidden rounded-lg border-2 transition ${idx === active ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="eyebrow">{product.category === "energy-bars" ? "Energy Bar" : "Gift Hamper"}</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl text-primary">{product.name}</h1>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl font-display text-primary">{formatINR(price)}</span>
            {product.salePrice && <span className="text-muted-foreground line-through text-sm">{formatINR(product.price)}</span>}
          </div>
          <p className="mt-6 text-muted-foreground leading-relaxed">{product.fullDescription}</p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:text-accent"><Minus size={14} /></button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:text-accent"><Plus size={14} /></button>
            </div>
            <button
              onClick={() => { add(product, qty); toast.success(`${product.name} added to cart`); }}
              className="btn-cocoa"
            >
              <ShoppingBag size={14} /> Add to cart
            </button>
            <button
              onClick={() => { add(product, qty); navigate({ to: "/checkout" }); }}
              className="btn-gold"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-10 divide-y divide-border border-y border-border">
            {[
              { label: "Ingredients", value: product.ingredients },
              { label: "Weight", value: product.weight },
              { label: "Shelf Life", value: product.shelfLife },
            ].map((row) => (
              <div key={row.label} className="py-4 grid grid-cols-3 gap-4 text-sm">
                <div className="eyebrow !text-primary/60">{row.label}</div>
                <div className="col-span-2 text-primary/80">{row.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="eyebrow">Nutrition (per serving)</div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.nutrition.map((n: { label: string; value: string }) => (
                <div key={n.label} className="rounded-xl border border-border p-4">
                  <div className="text-xs text-muted-foreground">{n.label}</div>
                  <div className="mt-1 font-display text-lg text-primary">{n.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-luxe py-16">
          <h2 className="font-display text-3xl md:text-4xl text-primary">You may also love</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p: Product) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}
    </main>
  );
}
