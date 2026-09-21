import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { r as productsByCategoryQuery } from "./products-BrPBlLkZ.mjs";
import { t as CollectionView } from "./CollectionView-D0x8cfWP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/energy-bars-CVJjHY5O.js
var import_jsx_runtime = require_jsx_runtime();
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
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryPage, {
	category: "energy-bars",
	title: "Energy Bars",
	subtitle: "Clean fuel, deep chocolate. Small-batch craftsmanship in every bite."
});
//#endregion
export { CategoryPage, SplitComponent as component };
