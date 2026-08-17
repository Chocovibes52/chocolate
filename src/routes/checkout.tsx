import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { formatINR, useCart } from "@/lib/cart-context";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — ChocoVibes" }, { name: "description", content: "Complete your ChocoVibes order." }] }),
  component: Checkout,
});

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const [method, setMethod] = useState<"razorpay" | "cod">("razorpay");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  if (items.length === 0) {
    return (
      <main className="container-luxe py-32 text-center">
        <h1 className="font-display text-4xl text-primary">Your cart is empty</h1>
        <Link to="/energy-bars" className="btn-cocoa mt-6 inline-flex">Continue shopping</Link>
      </main>
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const total = subtotal;
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id ?? null,
          customer_name: String(fd.get("name") ?? "").trim(),
          customer_email: String(fd.get("email") ?? "").trim(),
          customer_phone: String(fd.get("phone") ?? "").trim(),
          address: String(fd.get("address") ?? "").trim(),
          city: String(fd.get("city") ?? "").trim(),
          state: String(fd.get("state") ?? "").trim(),
          pincode: String(fd.get("pincode") ?? "").trim(),
          subtotal,
          shipping: 0,
          total,
          payment_method: method,
          payment_status: "pending",
          status: "pending",
        })
        .select("id")
        .single();
      if (error) throw error;

      const rows = items.map((it) => {
        const unit = it.product.salePrice ?? it.product.price;
        return {
          order_id: order.id,
          product_slug: it.product.slug,
          product_name: it.product.name,
          unit_price: unit,
          quantity: it.qty,
          line_total: unit * it.qty,
        };
      });
      const { error: itemsErr } = await supabase.from("order_items").insert(rows);
      if (itemsErr) throw itemsErr;

      toast.success("Order placed! We'll email you the details. (Payment gateway coming next.)");
      clear();
      nav({ to: user ? "/account" : "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container-luxe py-16">
      <h1 className="font-display text-5xl text-primary">Checkout</h1>
      {!user && (
        <p className="mt-3 text-sm text-muted-foreground">
          Checking out as guest. <Link to="/auth" className="text-accent">Sign in</Link> to track this order in your account.
        </p>
      )}
      <form onSubmit={submit} className="mt-10 grid lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-8">
          <section>
            <h2 className="eyebrow">Contact</h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" name="name" required />
              <Field label="Email" name="email" type="email" defaultValue={user?.email ?? ""} required />
              <Field label="Mobile Number" name="phone" type="tel" required />
            </div>
          </section>
          <section>
            <h2 className="eyebrow">Shipping Address</h2>
            <div className="mt-4 grid gap-4">
              <Field label="Address" name="address" required />
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="City" name="city" required />
                <Field label="State" name="state" required />
                <Field label="Pincode" name="pincode" required />
              </div>
            </div>
          </section>
          <section>
            <h2 className="eyebrow">Payment Method</h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {[
                { id: "razorpay", label: "Razorpay", desc: "Cards, UPI, netbanking, wallets" },
                { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id as typeof method)}
                  className={`text-left rounded-xl border p-5 transition ${
                    method === m.id ? "border-accent bg-accent/5" : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="font-display text-lg text-primary">{m.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{m.desc}</div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 sticky top-24">
          <h2 className="eyebrow">Order Summary</h2>
          <div className="mt-4 space-y-3 max-h-64 overflow-auto">
            {items.map((it) => (
              <div key={it.product.slug} className="flex justify-between text-sm">
                <span className="text-primary/80">{it.product.name} × {it.qty}</span>
                <span>{formatINR((it.product.salePrice ?? it.product.price) * it.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>Free</span></div>
            <div className="flex justify-between font-display text-xl text-primary pt-2"><span>Total</span><span>{formatINR(subtotal)}</span></div>
          </div>
          <button type="submit" disabled={busy} className="btn-gold w-full mt-6">
            {busy ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </form>
    </main>
  );
}

function Field({ label, name, type = "text", required, defaultValue }: { label: string; name: string; type?: string; required?: boolean; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
      />
    </label>
  );
}
