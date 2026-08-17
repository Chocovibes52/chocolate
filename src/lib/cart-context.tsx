import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./products";

export type CartItem = { product: Product; qty: number };

type CartCtx = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (slug: string) => void;
  update: (slug: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE = "cacao-noir-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* noop */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartCtx>(() => ({
    items,
    add: (p, qty = 1) => setItems((prev) => {
      const found = prev.find((i) => i.product.slug === p.slug);
      if (found) return prev.map((i) => i.product.slug === p.slug ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { product: p, qty }];
    }),
    remove: (slug) => setItems((prev) => prev.filter((i) => i.product.slug !== slug)),
    update: (slug, qty) => setItems((prev) => prev.map((i) => i.product.slug === slug ? { ...i, qty: Math.max(1, qty) } : i)),
    clear: () => setItems([]),
    count: items.reduce((n, i) => n + i.qty, 0),
    subtotal: items.reduce((n, i) => n + (i.product.salePrice ?? i.product.price) * i.qty, 0),
  }), [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;
