import { r as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime, n as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as useCart, t as CartProvider } from "./cart-context-D3LdUJnQ.mjs";
import { _ as require_react_dom, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as useAuth, t as AuthProvider } from "./auth-CmWxYn5E.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { K as ArrowUp, N as Instagram, R as Facebook, a as Twitter, f as ShoppingBag, g as Search, r as User, t as Youtube, w as MessageCircle } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as Route$18 } from "./energy-bars-C796AnGn.mjs";
import { t as Route$19 } from "./policies._type-cMwidkHC.mjs";
import { t as Route$20 } from "./products._slug-CIkiKg9Q.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C8nM-elv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
var styles_default = "/assets/styles-XrTDHg1K.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var logo$1 = { url: "/brand/chocovibes-mark.png" };
function Header() {
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const { count } = useCart();
	const { user } = useAuth();
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const closeOnEscape = (event) => {
			if (event.key === "Escape") setOpen(false);
		};
		const closeAtDesktop = window.matchMedia("(min-width: 768px)");
		const handleDesktopChange = (event) => {
			if (event.matches) setOpen(false);
		};
		document.addEventListener("keydown", closeOnEscape);
		closeAtDesktop.addEventListener("change", handleDesktopChange);
		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", closeOnEscape);
			closeAtDesktop.removeEventListener("change", handleDesktopChange);
		};
	}, [open]);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	const nav = [
		{
			to: "/shop",
			label: "Shop"
		},
		{
			to: "/energy-bars",
			label: "Energy Bars"
		},
		{
			to: "/gift-hampers",
			label: "Gift Hampers"
		},
		{
			to: "/b2b",
			label: "Corporate & B2B"
		},
		{
			to: "/about",
			label: "Our Story"
		},
		{
			to: "/contact",
			label: "Contact"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: `sticky top-0 z-[100] transition-all duration-500 ${scrolled ? "bg-background/90 backdrop-blur border-b border-border shadow-sm" : "bg-background/60 backdrop-blur-sm"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-luxe flex items-center justify-between h-16 md:h-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					className: "relative z-10 min-h-11 min-w-11 text-primary hover:bg-muted md:hidden",
					onClick: () => setOpen((current) => !current),
					"aria-label": open ? "Close navigation menu" : "Open navigation menu",
					"aria-expanded": open,
					"aria-controls": "mobile-navigation",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative block h-5 w-5",
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute left-0 top-1 h-0.5 w-5 bg-current transition-transform duration-250 ${open ? "translate-y-1.5 rotate-45" : ""}` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute left-0 top-2.5 h-0.5 w-5 bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute left-0 top-4 h-0.5 w-5 bg-current transition-transform duration-250 ${open ? "-translate-y-1.5 -rotate-45" : ""}` })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex items-center gap-2 group",
					"aria-label": "ChocoVibes home",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: logo$1.url,
						alt: "ChocoVibes",
						className: "h-10 md:h-12 w-auto"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden md:flex items-center gap-8",
					children: nav.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: n.to,
						className: "gold-underline text-[0.78rem] uppercase tracking-[0.18em] text-primary/80 hover:text-primary transition",
						activeProps: { className: "text-primary" },
						children: n.label
					}, n.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 text-primary",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": "Search",
							className: "hidden sm:block hover:text-accent transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 18 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: user ? "/account" : "/auth",
							"aria-label": "Account",
							className: "hover:text-accent transition relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { size: 18 }), user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-accent" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/cart",
							"aria-label": "Cart",
							className: "relative hover:text-accent transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { size: 18 }), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -top-2 -right-2 min-w-4 h-4 px-1 text-[10px] rounded-full bg-accent text-accent-foreground flex items-center justify-center font-medium",
								children: count
							})]
						})
					]
				})
			]
		}), mounted && (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `fixed inset-x-0 bottom-0 top-16 z-[90] md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`,
			"aria-hidden": !open,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				"aria-label": "Close navigation menu",
				tabIndex: open ? 0 : -1,
				onClick: () => setOpen(false),
				className: `absolute inset-0 h-full w-full rounded-none bg-primary/20 p-0 backdrop-blur-[2px] transition-opacity duration-250 hover:bg-primary/20 ${open ? "opacity-100" : "opacity-0"}`
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				id: "mobile-navigation",
				"aria-label": "Mobile navigation",
				className: `absolute inset-x-0 top-0 max-h-full overflow-y-auto overscroll-contain border-t border-border bg-background shadow-luxe transition-[transform,opacity] duration-250 ease-out ${open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container-luxe py-4",
					children: [nav.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: n.to,
						tabIndex: open ? 0 : -1,
						onClick: () => setOpen(false),
						className: "flex min-h-14 items-center border-b border-border font-display text-2xl text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
						activeProps: { className: "text-accent" },
						children: n.label
					}, n.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: user ? "/account" : "/auth",
						tabIndex: open ? 0 : -1,
						onClick: () => setOpen(false),
						className: "flex min-h-14 items-center font-display text-2xl text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
						children: user ? "Account" : "Sign in"
					})]
				})
			})]
		}), document.body)]
	});
}
var logo = { url: "/brand/chocovibes-mark.png" };
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-24 bg-primary text-primary-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-luxe py-16 grid gap-12 md:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: logo.url,
						alt: "ChocoVibes",
						className: "h-16 w-auto bg-primary-foreground rounded-lg p-2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-primary-foreground/70 leading-relaxed max-w-xs",
						children: "Small-batch, single-origin chocolate crafted with obsession. Ethically sourced, elegantly made."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 flex gap-4",
						children: [
							Instagram,
							Facebook,
							Twitter,
							Youtube
						].map((I, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							"aria-label": "social",
							className: "text-primary-foreground/70 hover:text-accent transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { size: 18 })
						}, i))
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow mb-4",
					children: "Shop"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/energy-bars",
							className: "hover:text-accent transition",
							children: "Energy Bars"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/gift-hampers",
							className: "hover:text-accent transition",
							children: "Gift Hampers"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/b2b",
							className: "hover:text-accent transition",
							children: "Corporate & B2B"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow mb-4",
					children: "Company"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/about",
							className: "hover:text-accent transition",
							children: "Our Story"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							className: "hover:text-accent transition",
							children: "Contact"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/faq",
							className: "hover:text-accent transition",
							children: "FAQ"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/policies/$type",
							params: { type: "shipping" },
							className: "hover:text-accent transition",
							children: "Shipping"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow mb-4",
					children: "Get in touch"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm text-primary-foreground/80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "mailto:Chocovibes52@gmail.com",
							className: "hover:text-accent transition",
							children: "Chocovibes52@gmail.com"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "tel:+919662034448",
							className: "hover:text-accent transition",
							children: "+91 96620 34448"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"F9, Om Shivam Complex,",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"nr. Gangeshwar Mahadev Mandir,",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Chatrapati Shivaji Nagar, Adajan Gam,",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Adajan, Surat, Gujarat 395009"
						] })
					]
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-primary-foreground/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-luxe py-6 flex flex-col sm:flex-row gap-3 justify-between text-xs text-primary-foreground/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ChocoVibes. All rights reserved."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/policies/$type",
							params: { type: "privacy" },
							className: "hover:text-accent",
							children: "Privacy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/policies/$type",
							params: { type: "terms" },
							className: "hover:text-accent",
							children: "Terms"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/policies/$type",
							params: { type: "refund" },
							className: "hover:text-accent",
							children: "Refund"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/policies/$type",
							params: { type: "shipping" },
							className: "hover:text-accent",
							children: "Shipping"
						})
					]
				})]
			})
		})]
	});
}
function FloatingButtons() {
	const [show, setShow] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const on = () => setShow(window.scrollY > 500);
		on();
		window.addEventListener("scroll", on, { passive: true });
		return () => window.removeEventListener("scroll", on);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-5 right-5 z-40 flex flex-col gap-3",
		children: [show && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => window.scrollTo({
				top: 0,
				behavior: "smooth"
			}),
			className: "w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition animate-fade-up",
			"aria-label": "Back to top",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { size: 18 })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: "https://wa.me/919662034448",
			target: "_blank",
			rel: "noreferrer",
			className: "w-12 h-12 rounded-full bg-[oklch(0.72_0.16_150)] text-white shadow-lg flex items-center justify-center hover:scale-105 transition",
			"aria-label": "WhatsApp",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { size: 20 })
		})]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$17 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ChocoVibes — Artisan Chocolate Energy Bars & Gift Hampers" },
			{
				name: "description",
				content: "Small-batch, single-origin chocolate crafted with obsession. Shop premium energy bars, curated gift hampers, and corporate gifting."
			},
			{
				property: "og:title",
				content: "ChocoVibes — Artisan Chocolate"
			},
			{
				property: "og:description",
				content: "Small-batch, single-origin chocolate. Premium energy bars and gift hampers."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$17.useRouteContext();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CartProvider, { children: [
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingButtons, {}),
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				richColors: true,
				position: "top-center"
			})
		] }) })
	});
}
var $$splitComponentImporter$16 = () => import("./routes-DqlE2Kti.mjs");
var Route$16 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "ChocoVibes — Artisan Chocolate Energy Bars & Gift Hampers" },
		{
			name: "description",
			content: "Small-batch dark chocolate, single-origin cacao, and hand-finished gift hampers. Delivered across India."
		},
		{
			property: "og:title",
			content: "ChocoVibes — Artisan Chocolate"
		},
		{
			property: "og:description",
			content: "Small-batch dark chocolate, single-origin cacao, and hand-finished gift hampers."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./about-BDuE7fO6.mjs");
var Route$15 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "Our Story — ChocoVibes" },
		{
			name: "description",
			content: "The story, mission, and quality commitment behind ChocoVibes chocolate."
		},
		{
			property: "og:title",
			content: "Our Story — ChocoVibes"
		},
		{
			property: "og:description",
			content: "The story, mission, and quality commitment behind ChocoVibes."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./account-BihPRros.mjs");
var Route$14 = createFileRoute("/account")({
	head: () => ({ meta: [{ title: "Account — ChocoVibes" }, {
		name: "description",
		content: "Manage your ChocoVibes account and view orders."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./admin-C7auSY-P.mjs");
var Route$13 = createFileRoute("/admin")({
	head: () => ({ meta: [
		{ title: "Admin Dashboard — ChocoVibes" },
		{
			name: "description",
			content: "ChocoVibes admin dashboard"
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./auth-D1xsLKtW.mjs");
var Route$12 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in — ChocoVibes" }, {
		name: "description",
		content: "Sign in or create your ChocoVibes account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./b2b-D7iURYQ9.mjs");
var Route$11 = createFileRoute("/b2b")({
	head: () => ({ meta: [
		{ title: "Corporate & B2B — ChocoVibes" },
		{
			name: "description",
			content: "Wholesale, bulk orders, private label and corporate gifting from ChocoVibes."
		},
		{
			property: "og:title",
			content: "Corporate & B2B — ChocoVibes"
		},
		{
			property: "og:description",
			content: "Wholesale, bulk orders, private label and corporate gifting."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./cart-Pr7Bjqx4.mjs");
var Route$10 = createFileRoute("/cart")({
	head: () => ({ meta: [{ title: "Your Cart — ChocoVibes" }, {
		name: "description",
		content: "Review your ChocoVibes cart before checkout."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./checkout-CzrkmTf8.mjs");
var Route$9 = createFileRoute("/checkout")({
	head: () => ({ meta: [{ title: "Checkout — ChocoVibes" }, {
		name: "description",
		content: "Complete your ChocoVibes order."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./contact-Ck_iCPyM.mjs");
var Route$8 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact — ChocoVibes" },
		{
			name: "description",
			content: "Get in touch with the ChocoVibes studio."
		},
		{
			property: "og:title",
			content: "Contact — ChocoVibes"
		},
		{
			property: "og:description",
			content: "Get in touch with the ChocoVibes studio."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./faq-pM9vQF3n.mjs");
var Route$7 = createFileRoute("/faq")({
	head: () => ({ meta: [
		{ title: "FAQ — ChocoVibes" },
		{
			name: "description",
			content: "Answers to common questions about ChocoVibes chocolate, shipping and gifting."
		},
		{
			property: "og:title",
			content: "FAQ — ChocoVibes"
		},
		{
			property: "og:description",
			content: "Answers to common questions about ChocoVibes."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./gift-hampers-Cd8CR0DQ.mjs");
var Route$6 = createFileRoute("/gift-hampers")({
	head: () => ({ meta: [
		{ title: "Gift Hampers — ChocoVibes" },
		{
			name: "description",
			content: "Curated chocolate hampers, hand-tied in silk. Corporate and personal gifting."
		},
		{
			property: "og:title",
			content: "Gift Hampers — ChocoVibes"
		},
		{
			property: "og:description",
			content: "Curated chocolate hampers, hand-tied in silk. Corporate and personal gifting."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./shop-d5A-Ru0e.mjs");
var Route$5 = createFileRoute("/shop")({
	head: () => ({ meta: [
		{ title: "Shop All Chocolates — ChocoVibes" },
		{
			name: "description",
			content: "Shop the full ChocoVibes collection — dark, milk, and white chocolate creations, hand-tempered in small batches."
		},
		{
			property: "og:title",
			content: "Shop All Chocolates — ChocoVibes"
		},
		{
			property: "og:description",
			content: "Shop the full ChocoVibes collection — dark, milk, and white chocolate creations."
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
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.index-Dpr1zcpp.mjs");
var Route$4 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./admin.enquiries-BspVH50P.mjs");
var Route$3 = createFileRoute("/admin/enquiries")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.orders-Cn0uIe47.mjs");
var Route$2 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.products-BCl2t6rC.mjs");
var Route$1 = createFileRoute("/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin.settings-36kLn-PW.mjs");
var Route = createFileRoute("/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$16.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$17
});
var AboutRoute = Route$15.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$17
});
var AccountRoute = Route$14.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$17
});
var AdminRoute = Route$13.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$17
});
var AuthRoute = Route$12.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$17
});
var B2bRoute = Route$11.update({
	id: "/b2b",
	path: "/b2b",
	getParentRoute: () => Route$17
});
var CartRoute = Route$10.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$17
});
var CheckoutRoute = Route$9.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$17
});
var ContactRoute = Route$8.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$17
});
var EnergyBarsRoute = Route$18.update({
	id: "/energy-bars",
	path: "/energy-bars",
	getParentRoute: () => Route$17
});
var FaqRoute = Route$7.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$17
});
var GiftHampersRoute = Route$6.update({
	id: "/gift-hampers",
	path: "/gift-hampers",
	getParentRoute: () => Route$17
});
var ShopRoute = Route$5.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$17
});
var AdminIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminEnquiriesRoute = Route$3.update({
	id: "/enquiries",
	path: "/enquiries",
	getParentRoute: () => AdminRoute
});
var AdminOrdersRoute = Route$2.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRoute
});
var AdminProductsRoute = Route$1.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var PoliciesTypeRoute = Route$19.update({
	id: "/policies/$type",
	path: "/policies/$type",
	getParentRoute: () => Route$17
});
var ProductsSlugRoute = Route$20.update({
	id: "/products/$slug",
	path: "/products/$slug",
	getParentRoute: () => Route$17
});
var AdminRouteChildren = {
	AdminEnquiriesRoute,
	AdminOrdersRoute,
	AdminProductsRoute,
	AdminSettingsRoute,
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AccountRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	AuthRoute,
	B2bRoute,
	CartRoute,
	CheckoutRoute,
	ContactRoute,
	EnergyBarsRoute,
	FaqRoute,
	GiftHampersRoute,
	ShopRoute,
	PoliciesTypeRoute,
	ProductsSlugRoute
};
var routeTree = Route$17._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
