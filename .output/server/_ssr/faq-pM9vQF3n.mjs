import { r as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { W as ChevronDown } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-pM9vQF3n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var faqs = [
	{
		q: "Where is ChocoVibes made?",
		a: "Every batch is tempered by hand in our Mumbai studio, using cacao sourced from the Western Ghats and single-origin partners abroad."
	},
	{
		q: "How is chocolate shipped in summer?",
		a: "We ship in temperature-controlled insulated packaging from April to September, and pause dispatches during heatwaves."
	},
	{
		q: "Do you offer corporate gifting?",
		a: "Yes — visit our Corporate & B2B page to send an enquiry. We handle everything from 50 to 50,000 units with custom packaging."
	},
	{
		q: "Are your products vegan or gluten-free?",
		a: "Our dark chocolate bars are vegan; several are gluten-free. Each product page lists ingredients and allergens."
	},
	{
		q: "What is your return policy?",
		a: "We accept returns on damaged or defective items within 48 hours of delivery. See our Refund Policy for details."
	},
	{
		q: "Do you deliver internationally?",
		a: "Currently we ship across India. International shipping is in the works — join our list to be notified."
	}
];
function FAQ() {
	const [open, setOpen] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "container-luxe pt-20 text-center max-w-2xl mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "eyebrow",
			children: "Help"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-3 font-display text-5xl md:text-6xl text-primary",
			children: "Frequently asked."
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "container-luxe py-16 max-w-3xl mx-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y divide-border border-y border-border",
			children: faqs.map((f, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setOpen(open === idx ? null : idx),
				className: "w-full flex items-center justify-between py-5 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-xl text-primary",
					children: f.q
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					className: `transition ${open === idx ? "rotate-180 text-accent" : "text-muted-foreground"}`,
					size: 18
				})]
			}), open === idx && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pb-6 text-muted-foreground leading-relaxed",
				children: f.a
			})] }, idx))
		})
	})] });
}
//#endregion
export { FAQ as component };
