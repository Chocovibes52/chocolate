import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-BjZKsg4o.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Mail, P as IndianRupee, S as Package, f as ShoppingBag, q as ArrowRight, s as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as statusTone, i as PageHeader, n as Card, r as EmptyState, t as Badge } from "./ui-CBa6olPZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-Dpr1zcpp.js
var import_jsx_runtime = require_jsx_runtime();
function useCount(table) {
	return useQuery({
		queryKey: ["admin-count", table],
		queryFn: async () => {
			const { count, error } = await supabase.from(table).select("*", {
				count: "exact",
				head: true
			});
			if (error) throw error;
			return count ?? 0;
		}
	});
}
function AdminOverview() {
	const products = useCount("products");
	const orders = useCount("orders");
	const enquiries = useCount("b2b_enquiries");
	const revenue = useQuery({
		queryKey: ["admin-revenue"],
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("total, payment_status");
			if (error) throw error;
			return (data ?? []).filter((o) => o.payment_status === "paid").reduce((s, o) => s + Number(o.total), 0);
		}
	});
	const recent = useQuery({
		queryKey: ["admin-recent-orders"],
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("id, customer_name, customer_email, total, status, payment_status, created_at").order("created_at", { ascending: false }).limit(6);
			if (error) throw error;
			return data ?? [];
		}
	});
	const outOfStock = useQuery({
		queryKey: ["admin-out-of-stock"],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("id, name, slug").eq("in_stock", false);
			if (error) throw error;
			return data ?? [];
		}
	});
	const cards = [
		{
			label: "Total revenue",
			value: revenue.data != null ? `₹${revenue.data.toLocaleString("en-IN")}` : "—",
			icon: IndianRupee,
			hint: "Paid orders"
		},
		{
			label: "Orders",
			value: orders.data ?? "—",
			icon: ShoppingBag,
			hint: "All time"
		},
		{
			label: "Products",
			value: products.data ?? "—",
			icon: Package,
			hint: "In catalog"
		},
		{
			label: "Enquiries",
			value: enquiries.data ?? "—",
			icon: Mail,
			hint: "Corporate & B2B"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Overview",
				description: "A snapshot of your store's performance."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: cards.map((c) => {
					const Icon = c.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
									children: c.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									size: 15,
									className: "text-muted-foreground"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 text-2xl font-semibold text-foreground",
								children: c.value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: c.hint
							})
						]
					}, c.label);
				})
			}),
			!!outOfStock.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-start gap-3 border-amber-200 bg-amber-50 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
						size: 16,
						className: "mt-0.5 text-amber-600"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm text-amber-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium",
							children: [
								outOfStock.data.length,
								" product",
								outOfStock.data.length > 1 ? "s are" : " is",
								" out of stock"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-amber-700",
							children: outOfStock.data.map((p) => p.name).join(", ")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/products",
						className: "admin-btn ml-auto shrink-0",
						children: "Manage"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border px-5 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold text-foreground",
					children: "Recent orders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/orders",
					className: "inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline",
					children: ["View all ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 13 })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-x-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-2.5 font-medium",
								children: "Order"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-2.5 font-medium",
								children: "Customer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-2.5 font-medium",
								children: "Payment"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-2.5 font-medium",
								children: "Fulfillment"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-2.5 font-medium text-right",
								children: "Total"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-2.5 font-medium",
								children: "Date"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (recent.data ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border/70 hover:bg-muted/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-5 py-3 font-mono text-xs",
								children: ["#", o.id.slice(0, 8)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-5 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-foreground",
									children: o.customer_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: o.customer_email
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: statusTone(o.payment_status),
									children: o.payment_status
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: statusTone(o.status),
									children: o.status
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-5 py-3 text-right font-medium",
								children: ["₹", Number(o.total).toLocaleString("en-IN")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-muted-foreground",
								children: new Date(o.created_at).toLocaleDateString("en-IN", {
									day: "numeric",
									month: "short"
								})
							})
						]
					}, o.id)) })]
				}), recent.data && recent.data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No orders yet",
					hint: "Orders will appear here as customers check out."
				})]
			})] })
		]
	});
}
//#endregion
export { AdminOverview as component };
