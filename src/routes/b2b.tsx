import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Building2, Factory, Gift, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/b2b")({
  head: () => ({
    meta: [
      { title: "Corporate & B2B — ChocoVibes" },
      { name: "description", content: "Wholesale, bulk orders, private label and corporate gifting from ChocoVibes." },
      { property: "og:title", content: "Corporate & B2B — ChocoVibes" },
      { property: "og:description", content: "Wholesale, bulk orders, private label and corporate gifting." },
    ],
  }),
  component: B2B,
});

function B2B() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      company: String(fd.get("company") ?? "").trim(),
      contact_person: String(fd.get("person") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      city: String(fd.get("city") ?? "").trim() || null,
      business_type: String(fd.get("type") ?? "").trim() || null,
      quantity: String(fd.get("qty") ?? "").trim() || null,
      message: String(fd.get("message") ?? "").trim() || null,
    };
    try {
      const { error } = await supabase.from("b2b_enquiries").insert(payload);
      if (error) throw error;
      toast.success("Enquiry sent. We'll be in touch shortly.");
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send enquiry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="relative bg-primary text-primary-foreground py-24 md:py-32">
        <div className="container-luxe max-w-3xl">
          <div className="eyebrow !text-accent">Corporate & Bulk</div>
          <h1 className="mt-4 font-display text-5xl md:text-6xl leading-tight">
            Gifting at scale,<br />crafted like couture.
          </h1>
          <p className="mt-6 text-primary-foreground/80 text-lg max-w-xl">
            From 50 boardroom favours to 50,000 Diwali hampers — private label, custom packaging, and nationwide fulfillment. Tell us what you're planning.
          </p>
        </div>
      </section>

      <section className="container-luxe py-20 grid md:grid-cols-4 gap-8">
        {[
          { Icon: Gift, title: "Corporate Gifting", desc: "Curated boxes for teams and clients." },
          { Icon: Package, title: "Bulk Orders", desc: "Volume pricing on our signature range." },
          { Icon: Building2, title: "Wholesale Supply", desc: "Stock ChocoVibes in your retail space." },
          { Icon: Factory, title: "Private Label", desc: "Your brand, our craft. Made to spec." },
        ].map(({ Icon, title, desc }) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-6">
            <div className="w-11 h-11 rounded-full bg-accent/10 text-accent flex items-center justify-center"><Icon size={18} /></div>
            <h3 className="mt-4 font-display text-xl text-primary">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-secondary py-20">
        <div className="container-luxe max-w-3xl">
          <div className="text-center">
            <div className="eyebrow">Enquiry</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-primary">Send us the brief.</h2>
            <p className="mt-3 text-muted-foreground">We reply within one business day.</p>
          </div>

          <form onSubmit={onSubmit} className="mt-10 grid sm:grid-cols-2 gap-4">
            <Field label="Company Name" name="company" required />
            <Field label="Contact Person" name="person" required />
            <Field label="Mobile Number" name="phone" type="tel" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="City" name="city" />
            <label className="block">
              <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Business Type</span>
              <select name="type" defaultValue="Corporate Gifting" className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm">
                <option>Corporate Gifting</option>
                <option>Retailer / Reseller</option>
                <option>Hotel / HORECA</option>
                <option>Private Label</option>
                <option>Other</option>
              </select>
            </label>
            <Field label="Required Quantity" name="qty" placeholder="e.g. 500 hampers" />
            <label className="sm:col-span-2 block">
              <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Message</span>
              <textarea name="message" rows={5} className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
            </label>
            <div className="sm:col-span-2 flex justify-end">
              <button disabled={loading} type="submit" className="btn-cocoa">{loading ? "Sending..." : "Send Enquiry"}</button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      <input name={name} type={type} required={required} placeholder={placeholder} className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
    </label>
  );
}
