import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Order — ChocoVibes" },
      {
        name: "description",
        content:
          "Track your handcrafted ChocoVibes order in real time with your order number and email address.",
      },
    ],
  }),
  component: TrackOrderPage,
});

type OrderItem = {
  id: string;
  product_name: string;
  product_slug?: string;
  unit_price: number;
  quantity: number;
  line_total: number;
};

type TrackedOrder = {
  id: string;
  order_number: string;
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
  courier: string;
  tracking_id: string;
  tracking_url: string;
  created_at: string;
  shipped_at?: string;
  delivered_at?: string;
  items: OrderItem[];
};

const TIMELINE_STEPS = [
  { key: "placed", label: "Order Placed" },
  { key: "payment", label: "Payment Received" },
  { key: "confirmed", label: "Order Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
] as const;

function getStepProgress(order: TrackedOrder): number {
  const normStatus = (order.status || "").toLowerCase();
  const isPaid = order.payment_status === "Paid";

  if (normStatus === "delivered") return 7;
  if (normStatus === "out for delivery") return 6;
  if (normStatus === "shipped") return 5;
  if (normStatus === "packed") return 4;
  if (normStatus === "processing") return 3;
  if (normStatus === "confirmed") return 2;
  if (isPaid) return 1;
  return 0; // Order placed
}

function getCourierTrackingLink(courier: string, trackingId: string, customUrl?: string): string {
  if (customUrl && customUrl.trim()) return customUrl.trim();
  const c = (courier || "").toLowerCase();
  const id = encodeURIComponent(trackingId.trim());

  if (c.includes("dtdc")) {
    return `https://www.dtdc.in/tracking/shipment-tracking.asp`;
  }
  if (c.includes("delhivery")) {
    return `https://www.delhivery.com/track/package/${id}`;
  }
  if (c.includes("blue dart")) {
    return `https://www.bluedart.com/tracking`;
  }
  if (c.includes("india post")) {
    return `https://www.indiapost.gov.in/_layouts/15/dpt.cept.tracking/trackconsignment.aspx`;
  }
  if (c.includes("xpressbees")) {
    return `https://www.xpressbees.com/shipment/tracking`;
  }
  if (c.includes("shiprocket")) {
    return `https://shiprocket.co/tracking/${id}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(`${courier} tracking ${trackingId}`)}`;
}

function TrackOrderPage() {
  const searchParams = useRouterState({
    select: (s) => new URLSearchParams(s.location.search),
  });

  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch if both query parameters are prefilled (e.g. from an email link or account page)
  useEffect(() => {
    const qOrder = searchParams.get("orderNumber");
    const qEmail = searchParams.get("email");
    if (qOrder && qEmail) {
      performLookup(qOrder, qEmail);
    }
  }, []);

  async function performLookup(num: string, mail: string) {
    if (!num.trim() || !mail.trim()) {
      setError("Please enter both your Order Number and Email Address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: num.trim(),
          email: mail.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "No order found matching these details. Please double-check.");
        setOrder(null);
      } else {
        setOrder(data.order);
        setError(null);
      }
    } catch {
      setError("An unexpected network error occurred. Please try again in a moment.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    performLookup(orderNumber, email);
  }

  const activeStepIdx = order ? getStepProgress(order) : 0;
  const isShipped =
    order &&
    ["shipped", "out for delivery", "delivered"].includes(
      (order.status || "").toLowerCase(),
    );

  return (
    <main className="min-h-screen py-12 md:py-20">
      <div className="container-luxe max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="eyebrow">Shipment Tracking</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl text-primary">
            Track Your Order
          </h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            Enter your order number and email address below to view real-time shipping updates,
            courier details, and order timeline.
          </p>
        </div>

        {/* Lookup Form Card */}
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-[var(--shadow-card)] max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="orderNumber"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Order Number
              </label>
              <input
                id="orderNumber"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. CV-2026-000125"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. customer@example.com"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs md:text-sm text-rose-800 flex items-start gap-2.5">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
                <div>{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-cocoa w-full py-3.5 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>Searching order details…</>
              ) : (
                <>
                  <Search size={15} /> Track Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Details View */}
        {order && (
          <div className="mt-12 space-y-8 animate-fade-in">
            {/* Top Status Banner */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-[var(--shadow-card)] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-2xl md:text-3xl text-primary font-semibold">
                    Order #{order.order_number || order.id.slice(0, 8)}
                  </h2>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Placed on{" "}
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Payment Badge */}
                <div className="rounded-xl border px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 bg-background">
                  <span className="text-muted-foreground text-[11px] uppercase tracking-wider">
                    Payment:
                  </span>
                  <span
                    className={`font-semibold ${
                      order.payment_status === "Paid"
                        ? "text-emerald-700"
                        : order.payment_status === "Failed"
                          ? "text-rose-700"
                          : "text-amber-700"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </div>

                {/* Order Status Badge */}
                <div className="rounded-xl border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent flex items-center gap-1.5">
                  <span className="text-muted-foreground text-[11px] uppercase tracking-wider">
                    Status:
                  </span>
                  <span>{order.status}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-[var(--shadow-card)]">
              <h3 className="font-display text-xl text-primary mb-6">
                Delivery Timeline
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 relative">
                {TIMELINE_STEPS.map((step, idx) => {
                  const isCompleted = idx <= activeStepIdx;
                  const isCurrent = idx === activeStepIdx;

                  return (
                    <div
                      key={step.key}
                      className="flex flex-col items-center text-center relative group"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isCompleted
                            ? "bg-accent text-accent-foreground shadow-sm"
                            : "bg-muted text-muted-foreground/60"
                        } ${isCurrent ? "ring-4 ring-accent/20 scale-105" : ""}`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <span className="text-[11px]">{idx + 1}</span>
                        )}
                      </div>
                      <span
                        className={`mt-2.5 text-[11px] leading-tight transition-colors ${
                          isCompleted
                            ? "font-semibold text-primary"
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

            {/* Courier & Shipping Information */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl text-primary flex items-center gap-2">
                  <Truck size={20} className="text-accent" /> Shipping Information
                </h3>
              </div>

              {isShipped ? (
                <div className="grid md:grid-cols-3 gap-6 items-center p-5 rounded-xl bg-background border border-border">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      Courier Partner
                    </div>
                    <div className="mt-1 text-base font-semibold text-primary">
                      {order.courier || "DTDC"}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      Tracking ID (AWB)
                    </div>
                    <div className="mt-1 text-base font-mono font-bold text-primary">
                      {order.tracking_id || "Awaiting Tracking ID"}
                    </div>
                  </div>

                  <div className="md:text-right">
                    {order.tracking_id ? (
                      <a
                        href={getCourierTrackingLink(
                          order.courier,
                          order.tracking_id,
                          order.tracking_url,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold inline-flex items-center gap-1.5 text-xs py-2.5 px-5"
                      >
                        Track Shipment <ExternalLink size={13} />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Tracking number will update shortly
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-muted/40 border border-border text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      Your order is currently being prepared.
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Shipping information, courier assignment, and your tracking ID will appear here
                      immediately after dispatch.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Products & Delivery Address Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Items List */}
              <div className="md:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-[var(--shadow-card)]">
                <h3 className="font-display text-xl text-primary mb-4 flex items-center gap-2">
                  <Package size={18} className="text-accent" /> Ordered Products
                </h3>
                <div className="divide-y divide-border">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="py-3 flex items-center justify-between gap-4 text-sm"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate">
                          {item.product_name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Qty: {item.quantity} × ₹{Number(item.unit_price).toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="font-semibold text-primary shrink-0">
                        ₹{Number(item.line_total).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{Number(order.subtotal || order.total).toLocaleString("en-IN")}</span>
                  </div>
                  {order.shipping > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping Fee</span>
                      <span>₹{Number(order.shipping).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t border-border">
                    <span>Total Amount</span>
                    <span>₹{Number(order.total).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-[var(--shadow-card)] flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl text-primary mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-accent" /> Shipping Address
                  </h3>
                  <div className="text-xs leading-relaxed text-muted-foreground space-y-1">
                    <div className="font-semibold text-foreground text-sm">
                      {order.customer_name}
                    </div>
                    <div>{order.address}</div>
                    <div>
                      {order.city}, {order.state} - {order.pincode}
                    </div>
                    <div className="pt-2 text-[11px] text-muted-foreground">
                      Phone: {order.customer_phone}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Email: {order.customer_email}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span>Verified ChocoVibes Direct Delivery</span>
                </div>
              </div>
            </div>

            {/* Back to Account Link */}
            <div className="text-center pt-4">
              <Link
                to="/account"
                className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1"
              >
                View all your orders in My Account <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
