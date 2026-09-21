import { r as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as formatINR, r as useCart } from "./cart-context-D3LdUJnQ.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Minus, H as ChevronRight, f as ShoppingBag, y as Plus } from "../_libs/lucide-react.mjs";
import { n as productQuery, r as productsByCategoryQuery, t as ProductCard } from "./products-BrPBlLkZ.mjs";
import { t as Route } from "./products._slug-CIkiKg9Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products._slug-BWDloJos.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const { slug } = Route.useParams();
	const { data: product, isLoading } = useQuery(productQuery(slug));
	const [qty, setQty] = (0, import_react.useState)(1);
	const [active, setActive] = (0, import_react.useState)(0);
	const { add } = useCart();
	const navigate = useNavigate();
	const { data: siblings = [] } = useQuery({
		...productsByCategoryQuery(product?.category ?? "energy-bars"),
		enabled: !!product
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "container-luxe py-24 text-center text-muted-foreground",
		children: "Loading…"
	});
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "container-luxe py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl text-primary",
			children: "Product not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "btn-cocoa mt-6 inline-flex",
			children: "Back home"
		})]
	});
	const related = siblings.filter((p) => p.slug !== product.slug).slice(0, 3);
	const price = product.salePrice ?? product.price;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-luxe pt-8 text-xs text-muted-foreground flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "hover:text-primary",
					children: "Home"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 12 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: product.category === "energy-bars" ? "/energy-bars" : "/gift-hampers",
					className: "hover:text-primary",
					children: product.category === "energy-bars" ? "Energy Bars" : "Gift Hampers"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 12 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary",
					children: product.name
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-luxe py-10 grid lg:grid-cols-2 gap-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-square overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] group",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: product.gallery[active],
					alt: product.name,
					className: "w-full h-full object-cover transition duration-500 group-hover:scale-110"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-4 gap-3",
				children: product.gallery.map((src, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActive(idx),
					className: `aspect-square overflow-hidden rounded-lg border-2 transition ${idx === active ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src,
						alt: "",
						className: "w-full h-full object-cover"
					})
				}, idx))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow",
					children: product.category === "energy-bars" ? "Energy Bar" : "Gift Hamper"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl md:text-5xl text-primary",
					children: product.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex items-baseline gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-2xl font-display text-primary",
						children: formatINR(price)
					}), product.salePrice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground line-through text-sm",
						children: formatINR(product.price)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-muted-foreground leading-relaxed",
					children: product.fullDescription
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex items-center gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center rounded-full border border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setQty(Math.max(1, qty - 1)),
									className: "p-3 hover:text-accent",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { size: 14 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-8 text-center text-sm",
									children: qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setQty(qty + 1),
									className: "p-3 hover:text-accent",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 14 })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								add(product, qty);
								toast.success(`${product.name} added to cart`);
							},
							className: "btn-cocoa",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { size: 14 }), " Add to cart"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								add(product, qty);
								navigate({ to: "/checkout" });
							},
							className: "btn-gold",
							children: "Buy Now"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 divide-y divide-border border-y border-border",
					children: [
						{
							label: "Ingredients",
							value: product.ingredients
						},
						{
							label: "Weight",
							value: product.weight
						},
						{
							label: "Shelf Life",
							value: product.shelfLife
						}
					].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-4 grid grid-cols-3 gap-4 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "eyebrow !text-primary/60",
							children: row.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-2 text-primary/80",
							children: row.value
						})]
					}, row.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "eyebrow",
						children: "Nutrition (per serving)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3",
						children: product.nutrition.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: n.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-display text-lg text-primary",
								children: n.value
							})]
						}, n.label))
					})]
				})
			] })]
		}),
		related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-luxe py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl md:text-4xl text-primary",
				children: "You may also love"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: related.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
			})]
		})
	] });
}
//#endregion
export { ProductPage as component };
