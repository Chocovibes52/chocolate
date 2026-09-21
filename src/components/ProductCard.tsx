import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatINR, useCart } from "@/lib/cart-context";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const price = product.salePrice ?? product.price;
  const { add } = useCart();
  const off = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden rounded-2xl bg-card aspect-[4/5] shadow-[var(--shadow-card)]"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {product.salePrice && (
            <span className="text-[10px] tracking-[0.18em] uppercase bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
              Save {off}%
            </span>
          )}
          {product.bestSeller && (
            <span className="text-[10px] tracking-[0.18em] uppercase bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
              Best seller
            </span>
          )}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <span className="text-[10px] tracking-[0.2em] uppercase text-primary border border-primary/30 rounded-full px-3 py-1.5 bg-background">
              Sold out
            </span>
          </div>
        )}
      </Link>

      {product.inStock && (
        <button
          onClick={() => {
            add(product, 1);
            toast.success(`${product.name} added to bag`);
          }}
          className="absolute left-3 right-3 bottom-[6.5rem] hidden rounded-full bg-background/95 px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] text-primary shadow-[var(--shadow-card)] backdrop-blur transition hover:bg-primary hover:text-primary-foreground group-hover:block md:block md:opacity-0 md:group-hover:opacity-100"
        >
          <span className="inline-flex items-center gap-2">
            <ShoppingBag size={13} /> Quick add
          </span>
        </button>
      )}

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link to="/products/$slug" params={{ slug: product.slug }}>
            <h3 className="font-display text-xl text-primary truncate">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
            {product.shortDescription}
          </p>
        </div>
        <div className="text-right shrink-0">
          {product.salePrice && (
            <div className="text-xs text-muted-foreground line-through">
              {formatINR(product.price)}
            </div>
          )}
          <div className="text-sm font-medium text-primary">
            {formatINR(price)}
          </div>
        </div>
      </div>
    </div>
  );
}
