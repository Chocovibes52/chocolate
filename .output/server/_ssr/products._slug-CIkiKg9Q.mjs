import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products._slug-CIkiKg9Q.js
var $$splitComponentImporter = () => import("./products._slug-BWDloJos.mjs");
var Route = createFileRoute("/products/$slug")({
	head: () => ({ meta: [{ title: "Product — ChocoVibes" }, {
		name: "description",
		content: "Discover artisan chocolate crafted with obsession."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
