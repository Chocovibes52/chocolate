import { r as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as formatINR } from "./cart-context-D3LdUJnQ.mjs";
import { d as SlidersHorizontal, g as Search, j as LayoutGrid, n as X, v as Rows3 } from "../_libs/lucide-react.mjs";
import { t as ProductCard } from "./products-BrPBlLkZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CollectionView-D0x8cfWP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FLAVOURS = [
	{
		key: "all",
		label: "All Flavours"
	},
	{
		key: "dark",
		label: "Dark"
	},
	{
		key: "milk",
		label: "Milk"
	},
	{
		key: "white",
		label: "White"
	}
];
function detectFlavour(p) {
	const hay = `${p.name} ${p.shortDescription ?? ""} ${p.fullDescription ?? ""} ${p.ingredients ?? ""}`.toLowerCase();
	if (/\bwhite\b/.test(hay)) return "white";
	if (/\bmilk\b/.test(hay)) return "milk";
	return "dark";
}
var SORTS = [
	{
		key: "featured",
		label: "Featured"
	},
	{
		key: "asc",
		label: "Price: Low to High"
	},
	{
		key: "desc",
		label: "Price: High to Low"
	},
	{
		key: "name",
		label: "Alphabetically, A–Z"
	}
];
var PAGE_SIZE = 12;
function CollectionView({ eyebrow, title, subtitle, products, isLoading, showFlavour = false }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)("featured");
	const [flavour, setFlavour] = (0, import_react.useState)("all");
	const [inStockOnly, setInStockOnly] = (0, import_react.useState)(false);
	const [onSaleOnly, setOnSaleOnly] = (0, import_react.useState)(false);
	const [max, setMax] = (0, import_react.useState)(5e3);
	const [dense, setDense] = (0, import_react.useState)(false);
	const [page, setPage] = (0, import_react.useState)(1);
	const [filtersOpen, setFiltersOpen] = (0, import_react.useState)(false);
	const filtered = (0, import_react.useMemo)(() => {
		let list = products.filter((p) => (p.salePrice ?? p.price) <= max);
		if (showFlavour && flavour !== "all") list = list.filter((p) => detectFlavour(p) === flavour);
		if (inStockOnly) list = list.filter((p) => p.inStock);
		if (onSaleOnly) list = list.filter((p) => p.salePrice != null);
		if (query) {
			const q = query.toLowerCase();
			list = list.filter((p) => p.name.toLowerCase().includes(q) || p.shortDescription?.toLowerCase().includes(q));
		}
		if (sort === "asc") list = [...list].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
		else if (sort === "desc") list = [...list].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
		else if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
		else list = [...list].sort((a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller));
		return list;
	}, [
		products,
		max,
		flavour,
		showFlavour,
		inStockOnly,
		onSaleOnly,
		query,
		sort
	]);
	(0, import_react.useEffect)(() => {
		setPage(1);
	}, [
		query,
		sort,
		flavour,
		inStockOnly,
		onSaleOnly,
		max
	]);
	const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	const activeChips = [
		showFlavour && flavour !== "all" ? {
			label: FLAVOURS.find((f) => f.key === flavour).label,
			clear: () => setFlavour("all")
		} : null,
		inStockOnly ? {
			label: "In stock",
			clear: () => setInStockOnly(false)
		} : null,
		onSaleOnly ? {
			label: "On sale",
			clear: () => setOnSaleOnly(false)
		} : null,
		max < 5e3 ? {
			label: `Under ${formatINR(max)}`,
			clear: () => setMax(5e3)
		} : null,
		query ? {
			label: `“${query}”`,
			clear: () => setQuery("")
		} : null
	].filter(Boolean);
	const filterPanel = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					size: 14,
					className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search this collection",
					className: "w-full rounded-full border border-border bg-card py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
				})]
			}),
			showFlavour && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "eyebrow mb-3",
				children: "Flavour"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: FLAVOURS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex cursor-pointer items-center gap-2 text-sm text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "radio",
						name: "flavour",
						checked: flavour === f.key,
						onChange: () => setFlavour(f.key),
						className: "accent-[var(--gold)]"
					}), f.label]
				}, f.key))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow mb-3",
					children: "Price"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 200,
					max: 5e3,
					step: 100,
					value: max,
					onChange: (e) => setMax(Number(e.target.value)),
					className: "w-full accent-[var(--gold)]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 text-xs text-muted-foreground",
					children: ["Up to ", formatINR(max)]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow mb-3",
					children: "Availability"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex cursor-pointer items-center gap-2 text-sm text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: inStockOnly,
						onChange: (e) => setInStockOnly(e.target.checked),
						className: "accent-[var(--gold)]"
					}), "In stock only"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-2 flex cursor-pointer items-center gap-2 text-sm text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: onSaleOnly,
						onChange: (e) => setOnSaleOnly(e.target.checked),
						className: "accent-[var(--gold)]"
					}), "On sale"]
				})
			] })
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-secondary py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-luxe text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "eyebrow",
						children: eyebrow
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-5xl text-primary md:text-6xl",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-4 max-w-xl text-muted-foreground",
						children: subtitle
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "container-luxe py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-10 md:grid-cols-[240px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden md:block",
					children: filterPanel
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setFiltersOpen(true),
									className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs uppercase tracking-[0.16em] text-primary md:hidden",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { size: 13 }), " Filter"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted-foreground",
									children: isLoading ? "Loading…" : `${filtered.length} product${filtered.length === 1 ? "" : "s"}`
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden items-center gap-1 rounded-full border border-border bg-card p-1 sm:flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setDense(false),
										"aria-label": "Comfortable grid",
										className: `rounded-full p-1.5 ${!dense ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { size: 13 })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setDense(true),
										"aria-label": "Dense grid",
										className: `rounded-full p-1.5 ${dense ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rows3, { size: 13 })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: sort,
									onChange: (e) => setSort(e.target.value),
									className: "rounded-full border border-border bg-card px-4 py-2 text-sm focus:outline-none",
									children: SORTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: s.key,
										children: ["Sort: ", s.label]
									}, s.key))
								})]
							})]
						}),
						activeChips.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-6 flex flex-wrap items-center gap-2",
							children: activeChips.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: c.clear,
								className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-primary hover:border-accent",
								children: [
									c.label,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 12 })
								]
							}, c.label))
						}),
						isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid gap-6 sm:grid-cols-2 ${dense ? "lg:grid-cols-4" : "lg:grid-cols-3"}`,
							children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[4/5] animate-pulse rounded-2xl bg-card" }, i))
						}) : visible.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid gap-6 sm:grid-cols-2 ${dense ? "lg:grid-cols-4" : "lg:grid-cols-3"}`,
							children: visible.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
						}), pages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-12 flex items-center justify-center gap-2",
							children: Array.from({ length: pages }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setPage(i + 1),
								className: `h-9 w-9 rounded-full border text-sm transition ${page === i + 1 ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-primary hover:border-accent"}`,
								children: i + 1
							}, i))
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-24 text-center text-muted-foreground",
							children: "No products match your filters."
						})
					]
				})]
			})
		}),
		filtersOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-50 md:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-foreground/40",
				onClick: () => setFiltersOpen(false)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-y-0 left-0 w-80 max-w-[85%] overflow-y-auto bg-background p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow",
							children: "Filters"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFiltersOpen(false),
							"aria-label": "Close filters",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								size: 18,
								className: "text-primary"
							})
						})]
					}),
					filterPanel,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setFiltersOpen(false),
						className: "btn-cocoa mt-8 w-full",
						children: [
							"Show ",
							filtered.length,
							" results"
						]
					})
				]
			})]
		})
	] });
}
//#endregion
export { CollectionView as t };
