import { r as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as formatINR, r as useCart } from "./cart-context-D3LdUJnQ.mjs";
import { t as supabase } from "./client-BjZKsg4o.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useAuth } from "./auth-CmWxYn5E.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-CzrkmTf8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Checkout() {
	const { items, subtotal, clear } = useCart();
	const { user } = useAuth();
	const [method, setMethod] = (0, import_react.useState)("razorpay");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const nav = useNavigate();
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "container-luxe py-32 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl text-primary",
			children: "Your cart is empty"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/energy-bars",
			className: "btn-cocoa mt-6 inline-flex",
			children: "Continue shopping"
		})]
	});
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		const fd = new FormData(e.currentTarget);
		const total = subtotal;
		try {
			const { data: order, error } = await supabase.from("orders").insert({
				user_id: user?.id ?? null,
				customer_name: String(fd.get("name") ?? "").trim(),
				customer_email: String(fd.get("email") ?? "").trim(),
				customer_phone: String(fd.get("phone") ?? "").trim(),
				address: String(fd.get("address") ?? "").trim(),
				city: String(fd.get("city") ?? "").trim(),
				state: String(fd.get("state") ?? "").trim(),
				pincode: String(fd.get("pincode") ?? "").trim(),
				subtotal,
				shipping: 0,
				total,
				payment_method: method,
				payment_status: "pending",
				status: "pending"
			}).select("id").single();
			if (error) throw error;
			const rows = items.map((it) => {
				const unit = it.product.salePrice ?? it.product.price;
				return {
					order_id: order.id,
					product_slug: it.product.slug,
					product_name: it.product.name,
					unit_price: unit,
					quantity: it.qty,
					line_total: unit * it.qty
				};
			});
			const { error: itemsErr } = await supabase.from("order_items").insert(rows);
			if (itemsErr) throw itemsErr;
			toast.success("Order placed! We'll email you the details. (Payment gateway coming next.)");
			clear();
			nav({ to: user ? "/account" : "/" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not place order");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "container-luxe py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-5xl text-primary",
				children: "Checkout"
			}),
			!user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: [
					"Checking out as guest. ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "text-accent",
						children: "Sign in"
					}),
					" to track this order in your account."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mt-10 grid lg:grid-cols-[1fr_400px] gap-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "eyebrow",
							children: "Contact"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid sm:grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Full Name",
									name: "name",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Email",
									name: "email",
									type: "email",
									defaultValue: user?.email ?? "",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Mobile Number",
									name: "phone",
									type: "tel",
									required: true
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "eyebrow",
							children: "Shipping Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Address",
								name: "address",
								required: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid sm:grid-cols-3 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "City",
										name: "city",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "State",
										name: "state",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Pincode",
										name: "pincode",
										required: true
									})
								]
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "eyebrow",
							children: "Payment Method"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid sm:grid-cols-2 gap-4",
							children: [{
								id: "razorpay",
								label: "Razorpay",
								desc: "Cards, UPI, netbanking, wallets"
							}, {
								id: "cod",
								label: "Cash on Delivery",
								desc: "Pay when your order arrives"
							}].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setMethod(m.id),
								className: `text-left rounded-xl border p-5 transition ${method === m.id ? "border-accent bg-accent/5" : "border-border hover:border-primary/40"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-lg text-primary",
									children: m.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-1",
									children: m.desc
								})]
							}, m.id))
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "h-fit rounded-2xl border border-border bg-card p-6 sticky top-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "eyebrow",
							children: "Order Summary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-3 max-h-64 overflow-auto",
							children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-primary/80",
									children: [
										it.product.name,
										" × ",
										it.qty
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatINR((it.product.salePrice ?? it.product.price) * it.qty) })]
							}, it.product.slug))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 border-t border-border pt-4 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatINR(subtotal) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shipping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Free" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between font-display text-xl text-primary pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatINR(subtotal) })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy,
							className: "btn-gold w-full mt-6",
							children: busy ? "Placing order…" : "Place order"
						})
					]
				})]
			})
		]
	});
}
function Field({ label, name, type = "text", required, defaultValue }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs uppercase tracking-[0.16em] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			name,
			type,
			required,
			defaultValue,
			className: "mt-2 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
		})]
	});
}
//#endregion
export { Checkout as component };
