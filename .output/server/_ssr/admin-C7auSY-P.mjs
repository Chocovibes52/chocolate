import { r as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as supabase } from "./client-BjZKsg4o.mjs";
import { f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useAuth } from "./auth-CmWxYn5E.mjs";
import { D as Mail, M as LayoutDashboard, O as LogOut, S as Package, T as Menu, f as ShoppingBag, h as Settings, l as Store, m as ShieldAlert, n as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-C7auSY-P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useIsAdmin() {
	const { user, loading } = useAuth();
	const q = useQuery({
		queryKey: ["is-admin", user?.id],
		enabled: !!user,
		staleTime: 6e4,
		queryFn: async () => {
			const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
			if (error) throw error;
			return !!data;
		}
	});
	return {
		isAdmin: q.data === true,
		checking: loading || !!user && q.isLoading,
		user
	};
}
var nav = [
	{
		to: "/admin",
		label: "Overview",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/admin/products",
		label: "Products",
		icon: Package
	},
	{
		to: "/admin/orders",
		label: "Orders",
		icon: ShoppingBag
	},
	{
		to: "/admin/enquiries",
		label: "Corporate & B2B",
		icon: Mail
	},
	{
		to: "/admin/settings",
		label: "Settings",
		icon: Settings
	}
];
function AdminLayout() {
	const { isAdmin, checking, user } = useIsAdmin();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	if (checking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "admin-shell min-h-screen flex items-center justify-center text-sm text-muted-foreground",
		children: "Checking permissions…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "admin-shell min-h-screen flex items-center justify-center px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "admin-card w-full max-w-sm p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
					className: "mx-auto mb-4 text-muted-foreground",
					size: 36
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-semibold text-foreground",
					children: "Admin sign-in required"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 mb-6 text-sm text-muted-foreground",
					children: "Sign in with an admin account to continue."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/auth",
					className: "admin-btn-primary w-full",
					children: "Go to sign in"
				})
			]
		})
	});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "admin-shell min-h-screen flex items-center justify-center px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "admin-card w-full max-w-sm p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
					className: "mx-auto mb-4 text-destructive",
					size: 36
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-semibold text-foreground",
					children: "Access denied"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [user.email, " does not have admin permissions."]
				})
			]
		})
	});
	const initial = (user.email ?? "A").charAt(0).toUpperCase();
	const navList = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "space-y-0.5 p-3",
		children: nav.map((n) => {
			const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
			const Icon = n.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: n.to,
				onClick: () => setMobileOpen(false),
				className: `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-white/12 text-white font-medium" : "text-white/65 hover:bg-white/8 hover:text-white"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 16 }),
					" ",
					n.label
				]
			}, n.to);
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "admin-shell min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-40 flex h-14 items-center gap-3 px-4",
			style: { background: "var(--admin-topbar)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMobileOpen((v) => !v),
					className: "rounded-md p-1.5 text-white/80 hover:bg-white/10 lg:hidden",
					"aria-label": "Toggle navigation",
					children: mobileOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 18 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold tracking-tight text-white",
					children: "ChocoVibes Admin"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white sm:inline-flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { size: 14 }), " View store"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-xs text-white/60 md:inline",
							children: user.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-xs font-semibold text-white",
							children: initial
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: async () => {
								await supabase.auth.signOut();
								window.location.href = "/auth";
							},
							className: "rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white",
							"aria-label": "Sign out",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 16 })
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden w-56 shrink-0 lg:block",
					style: {
						background: "var(--admin-sidebar)",
						minHeight: "calc(100vh - 3.5rem)"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sticky top-14",
						children: navList
					})
				}),
				mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-x-0 bottom-0 top-14 z-30 lg:hidden",
					style: { background: "var(--admin-sidebar)" },
					children: navList
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-w-0 flex-1 p-4 md:p-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto max-w-6xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					})
				})
			]
		})]
	});
}
//#endregion
export { AdminLayout as component };
