import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { RotateCw, ShieldCheck, AlertCircle } from "lucide-react";
import { formatINR, useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — ChocoVibes" },
      {
        name: "description",
        content: "Complete your ChocoVibes artisanal chocolate order.",
      },
    ],
  }),
  component: Checkout,
});

interface RazorpayWindow extends Window {
  Razorpay?: new (options: unknown) => {
    open: () => void;
    on: (
      event: string,
      handler: (response: { error: { description?: string } }) => void,
    ) => void;
  };
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as unknown as RazorpayWindow).Razorpay) return resolve(true);
    const existing = document.getElementById("razorpay-checkout-script");
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const nav = useNavigate();

  if (items.length === 0 && !pendingOrderId) {
    return (
      <main className="container-luxe py-32 text-center">
        <h1 className="font-display text-4xl text-primary">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Discover our artisanal chocolate bars and gift hampers.
        </p>
        <Link to="/energy-bars" className="btn-cocoa mt-6 inline-flex">
          Continue shopping
        </Link>
      </main>
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setPaymentError(null);

    const fd = new FormData(e.currentTarget);
    const customer = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      address: String(fd.get("address") ?? "").trim(),
      city: String(fd.get("city") ?? "").trim(),
      state: String(fd.get("state") ?? "").trim(),
      pincode: String(fd.get("pincode") ?? "").trim(),
      notes: String(fd.get("notes") ?? "").trim(),
      user_id: user?.id ?? null,
    };

    const cartPayload = items.map((it) => ({
      product_slug: it.product.slug,
      quantity: it.qty,
    }));

    try {
      // 1. Check stock & create order server-side with Razorpay
      const createRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartPayload,
          customer,
          payment_method: "Razorpay",
        }),
      });

      const orderData = await createRes.json();
      if (!createRes.ok || !orderData.ok) {
        throw new Error(orderData.error || "Could not process order");
      }

      const orderId = orderData.orderId;
      setPendingOrderId(orderId);

      // 2. REAL RAZORPAY PAYMENT
      const loaded = await loadRazorpayScript();
      const rzpConstructor = (window as unknown as RazorpayWindow).Razorpay;
      if (!loaded || !rzpConstructor) {
        throw new Error(
          "Unable to connect to Razorpay payment gateway. Please check your network.",
        );
      }

      const rzpOptions = {
        key: orderData.keyId,
        amount: orderData.amountInPaise,
        currency: orderData.currency || "INR",
        name: "ChocoVibes",
        description: `Artisanal Chocolate Order #${orderData.orderNumber}`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: {
          color: "#3d2314",
        },
        modal: {
          ondismiss: () => {
            setBusy(false);
            setPaymentError(
              "Payment was not completed. You can retry paying whenever you are ready.",
            );
            toast.error("Payment was not completed.");
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            toast.loading("Verifying your payment…", { id: "verify-toast" });

            // 4. VERIFY SIGNATURE SERVER-SIDE
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            toast.dismiss("verify-toast");

            if (!verifyRes.ok || !verifyData.ok) {
              setPaymentError(
                verifyData.error || "Payment verification failed.",
              );
              toast.error(verifyData.error || "Payment verification failed.");
              return;
            }

            toast.success("Payment successful! Your order has been confirmed.");
            clear();
            nav({ to: `/order/${orderId}` });
          } catch (err: unknown) {
            toast.dismiss("verify-toast");
            const msg =
              err instanceof Error ? err.message : "Payment verification error";
            setPaymentError(msg);
            toast.error("Error verifying payment with server");
          } finally {
            setBusy(false);
          }
        },
      };

      const razorpayInstance = new rzpConstructor(rzpOptions);

      razorpayInstance.on(
        "payment.failed",
        (response: { error: { description?: string } }) => {
          console.error("Razorpay payment failed:", response.error);
          setPaymentError(
            `Payment was not completed: ${response.error?.description || "Transaction failed."}`,
          );
          toast.error("Payment was not completed.");
          setBusy(false);
        },
      );

      razorpayInstance.open();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Could not complete checkout";
      toast.error(msg);
      setPaymentError(msg);
      setBusy(false);
    }
  }

  return (
    <main className="container-luxe py-16">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent mb-2">
        <ShieldCheck size={16} /> Secure Checkout
      </div>
      <h1 className="font-display text-5xl text-primary">Checkout</h1>

      {!user && (
        <p className="mt-3 text-sm text-muted-foreground">
          Checking out as guest.{" "}
          <Link to="/auth" className="text-accent hover:underline">
            Sign in
          </Link>{" "}
          to track this order in your customer account.
        </p>
      )}

      {/* Payment Error / Retry Banner */}
      {paymentError && (
        <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-destructive">
            <AlertCircle size={20} className="shrink-0" />
            <div>
              <p className="font-semibold">Payment was not completed</p>
              <p className="text-xs text-muted-foreground">{paymentError}</p>
            </div>
          </div>
          {pendingOrderId && (
            <Link
              to={`/order/${pendingOrderId}`}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary/90 shrink-0"
            >
              View Pending Order
            </Link>
          )}
        </div>
      )}

      <form
        onSubmit={submit}
        className="mt-10 grid lg:grid-cols-[1fr_400px] gap-12"
      >
        <div className="space-y-8">
          {/* Customer Contact */}
          <section>
            <h2 className="eyebrow">Contact Information</h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <Field
                label="Full Name"
                name="name"
                required
                placeholder="John Doe"
              />
              <Field
                label="Email Address"
                name="email"
                type="email"
                defaultValue={user?.email ?? ""}
                required
                placeholder="you@example.com"
              />
              <div className="sm:col-span-2">
                <Field
                  label="Mobile Phone Number (for DTDC delivery updates)"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section>
            <h2 className="eyebrow">Delivery Address</h2>
            <div className="mt-4 grid gap-4">
              <Field
                label="Street Address / Flat / Building"
                name="address"
                required
                placeholder="123 Cocoa Lane, Bandra West"
              />
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="City" name="city" required placeholder="Mumbai" />
                <Field
                  label="State"
                  name="state"
                  required
                  placeholder="Maharashtra"
                />
                <Field
                  label="Pincode"
                  name="pincode"
                  required
                  placeholder="400050"
                />
              </div>
              <Field
                label="Delivery Notes (optional)"
                name="notes"
                placeholder="e.g. Leave with security, fragile gift box"
              />
            </div>
          </section>

          {/* Payment Method */}
          <section>
            <h2 className="eyebrow">Payment Method</h2>
            <div className="mt-4">
              <div className="rounded-xl border border-accent bg-accent/5 ring-2 ring-accent/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg text-primary font-medium">
                      Razorpay
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-accent/10 text-accent">
                      Online Payment
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1.5">
                    UPI (Google Pay, PhonePe, Paytm), Credit &amp; Debit Cards,
                    Netbanking, Wallets
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-accent shrink-0">
                  <span className="w-3.5 h-3.5 rounded-full border border-accent bg-accent flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                  <span>Prepaid Online</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Order Summary Aside */}
        <aside className="h-fit rounded-2xl border border-border bg-card p-6 sticky top-24 shadow-sm">
          <h2 className="eyebrow">Order Summary</h2>
          <div className="mt-4 space-y-3 max-h-64 overflow-auto divide-y divide-border/60">
            {items.map((it) => {
              const price = it.product.salePrice ?? it.product.price;
              return (
                <div
                  key={it.product.slug}
                  className="pt-2.5 first:pt-0 flex justify-between text-sm"
                >
                  <div>
                    <div className="text-primary/90 font-medium">
                      {it.product.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Qty: {it.qty} × {formatINR(price)}
                    </div>
                  </div>
                  <span className="font-medium text-primary">
                    {formatINR(price * it.qty)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-primary">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="text-accent font-medium">
                {subtotal >= 999 ? "Free" : "₹99"}
              </span>
            </div>
            <div className="flex justify-between font-display text-2xl text-primary pt-3 border-t border-border font-bold">
              <span>Total</span>
              <span>
                {formatINR(subtotal >= 999 ? subtotal : subtotal + 99)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="btn-gold w-full mt-6 py-3.5 text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
          >
            {busy ? (
              <>
                <RotateCw size={16} className="animate-spin" />
                Processing…
              </>
            ) : (
              `Pay Now (${formatINR(subtotal >= 999 ? subtotal : subtotal + 99)})`
            )}
          </button>

          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Secured by Razorpay. 100% genuine SSL encrypted online payment.
          </p>
        </aside>
      </form>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-medium">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
      />
    </label>
  );
}
