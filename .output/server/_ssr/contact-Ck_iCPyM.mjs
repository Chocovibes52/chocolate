import { r as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Mail, E as MapPin, b as Phone } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-Ck_iCPyM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Contact() {
	const [sent, setSent] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "container-luxe pt-20 text-center max-w-2xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "eyebrow",
				children: "Contact"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-5xl md:text-6xl text-primary",
				children: "Say hello."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-muted-foreground",
				children: "We'd love to hear from you — for orders, collaborations, or just chocolate talk."
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "container-luxe py-16 grid md:grid-cols-[1fr_1.2fr] gap-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [[
				{
					Icon: Phone,
					label: "Phone",
					value: "+91 96620 34448",
					href: "tel:+919662034448"
				},
				{
					Icon: Mail,
					label: "Email",
					value: "Chocovibes52@gmail.com",
					href: "mailto:Chocovibes52@gmail.com"
				},
				{
					Icon: MapPin,
					label: "Studio",
					value: "F9, Om Shivam Complex, nr. Gangeshwar Mahadev Mandir, Chatrapati Shivaji Nagar, Adajan Gam, Adajan, Surat, Gujarat 395009"
				}
			].map(({ Icon, label, value, href }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-4 rounded-2xl border border-border p-5 bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 16 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-primary",
					children: href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href,
						className: "hover:text-accent transition",
						children: value
					}) : value
				})] })]
			}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-[5/3] rounded-2xl overflow-hidden border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					title: "map",
					src: "https://www.google.com/maps?q=Om+Shivam+Complex+Adajan+Surat+Gujarat+395009&output=embed",
					className: "w-full h-full grayscale",
					loading: "lazy"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				setSent(true);
				toast.success("Message sent. We'll reply soon.");
			},
			className: "rounded-2xl border border-border bg-card p-8 h-fit",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl text-primary",
				children: "Send a message"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						placeholder: "Full name",
						className: "rounded-lg border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:border-accent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "email",
						placeholder: "Email",
						className: "rounded-lg border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:border-accent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						placeholder: "Subject",
						className: "rounded-lg border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:border-accent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						required: true,
						rows: 5,
						placeholder: "Your message",
						className: "rounded-lg border border-border bg-secondary px-4 py-3 text-sm resize-none focus:outline-none focus:border-accent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "btn-cocoa self-start",
						children: sent ? "Sent" : "Send message"
					})
				]
			})]
		})]
	})] });
}
//#endregion
export { Contact as component };
