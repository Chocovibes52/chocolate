import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { i as productsQuery } from "./products-BrPBlLkZ.mjs";
import { t as CollectionView } from "./CollectionView-D0x8cfWP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-d5A-Ru0e.js
var import_jsx_runtime = require_jsx_runtime();
function ShopPage() {
	const { data: all = [], isLoading } = useQuery(productsQuery());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionView, {
		eyebrow: "Shop",
		title: "The Full Collection",
		subtitle: "Browse every ChocoVibes creation — filter by dark, milk, or white to find your favourite.",
		products: all,
		isLoading,
		showFlavour: true
	});
}
//#endregion
export { ShopPage as component };
