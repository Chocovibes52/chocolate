import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as formatINR, r as useCart } from "./cart-context-D3LdUJnQ.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Minus, c as Trash2, y as Plus } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-Pr7Bjqx4.js
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const { items, update, remove, subtotal } = useCart();
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "container-luxe py-32 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "eyebrow",
				children: "Empty basket"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-5xl text-primary",
				children: "Nothing here — yet."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-muted-foreground",
				children: "Discover our best-selling energy bars and gift hampers."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/energy-bars",
				className: "btn-cocoa mt-8",
				children: "Start shopping"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "container-luxe py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-5xl text-primary",
			children: "Your Cart"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 grid lg:grid-cols-[1fr_360px] gap-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border border-y border-border",
				children: items.map((it) => {
					const price = it.product.salePrice ?? it.product.price;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-6 grid grid-cols-[80px_1fr_auto] gap-5 items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: it.product.image,
								alt: it.product.name,
								className: "w-20 h-20 rounded-lg object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/products/$slug",
									params: { slug: it.product.slug },
									className: "font-display text-xl text-primary hover:text-accent",
									children: it.product.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										formatINR(price),
										" · ",
										it.product.weight
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center rounded-full border border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => update(it.product.slug, it.qty - 1),
												className: "p-2 hover:text-accent",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { size: 12 })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-8 text-center text-sm",
												children: it.qty
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => update(it.product.slug, it.qty + 1),
												className: "p-2 hover:text-accent",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 12 })
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => remove(it.product.slug),
										className: "text-xs text-muted-foreground hover:text-destructive flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 12 }), " Remove"]
									})]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-lg text-primary",
								children: formatINR(price * it.qty)
							})
						]
					}, it.product.slug);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "h-fit rounded-2xl border border-border bg-card p-6 sticky top-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "eyebrow",
						children: "Order Summary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatINR(subtotal) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shipping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Calculated at checkout" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border pt-3 flex justify-between font-display text-xl text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatINR(subtotal) })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/checkout",
						className: "btn-cocoa w-full mt-6",
						children: "Proceed to checkout"
					})
				]
			})]
		})]
	});
}
//#endregion
export { CartPage as component };
