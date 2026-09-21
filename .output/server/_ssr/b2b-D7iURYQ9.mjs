import { r as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as supabase } from "./client-BjZKsg4o.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { G as Building2, I as Gift, L as Factory, S as Package } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/b2b-D7iURYQ9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function B2B() {
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setLoading(true);
		const fd = new FormData(e.currentTarget);
		const payload = {
			company: String(fd.get("company") ?? "").trim(),
			contact_person: String(fd.get("person") ?? "").trim(),
			phone: String(fd.get("phone") ?? "").trim(),
			email: String(fd.get("email") ?? "").trim(),
			city: String(fd.get("city") ?? "").trim() || null,
			business_type: String(fd.get("type") ?? "").trim() || null,
			quantity: String(fd.get("qty") ?? "").trim() || null,
			message: String(fd.get("message") ?? "").trim() || null
		};
		try {
			const { error } = await supabase.from("b2b_enquiries").insert(payload);
			if (error) throw error;
			toast.success("Enquiry sent. We'll be in touch shortly.");
			e.currentTarget.reset();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not send enquiry");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "relative bg-primary text-primary-foreground py-24 md:py-32",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-luxe max-w-3xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "eyebrow !text-accent",
						children: "Corporate & Bulk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-4 font-display text-5xl md:text-6xl leading-tight",
						children: [
							"Gifting at scale,",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"crafted like couture."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-primary-foreground/80 text-lg max-w-xl",
						children: "From 50 boardroom favours to 50,000 Diwali hampers — private label, custom packaging, and nationwide fulfillment. Tell us what you're planning."
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "container-luxe py-20 grid md:grid-cols-4 gap-8",
			children: [
				{
					Icon: Gift,
					title: "Corporate Gifting",
					desc: "Curated boxes for teams and clients."
				},
				{
					Icon: Package,
					title: "Bulk Orders",
					desc: "Volume pricing on our signature range."
				},
				{
					Icon: Building2,
					title: "Wholesale Supply",
					desc: "Stock ChocoVibes in your retail space."
				},
				{
					Icon: Factory,
					title: "Private Label",
					desc: "Your brand, our craft. Made to spec."
				}
			].map(({ Icon, title, desc }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-11 h-11 rounded-full bg-accent/10 text-accent flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 18 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 font-display text-xl text-primary",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: desc
					})
				]
			}, title))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-secondary py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-luxe max-w-3xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "eyebrow",
							children: "Enquiry"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-4xl md:text-5xl text-primary",
							children: "Send us the brief."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-muted-foreground",
							children: "We reply within one business day."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-10 grid sm:grid-cols-2 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Company Name",
							name: "company",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Contact Person",
							name: "person",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Mobile Number",
							name: "phone",
							type: "tel",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							name: "email",
							type: "email",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "City",
							name: "city"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-[0.16em] text-muted-foreground",
								children: "Business Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								name: "type",
								defaultValue: "Corporate Gifting",
								className: "mt-2 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Corporate Gifting" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Retailer / Reseller" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Hotel / HORECA" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Private Label" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Other" })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Required Quantity",
							name: "qty",
							placeholder: "e.g. 500 hampers"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "sm:col-span-2 block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-[0.16em] text-muted-foreground",
								children: "Message"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								name: "message",
								rows: 5,
								className: "mt-2 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sm:col-span-2 flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: loading,
								type: "submit",
								className: "btn-cocoa",
								children: loading ? "Sending..." : "Send Enquiry"
							})
						})
					]
				})]
			})
		})
	] });
}
function Field({ label, name, type = "text", required, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs uppercase tracking-[0.16em] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			name,
			type,
			required,
			placeholder,
			className: "mt-2 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
		})]
	});
}
//#endregion
export { B2B as component };
