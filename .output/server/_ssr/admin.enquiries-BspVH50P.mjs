import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-BjZKsg4o.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as statusTone, i as PageHeader, n as Card, r as EmptyState, t as Badge } from "./ui-CBa6olPZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.enquiries-BspVH50P.js
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"new",
	"contacted",
	"qualified",
	"closed"
];
function AdminEnquiries() {
	const qc = useQueryClient();
	const { data } = useQuery({
		queryKey: ["admin-enquiries"],
		queryFn: async () => {
			const { data, error } = await supabase.from("b2b_enquiries").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	async function updateStatus(id, status) {
		const { error } = await supabase.from("b2b_enquiries").update({ status }).eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Updated");
		qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Corporate & B2B Enquiries",
		description: "Review bulk and corporate gifting leads."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [(data ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-base font-semibold text-foreground",
							children: e.company
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: statusTone(e.status),
							children: e.status
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							e.contact_person,
							" · ",
							e.email,
							" · ",
							e.phone
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: [
							e.business_type && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								"Type: ",
								e.business_type,
								" · "
							] }),
							e.city && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								"City: ",
								e.city,
								" · "
							] }),
							e.quantity && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								"Qty: ",
								e.quantity,
								" · "
							] }),
							new Date(e.created_at).toLocaleString()
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: e.status,
					onChange: (ev) => updateStatus(e.id, ev.target.value),
					className: "admin-input w-auto py-1 text-xs",
					children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s,
						children: s
					}, s))
				})]
			}), e.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 whitespace-pre-wrap text-sm text-foreground/80",
				children: e.message
			})]
		}, e.id)), data && data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No enquiries yet",
			hint: "Submissions from the Corporate & B2B form appear here."
		}) })]
	})] });
}
//#endregion
export { AdminEnquiries as component };
