import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Route } from "./policies._type-cMwidkHC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/policies._type-DVg-oOfW.js
var import_jsx_runtime = require_jsx_runtime();
function PolicyPage() {
	const { policy } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "container-luxe py-20 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "eyebrow",
				children: "Policy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-5xl text-primary",
				children: policy.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-6 text-muted-foreground leading-relaxed",
				children: policy.body.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-10 text-xs text-muted-foreground",
				children: ["Last updated: ", (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
					year: "numeric",
					month: "long"
				})]
			})
		]
	});
}
//#endregion
export { PolicyPage as component };
