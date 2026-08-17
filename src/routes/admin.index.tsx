import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingBag, Mail, IndianRupee, ArrowRight, AlertTriangle } from "lucide-react";
import { Badge, Card, EmptyState, PageHeader, statusTone } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function useCount(table: "products" | "orders" | "b2b_enquiries") {
  return useQuery({
    queryKey: ["admin-count", table],
    queryFn: async () => {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });
}

function AdminOverview() {
  const products = useCount("products");
  const orders = useCount("orders");
  const enquiries = useCount("b2b_enquiries");

  const revenue = useQuery({
    queryKey: ["admin-revenue"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("total, payment_status");
      if (error) throw error;
      return (data ?? [])
        .filter((o) => o.payment_status === "paid")
        .reduce((s, o) => s + Number(o.total), 0);
    },
  });

  const recent = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, customer_name, customer_email, total, status, payment_status, created_at")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

  const outOfStock = useQuery({
    queryKey: ["admin-out-of-stock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug")
        .eq("in_stock", false);
      if (error) throw error;
      return data ?? [];
    },
  });

  const cards = [
    { label: "Total revenue", value: revenue.data != null ? `₹${revenue.data.toLocaleString("en-IN")}` : "—", icon: IndianRupee, hint: "Paid orders" },
    { label: "Orders", value: orders.data ?? "—", icon: ShoppingBag, hint: "All time" },
    { label: "Products", value: products.data ?? "—", icon: Package, hint: "In catalog" },
    { label: "Enquiries", value: enquiries.data ?? "—", icon: Mail, hint: "Corporate & B2B" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description="A snapshot of your store's performance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {c.label}
                </span>
                <Icon size={15} className="text-muted-foreground" />
              </div>
              <div className="mt-3 text-2xl font-semibold text-foreground">{c.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{c.hint}</div>
            </Card>
          );
        })}
      </div>

      {!!outOfStock.data?.length && (
        <Card className="flex items-start gap-3 border-amber-200 bg-amber-50 p-4">
          <AlertTriangle size={16} className="mt-0.5 text-amber-600" />
          <div className="text-sm text-amber-800">
            <span className="font-medium">
              {outOfStock.data.length} product{outOfStock.data.length > 1 ? "s are" : " is"} out of stock
            </span>
            <div className="mt-0.5 text-amber-700">
              {outOfStock.data.map((p) => p.name).join(", ")}
            </div>
          </div>
          <Link to="/admin/products" className="admin-btn ml-auto shrink-0">
            Manage
          </Link>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">Recent orders</h3>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-2.5 font-medium">Order</th>
                <th className="px-5 py-2.5 font-medium">Customer</th>
                <th className="px-5 py-2.5 font-medium">Payment</th>
                <th className="px-5 py-2.5 font-medium">Fulfillment</th>
                <th className="px-5 py-2.5 font-medium text-right">Total</th>
                <th className="px-5 py-2.5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {(recent.data ?? []).map((o) => (
                <tr key={o.id} className="border-t border-border/70 hover:bg-muted/40">
                  <td className="px-5 py-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                  <td className="px-5 py-3">
                    <div className="text-foreground">{o.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={statusTone(o.payment_status)}>{o.payment_status}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={statusTone(o.status)}>{o.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right font-medium">
                    ₹{Number(o.total).toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recent.data && recent.data.length === 0 && (
            <EmptyState title="No orders yet" hint="Orders will appear here as customers check out." />
          )}
        </div>
      </Card>
    </div>
  );
}
