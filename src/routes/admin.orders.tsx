import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Badge, Card, PageHeader, statusTone } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

type Order = Tables<"orders">;
type OrderItem = Tables<"order_items">;

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;
const PAY_STATUSES = ["pending", "paid", "failed", "refunded"] as const;

function AdminOrders() {
  const qc = useQueryClient();
  const [open, setOpen] = useState<Order | null>(null);

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
  });

  async function update(id: string, patch: Partial<Order>) {
    const { error } = await supabase.from("orders").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order updated");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  }

  return (
    <div>
      <PageHeader title="Orders" description="Track payments and fulfillment for every order." />
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">Order</th>
              <th className="px-4 py-2.5 font-medium">Customer</th>
              <th className="px-4 py-2.5 font-medium">Total</th>
              <th className="px-4 py-2.5 font-medium">Payment</th>
              <th className="px-4 py-2.5 font-medium">Fulfillment</th>
              <th className="px-4 py-2.5 font-medium">Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((o) => (
              <tr key={o.id} className="border-t border-border/70 hover:bg-muted/40">
                <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                <td className="px-4 py-3">
                  <div className="text-foreground">{o.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                </td>
                <td className="px-4 py-3 font-medium">₹{Number(o.total).toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Badge tone={statusTone(o.payment_status)}>{o.payment_status}</Badge>
                    <select
                      value={o.payment_status}
                      onChange={(e) => update(o.id, { payment_status: e.target.value })}
                      className="admin-input w-auto py-1 text-xs"
                    >
                      {PAY_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Badge tone={statusTone(o.status)}>{o.status}</Badge>
                    <select
                      value={o.status}
                      onChange={(e) => update(o.id, { status: e.target.value })}
                      className="admin-input w-auto py-1 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setOpen(o)} className="admin-btn">
                    View
                  </button>
                </td>
              </tr>
            ))}
            {orders && orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>


      {open && <OrderDialog order={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function OrderDialog({ order, onClose }: { order: Order; onClose: () => void }) {
  const { data: items } = useQuery({
    queryKey: ["admin-order-items", order.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);
      if (error) throw error;
      return data as OrderItem[];
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-background p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary/60">Order</p>
            <h3 className="font-mono text-primary">{order.id}</h3>
          </div>
          <button onClick={onClose} className="text-primary/60 hover:text-primary">
            <X size={20} />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-serif text-lg text-primary mb-1">Customer</h4>
            <p>{order.customer_name}</p>
            <p className="text-primary/70">{order.customer_email}</p>
            <p className="text-primary/70">{order.customer_phone}</p>
          </div>
          <div>
            <h4 className="font-serif text-lg text-primary mb-1">Shipping</h4>
            <p>{order.address}</p>
            <p>
              {order.city}, {order.state} — {order.pincode}
            </p>
          </div>
        </div>

        <h4 className="font-serif text-lg text-primary mt-6 mb-2">Items</h4>
        <table className="w-full text-sm border border-border rounded-md overflow-hidden">
          <thead className="bg-muted text-primary/60 text-left">
            <tr>
              <th className="px-3 py-2 font-normal">Product</th>
              <th className="px-3 py-2 font-normal">Qty</th>
              <th className="px-3 py-2 font-normal">Unit</th>
              <th className="px-3 py-2 font-normal">Line</th>
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((i) => (
              <tr key={i.id} className="border-t border-border/60">
                <td className="px-3 py-2">{i.product_name}</td>
                <td className="px-3 py-2">{i.quantity}</td>
                <td className="px-3 py-2">₹{Number(i.unit_price).toLocaleString("en-IN")}</td>
                <td className="px-3 py-2">₹{Number(i.line_total).toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 space-y-1 text-sm text-right">
          <div>Subtotal: ₹{Number(order.subtotal).toLocaleString("en-IN")}</div>
          <div>Shipping: ₹{Number(order.shipping).toLocaleString("en-IN")}</div>
          <div className="font-serif text-lg text-primary">
            Total: ₹{Number(order.total).toLocaleString("en-IN")}
          </div>
          <div className="text-primary/60 text-xs">
            Payment: {order.payment_method} · {order.payment_status}
          </div>
        </div>

        {order.notes && (
          <div className="mt-4 text-sm">
            <span className="text-primary/60">Notes: </span>
            {order.notes}
          </div>
        )}
      </div>
    </div>
  );
}
