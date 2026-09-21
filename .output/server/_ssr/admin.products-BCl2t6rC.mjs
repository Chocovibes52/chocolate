import { r as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as supabase } from "./client-BjZKsg4o.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { F as Image, H as ChevronRight, U as ChevronLeft, c as Trash2, g as Search, n as X, x as Pencil, y as Plus } from "../_libs/lucide-react.mjs";
import { i as PageHeader, n as Card, r as EmptyState, t as Badge } from "./ui-CBa6olPZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products-BCl2t6rC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = {
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
	image_url: null
};
var TABS = [
	{
		key: "all",
		label: "All"
	},
	{
		key: "active",
		label: "In stock"
	},
	{
		key: "out",
		label: "Out of stock"
	},
	{
		key: "sale",
		label: "On sale"
	}
];
var PAGE_SIZE = 10;
function AdminProducts() {
	const qc = useQueryClient();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("sort_order");
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [page, setPage] = (0, import_react.useState)(1);
	const { data: products, isLoading } = useQuery({
		queryKey: ["admin-products"],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("*").order("sort_order");
			if (error) throw error;
			return data;
		}
	});
	const { data: categories } = useQuery({
		queryKey: ["admin-categories"],
		queryFn: async () => {
			const { data } = await supabase.from("categories").select("slug, name").order("sort_order");
			return data ?? [];
		}
	});
	const filtered = (0, import_react.useMemo)(() => {
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
	}, [
		products,
		tab,
		category,
		query,
		sort
	]);
	const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const current = Math.min(page, pages);
	const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
	const allSelected = visible.length > 0 && visible.every((p) => selected.includes(p.id));
	function toggle(id) {
		setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
	}
	function invalidate() {
		qc.invalidateQueries({ queryKey: ["admin-products"] });
		qc.invalidateQueries({ queryKey: ["products"] });
	}
	async function remove(ids) {
		if (!confirm(`Delete ${ids.length} product${ids.length > 1 ? "s" : ""}?`)) return;
		const { error } = await supabase.from("products").delete().in("id", ids);
		if (error) return toast.error(error.message);
		toast.success(`Deleted ${ids.length} product${ids.length > 1 ? "s" : ""}`);
		setSelected([]);
		invalidate();
	}
	async function bulkStock(in_stock) {
		const { error } = await supabase.from("products").update({ in_stock }).in("id", selected);
		if (error) return toast.error(error.message);
		toast.success(in_stock ? "Marked as in stock" : "Marked as out of stock");
		setSelected([]);
		invalidate();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Products",
			description: "Manage your catalog, pricing, imagery and availability.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setCreating(true),
				className: "admin-btn-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 15 }), " Add product"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1 overflow-x-auto border-b border-border px-3 pt-3",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setTab(t.key);
						setPage(1);
					},
					className: `whitespace-nowrap rounded-t-lg px-3.5 py-2 text-sm transition ${tab === t.key ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`,
					children: t.label
				}, t.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-52 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							size: 14,
							className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => {
								setQuery(e.target.value);
								setPage(1);
							},
							placeholder: "Search products",
							className: "admin-input pl-9"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: category,
						onChange: (e) => setCategory(e.target.value),
						className: "admin-input w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All categories"
						}), (categories ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.slug,
							children: c.name
						}, c.slug))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: sort,
						onChange: (e) => setSort(e.target.value),
						className: "admin-input w-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "sort_order",
								children: "Sort: Manual"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "name",
								children: "Name A–Z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "price_asc",
								children: "Price: Low to high"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "price_desc",
								children: "Price: High to low"
							})
						]
					})
				]
			}),
			selected.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border bg-muted/70 px-4 py-2.5 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-medium",
					children: [selected.length, " selected"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => bulkStock(true),
							className: "admin-btn",
							children: "Mark in stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => bulkStock(false),
							className: "admin-btn",
							children: "Mark out of stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => remove(selected),
							className: "admin-btn border-destructive/30 text-destructive hover:bg-destructive/10",
							children: "Delete"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-x-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-10 px-4 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: allSelected,
										onChange: (e) => setSelected(e.target.checked ? visible.map((p) => p.id) : []),
										"aria-label": "Select all"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5 font-medium",
									children: "Product"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5 font-medium",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5 font-medium",
									children: "Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5 font-medium text-right",
									children: "Price"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2.5" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: visible.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border/70 hover:bg-muted/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: selected.includes(p.id),
										onChange: () => toggle(p.id),
										"aria-label": `Select ${p.name}`
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [p.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: p.image_url,
											alt: "",
											className: "h-10 w-10 rounded-md border border-border object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-10 w-10 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { size: 14 })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setEditing(p),
												className: "block truncate font-medium text-foreground hover:underline",
												children: p.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate font-mono text-xs text-muted-foreground",
												children: p.slug
											})]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: p.in_stock ? "success" : "critical",
											children: p.in_stock ? "In stock" : "Out of stock"
										}), p.best_seller && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: "info",
											children: "Best seller"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: p.category_slug
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right",
									children: p.sale_price != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground line-through",
											children: ["₹", Number(p.price).toLocaleString("en-IN")]
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium",
											children: ["₹", Number(p.sale_price).toLocaleString("en-IN")]
										})
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium",
										children: ["₹", Number(p.price).toLocaleString("en-IN")]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-end gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setEditing(p),
											className: "rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground",
											"aria-label": "Edit",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { size: 15 })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => remove([p.id]),
											className: "rounded-md p-1.5 text-destructive hover:bg-destructive/10",
											"aria-label": "Delete",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 15 })
										})]
									})
								})
							]
						}, p.id)) })]
					}),
					!isLoading && visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "No products found",
						hint: "Try a different search, filter or add a new product."
					}),
					isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "Loading products…" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: filtered.length === 0 ? "0 products" : `Showing ${(current - 1) * PAGE_SIZE + 1}–${Math.min(current * PAGE_SIZE, filtered.length)} of ${filtered.length}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setPage(current - 1),
						disabled: current <= 1,
						className: "admin-btn px-2",
						"aria-label": "Previous page",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 15 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setPage(current + 1),
						disabled: current >= pages,
						className: "admin-btn px-2",
						"aria-label": "Next page",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 15 })
					})]
				})]
			})
		] }),
		(editing || creating) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDialog, {
			initial: editing ?? empty,
			isNew: creating,
			categories: categories ?? [],
			onClose: () => {
				setEditing(null);
				setCreating(false);
			},
			onSaved: invalidate
		})
	] });
}
function ProductDialog({ initial, isNew, categories, onClose, onSaved }) {
	const [form, setForm] = (0, import_react.useState)(initial);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	async function uploadImage(file) {
		setUploading(true);
		const ext = file.name.split(".").pop() ?? "jpg";
		const path = `${(form.slug || "product").replace(/[^a-z0-9-]/gi, "-").toLowerCase()}-${Date.now()}.${ext}`;
		const { error } = await supabase.storage.from("product-images").upload(path, file, {
			upsert: true,
			contentType: file.type
		});
		if (error) {
			setUploading(false);
			return toast.error(error.message);
		}
		const { data, error: signErr } = await supabase.storage.from("product-images").createSignedUrl(path, 3600 * 24 * 365 * 5);
		setUploading(false);
		if (signErr || !data) return toast.error(signErr?.message ?? "Could not read image URL");
		set("image_url", data.signedUrl);
		toast.success("Image uploaded");
	}
	function set(k, v) {
		setForm({
			...form,
			[k]: v
		});
	}
	async function save() {
		setSaving(true);
		const payload = {
			...form,
			price: Number(form.price),
			sale_price: form.sale_price != null && form.sale_price !== "" ? Number(form.sale_price) : null,
			sort_order: Number(form.sort_order ?? 0)
		};
		const res = isNew ? await supabase.from("products").insert(payload) : await supabase.from("products").update(payload).eq("id", form.id);
		setSaving(false);
		if (res.error) return toast.error(res.error.message);
		toast.success(isNew ? "Product created" : "Product updated");
		onSaved();
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "admin-shell fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-background shadow-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky top-0 flex items-center justify-between border-b border-border bg-background px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold text-foreground",
						children: isNew ? "Add product" : "Edit product"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "text-muted-foreground hover:text-foreground",
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "admin-card p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mb-4 text-sm font-semibold text-foreground",
								children: "Product details"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Name",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "admin-input",
											value: form.name,
											onChange: (e) => set("name", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Slug",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "admin-input",
											value: form.slug,
											onChange: (e) => set("slug", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Short description",
										span: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "admin-input min-h-16",
											value: form.short_description,
											onChange: (e) => set("short_description", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Full description",
										span: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "admin-input min-h-24",
											value: form.full_description,
											onChange: (e) => set("full_description", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Ingredients",
										span: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "admin-input min-h-16",
											value: form.ingredients,
											onChange: (e) => set("ingredients", e.target.value)
										})
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "admin-card p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mb-4 text-sm font-semibold text-foreground",
								children: "Media"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [form.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: form.image_url,
									alt: "Product preview",
									className: "h-24 w-24 rounded-lg border border-border object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { size: 20 })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "image/*",
											disabled: uploading,
											onChange: (e) => {
												const f = e.target.files?.[0];
												if (f) uploadImage(f);
											},
											className: "block text-xs text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:text-primary-foreground"
										}),
										uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Uploading…"
										}),
										form.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => set("image_url", null),
											className: "text-xs text-destructive hover:underline",
											children: "Remove image"
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "admin-card p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mb-4 text-sm font-semibold text-foreground",
								children: "Pricing & organisation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Price (₹)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											className: "admin-input",
											value: form.price,
											onChange: (e) => set("price", Number(e.target.value))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Sale price (₹)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											className: "admin-input",
											value: form.sale_price ?? "",
											onChange: (e) => set("sale_price", e.target.value === "" ? null : Number(e.target.value))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Category",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: "admin-input",
											value: form.category_slug,
											onChange: (e) => set("category_slug", e.target.value),
											children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: c.slug,
												children: c.name
											}, c.slug))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Sort order",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											className: "admin-input",
											value: form.sort_order ?? 0,
											onChange: (e) => set("sort_order", Number(e.target.value))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Weight",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "admin-input",
											value: form.weight,
											onChange: (e) => set("weight", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Shelf life",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "admin-input",
											value: form.shelf_life,
											onChange: (e) => set("shelf_life", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: form.in_stock,
											onChange: (e) => set("in_stock", e.target.checked)
										}), "In stock"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: form.best_seller,
											onChange: (e) => set("best_seller", e.target.checked)
										}), "Best seller"]
									})
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky bottom-0 flex justify-end gap-2 border-t border-border bg-background px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "admin-btn",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: save,
						disabled: saving,
						className: "admin-btn-primary",
						children: saving ? "Saving…" : "Save product"
					})]
				})
			]
		})
	});
}
function Field({ label, children, span }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: `block ${span ? "sm:col-span-2" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1.5 block text-xs font-medium text-muted-foreground",
			children: label
		}), children]
	});
}
//#endregion
export { AdminProducts as component };
