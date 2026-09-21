import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "./products";

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (slug: string) => void;
  update: (slug: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const Ctx = createContext<CartContextValue | null>(null);
const STORAGE = "cacao-noir-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore storage error
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo(
    () => ({
      items,
      add: (p: Product, qty = 1) =>
        setItems((prev) => {
          if (prev.find((i) => i.product.slug === p.slug)) {
            return prev.map((i) =>
              i.product.slug === p.slug ? { ...i, qty: i.qty + qty } : i,
            );
          }
          return [...prev, { product: p, qty }];
        }),
      remove: (slug: string) =>
        setItems((prev) => prev.filter((i) => i.product.slug !== slug)),
      update: (slug: string, qty: number) =>
        setItems((prev) =>
          prev.map((i) =>
            i.product.slug === slug ? { ...i, qty: Math.max(1, qty) } : i,
          ),
        ),
      clear: () => setItems([]),
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce(
        (n, i) => n + (i.product.salePrice ?? i.product.price) * i.qty,
        0,
      ),
    }),
    [items],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}

export const formatINR = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;
