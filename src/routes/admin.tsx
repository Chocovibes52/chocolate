import {
  createFileRoute,
  Outlet,
  Link,
  useRouterState,
} from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Mail,
  Settings,
  ShieldAlert,
  Menu,
  X,
  Store,
  LogOut,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — ChocoVibes" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function useIsAdmin() {
  const { user, loading } = useAuth();
  const q = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user,
    staleTime: 6e4,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });
  return {
    isAdmin: q.data === true,
    checking: loading || (!!user && q.isLoading),
    user,
  };
}

const nav = [
  {
    to: "/admin" as const,
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    to: "/admin/products" as const,
    label: "Products",
    icon: Package,
    exact: false,
  },
  {
    to: "/admin/orders" as const,
    label: "Orders",
    icon: ShoppingBag,
    exact: false,
  },
  {
    to: "/admin/enquiries" as const,
    label: "Corporate & B2B",
    icon: Mail,
    exact: false,
  },
  {
    to: "/admin/settings" as const,
    label: "Settings",
    icon: Settings,
    exact: false,
  },
];

function AdminLayout() {
  const { isAdmin, checking, user } = useIsAdmin();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  if (checking) {
    return (
      <div className="admin-shell min-h-screen flex items-center justify-center text-sm text-slate-500 bg-slate-50">
        Checking permissions…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-shell min-h-screen flex items-center justify-center px-6 bg-slate-50">
        <div className="admin-card w-full max-w-sm p-8 text-center bg-white shadow-sm border border-slate-200 rounded-xl">
          <ShieldAlert
            className="mx-auto mb-4 text-slate-400"
            size={36}
          />
          <h1 className="text-lg font-semibold text-slate-900">
            Admin sign-in required
          </h1>
          <p className="mt-1 mb-6 text-sm text-slate-500">
            Sign in with an admin account to continue.
          </p>
          <Link
            to="/auth"
            className="admin-btn-primary w-full block text-center"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-shell min-h-screen flex items-center justify-center px-6 bg-slate-50">
        <div className="admin-card w-full max-w-sm p-8 text-center bg-white shadow-sm border border-slate-200 rounded-xl">
          <ShieldAlert className="mx-auto mb-4 text-rose-500" size={36} />
          <h1 className="text-lg font-semibold text-slate-900">
            Access denied
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {user.email} does not have admin permissions.
          </p>
        </div>
      </div>
    );
  }

  const initial = (user.email ?? "A").charAt(0).toUpperCase();
  const navList = (
    <nav className="space-y-1 p-3">
      {nav.map((n) => {
        const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
        const Icon = n.icon;
        return (
          <Link
            key={n.to}
            to={n.to}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-[#27272a] text-white shadow-xs"
                : "text-zinc-400 hover:bg-[#1f1f23] hover:text-zinc-200"
            }`}
          >
            <Icon size={16} className={active ? "text-white" : "text-zinc-400"} /> {n.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="admin-shell min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 px-4 bg-[#09090b] border-b border-zinc-800">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <span className="text-sm font-semibold tracking-tight text-white">
          ChocoVibes Admin
        </span>
        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/"
            className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white sm:inline-flex"
          >
            <Store size={14} /> View store
          </Link>
          <span className="hidden text-xs text-zinc-400 md:inline">
            {user.email}
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-xs font-semibold text-white">
            {initial}
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/auth";
            }}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>
      <div className="flex">
        <aside
          className="hidden w-56 shrink-0 lg:block bg-[#121215] border-r border-zinc-800/80"
          style={{ minHeight: "calc(100vh - 3.5rem)" }}
        >
          <div className="sticky top-14">{navList}</div>
        </aside>
        {mobileOpen && (
          <div className="fixed inset-x-0 bottom-0 top-14 z-30 lg:hidden bg-[#121215] border-r border-zinc-800/80">
            {navList}
          </div>
        )}
        <main className="min-w-0 flex-1 p-4 md:p-8 bg-[#f8fafc] text-slate-900">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
