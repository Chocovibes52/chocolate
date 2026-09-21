import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as productsByCategoryQuery } from "./products-BrPBlLkZ.mjs";
import { t as CollectionView } from "./CollectionView-D0x8cfWP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/energy-bars-C796AnGn.js
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter = () => import("./energy-bars-CVJjHY5O.mjs");
var Route = createFileRoute("/energy-bars")({
	head: () => ({ meta: [
		{ title: "Energy Bars — ChocoVibes" },
		{
			name: "description",
			content: "Single-origin dark chocolate energy bars, hand-tempered in small batches."
		},
		{
			property: "og:title",
			content: "Energy Bars — ChocoVibes"
		},
		{
			property: "og:description",
			content: "Single-origin dark chocolate energy bars, hand-tempered in small batches."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function CategoryPage({ category, title, subtitle }) {
	const { data: all = [], isLoading } = useQuery(productsByCategoryQuery(category));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionView, {
		eyebrow: "Collection",
		title,
		subtitle,
		products: all,
		isLoading,
		showFlavour: true
	});
}
//#endregion
export { Route as n, CategoryPage as t };
