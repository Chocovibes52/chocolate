import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — ChocoVibes" },
      {
        name: "description",
        content:
          "Reach out to ChocoVibes for customer support, custom orders, or studio visits in Surat.",
      },
      { property: "og:title", content: "Contact Us — ChocoVibes" },
      {
        property: "og:description",
        content:
          "Reach out to ChocoVibes for customer support or custom orders.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <main>
      <section className="container-luxe pt-20 text-center max-w-2xl mx-auto">
        <div className="eyebrow">Contact</div>
        <h1 className="mt-3 font-display text-5xl md:text-6xl text-primary">
          Say hello.
        </h1>
        <p className="mt-4 text-muted-foreground">
          We'd love to hear from you — for orders, collaborations, or just
          chocolate talk.
        </p>
      </section>

      <section className="container-luxe py-16 grid md:grid-cols-[1fr_1.2fr] gap-12">
        <div className="space-y-6">
          {[
            {
              Icon: Phone,
              label: "Phone",
              value: "+91 96620 34448",
              href: "tel:+919662034448",
            },
            {
              Icon: Mail,
              label: "Email",
              value: "Chocovibes52@gmail.com",
              href: "mailto:Chocovibes52@gmail.com",
            },
            {
              Icon: MapPin,
              label: "Studio",
              value:
                "F9, Om Shivam Complex, nr. Gangeshwar Mahadev Mandir, Chatrapati Shivaji Nagar, Adajan Gam, Adajan, Surat, Gujarat 395009",
            },
          ].map(({ Icon, label, value, href }) => (
            <div
              key={label}
              className="flex items-start gap-4 rounded-2xl border border-border p-5 bg-card"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Icon size={16} />
              </div>
              <div>
                <div className="eyebrow">{label}</div>
                <div className="mt-1 text-primary">
                  {href ? (
                    <a href={href} className="hover:text-accent transition">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="aspect-[5/3] rounded-2xl overflow-hidden border border-border">
            <iframe
              title="map"
              src="https://www.google.com/maps?q=Om+Shivam+Complex+Adajan+Surat+Gujarat+395009&output=embed"
              className="w-full h-full grayscale"
              loading="lazy"
            />
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            toast.success("Message sent. We'll reply soon.");
          }}
          className="rounded-2xl border border-border bg-card p-8 h-fit"
        >
          <h2 className="font-display text-3xl text-primary">Send a message</h2>
          <div className="mt-6 grid gap-4">
            <input
              required
              placeholder="Full name"
              className="rounded-lg border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:border-accent"
            />
            <input
              required
              type="email"
              placeholder="Email"
              className="rounded-lg border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:border-accent"
            />
            <input
              placeholder="Subject"
              className="rounded-lg border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:border-accent"
            />
            <textarea
              required
              rows={5}
              placeholder="Your message"
              className="rounded-lg border border-border bg-secondary px-4 py-3 text-sm resize-none focus:outline-none focus:border-accent"
            />
            <button type="submit" className="btn-cocoa self-start">
              {sent ? "Sent" : "Send message"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
