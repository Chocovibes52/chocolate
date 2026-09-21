import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  X,
  RotateCw,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Mail,
  ExternalLink,
} from "lucide-react";
import { Badge, Card, PageHeader, statusTone } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

export type AdminOrder = {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: string;
  payment_status: "Pending" | "Paid" | "Failed" | "Refunded";
  status: string;
  notes: string | null;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_payment_method?: string;
  payment_date?: string;
  courier: string;
  tracking_id: string;
  tracking_url: string;
  shipped_at?: string;
  delivered_at?: string;
  confirmation_email_sent?: boolean;
  shipped_email_sent?: boolean;
  delivery_email_sent?: boolean;
  items: Array<{
    id: string;
    product_slug: string;
    product_name: string;
    unit_price: number;
    quantity: number;
    line_total: number;
  }>;
  created_at: string;
  updated_at: string;
};

const ORDER_STATUSES = [
  "Payment Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Refunded",
] as const;

const COURIER_OPTIONS = [
  "DTDC",
  "Delhivery",
  "Blue Dart",
  "India Post",
  "XpressBees",
  "Shiprocket",
  "Other",
] as const;

function AdminOrders() {
  const qc = useQueryClient();
  const [open, setOpen] = useState<AdminOrder | null>(null);

  const { data: orders, isLoading } = useQuery<AdminOrder[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      return data.orders || [];
    },
    refetchInterval: 10000,
  });

  async function updateStatus(id: string, newStatus: string) {
    try {
      const res = await fetch("/api/orders/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: id,
          status: newStatus,
          markAsShipped: newStatus.toLowerCase() === "shipped",
          markAsDelivered: newStatus.toLowerCase() === "delivered",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok)
        throw new Error(data.error || "Failed to update order");
      toast.success(`Order updated to ${newStatus}`);
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update order",
      );
    }
  }

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Track payments and fulfillment for every order."
      />

      <Card className="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-xs">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">ORDER</th>
              <th className="px-4 py-3 font-semibold">CUSTOMER</th>
              <th className="px-4 py-3 font-semibold">TOTAL</th>
              <th className="px-4 py-3 font-semibold">PAYMENT</th>
              <th className="px-4 py-3 font-semibold">FULFILLMENT</th>
              <th className="px-4 py-3 font-semibold">DATE</th>
              <th className="px-4 py-3 text-right font-semibold">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {(orders ?? []).map((o) => {
              const isPaid = o.payment_status?.toLowerCase() === "paid";
              return (
                <tr
                  key={o.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-4 py-3.5 font-mono text-xs font-bold text-slate-900">
                    #{o.order_number || o.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-slate-900">
                      {o.customer_name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {o.customer_email}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    ₹{Number(o.total).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isPaid
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : o.payment_status === "Failed"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {isPaid && <CheckCircle2 size={11} />}
                      {o.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <Badge tone={statusTone(o.status)}>{o.status}</Badge>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="admin-input w-auto py-0.5 px-2 text-xs"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">
                    {new Date(o.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => setOpen(o)}
                      className="admin-btn py-1 px-3 text-xs font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
            {orders && orders.length === 0 && !isLoading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  No orders recorded yet. As soon as customers checkout, orders
                  will appear here in real-time.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {open && (
        <OrderDetailsDialog
          order={open}
          onClose={() => setOpen(null)}
          onRefresh={() => {
            qc.invalidateQueries({ queryKey: ["admin-orders"] });
            // Re-fetch current order
            fetch(`/api/orders/${open.id}`)
              .then((r) => r.json())
              .then((d) => d.ok && setOpen(d.order));
          }}
        />
      )}
    </div>
  );
}

function OrderDetailsDialog({
  order,
  onClose,
  onRefresh,
}: {
  order: AdminOrder;
  onClose: () => void;
  onRefresh: () => void;
}) {
  // DTDC is default for new orders, or keeps current courier if already set
  const [courier, setCourier] = useState(order.courier || "DTDC");
  const [trackingId, setTrackingId] = useState(order.tracking_id || "");
  const [trackingUrl, setTrackingUrl] = useState(order.tracking_url || "");
  const [status, setStatus] = useState(order.status || "Confirmed");
  const [saving, setSaving] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

  async function handleSaveShipping(
    markShipped = false,
    markDelivered = false,
  ) {
    setSaving(true);
    try {
      const res = await fetch("/api/orders/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          courier,
          trackingId,
          trackingUrl,
          status: markShipped
            ? "Shipped"
            : markDelivered
              ? "Delivered"
              : status,
          markAsShipped: markShipped,
          markAsDelivered: markDelivered,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok)
        throw new Error(data.error || "Failed to update shipping");

      toast.success(
        markShipped
          ? "Order marked as Shipped! Shipping confirmation email sent to customer."
          : markDelivered
            ? "Order marked as Delivered! Delivery email sent to customer."
            : "Shipping details saved.",
      );

      onRefresh();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update shipping",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleCheckPayment() {
    setCheckingPayment(true);
    try {
      const res = await fetch("/api/orders/check-payment-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Check failed");

      toast.success(data.message || "Payment status checked");
      onRefresh();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not check Razorpay status",
      );
    } finally {
      setCheckingPayment(false);
    }
  }

  const isPaid = order.payment_status?.toLowerCase() === "paid";
  const isPending = order.payment_status?.toLowerCase() === "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-xl bg-white p-6 md:p-8 shadow-2xl border border-slate-200 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
              ChocoVibes Order Details
            </div>
            <h3 className="font-mono text-xl md:text-2xl font-bold text-slate-900 mt-0.5">
              #{order.order_number || order.id.slice(0, 8)}
            </h3>
            <div className="text-xs text-slate-500 mt-0.5">
              Order ID: <span className="font-mono">{order.id}</span> · Date:{" "}
              {new Date(order.created_at).toLocaleString("en-IN")}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Customer & Address Grid */}
        <div className="grid sm:grid-cols-2 gap-6 text-sm mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
              Customer Information
            </h4>
            <p className="font-semibold text-slate-900">
              {order.customer_name}
            </p>
            <p className="text-slate-600">{order.customer_email}</p>
            <p className="text-slate-600 font-mono">
              {order.customer_phone}
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
              Delivery Address
            </h4>
            <p className="text-slate-800">{order.address}</p>
            <p className="text-slate-600">
              {order.city}, {order.state} —{" "}
              <span className="font-mono font-medium">{order.pincode}</span>
            </p>
          </div>
        </div>

        {/* PAYMENT DETAILS SECTION */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 mb-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={16} className="text-slate-700" /> Payment
              Verification
            </h4>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                isPaid
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : isPending
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              {isPaid && <CheckCircle2 size={12} />}
              Payment: {order.payment_status}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Method:</span>
              <span className="font-semibold text-slate-900 text-sm uppercase">
                {order.razorpay_payment_method ||
                  order.payment_method ||
                  "Razorpay"}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Payment Date:</span>
              <span className="font-medium text-slate-900">
                {order.payment_date
                  ? new Date(order.payment_date).toLocaleString("en-IN")
                  : isPaid
                    ? new Date(order.created_at).toLocaleString("en-IN")
                    : "Awaiting payment"}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 block">
                Razorpay Order ID:
              </span>
              <span className="font-mono font-medium text-slate-900">
                {order.razorpay_order_id || "N/A"}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 block">
                Razorpay Payment ID:
              </span>
              <span className="font-mono font-medium text-slate-900">
                {order.razorpay_payment_id ||
                  (isPaid ? "Captured" : "Pending Capture")}
              </span>
            </div>
          </div>

          {/* CHECK PAYMENT STATUS BUTTON */}
          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              {isPaid
                ? "✓ Payment is verified and captured on Razorpay."
                : "Payment is pending. You can query Razorpay API directly to verify if the customer completed payment."}
            </p>

            <button
              type="button"
              onClick={handleCheckPayment}
              disabled={checkingPayment}
              className="admin-btn text-xs inline-flex items-center gap-1.5 shrink-0"
            >
              <RotateCw
                size={13}
                className={checkingPayment ? "animate-spin" : ""}
              />
              {checkingPayment ? "Checking Razorpay…" : "Check Payment Status"}
            </button>
          </div>
        </div>

        {/* SHIPPING MANAGEMENT SECTION (DTDC is Default) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 mb-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Truck size={16} className="text-slate-700" /> Shipping & Fulfillment
            </h4>
            <span className="text-xs text-slate-500">
              Default Courier: <strong>DTDC</strong>
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-sm mb-4">
            {/* Courier Selection (DTDC is Default) */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                Courier Partner
              </label>
              <select
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="admin-input w-full text-sm font-medium"
              >
                {COURIER_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c} {c === "DTDC" ? "(Default)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Tracking ID */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                Tracking ID / AWB
              </label>
              <input
                value={trackingId}
                onChange={(e) => {
                  setTrackingId(e.target.value);
                  // Auto-generate DTDC tracking URL if empty
                  if (courier.toUpperCase().includes("DTDC") && !trackingUrl) {
                    setTrackingUrl(
                      "https://www.dtdc.in/tracking/shipment-tracking.asp",
                    );
                  }
                }}
                placeholder="e.g. D123456789"
                className="admin-input w-full font-mono text-sm"
              />
            </div>

            {/* Order Status */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                Order Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="admin-input w-full text-sm font-medium"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Tracking URL */}
            <div className="sm:col-span-3">
              <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                Tracking URL (Customer link)
              </label>
              <div className="flex gap-2">
                <input
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://www.dtdc.in/tracking/shipment-tracking.asp"
                  className="admin-input flex-1 font-mono text-xs"
                />
                {trackingUrl && (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn text-xs inline-flex items-center gap-1"
                  >
                    Open <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 flex items-center gap-3">
              {order.shipped_email_sent && (
                <span className="inline-flex items-center gap-1 text-emerald-700">
                  <Mail size={13} /> Shipping email sent
                </span>
              )}
              {order.delivery_email_sent && (
                <span className="inline-flex items-center gap-1 text-emerald-700">
                  <Mail size={13} /> Delivery email sent
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveShipping(false, false)}
                disabled={saving}
                className="admin-btn text-xs"
              >
                {saving ? "Saving…" : "Save Shipping"}
              </button>

              <button
                type="button"
                onClick={() => handleSaveShipping(true, false)}
                disabled={saving}
                className="admin-btn-primary text-xs flex items-center gap-1.5"
              >
                <Truck size={14} />
                Mark as Shipped
              </button>

              <button
                type="button"
                onClick={() => handleSaveShipping(false, true)}
                disabled={saving}
                className="admin-btn text-xs bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600"
              >
                Mark as Delivered
              </button>
            </div>
          </div>
        </div>

        {/* ORDER ITEMS TABLE */}
        <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
          Ordered Products
        </h4>
        <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden mb-6">
          <thead className="bg-slate-50 text-slate-500 text-left text-xs uppercase border-b border-slate-200">
            <tr>
              <th className="px-3 py-2.5 font-semibold">Product</th>
              <th className="px-3 py-2.5 font-semibold text-center">Qty</th>
              <th className="px-3 py-2.5 font-semibold text-right">Unit Price</th>
              <th className="px-3 py-2.5 font-semibold text-right">Line Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {(order.items ?? []).map((i) => (
              <tr key={i.id} className="hover:bg-slate-50/60">
                <td className="px-3 py-2.5 font-medium text-slate-900">
                  {i.product_name}
                </td>
                <td className="px-3 py-2.5 text-center text-slate-700">{i.quantity}</td>
                <td className="px-3 py-2.5 text-right font-mono text-slate-700">
                  ₹{Number(i.unit_price).toLocaleString("en-IN")}
                </td>
                <td className="px-3 py-2.5 text-right font-mono font-semibold text-slate-900">
                  ₹{Number(i.line_total).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pricing Summary */}
        <div className="border-t border-slate-200 pt-4 space-y-1.5 text-sm text-right">
          <div className="text-slate-500">
            Subtotal: ₹{Number(order.subtotal).toLocaleString("en-IN")}
          </div>
          <div className="text-slate-500">
            Shipping:{" "}
            {order.shipping === 0
              ? "Free"
              : `₹${Number(order.shipping).toLocaleString("en-IN")}`}
          </div>
          <div className="text-2xl text-slate-900 font-bold pt-1">
            Total: ₹{Number(order.total).toLocaleString("en-IN")}
          </div>
        </div>

        {order.notes && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs border border-slate-200">
            <span className="font-semibold text-slate-900">
              Customer Notes:{" "}
            </span>
            <span className="text-slate-600">{order.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
}
