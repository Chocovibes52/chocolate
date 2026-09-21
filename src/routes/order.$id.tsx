import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  ExternalLink,
  RotateCw,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { formatINR } from "@/lib/cart-context";

export const Route = createFileRoute("/order/$id")({
  head: () => ({
    meta: [
      { title: "Order Details — ChocoVibes" },
      {
        name: "description",
        content: "Track your ChocoVibes order status and delivery.",
      },
    ],
  }),
  component: OrderPage,
});

type OrderData = {
  id: string;
  order_number: string;
  created_at: string;
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
  courier?: string;
  tracking_id?: string;
  tracking_url?: string;
  items: Array<{
    id: string;
    product_slug: string;
    product_name: string;
    unit_price: number;
    quantity: number;
    line_total: number;
  }>;
};

const TIMELINE_STEPS = [
  { id: "placed", label: "Order Placed" },
  { id: "payment", label: "Payment Received" },
  { id: "confirmed", label: "Order Confirmed" },
  { id: "processing", label: "Processing" },
  { id: "packed", label: "Packed" },
  { id: "shipped", label: "Shipped" },
  { id: "out_for_delivery", label: "Out for Delivery" },
  { id: "delivered", label: "Delivered" },
];

function getStepIndex(status: string, paymentStatus: string): number {
  const norm = (status || "").toLowerCase().trim();
  const payNorm = (paymentStatus || "").toLowerCase().trim();

  if (norm === "delivered") return 7;
  if (norm === "out for delivery" || norm === "out_for_delivery") return 6;
  if (norm === "shipped") return 5;
  if (norm === "packed") return 4;
  if (norm === "processing") return 3;
  if (norm === "confirmed") return 2;
  if (payNorm === "paid") return 2;
  if (norm === "payment pending" || norm === "pending") return 0;
  return 1;
}

function OrderPage() {
  const { id } = useParams({ from: "/order/$id" });
  const [checking, setChecking] = useState(false);

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useQuery<OrderData>({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${encodeURIComponent(id)}`);
      if (!res.ok) {
        throw new Error("Order not found");
      }
      const data = await res.json();
      return data.order;
    },
    refetchInterval: 8000, // auto-refresh while waiting for confirmation
  });

  async function checkPayment() {
    if (!order) return;
    setChecking(true);
    try {
      const res = await fetch("/api/orders/check-payment-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(data.message || "Payment status checked");
        refetch();
      } else {
        toast.error(data.error || "Could not verify payment status");
      }
    } catch {
      toast.error("Network error while checking payment status");
    } finally {
      setChecking(false);
    }
  }

  if (isLoading) {
    return (
      <main className="container-luxe py-24 text-center">
        <p className="text-muted-foreground">Loading order details…</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="container-luxe py-24 text-center max-w-lg">
        <AlertCircle className="mx-auto text-destructive mb-4" size={42} />
        <h1 className="font-display text-3xl text-primary">Order Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't locate this order. Please check the order link or contact
          ChocoVibes support.
        </p>
        <Link to="/" className="btn-cocoa mt-6 inline-flex">
          Return to Home
        </Link>
      </main>
    );
  }

  const currentStep = getStepIndex(order.status, order.payment_status);
  const isPaid = order.payment_status === "Paid";
  const isPending = order.payment_status === "Pending";
  const isFailed = order.payment_status === "Failed";

  const courier = order.courier || "DTDC";
  const trackingId = order.tracking_id?.trim();
  const trackingUrl =
    order.tracking_url?.trim() ||
    (trackingId && courier.toUpperCase().includes("DTDC")
      ? "https://www.dtdc.in/tracking/shipment-tracking.asp"
      : "");

  return (
    <main className="container-luxe py-12 max-w-4xl">
      {/* Back button */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/account"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
        >
          <ArrowLeft size={16} /> Back to My Account
        </Link>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Placed on{" "}
          {new Date(order.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Main Order Header Card */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-accent font-medium">
              ChocoVibes Order
            </span>
            <h1 className="mt-1 font-mono text-2xl md:text-3xl font-bold text-primary">
              #{order.order_number || order.id.slice(0, 8)}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                isPaid
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : isPending
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {isPaid ? <CheckCircle2 size={14} /> : <Clock size={14} />}
              Payment: {order.payment_status}
            </div>

            <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-secondary text-primary border border-border">
              Order: {order.status}
            </div>
          </div>
        </div>

        {/* Payment Verification / Pending Banner */}
        {isPending && (
          <div className="mt-6 rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-amber-900">
              <Clock className="text-amber-600 shrink-0" size={20} />
              <div>
                <p className="font-medium">Payment is being verified</p>
                <p className="text-xs text-amber-800/80">
                  If you just paid via Razorpay and the status hasn't updated,
                  click check status below.
                </p>
              </div>
            </div>
            <button
              onClick={checkPayment}
              disabled={checking}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-xs font-medium text-white hover:bg-amber-800 transition disabled:opacity-50 shrink-0"
            >
              <RotateCw size={13} className={checking ? "animate-spin" : ""} />
              {checking ? "Checking Razorpay…" : "Check Payment Status"}
            </button>
          </div>
        )}

        {isFailed && (
          <div className="mt-6 rounded-xl bg-destructive/10 border border-destructive/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-destructive">
              <AlertCircle className="shrink-0" size={20} />
              <div>
                <p className="font-medium">Payment was not completed</p>
                <p className="text-xs text-muted-foreground">
                  The transaction could not be verified or was cancelled.
                </p>
              </div>
            </div>
            <Link
              to="/checkout"
              className="btn-cocoa py-2 px-4 text-xs shrink-0"
            >
              Retry Payment
            </Link>
          </div>
        )}

        {/* ORDER PROGRESS TIMELINE */}
        <div className="mt-8 pt-4">
          <h2 className="eyebrow mb-6">Order Progress</h2>
          <div className="relative">
            {/* Desktop timeline */}
            <div className="hidden md:grid grid-cols-8 gap-2 text-center relative">
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-border -z-0" />
              <div
                className="absolute top-4 left-4 h-0.5 bg-accent transition-all duration-500 -z-0"
                style={{ width: `${(Math.min(currentStep, 7) / 7) * 94}%` }}
              />

              {TIMELINE_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div
                    key={step.id}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isPassed
                          ? "bg-accent text-white"
                          : "bg-background border-2 border-border text-muted-foreground"
                      } ${isCurrent ? "ring-4 ring-accent/20" : ""}`}
                    >
                      {isPassed ? "✓" : idx + 1}
                    </div>
                    <span
                      className={`mt-2 text-[11px] leading-tight font-medium ${
                        isPassed
                          ? "text-primary font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile vertical timeline */}
            <div className="md:hidden space-y-4 relative pl-6 border-l-2 border-border ml-3">
              {TIMELINE_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div
                    key={step.id}
                    className="relative flex items-center gap-3"
                  >
                    <div
                      className={`absolute -left-[31px] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isPassed
                          ? "bg-accent text-white"
                          : "bg-background border-2 border-border text-muted-foreground"
                      }`}
                    >
                      {isPassed ? "✓" : idx + 1}
                    </div>
                    <span
                      className={`text-sm ${
                        isCurrent
                          ? "font-bold text-accent"
                          : isPassed
                            ? "font-medium text-primary"
                            : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SHIPPING INFORMATION CARD */}
        <div className="mt-10 rounded-xl bg-muted/40 border border-border/80 p-5">
          <div className="flex items-center gap-2 text-primary font-medium text-sm">
            <Truck size={18} className="text-accent" />
            <h3 className="font-serif text-base">Shipping & Tracking</h3>
          </div>

          <div className="mt-3 grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Courier Partner
              </span>
              <p className="font-semibold text-primary mt-0.5">{courier}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Tracking ID
              </span>
              <p className="font-mono font-medium text-primary mt-0.5">
                {trackingId ||
                  "Tracking information will be added after dispatch."}
              </p>
            </div>
          </div>

          {trackingId && trackingUrl && (
            <div className="mt-4 pt-3 border-t border-border/60">
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold py-2 px-4 text-xs inline-flex items-center gap-1.5"
              >
                Track Shipment <ExternalLink size={13} />
              </a>
            </div>
          )}
        </div>

        {/* ORDER ITEMS & TOTAL */}
        <div className="mt-10">
          <h2 className="eyebrow mb-4">Items in Order</h2>
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between gap-4 flex-wrap"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-primary/70">
                    <Package size={18} />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-foreground">
                      {item.product_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Quantity: {item.quantity} × {formatINR(item.unit_price)}
                    </div>
                  </div>
                </div>
                <div className="font-semibold text-sm text-primary">
                  {formatINR(item.line_total)}
                </div>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="mt-4 space-y-1.5 text-sm text-right">
            <div className="text-muted-foreground">
              Subtotal: {formatINR(order.subtotal)}
            </div>
            <div className="text-muted-foreground">
              Shipping:{" "}
              {order.shipping === 0 ? "Free" : formatINR(order.shipping)}
            </div>
            <div className="font-display text-2xl text-primary pt-2 font-bold">
              Total: {formatINR(order.total)}
            </div>
            <div className="text-xs text-muted-foreground">
              Payment Method: {order.payment_method} · Status:{" "}
              {order.payment_status}
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mt-8 border-t border-border pt-6 text-sm">
          <h4 className="font-serif text-lg text-primary mb-2">
            Delivery Address
          </h4>
          <p className="font-medium text-foreground">{order.customer_name}</p>
          <p className="text-muted-foreground">{order.address}</p>
          <p className="text-muted-foreground">
            {order.city}, {order.state} — {order.pincode}
          </p>
          <p className="text-muted-foreground mt-1">
            Phone: {order.customer_phone}
          </p>
        </div>
      </div>
    </main>
  );
}
