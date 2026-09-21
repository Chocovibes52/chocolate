import { createFileRoute, Link } from "@tanstack/react-router";
import { formatINR, useCart } from "@/lib/cart-context";
import { Minus, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — ChocoVibes" },
      {
        name: "description",
        content: "View and edit the items in your shopping bag.",
      },
      { property: "og:title", content: "Your Cart — ChocoVibes" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, update, remove, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <main className="container-luxe py-32 text-center">
        <div className="eyebrow">Empty basket</div>
        <h1 className="mt-3 font-display text-5xl text-primary">
          Nothing here — yet.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Discover our best-selling energy bars and gift hampers.
        </p>
        <Link to="/energy-bars" className="btn-cocoa mt-8 inline-block">
          Start shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="container-luxe py-16">
      <h1 className="font-display text-5xl text-primary">Your Cart</h1>
      <div className="mt-10 grid lg:grid-cols-[1fr_360px] gap-12">
        <div className="divide-y divide-border border-y border-border">
          {items.map((it) => {
            const price = it.product.salePrice ?? it.product.price;
            return (
              <div
                key={it.product.slug}
                className="py-6 grid grid-cols-[80px_1fr_auto] gap-5 items-center"
              >
                <img
                  src={it.product.image}
                  alt={it.product.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <Link
                    to="/products/$slug"
                    params={{ slug: it.product.slug }}
                    className="font-display text-xl text-primary hover:text-accent"
                  >
                    {it.product.name}
                  </Link>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {formatINR(price)} · {it.product.weight}
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        onClick={() => update(it.product.slug, it.qty - 1)}
                        className="p-2 hover:text-accent"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm">{it.qty}</span>
                      <button
                        onClick={() => update(it.product.slug, it.qty + 1)}
                        className="p-2 hover:text-accent"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(it.product.slug)}
                      className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
                <div className="font-display text-lg text-primary">
                  {formatINR(price * it.qty)}
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 sticky top-24">
          <h2 className="eyebrow">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-display text-xl text-primary">
              <span>Total</span>
              <span>{formatINR(subtotal)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="btn-cocoa w-full mt-6 text-center block"
          >
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}
