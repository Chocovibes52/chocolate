import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut, Package, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatINR } from "@/lib/cart-context";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — ChocoVibes" },
      {
        name: "description",
        content: "Manage your ChocoVibes account and view orders.",
      },
    ],
  }),
  component: Account,
});

type OrderRow = {
  id: string;
  order_number?: string;
  created_at: string;
  status: string;
  payment_method: string;
  payment_status: string;
  total: number;
  courier?: string;
  tracking_id?: string;
};

function Account() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading, nav]);

  const orders = useQuery({
    queryKey: ["my-orders", user?.id, user?.email],
    enabled: !!user,
    queryFn: async (): Promise<OrderRow[]> => {
      // 1. Fetch from server API
      try {
        const queryParam = encodeURIComponent(user?.id || user?.email || "");
        const res = await fetch(`/api/user/orders?user=${queryParam}`);
        if (res.ok) {
          const data = await res.json();
          if (data.ok && Array.isArray(data.orders) && data.orders.length > 0) {
            return data.orders;
          }
        }
      } catch (err) {
        console.warn(
          "Could not fetch from server API, falling back to Supabase:",
          err,
        );
      }

      // 2. Fallback to Supabase
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
      <main className="container-luxe py-24 text-center text-muted-foreground">
        Loading…
      </main>
    );
  }

  return (
    <main className="container-luxe py-16 max-w-4xl">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="eyebrow">Account</div>
          <h1 className="mt-3 font-display text-5xl text-primary">
            Hello there.
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">{user.email}</p>
        </div>
        <button onClick={signOut} className="btn-outline-cocoa">
          <LogOut size={14} /> Sign out
        </button>
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="eyebrow">Your Orders</h2>
          <span className="text-xs text-muted-foreground">
            {orders.data ? `${orders.data.length} orders found` : ""}
          </span>
        </div>

        {orders.isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading orders…</p>
        ) : orders.data && orders.data.length > 0 ? (
          <div className="mt-4 divide-y divide-border border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
            {orders.data.map((o) => {
              const isPaid = (o.payment_status || "").toLowerCase() === "paid";
              return (
                <div
                  key={o.id}
                  className="p-5 flex items-center justify-between gap-4 flex-wrap hover:bg-muted/30 transition"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <Package size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-primary">
                          #{o.order_number || o.id.slice(0, 8)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ·{" "}
                          {new Date(o.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isPaid
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {isPaid ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          {o.payment_status}
                        </span>

                        <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-primary border border-border">
                          Order: {o.status}
                        </span>

                        {o.courier && (
                          <span className="text-xs text-muted-foreground">
                            Courier: {o.courier}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-display text-xl text-primary font-bold">
                        {formatINR(Number(o.total))}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {o.payment_method}
                      </div>
                    </div>

                    <Link
                      to={`/order/${o.id}`}
                      className="btn-gold py-2 px-3 text-xs inline-flex items-center gap-1 shrink-0"
                    >
                      View Order <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-12 text-center">
            <Package
              size={36}
              className="mx-auto text-muted-foreground/60 mb-3"
            />
            <h3 className="font-display text-xl text-primary">
              No orders placed yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Experience the richness of handcrafted dark chocolate.
            </p>
            <Link to="/energy-bars" className="btn-cocoa mt-6 inline-flex">
              Explore Our Collection →
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
