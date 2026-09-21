import { r as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as formatINR } from "./cart-context-D3LdUJnQ.mjs";
import { t as supabase } from "./client-BjZKsg4o.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useAuth } from "./auth-CmWxYn5E.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { O as LogOut } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-BihPRros.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Account() {
	const { user, loading } = useAuth();
	const nav = useNavigate();
	(0, import_react.useEffect)(() => {
		if (!loading && !user) nav({ to: "/auth" });
	}, [
		user,
		loading,
		nav
	]);
	const orders = useQuery({
		queryKey: ["my-orders", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("id, created_at, status, payment_method, payment_status, total").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	async function signOut() {
		await supabase.auth.signOut();
		toast.success("Signed out");
		nav({ to: "/" });
	}
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "container-luxe py-24 text-center text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "container-luxe py-16 max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-6 flex-wrap",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow",
					children: "Account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-5xl text-primary",
					children: "Hello there."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted-foreground text-sm",
					children: user.email
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: signOut,
				className: "btn-outline-cocoa",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 14 }), " Sign out"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "eyebrow",
				children: "Your orders"
			}), orders.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "Loading orders…"
			}) : orders.data && orders.data.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 divide-y divide-border border border-border rounded-2xl overflow-hidden",
				children: orders.data.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 flex items-center justify-between gap-4 flex-wrap bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs uppercase tracking-widest text-muted-foreground",
						children: [
							"#",
							o.id.slice(0, 8),
							" · ",
							new Date(o.created_at).toLocaleDateString()
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-sm text-primary capitalize",
						children: [
							o.status,
							" · ",
							o.payment_method,
							" (",
							o.payment_status,
							")"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-xl text-primary",
						children: formatINR(Number(o.total))
					})]
				}, o.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: ["No orders yet. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/energy-bars",
					className: "text-accent",
					children: "Start shopping →"
				})]
			})]
		})]
	});
}
//#endregion
export { Account as component };
