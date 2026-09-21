globalThis.__nitro_main__ = import.meta.url;
import { i as serve, r as NodeResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
import { a as defineLazyEventHandler, i as defineHandler, n as HTTPError, o as toEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/account-CcgTb1HU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a12-BmpZI1lcwynYG1YzfbDdr19dPV4\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 2578,
		"path": "../public/assets/account-CcgTb1HU.js"
	},
	"/assets/admin-CjO0o1x9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1823-XmyGPw2B7WbP4Un8Dpyb8KTU9aw\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 6179,
		"path": "../public/assets/admin-CjO0o1x9.js"
	},
	"/assets/admin.enquiries-WtaQDYbj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"892-hvWyyaBDGxd5+AUAF0v3/3vhIMY\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 2194,
		"path": "../public/assets/admin.enquiries-WtaQDYbj.js"
	},
	"/assets/admin.index-CcXDXn8q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15bd-LQZ/znJos371XzHHdqovXmA6DkQ\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 5565,
		"path": "../public/assets/admin.index-CcXDXn8q.js"
	},
	"/assets/admin.orders-CNhgGhXr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19a5-joZx7KKTbK+w0Fvy9SqzcSOaiG0\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 6565,
		"path": "../public/assets/admin.orders-CNhgGhXr.js"
	},
	"/assets/admin.products-Bobcbimu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c5e-lMSVwwWLj0ToB+BWKmxv4LNhm3w\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 15454,
		"path": "../public/assets/admin.products-Bobcbimu.js"
	},
	"/assets/admin.settings-BIe8J3De.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"264a-xlybzWsTa3lOKUm8bSA/nAGbaxs\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 9802,
		"path": "../public/assets/admin.settings-BIe8J3De.js"
	},
	"/assets/arrow-right-z4wMTEv0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-LxZSlUwVPz7uETygC2DlVre4MBw\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 165,
		"path": "../public/assets/arrow-right-z4wMTEv0.js"
	},
	"/assets/auth-DI2pA4_1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21f7-A9w6ChVEbyw4Y/h9tRwpRiTI3b4\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 8695,
		"path": "../public/assets/auth-DI2pA4_1.js"
	},
	"/assets/bar-1-CBS57mYT.jpg": {
		"type": "image/jpeg",
		"etag": "\"d1a3-+WACQ3fCr8XXRbInPVqpbP9Rz1w\"",
		"mtime": "2026-09-18T11:54:04.926Z",
		"size": 53667,
		"path": "../public/assets/bar-1-CBS57mYT.jpg"
	},
	"/assets/about-D4ek0uQh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"614-44u8t93dPtLWYI0n3Jc0sLN1oXY\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 1556,
		"path": "../public/assets/about-D4ek0uQh.js"
	},
	"/assets/b2b-c5Cm5MSG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1763-5kyeWHcvfjJGkusmGK+GrVcm2rE\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 5987,
		"path": "../public/assets/b2b-c5Cm5MSG.js"
	},
	"/assets/bar-2-BJjsi9V5.jpg": {
		"type": "image/jpeg",
		"etag": "\"e57d-Z9D/+FYOsQvMhUW67b3iXc4ZJ1E\"",
		"mtime": "2026-09-18T11:54:04.926Z",
		"size": 58749,
		"path": "../public/assets/bar-2-BJjsi9V5.jpg"
	},
	"/assets/checkout-BX8mmMqs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1591-h/d1ipE1OzfbfF64GPj/p+sWbIw\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 5521,
		"path": "../public/assets/checkout-BX8mmMqs.js"
	},
	"/assets/chevron-right-BcvlbBXJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-aYWASeFIdCzi/FIKV6JizCzYzgc\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 130,
		"path": "../public/assets/chevron-right-BcvlbBXJ.js"
	},
	"/assets/cart-context-BUkvcjip.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"420-2ce3ESZsGOV8aPTgVg0dGfqCV0I\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 1056,
		"path": "../public/assets/cart-context-BUkvcjip.js"
	},
	"/assets/bar-3-ClerG5C8.jpg": {
		"type": "image/jpeg",
		"etag": "\"253c3-2GqAndrICkklS/qMnpZz/zKUMQY\"",
		"mtime": "2026-09-18T11:54:04.926Z",
		"size": 152515,
		"path": "../public/assets/bar-3-ClerG5C8.jpg"
	},
	"/assets/contact-BFgAFWig.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e22-M9ViygMUfU3vhg1wvxJdT4kN8x0\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 3618,
		"path": "../public/assets/contact-BFgAFWig.js"
	},
	"/assets/cart-Bq5WPsku.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cef-lJUlosdEJ4E4K4hHjR4bdePnZbs\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 3311,
		"path": "../public/assets/cart-Bq5WPsku.js"
	},
	"/assets/createLucideIcon-woUNXNh4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4c7-PGRvGFSnsCv6JoUHYljAGA899Qs\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 1223,
		"path": "../public/assets/createLucideIcon-woUNXNh4.js"
	},
	"/assets/bar-4-DSl79d8f.jpg": {
		"type": "image/jpeg",
		"etag": "\"19afa-te87mB/M1DGgxHIFJNR/Z23PkIk\"",
		"mtime": "2026-09-18T11:54:04.926Z",
		"size": 105210,
		"path": "../public/assets/bar-4-DSl79d8f.jpg"
	},
	"/assets/chevron-left-DfG-a7a8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-JR/cpY1tKlbFn+Cm9fAYtdntwuc\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 130,
		"path": "../public/assets/chevron-left-DfG-a7a8.js"
	},
	"/assets/dist-BbjFM9Ac.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7f5d-yJzNAeJRv6l2myar9ThUKUxZLMk\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 32605,
		"path": "../public/assets/dist-BbjFM9Ac.js"
	},
	"/assets/client-BcdkIOkq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"321b6-Ir46WwzrGZAs03DAOEICtu9WzWc\"",
		"mtime": "2026-09-18T11:54:04.924Z",
		"size": 205238,
		"path": "../public/assets/client-BcdkIOkq.js"
	},
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"d8535-je1DWCmoc4HH8aYli1vfuSSRtFA\"",
		"mtime": "2026-09-18T11:54:06.668Z",
		"size": 886069,
		"path": "../public/favicon.png"
	},
	"/assets/energy-bars-mUvrDClt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1dd-FIRZba0R7QtXZiPlKWIL7BL2lsI\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 477,
		"path": "../public/assets/energy-bars-mUvrDClt.js"
	},
	"/assets/hamper-2-Bch0DBMv.jpg": {
		"type": "image/jpeg",
		"etag": "\"1730d-MQ4fpHHi/AuxCRsbpxfxhIF0KOg\"",
		"mtime": "2026-09-18T11:54:04.926Z",
		"size": 94989,
		"path": "../public/assets/hamper-2-Bch0DBMv.jpg"
	},
	"/assets/hero-1-Ceb1H20E.jpg": {
		"type": "image/jpeg",
		"etag": "\"4fd56-NGaP77ZEFcnAD2hfsN0QMoWSxvs\"",
		"mtime": "2026-09-18T11:54:04.926Z",
		"size": 326998,
		"path": "../public/assets/hero-1-Ceb1H20E.jpg"
	},
	"/assets/hamper-3-asWrAb3_.jpg": {
		"type": "image/jpeg",
		"etag": "\"22089-AkY9H+7sS0hICGcu97V3sG3y9lw\"",
		"mtime": "2026-09-18T11:54:04.926Z",
		"size": 139401,
		"path": "../public/assets/hamper-3-asWrAb3_.jpg"
	},
	"/assets/faq-_4cElCIb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"87a-77eWTCIohljBXvCfjMa7mpblBH4\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 2170,
		"path": "../public/assets/faq-_4cElCIb.js"
	},
	"/assets/hero-2-BYMrGjPw.jpg": {
		"type": "image/jpeg",
		"etag": "\"3b9c7-V32MXWhtTLY59jeCcvdTBWyaKTg\"",
		"mtime": "2026-09-18T11:54:04.927Z",
		"size": 244167,
		"path": "../public/assets/hero-2-BYMrGjPw.jpg"
	},
	"/assets/gift-hampers-xmoFERsi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fe-3zSVY/iU9mUzwBnsNHq5KOYZTa0\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 254,
		"path": "../public/assets/gift-hampers-xmoFERsi.js"
	},
	"/assets/hamper-1-DL8Om9SX.jpg": {
		"type": "image/jpeg",
		"etag": "\"1c655-bMTuuA463gPQbin7+8GHfUjBvdw\"",
		"mtime": "2026-09-18T11:54:04.926Z",
		"size": 116309,
		"path": "../public/assets/hamper-1-DL8Om9SX.jpg"
	},
	"/assets/jsx-runtime-DGeXAQPT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3ab-mgnSm9dUpwL2+z7tKxJ2MsN0fOM\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 939,
		"path": "../public/assets/jsx-runtime-DGeXAQPT.js"
	},
	"/assets/link-VJxGzH-I.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b6d-up41CdcoulQcuMYjk1JoTOSbqqo\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 23405,
		"path": "../public/assets/link-VJxGzH-I.js"
	},
	"/assets/log-out-D3rdryVR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-v36WtgZZFbydwDBRwLe/DcvRSF4\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 230,
		"path": "../public/assets/log-out-D3rdryVR.js"
	},
	"/assets/mail-Bk51HHzF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d5-Z0Lah7ZNSir7phybIUpP81Bj0bQ\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 213,
		"path": "../public/assets/mail-Bk51HHzF.js"
	},
	"/assets/minus-D6uXiEWZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75-i0PnlnvSWCBkYWCWHtAvq8MBKBY\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 117,
		"path": "../public/assets/minus-D6uXiEWZ.js"
	},
	"/assets/not-found-i5RsCZif.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-Trmr7GZIBZuvfg4uM18tBiRtOXg\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 118,
		"path": "../public/assets/not-found-i5RsCZif.js"
	},
	"/assets/package-KtpvhgCp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"174-2hDbTYYU0D4XdHfMhyJdptcEhyA\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 372,
		"path": "../public/assets/package-KtpvhgCp.js"
	},
	"/assets/plus-8s7MmOUJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-lhLiS22oozE7Z2yLtI3wU3Dtyx0\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 153,
		"path": "../public/assets/plus-8s7MmOUJ.js"
	},
	"/assets/preload-helper-Czpn1I53.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ac-sE+5KsaRXTMfwOfrOATQajMSGV4\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 1196,
		"path": "../public/assets/preload-helper-Czpn1I53.js"
	},
	"/assets/products._slug-WoDGfKXs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1355-3FF5xqntGu8FtY1VfKnNWpqC+t0\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 4949,
		"path": "../public/assets/products._slug-WoDGfKXs.js"
	},
	"/assets/react-dom-D15Ble1V.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"df6-fAdQkk3pLH4opgU0lDZCpQ73UeA\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 3574,
		"path": "../public/assets/react-dom-D15Ble1V.js"
	},
	"/assets/routes-DSMbV2oY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c90-r15YLo0w7e0dJo0n4F5ElG8tfgI\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 11408,
		"path": "../public/assets/routes-DSMbV2oY.js"
	},
	"/assets/shop-DxgAIMUp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"181-awavkps+J21vdhQB+PnDNjU9oFY\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 385,
		"path": "../public/assets/shop-DxgAIMUp.js"
	},
	"/assets/index-Cex3M2RF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e143-ESp7c+YFHLGvrf2LMwSz37K33pA\"",
		"mtime": "2026-09-18T11:54:04.923Z",
		"size": 385347,
		"path": "../public/assets/index-Cex3M2RF.js"
	},
	"/assets/react-BhjfaixL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d67-ILwtLUZqgkiC+EEZftFz3Q3TNqQ\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 7527,
		"path": "../public/assets/react-BhjfaixL.js"
	},
	"/assets/policies._type-DV1RhSpi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-Agaw+LZo9oINgHRdlmr0IcbrgA0\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 694,
		"path": "../public/assets/policies._type-DV1RhSpi.js"
	},
	"/assets/shopping-bag-BE7vBbjL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"154-bzTfEFw+6v53zmm862/VRHaSFCE\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 340,
		"path": "../public/assets/shopping-bag-BE7vBbjL.js"
	},
	"/assets/story-0aIMrKZE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32-QVfWUVhhk/DVE42a7DcxS5w8XmM\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 50,
		"path": "../public/assets/story-0aIMrKZE.js"
	},
	"/assets/story-Csk-Vu3A.jpg": {
		"type": "image/jpeg",
		"etag": "\"3564c-M5p9CmhN1uSbOhzrkGrlLXkzMHo\"",
		"mtime": "2026-09-18T11:54:04.927Z",
		"size": 218700,
		"path": "../public/assets/story-Csk-Vu3A.jpg"
	},
	"/assets/trash-2-CI3HQOK1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-Jo3+jzNAK74NM4Y+yoWKXEaUYYo\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 328,
		"path": "../public/assets/trash-2-CI3HQOK1.js"
	},
	"/assets/ui-3OsJERRY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"668-88B7+n56XUk1dkthO92tXjdT1OM\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 1640,
		"path": "../public/assets/ui-3OsJERRY.js"
	},
	"/assets/truck-GM8A9bZJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"196-yXX1Zk+aswdOVUw5qGKrddg6EFg\"",
		"mtime": "2026-09-18T11:54:04.925Z",
		"size": 406,
		"path": "../public/assets/truck-GM8A9bZJ.js"
	},
	"/assets/useMatch-Bt7REY-j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"498-VX8zi15POF/dhe8pq1u37jBpmU0\"",
		"mtime": "2026-09-18T11:54:04.926Z",
		"size": 1176,
		"path": "../public/assets/useMatch-Bt7REY-j.js"
	},
	"/brand/chocovibes-logo.png": {
		"type": "image/png",
		"etag": "\"21919-Sir03kWK8L5xaiSYVGfpemtaDQw\"",
		"mtime": "2026-09-18T11:54:06.666Z",
		"size": 137497,
		"path": "../public/brand/chocovibes-logo.png"
	},
	"/catalog/cv-12.webp": {
		"type": "image/webp",
		"etag": "\"daee-0bbuHZZUsP5pUtbWQEuhxScAbwU\"",
		"mtime": "2026-09-18T11:54:06.666Z",
		"size": 56046,
		"path": "../public/catalog/cv-12.webp"
	},
	"/catalog/cv-13.webp": {
		"type": "image/webp",
		"etag": "\"19fce-/P6MaDk6toByBviBgGUy0YncXog\"",
		"mtime": "2026-09-18T11:54:06.666Z",
		"size": 106446,
		"path": "../public/catalog/cv-13.webp"
	},
	"/catalog/cv-14.webp": {
		"type": "image/webp",
		"etag": "\"fb96-CG78nhjc7kJZ0XwAS5fijgh21qk\"",
		"mtime": "2026-09-18T11:54:06.669Z",
		"size": 64406,
		"path": "../public/catalog/cv-14.webp"
	},
	"/catalog/cv-15.webp": {
		"type": "image/webp",
		"etag": "\"19d34-EGotkoqdwTf0fagNmUEox8eSbNY\"",
		"mtime": "2026-09-18T11:54:06.666Z",
		"size": 105780,
		"path": "../public/catalog/cv-15.webp"
	},
	"/catalog/cv-16.webp": {
		"type": "image/webp",
		"etag": "\"1457a-CyAdolK67+As4tkfL3BeUqEsiks\"",
		"mtime": "2026-09-18T11:54:06.667Z",
		"size": 83322,
		"path": "../public/catalog/cv-16.webp"
	},
	"/catalog/cv-17.webp": {
		"type": "image/webp",
		"etag": "\"19c3e-Bj+81E3/W7GzncnXRdlYLbNWQ14\"",
		"mtime": "2026-09-18T11:54:06.667Z",
		"size": 105534,
		"path": "../public/catalog/cv-17.webp"
	},
	"/catalog/cv-18.webp": {
		"type": "image/webp",
		"etag": "\"1dd3a-Rp9h0e1h7k0TvJz0B8HPiBv+oP0\"",
		"mtime": "2026-09-18T11:54:06.667Z",
		"size": 122170,
		"path": "../public/catalog/cv-18.webp"
	},
	"/catalog/cv-21.webp": {
		"type": "image/webp",
		"etag": "\"14a1a-ZTE/hxt3qIwnx3HevGfi67GnqIc\"",
		"mtime": "2026-09-18T11:54:06.667Z",
		"size": 84506,
		"path": "../public/catalog/cv-21.webp"
	},
	"/catalog/doc-1.jpg": {
		"type": "image/jpeg",
		"etag": "\"1d50e-JJ0OnMO8UIC+VswHyxArWpcis6I\"",
		"mtime": "2026-09-18T11:54:06.667Z",
		"size": 120078,
		"path": "../public/catalog/doc-1.jpg"
	},
	"/catalog/doc-2.jpg": {
		"type": "image/jpeg",
		"etag": "\"1c478-J/hzBQdGi3bYxgCdLF4RuLB6z2g\"",
		"mtime": "2026-09-18T11:54:06.667Z",
		"size": 115832,
		"path": "../public/catalog/doc-2.jpg"
	},
	"/catalog/doc-3.jpg": {
		"type": "image/jpeg",
		"etag": "\"ebdc-PXNinacdJZ9ZwOM5tdK/q2n6DuQ\"",
		"mtime": "2026-09-18T11:54:06.667Z",
		"size": 60380,
		"path": "../public/catalog/doc-3.jpg"
	},
	"/catalog/doc-4.jpg": {
		"type": "image/jpeg",
		"etag": "\"21e44-D0m1SYuMDBBzKoFhPNjbIfEymqw\"",
		"mtime": "2026-09-18T11:54:06.668Z",
		"size": 138820,
		"path": "../public/catalog/doc-4.jpg"
	},
	"/catalog/doc-5.jpg": {
		"type": "image/jpeg",
		"etag": "\"9b4a-hpGdlc05mF+PRhw61M+1X+F7h7o\"",
		"mtime": "2026-09-18T11:54:06.669Z",
		"size": 39754,
		"path": "../public/catalog/doc-5.jpg"
	},
	"/catalog/doc-6.jpg": {
		"type": "image/jpeg",
		"etag": "\"1b5ef-SePLYs3iMGa4AXnwcNRT2RsI9Ww\"",
		"mtime": "2026-09-18T11:54:06.668Z",
		"size": 112111,
		"path": "../public/catalog/doc-6.jpg"
	},
	"/catalog/nutella-chocolate.jpg": {
		"type": "image/jpeg",
		"etag": "\"1c10c-YqyJ+LsFeyEk78PMxk2PEdsvK0o\"",
		"mtime": "2026-09-18T11:54:06.668Z",
		"size": 114956,
		"path": "../public/catalog/nutella-chocolate.jpg"
	},
	"/assets/styles-XrTDHg1K.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"196cf-fYa5jnXyEQ/JVokUdAn/OoeInLk\"",
		"mtime": "2026-09-18T11:54:04.927Z",
		"size": 104143,
		"path": "../public/assets/styles-XrTDHg1K.css"
	},
	"/brand/chocovibes-mark.png": {
		"type": "image/png",
		"etag": "\"d8535-je1DWCmoc4HH8aYli1vfuSSRtFA\"",
		"mtime": "2026-09-18T11:54:06.667Z",
		"size": 886069,
		"path": "../public/brand/chocovibes-mark.png"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_6qWkqV = defineLazyEventHandler(() => import("./_chunks/renderer-template.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_6qWkqV
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
