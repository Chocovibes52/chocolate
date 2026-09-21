import { r as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as supabase } from "./client-BjZKsg4o.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as X } from "../_libs/lucide-react.mjs";
import { a as statusTone, i as PageHeader, n as Card, t as Badge } from "./ui-CBa6olPZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders-Cn0uIe47.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"pending",
	"processing",
	"shipped",
	"delivered",
	"cancelled"
];
var PAY_STATUSES = [
	"pending",
	"paid",
	"failed",
	"refunded"
];
function AdminOrders() {
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(null);
	const { data: orders } = useQuery({
		queryKey: ["admin-orders"],
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	async function update(id, patch) {
		const { error } = await supabase.from("orders").update(patch).eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Order updated");
		qc.invalidateQueries({ queryKey: ["admin-orders"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Orders",
			description: "Track payments and fulfillment for every order."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Order"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Customer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Total"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Payment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Fulfillment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Date"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [(orders ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border/70 hover:bg-muted/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 font-mono text-xs",
							children: ["#", o.id.slice(0, 8)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-foreground",
								children: o.customer_name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: o.customer_email
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 font-medium",
							children: ["₹", Number(o.total).toLocaleString("en-IN")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: statusTone(o.payment_status),
									children: o.payment_status
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: o.payment_status,
									onChange: (e) => update(o.id, { payment_status: e.target.value }),
									className: "admin-input w-auto py-1 text-xs",
									children: PAY_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s
									}, s))
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: statusTone(o.status),
									children: o.status
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: o.status,
									onChange: (e) => update(o.id, { status: e.target.value }),
									className: "admin-input w-auto py-1 text-xs",
									children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s
									}, s))
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted-foreground",
							children: new Date(o.created_at).toLocaleDateString("en-IN", {
								day: "numeric",
								month: "short",
								year: "numeric"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setOpen(o),
								className: "admin-btn",
								children: "View"
							})
						})
					]
				}, o.id)), orders && orders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 7,
					className: "px-4 py-10 text-center text-muted-foreground",
					children: "No orders yet."
				}) })] })]
			})
		}),
		open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderDialog, {
			order: open,
			onClose: () => setOpen(null)
		})
	] });
}
function OrderDialog({ order, onClose }) {
	const { data: items } = useQuery({
		queryKey: ["admin-order-items", order.id],
		queryFn: async () => {
			const { data, error } = await supabase.from("order_items").select("*").eq("order_id", order.id);
			if (error) throw error;
			return data;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-background p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wider text-primary/60",
						children: "Order"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-mono text-primary",
						children: order.id
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "text-primary/60 hover:text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-2 gap-4 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-serif text-lg text-primary mb-1",
							children: "Customer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.customer_name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-primary/70",
							children: order.customer_email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-primary/70",
							children: order.customer_phone
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-serif text-lg text-primary mb-1",
							children: "Shipping"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.address }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							order.city,
							", ",
							order.state,
							" — ",
							order.pincode
						] })
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "font-serif text-lg text-primary mt-6 mb-2",
					children: "Items"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm border border-border rounded-md overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted text-primary/60 text-left",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-normal",
								children: "Product"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-normal",
								children: "Qty"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-normal",
								children: "Unit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-normal",
								children: "Line"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (items ?? []).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: i.product_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: i.quantity
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2",
								children: ["₹", Number(i.unit_price).toLocaleString("en-IN")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2",
								children: ["₹", Number(i.line_total).toLocaleString("en-IN")]
							})
						]
					}, i.id)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-1 text-sm text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Subtotal: ₹", Number(order.subtotal).toLocaleString("en-IN")] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Shipping: ₹", Number(order.shipping).toLocaleString("en-IN")] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-serif text-lg text-primary",
							children: ["Total: ₹", Number(order.total).toLocaleString("en-IN")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-primary/60 text-xs",
							children: [
								"Payment: ",
								order.payment_method,
								" · ",
								order.payment_status
							]
						})
					]
				}),
				order.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary/60",
						children: "Notes: "
					}), order.notes]
				})
			]
		})
	});
}
//#endregion
export { AdminOrders as component };
