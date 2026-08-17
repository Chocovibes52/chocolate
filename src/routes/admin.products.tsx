import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Image as ImageIcon, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

type Product = Tables<"products">;

const empty: TablesInsert<"products"> = {
  slug: "",
  name: "",
  category_slug: "energy-bars",
  price: 0,
  sale_price: null,
  short_description: "",
  full_description: "",
  ingredients: "",
  weight: "",
  shelf_life: "",
  in_stock: true,
  best_seller: false,
  sort_order: 0,
  nutrition: [],
  image_url: null,
};

const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "In stock" },
  { key: "out", label: "Out of stock" },
  { key: "sale", label: "On sale" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const PAGE_SIZE = 10;

function AdminProducts() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [tab, setTab] = useState<TabKey>("all");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("sort_order");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("sort_order");
      if (error) throw error;
      return data as Product[];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("slug, name").order("sort_order");
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    let list = products ?? [];
    if (tab === "active") list = list.filter((p) => p.in_stock);
    if (tab === "out") list = list.filter((p) => !p.in_stock);
    if (tab === "sale") list = list.filter((p) => p.sale_price != null);
    if (category !== "all") list = list.filter((p) => p.category_slug === category);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
    }
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "price_asc") list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === "price_desc") list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
    return list;
  }, [products, tab, category, query, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const allSelected = visible.length > 0 && visible.every((p) => selected.includes(p.id));

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  async function remove(ids: string[]) {
    if (!confirm(`Delete ${ids.length} product${ids.length > 1 ? "s" : ""}?`)) return;
    const { error } = await supabase.from("products").delete().in("id", ids);
    if (error) return toast.error(error.message);
    toast.success(`Deleted ${ids.length} product${ids.length > 1 ? "s" : ""}`);
    setSelected([]);
    invalidate();
  }

  async function bulkStock(in_stock: boolean) {
    const { error } = await supabase.from("products").update({ in_stock }).in("id", selected);
    if (error) return toast.error(error.message);
    toast.success(in_stock ? "Marked as in stock" : "Marked as out of stock");
    setSelected([]);
    invalidate();
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your catalog, pricing, imagery and availability."
        actions={
          <button onClick={() => setCreating(true)} className="admin-btn-primary">
            <Plus size={15} /> Add product
          </button>
        }
      />

      <Card>
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-3 pt-3">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setPage(1);
              }}
              className={`whitespace-nowrap rounded-t-lg px-3.5 py-2 text-sm transition ${
                tab === t.key
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          <div className="relative min-w-52 flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search products"
              className="admin-input pl-9"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="admin-input w-auto"
          >
            <option value="all">All categories</option>
            {(categories ?? []).map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="admin-input w-auto">
            <option value="sort_order">Sort: Manual</option>
            <option value="name">Name A–Z</option>
            <option value="price_asc">Price: Low to high</option>
            <option value="price_desc">Price: High to low</option>
          </select>
        </div>

        {/* Bulk bar */}
        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/70 px-4 py-2.5 text-sm">
            <span className="font-medium">{selected.length} selected</span>
            <div className="ml-auto flex flex-wrap gap-2">
              <button onClick={() => bulkStock(true)} className="admin-btn">
                Mark in stock
              </button>
              <button onClick={() => bulkStock(false)} className="admin-btn">
                Mark out of stock
              </button>
              <button
                onClick={() => remove(selected)}
                className="admin-btn border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="w-10 px-4 py-2.5">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) =>
                      setSelected(e.target.checked ? visible.map((p) => p.id) : [])
                    }
                    aria-label="Select all"
                  />
                </th>
                <th className="px-4 py-2.5 font-medium">Product</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Category</th>
                <th className="px-4 py-2.5 font-medium text-right">Price</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id} className="border-t border-border/70 hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() => toggle(p.id)}
                      aria-label={`Select ${p.name}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="h-10 w-10 rounded-md border border-border object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
                          <ImageIcon size={14} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <button
                          onClick={() => setEditing(p)}
                          className="block truncate font-medium text-foreground hover:underline"
                        >
                          {p.name}
                        </button>
                        <div className="truncate font-mono text-xs text-muted-foreground">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge tone={p.in_stock ? "success" : "critical"}>
                        {p.in_stock ? "In stock" : "Out of stock"}
                      </Badge>
                      {p.best_seller && <Badge tone="info">Best seller</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category_slug}</td>
                  <td className="px-4 py-3 text-right">
                    {p.sale_price != null ? (
                      <>
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{Number(p.price).toLocaleString("en-IN")}
                        </span>{" "}
                        <span className="font-medium">₹{Number(p.sale_price).toLocaleString("en-IN")}</span>
                      </>
                    ) : (
                      <span className="font-medium">₹{Number(p.price).toLocaleString("en-IN")}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditing(p)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => remove([p.id])}
                        className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && visible.length === 0 && (
            <EmptyState title="No products found" hint="Try a different search, filter or add a new product." />
          )}
          {isLoading && <EmptyState title="Loading products…" />}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
          <span>
            {filtered.length === 0
              ? "0 products"
              : `Showing ${(current - 1) * PAGE_SIZE + 1}–${Math.min(current * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(current - 1)}
              disabled={current <= 1}
              className="admin-btn px-2"
              aria-label="Previous page"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => setPage(current + 1)}
              disabled={current >= pages}
              className="admin-btn px-2"
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </Card>

      {(editing || creating) && (
        <ProductDialog
          initial={editing ?? empty}
          isNew={creating}
          categories={categories ?? []}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={invalidate}
        />
      )}
    </div>
  );
}

function ProductDialog({
  initial,
  isNew,
  categories,
  onClose,
  onSaved,
}: {
  initial: Product | TablesInsert<"products">;
  isNew: boolean;
  categories: { slug: string; name: string }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function uploadImage(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${(form.slug || "product").replace(/[^a-z0-9-]/gi, "-").toLowerCase()}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      setUploading(false);
      return toast.error(error.message);
    }
    const { data, error: signErr } = await supabase.storage
      .from("product-images")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
    setUploading(false);
    if (signErr || !data) return toast.error(signErr?.message ?? "Could not read image URL");
    set("image_url", data.signedUrl);
    toast.success("Image uploaded");
  }

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm({ ...form, [k]: v });
  }

  async function save() {
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      sale_price:
        form.sale_price != null && form.sale_price !== ("" as unknown) ? Number(form.sale_price) : null,
      sort_order: Number(form.sort_order ?? 0),
    };
    const res = isNew
      ? await supabase.from("products").insert(payload as TablesInsert<"products">)
      : await supabase.from("products").update(payload).eq("id", (form as Product).id);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(isNew ? "Product created" : "Product updated");
    onSaved();
    onClose();
  }

  return (
    <div className="admin-shell fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-background shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <h3 className="text-base font-semibold text-foreground">
            {isNew ? "Add product" : "Edit product"}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <section className="admin-card p-5">
            <h4 className="mb-4 text-sm font-semibold text-foreground">Product details</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name">
                <input className="admin-input" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </Field>
              <Field label="Slug">
                <input className="admin-input" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
              </Field>
              <Field label="Short description" span>
                <textarea
                  className="admin-input min-h-16"
                  value={form.short_description}
                  onChange={(e) => set("short_description", e.target.value)}
                />
              </Field>
              <Field label="Full description" span>
                <textarea
                  className="admin-input min-h-24"
                  value={form.full_description}
                  onChange={(e) => set("full_description", e.target.value)}
                />
              </Field>
              <Field label="Ingredients" span>
                <textarea
                  className="admin-input min-h-16"
                  value={form.ingredients}
                  onChange={(e) => set("ingredients", e.target.value)}
                />
              </Field>
            </div>
          </section>

          <section className="admin-card p-5">
            <h4 className="mb-4 text-sm font-semibold text-foreground">Media</h4>
            <div className="flex items-center gap-4">
              {form.image_url ? (
                <img
                  src={form.image_url}
                  alt="Product preview"
                  className="h-24 w-24 rounded-lg border border-border object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
                  <ImageIcon size={20} />
                </div>
              )}
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadImage(f);
                  }}
                  className="block text-xs text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:text-primary-foreground"
                />
                {uploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
                {form.image_url && (
                  <button
                    type="button"
                    onClick={() => set("image_url", null)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Remove image
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="admin-card p-5">
            <h4 className="mb-4 text-sm font-semibold text-foreground">Pricing & organisation</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Price (₹)">
                <input
                  type="number"
                  className="admin-input"
                  value={form.price}
                  onChange={(e) => set("price", Number(e.target.value))}
                />
              </Field>
              <Field label="Sale price (₹)">
                <input
                  type="number"
                  className="admin-input"
                  value={form.sale_price ?? ""}
                  onChange={(e) => set("sale_price", e.target.value === "" ? null : Number(e.target.value))}
                />
              </Field>
              <Field label="Category">
                <select
                  className="admin-input"
                  value={form.category_slug}
                  onChange={(e) => set("category_slug", e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Sort order">
                <input
                  type="number"
                  className="admin-input"
                  value={form.sort_order ?? 0}
                  onChange={(e) => set("sort_order", Number(e.target.value))}
                />
              </Field>
              <Field label="Weight">
                <input className="admin-input" value={form.weight} onChange={(e) => set("weight", e.target.value)} />
              </Field>
              <Field label="Shelf life">
                <input
                  className="admin-input"
                  value={form.shelf_life}
                  onChange={(e) => set("shelf_life", e.target.value)}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.in_stock} onChange={(e) => set("in_stock", e.target.checked)} />
                In stock
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.best_seller}
                  onChange={(e) => set("best_seller", e.target.checked)}
                />
                Best seller
              </label>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-background px-6 py-4">
          <button onClick={onClose} className="admin-btn">
            Cancel
          </button>
          <button onClick={save} disabled={saving} className="admin-btn-primary">
            {saving ? "Saving…" : "Save product"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, span }: { label: string; children: React.ReactNode; span?: boolean }) {
  return (
    <label className={`block ${span ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
