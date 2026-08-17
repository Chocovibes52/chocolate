import { createFileRoute, notFound } from "@tanstack/react-router";

const POLICIES: Record<string, { title: string; body: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "ChocoVibes respects your privacy. We collect only the information required to process your order and improve your experience.",
      "We never sell personal data to third parties. Payment information is handled securely by Razorpay and never stored on our servers.",
      "You may request access, correction, or deletion of your data at any time by writing to hello@chocovibes.co.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    body: [
      "By purchasing from ChocoVibes, you agree to these terms. Prices are in INR and inclusive of taxes unless stated otherwise.",
      "We reserve the right to cancel or modify orders in case of product unavailability, pricing errors, or suspected fraudulent activity.",
      "All product images, copy, and branding are the intellectual property of ChocoVibes and may not be reproduced without permission.",
    ],
  },
  shipping: {
    title: "Shipping Policy",
    body: [
      "Orders are dispatched within 1–2 business days from our Mumbai studio. Standard delivery takes 3–6 business days across India.",
      "We ship in temperature-controlled packaging from April to September to protect chocolate quality.",
      "Free shipping is available on orders above ₹999. Below that, a flat ₹99 delivery fee applies.",
    ],
  },
  refund: {
    title: "Refund Policy",
    body: [
      "We accept returns on damaged or defective products only. Please email hello@chocovibes.co with a photo within 48 hours of delivery.",
      "Approved refunds are processed to the original payment method within 5–7 business days.",
      "Due to the perishable nature of chocolate, we cannot accept returns on opened or partially consumed products.",
    ],
  },
};

export const Route = createFileRoute("/policies/$type")({
  loader: ({ params }) => {
    const policy = POLICIES[params.type];
    if (!policy) throw notFound();
    return { policy };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.policy.title} — ChocoVibes` },
          { name: "description", content: loaderData.policy.body[0] },
        ]
      : [{ title: "Policy — ChocoVibes" }],
  }),
  component: PolicyPage,
});

function PolicyPage() {
  const { policy } = Route.useLoaderData();
  return (
    <main className="container-luxe py-20 max-w-3xl">
      <div className="eyebrow">Policy</div>
      <h1 className="mt-3 font-display text-5xl text-primary">{policy.title}</h1>
      <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
        {policy.body.map((p: string, i: number) => <p key={i}>{p}</p>)}
      </div>
      <p className="mt-10 text-xs text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</p>
    </main>
  );
}
