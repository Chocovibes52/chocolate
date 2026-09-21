import { useMemo, useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, LayoutGrid, Rows3 } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/products";
import { formatINR } from "@/lib/cart-context";

export type Flavour = "all" | "dark" | "milk" | "white";

export const FLAVOURS: { key: Flavour; label: string }[] = [
  { key: "all", label: "All Flavours" },
  { key: "dark", label: "Dark" },
  { key: "milk", label: "Milk" },
  { key: "white", label: "White" },
];

export function detectFlavour(p: Product): Flavour {
  const hay =
    `${p.name} ${p.shortDescription ?? ""} ${p.fullDescription ?? ""} ${p.ingredients ?? ""}`.toLowerCase();
  if (/\bwhite\b/.test(hay)) return "white";
  if (/\bmilk\b/.test(hay)) return "milk";
  return "dark";
}

const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "asc", label: "Price: Low to High" },
  { key: "desc", label: "Price: High to Low" },
  { key: "name", label: "Alphabetically, A–Z" },
];

const PAGE_SIZE = 12;

export function CollectionView({
  eyebrow,
  title,
  subtitle,
  products,
  isLoading,
  showFlavour = false,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  products: Product[];
  isLoading: boolean;
  showFlavour?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [flavour, setFlavour] = useState<Flavour>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [max, setMax] = useState(5000);
  const [dense, setDense] = useState(false);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => (p.salePrice ?? p.price) <= max);
    if (showFlavour && flavour !== "all")
      list = list.filter((p) => detectFlavour(p) === flavour);
    if (inStockOnly) list = list.filter((p) => p.inStock);
    if (onSaleOnly) list = list.filter((p) => p.salePrice != null);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q),
      );
    }
    if (sort === "asc")
      list = [...list].sort(
        (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
      );
    else if (sort === "desc")
      list = [...list].sort(
        (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price),
      );
    else if (sort === "name")
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else
      list = [...list].sort(
        (a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller),
      );
    return list;
  }, [
    products,
    max,
    flavour,
    showFlavour,
    inStockOnly,
    onSaleOnly,
    query,
    sort,
  ]);

  useEffect(() => {
    setPage(1);
  }, [query, sort, flavour, inStockOnly, onSaleOnly, max]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeChips = [
    showFlavour && flavour !== "all"
      ? {
          label: FLAVOURS.find((f) => f.key === flavour)!.label,
          clear: () => setFlavour("all"),
        }
      : null,
    inStockOnly
      ? { label: "In stock", clear: () => setInStockOnly(false) }
      : null,
    onSaleOnly ? { label: "On sale", clear: () => setOnSaleOnly(false) } : null,
    max < 5000
      ? { label: `Under ${formatINR(max)}`, clear: () => setMax(5000) }
      : null,
    query ? { label: `“${query}”`, clear: () => setQuery("") } : null,
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const filterPanel = (
    <div className="space-y-8">
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search this collection"
          className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {showFlavour && (
        <div>
          <div className="eyebrow mb-3">Flavour</div>
          <div className="space-y-2">
            {FLAVOURS.map((f) => (
              <label
                key={f.key}
                className="flex cursor-pointer items-center gap-2 text-sm text-primary"
              >
                <input
                  type="radio"
                  name="flavour"
                  checked={flavour === f.key}
                  onChange={() => setFlavour(f.key)}
                  className="accent-[var(--gold)]"
                />
                {f.label}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="eyebrow mb-3">Price</div>
        <input
          type="range"
          min={200}
          max={5000}
          step={100}
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
          className="w-full accent-[var(--gold)]"
        />
        <div className="mt-2 text-xs text-muted-foreground">
          Up to {formatINR(max)}
        </div>
      </div>

      <div>
        <div className="eyebrow mb-3">Availability</div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-primary">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="accent-[var(--gold)]"
          />
          In stock only
        </label>
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-primary">
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={(e) => setOnSaleOnly(e.target.checked)}
            className="accent-[var(--gold)]"
          />
          On sale
        </label>
      </div>
    </div>
  );

  return (
    <main>
      <section className="bg-secondary py-16 md:py-20">
        <div className="container-luxe text-center">
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="mt-3 font-display text-5xl text-primary md:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </section>

      <section className="container-luxe py-12">
        <div className="grid gap-10 md:grid-cols-[240px_1fr]">
          <aside className="hidden md:block">{filterPanel}</aside>

          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs uppercase tracking-[0.16em] text-primary md:hidden"
                >
                  <SlidersHorizontal size={13} /> Filter
                </button>
                <span className="text-sm text-muted-foreground">
                  {isLoading
                    ? "Loading…"
                    : `${filtered.length} product${filtered.length === 1 ? "" : "s"}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-1 rounded-full border border-border bg-card p-1 sm:flex">
                  <button
                    onClick={() => setDense(false)}
                    aria-label="Comfortable grid"
                    className={`rounded-full p-1.5 ${!dense ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                  >
                    <LayoutGrid size={13} />
                  </button>
                  <button
                    onClick={() => setDense(true)}
                    aria-label="Dense grid"
                    className={`rounded-full p-1.5 ${dense ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                  >
                    <Rows3 size={13} />
                  </button>
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm focus:outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>
                      Sort: {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {activeChips.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {activeChips.map((c) => (
                  <button
                    key={c.label}
                    onClick={c.clear}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-primary hover:border-accent"
                  >
                    {c.label} <X size={12} />
                  </button>
                ))}
              </div>
            )}

            {isLoading ? (
              <div
                className={`grid gap-6 sm:grid-cols-2 ${dense ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] animate-pulse rounded-2xl bg-card"
                  />
                ))}
              </div>
            ) : visible.length ? (
              <>
                <div
                  className={`grid gap-6 sm:grid-cols-2 ${dense ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
                >
                  {visible.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
                {pages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    {Array.from({ length: pages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`h-9 w-9 rounded-full border text-sm transition ${
                          page === i + 1
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-primary hover:border-accent"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="py-24 text-center text-muted-foreground">
                No products match your filters.
              </div>
            )}
          </div>
        </div>
      </section>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] overflow-y-auto bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="eyebrow">Filters</span>
              <button
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} className="text-primary" />
              </button>
            </div>
            {filterPanel}
            <button
              onClick={() => setFiltersOpen(false)}
              className="btn-cocoa mt-8 w-full"
            >
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
