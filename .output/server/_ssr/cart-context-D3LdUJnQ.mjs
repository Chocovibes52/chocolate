import { r as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-context-D3LdUJnQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)(null);
var STORAGE = "cacao-noir-cart";
function CartProvider({ children }) {
	const [items, setItems] = (0, import_react.useState)([]);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(STORAGE);
			if (raw) setItems(JSON.parse(raw));
		} catch {}
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(items));
	}, [items, hydrated]);
	const value = (0, import_react.useMemo)(() => ({
		items,
		add: (p, qty = 1) => setItems((prev) => {
			if (prev.find((i) => i.product.slug === p.slug)) return prev.map((i) => i.product.slug === p.slug ? {
				...i,
				qty: i.qty + qty
			} : i);
			return [...prev, {
				product: p,
				qty
			}];
		}),
		remove: (slug) => setItems((prev) => prev.filter((i) => i.product.slug !== slug)),
		update: (slug, qty) => setItems((prev) => prev.map((i) => i.product.slug === slug ? {
			...i,
			qty: Math.max(1, qty)
		} : i)),
		clear: () => setItems([]),
		count: items.reduce((n, i) => n + i.qty, 0),
		subtotal: items.reduce((n, i) => n + (i.product.salePrice ?? i.product.price) * i.qty, 0)
	}), [items]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value,
		children
	});
}
function useCart() {
	const c = (0, import_react.useContext)(Ctx);
	if (!c) throw new Error("useCart must be used inside CartProvider");
	return c;
}
var formatINR = (n) => `₹${n.toLocaleString("en-IN")}`;
//#endregion
export { formatINR as n, useCart as r, CartProvider as t };
