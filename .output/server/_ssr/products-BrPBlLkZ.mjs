import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as formatINR, r as useCart } from "./cart-context-D3LdUJnQ.mjs";
import { t as supabase } from "./client-BjZKsg4o.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as ShoppingBag } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-BrPBlLkZ.js
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product }) {
	const price = product.salePrice ?? product.price;
	const { add } = useCart();
	const off = product.salePrice ? Math.round((product.price - product.salePrice) / product.price * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/products/$slug",
				params: { slug: product.slug },
				className: "relative block overflow-hidden rounded-2xl bg-card aspect-[4/5] shadow-[var(--shadow-card)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.image,
						alt: product.name,
						loading: "lazy",
						className: "w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-3 left-3 flex flex-col items-start gap-1.5",
						children: [product.salePrice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] tracking-[0.18em] uppercase bg-accent text-accent-foreground px-2.5 py-1 rounded-full",
							children: [
								"Save ",
								off,
								"%"
							]
						}), product.bestSeller && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] tracking-[0.18em] uppercase bg-primary text-primary-foreground px-2.5 py-1 rounded-full",
							children: "Best seller"
						})]
					}),
					!product.inStock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex items-center justify-center bg-background/70",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] tracking-[0.2em] uppercase text-primary border border-primary/30 rounded-full px-3 py-1.5 bg-background",
							children: "Sold out"
						})
					})
				]
			}),
			product.inStock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					add(product, 1);
					toast.success(`${product.name} added to bag`);
				},
				className: "absolute left-3 right-3 bottom-[6.5rem] hidden rounded-full bg-background/95 px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] text-primary shadow-[var(--shadow-card)] backdrop-blur transition hover:bg-primary hover:text-primary-foreground group-hover:block md:block md:opacity-0 md:group-hover:opacity-100",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { size: 13 }), " Quick add"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/products/$slug",
						params: { slug: product.slug },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl text-primary truncate",
							children: product.name
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground line-clamp-1",
						children: product.shortDescription
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right shrink-0",
					children: [product.salePrice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground line-through",
						children: formatINR(product.price)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium text-primary",
						children: formatINR(price)
					})]
				})]
			})
		]
	});
}
var bar_1_default = "/assets/bar-1-CBS57mYT.jpg";
var bar_2_default = "/assets/bar-2-BJjsi9V5.jpg";
var bar_3_default = "/assets/bar-3-ClerG5C8.jpg";
var bar_4_default = "/assets/bar-4-DSl79d8f.jpg";
var hamper_1_default = "/assets/hamper-1-DL8Om9SX.jpg";
var hamper_2_default = "/assets/hamper-2-Bch0DBMv.jpg";
var hamper_3_default = "/assets/hamper-3-asWrAb3_.jpg";
var imageMap = {
	"cacao-noir-original": {
		image: bar_1_default,
		gallery: [
			bar_1_default,
			bar_2_default,
			bar_3_default
		]
	},
	"almond-sea-salt": {
		image: bar_2_default,
		gallery: [
			bar_2_default,
			bar_1_default,
			bar_4_default
		]
	},
	"hazelnut-cocoa-nib": {
		image: bar_3_default,
		gallery: [
			bar_3_default,
			bar_1_default,
			bar_2_default
		]
	},
	"pistachio-rose": {
		image: bar_4_default,
		gallery: [
			bar_4_default,
			bar_1_default,
			bar_3_default
		]
	},
	"the-noir-signature": {
		image: hamper_1_default,
		gallery: [
			hamper_1_default,
			hamper_2_default,
			hamper_3_default
		]
	},
	"grand-reserve-hamper": {
		image: hamper_2_default,
		gallery: [
			hamper_2_default,
			hamper_1_default,
			hamper_3_default
		]
	},
	"petit-noir-tin": {
		image: hamper_3_default,
		gallery: [
			hamper_3_default,
			hamper_1_default,
			hamper_2_default
		]
	}
};
var fallback = {
	image: bar_1_default,
	gallery: [bar_1_default]
};
function mapProduct(row) {
	const imgs = imageMap[row.slug] ?? fallback;
	return {
		slug: row.slug,
		name: row.name,
		category: row.category_slug,
		price: Number(row.price),
		salePrice: row.sale_price != null ? Number(row.sale_price) : void 0,
		image: row.image_url ?? imgs.image,
		gallery: row.image_url ? [row.image_url, ...imgs.gallery] : imgs.gallery,
		shortDescription: row.short_description,
		fullDescription: row.full_description,
		ingredients: row.ingredients,
		nutrition: Array.isArray(row.nutrition) ? row.nutrition : [],
		weight: row.weight,
		shelfLife: row.shelf_life,
		inStock: row.in_stock,
		bestSeller: row.best_seller
	};
}
async function fetchAllProducts() {
	const { data, error } = await supabase.from("products").select("*").order("sort_order", { ascending: true });
	if (error) throw error;
	return data.map(mapProduct);
}
async function fetchByCategory(category) {
	const { data, error } = await supabase.from("products").select("*").eq("category_slug", category).order("sort_order", { ascending: true });
	if (error) throw error;
	return data.map(mapProduct);
}
async function fetchProduct(slug) {
	const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
	if (error) throw error;
	return data ? mapProduct(data) : null;
}
var productsQuery = () => ({
	queryKey: ["products", "all"],
	queryFn: fetchAllProducts,
	staleTime: 6e4
});
var productsByCategoryQuery = (c) => ({
	queryKey: [
		"products",
		"category",
		c
	],
	queryFn: () => fetchByCategory(c),
	staleTime: 6e4
});
var productQuery = (slug) => ({
	queryKey: ["product", slug],
	queryFn: () => fetchProduct(slug),
	staleTime: 6e4
});
var testimonialsQuery = () => ({
	queryKey: ["testimonials"],
	queryFn: async () => {
		const { data, error } = await supabase.from("testimonials").select("id, author, role, quote, rating").eq("is_published", true).order("sort_order", { ascending: true });
		if (error) throw error;
		return data ?? [];
	},
	staleTime: 6e4
});
//#endregion
export { testimonialsQuery as a, productsQuery as i, productQuery as n, productsByCategoryQuery as r, ProductCard as t };
