import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Mail,
  LogOut,
  ShieldAlert,
  Settings,
  Store,
  Menu,
  X,
} from "lucide-react";
import { useIsAdmin } from "@/lib/use-admin";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — ChocoVibes" },
      { name: "description", content: "ChocoVibes admin dashboard" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/enquiries", label: "Corporate & B2B", icon: Mail },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const { isAdmin, checking, user } = useIsAdmin();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  if (checking) {
    return (
      <div className="admin-shell min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Checking permissions…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-shell min-h-screen flex items-center justify-center px-6">
        <div className="admin-card w-full max-w-sm p-8 text-center">
          <ShieldAlert className="mx-auto mb-4 text-muted-foreground" size={36} />
          <h1 className="text-lg font-semibold text-foreground">Admin sign-in required</h1>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">
            Sign in with an admin account to continue.
          </p>
          <Link to="/auth" className="admin-btn-primary w-full">
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-shell min-h-screen flex items-center justify-center px-6">
        <div className="admin-card w-full max-w-sm p-8 text-center">
          <ShieldAlert className="mx-auto mb-4 text-destructive" size={36} />
          <h1 className="text-lg font-semibold text-foreground">Access denied</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user.email} does not have admin permissions.
          </p>
        </div>
      </div>
    );
  }

  const initial = (user.email ?? "A").charAt(0).toUpperCase();

  const navList = (
    <nav className="space-y-0.5 p-3">
      {nav.map((n) => {
        const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
        const Icon = n.icon;
        return (
          <Link
            key={n.to}
            to={n.to}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
              active
                ? "bg-white/12 text-white font-medium"
                : "text-white/65 hover:bg-white/8 hover:text-white"
            }`}
          >
            <Icon size={16} /> {n.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="admin-shell min-h-screen">
      {/* Top bar */}
      <header
        className="sticky top-0 z-40 flex h-14 items-center gap-3 px-4"
        style={{ background: "var(--admin-topbar)" }}
      >
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md p-1.5 text-white/80 hover:bg-white/10 lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <span className="text-sm font-semibold tracking-tight text-white">ChocoVibes Admin</span>
        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/"
            className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            <Store size={14} /> View store
          </Link>
          <span className="hidden text-xs text-white/60 md:inline">{user.email}</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-xs font-semibold text-white">
            {initial}
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/auth";
            }}
            className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="flex">
        <aside
          className="hidden w-56 shrink-0 lg:block"
          style={{ background: "var(--admin-sidebar)", minHeight: "calc(100vh - 3.5rem)" }}
        >
          <div className="sticky top-14">{navList}</div>
        </aside>

        {mobileOpen && (
          <div
            className="fixed inset-x-0 bottom-0 top-14 z-30 lg:hidden"
            style={{ background: "var(--admin-sidebar)" }}
          >
            {navList}
          </div>
        )}

        <main className="min-w-0 flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
