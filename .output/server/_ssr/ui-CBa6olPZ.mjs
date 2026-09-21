import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-CBa6olPZ.js
var import_jsx_runtime = require_jsx_runtime();
var toneClass = {
	neutral: "bg-muted text-muted-foreground border-border",
	success: "bg-emerald-50 text-emerald-700 border-emerald-200",
	warning: "bg-amber-50 text-amber-700 border-amber-200",
	critical: "bg-red-50 text-red-700 border-red-200",
	info: "bg-sky-50 text-sky-700 border-sky-200"
};
function Badge({ children, tone = "neutral", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", toneClass[tone], className),
		children
	});
}
function statusTone(status) {
	switch (status) {
		case "paid":
		case "delivered":
		case "closed": return "success";
		case "processing":
		case "shipped":
		case "contacted": return "info";
		case "pending":
		case "new": return "warning";
		case "failed":
		case "cancelled":
		case "refunded": return "critical";
		default: return "neutral";
	}
}
function PageHeader({ title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-wrap items-start justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-semibold text-foreground",
			children: title
		}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: description
		})] }), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-2",
			children: actions
		})]
	});
}
function Card({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("admin-card", className),
		children
	});
}
function EmptyState({ title, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-6 py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-foreground",
			children: title
		}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: hint
		})]
	});
}
//#endregion
export { statusTone as a, PageHeader as i, Card as n, EmptyState as r, Badge as t };
