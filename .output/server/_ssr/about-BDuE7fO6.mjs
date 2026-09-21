import { t as story_default } from "./story-DdBJpMLZ.mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-BDuE7fO6.js
var import_jsx_runtime = require_jsx_runtime();
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-luxe pt-20 pb-10 max-w-3xl text-center mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow",
					children: "Our Story"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-5xl md:text-6xl text-primary leading-tight",
					children: "A love letter to cacao."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-lg text-muted-foreground leading-relaxed",
					children: "ChocoVibes began in a Mumbai studio kitchen in 2019, with a single copper pot and a stubborn belief that chocolate deserved better. Today we work directly with cacao growers in the Western Ghats, tempering each batch by hand."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "container-luxe",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: story_default,
				alt: "Cacao pods and dark chocolate",
				className: "w-full rounded-2xl shadow-[var(--shadow-luxe)]"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "container-luxe py-20 grid md:grid-cols-3 gap-10",
			children: [
				{
					title: "Mission",
					body: "To make chocolate that respects the pod, the grower, and the person eating it."
				},
				{
					title: "Vision",
					body: "A world where indulgence is thoughtful, ethical, and unashamedly beautiful."
				},
				{
					title: "Quality",
					body: "Single-origin cacao, no refined sugar, cold-chain shipping. No compromises."
				}
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "eyebrow",
				children: s.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-display text-2xl text-primary leading-snug",
				children: s.body
			})] }, s.title))
		})
	] });
}
//#endregion
export { About as component };
