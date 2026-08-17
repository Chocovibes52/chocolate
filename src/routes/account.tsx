import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatINR } from "@/lib/cart-context";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — ChocoVibes" },
      { name: "description", content: "Manage your ChocoVibes account and view orders." },
    ],
  }),
  component: Account,
});

type OrderRow = {
  id: string;
  created_at: string;
  status: string;
  payment_method: string;
  payment_status: string;
  total: number;
};

function Account() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading, nav]);

  const orders = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<OrderRow[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, created_at, status, payment_method, payment_status, total")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as OrderRow[];
    },
  });

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    nav({ to: "/" });
  }

  if (loading || !user) {
    return (
      <main className="container-luxe py-24 text-center text-muted-foreground">Loading…</main>
    );
  }

  return (
    <main className="container-luxe py-16 max-w-3xl">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="eyebrow">Account</div>
          <h1 className="mt-3 font-display text-5xl text-primary">Hello there.</h1>
          <p className="mt-2 text-muted-foreground text-sm">{user.email}</p>
        </div>
        <button onClick={signOut} className="btn-outline-cocoa">
          <LogOut size={14} /> Sign out
        </button>
      </div>

      <section className="mt-12">
        <h2 className="eyebrow">Your orders</h2>
        {orders.isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading orders…</p>
        ) : orders.data && orders.data.length > 0 ? (
          <div className="mt-4 divide-y divide-border border border-border rounded-2xl overflow-hidden">
            {orders.data.map((o) => (
              <div key={o.id} className="p-5 flex items-center justify-between gap-4 flex-wrap bg-card">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    #{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleDateString()}
                  </div>
                  <div className="mt-1 text-sm text-primary capitalize">
                    {o.status} · {o.payment_method} ({o.payment_status})
                  </div>
                </div>
                <div className="font-display text-xl text-primary">{formatINR(Number(o.total))}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            No orders yet. <Link to="/energy-bars" className="text-accent">Start shopping →</Link>
          </p>
        )}
      </section>
    </main>
  );
}
