import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — ChocoVibes" },
      { name: "description", content: "Answers to common questions about ChocoVibes chocolate, shipping and gifting." },
      { property: "og:title", content: "FAQ — ChocoVibes" },
      { property: "og:description", content: "Answers to common questions about ChocoVibes." },
    ],
  }),
  component: FAQ,
});

const faqs = [
  { q: "Where is ChocoVibes made?", a: "Every batch is tempered by hand in our Mumbai studio, using cacao sourced from the Western Ghats and single-origin partners abroad." },
  { q: "How is chocolate shipped in summer?", a: "We ship in temperature-controlled insulated packaging from April to September, and pause dispatches during heatwaves." },
  { q: "Do you offer corporate gifting?", a: "Yes — visit our Corporate & B2B page to send an enquiry. We handle everything from 50 to 50,000 units with custom packaging." },
  { q: "Are your products vegan or gluten-free?", a: "Our dark chocolate bars are vegan; several are gluten-free. Each product page lists ingredients and allergens." },
  { q: "What is your return policy?", a: "We accept returns on damaged or defective items within 48 hours of delivery. See our Refund Policy for details." },
  { q: "Do you deliver internationally?", a: "Currently we ship across India. International shipping is in the works — join our list to be notified." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <main>
      <section className="container-luxe pt-20 text-center max-w-2xl mx-auto">
        <div className="eyebrow">Help</div>
        <h1 className="mt-3 font-display text-5xl md:text-6xl text-primary">Frequently asked.</h1>
      </section>
      <section className="container-luxe py-16 max-w-3xl mx-auto">
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f, idx) => (
            <div key={idx}>
              <button onClick={() => setOpen(open === idx ? null : idx)} className="w-full flex items-center justify-between py-5 text-left">
                <span className="font-display text-xl text-primary">{f.q}</span>
                <ChevronDown className={`transition ${open === idx ? "rotate-180 text-accent" : "text-muted-foreground"}`} size={18} />
              </button>
              {open === idx && <p className="pb-6 text-muted-foreground leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
