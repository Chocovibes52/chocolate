import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Sparkles,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { productsByCategoryQuery, testimonialsQuery } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import story from "@/assets/story.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ChocoVibes — Artisan Chocolate Energy Bars & Gift Hampers" },
      {
        name: "description",
        content:
          "Handcrafted single-origin chocolate energy bars and curated gift hampers. Small batch, ethically sourced, delivered fresh.",
      },
      {
        property: "og:title",
        content: "ChocoVibes — Artisan Chocolate Energy Bars & Gift Hampers",
      },
      {
        property: "og:description",
        content:
          "Handcrafted single-origin chocolate energy bars and curated gift hampers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const banners = [
  {
    image: hero1,
    eyebrow: "Signature Collection",
    heading: "Chocolate,\ncrafted with obsession.",
    sub: "Single-origin cacao. Hand-tempered in small batches. Delivered to your door.",
    cta: "Shop Energy Bars",
    to: "/energy-bars",
  },
  {
    image: hero2,
    eyebrow: "Gifting Season",
    heading: "The art of\nunforgettable gifting.",
    sub: "Curated hampers, hand-tied in silk. Presented in lacquered walnut boxes.",
    cta: "Explore Hampers",
    to: "/gift-hampers",
  },
];

function Home() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % banners.length), 6500);
    return () => clearInterval(t);
  }, []);

  const { data: barsAll = [] } = useQuery(
    productsByCategoryQuery("energy-bars"),
  );
  const { data: hampersAll = [] } = useQuery(
    productsByCategoryQuery("gift-hampers"),
  );
  const { data: testimonials = [] } = useQuery(testimonialsQuery());

  const bars = barsAll.filter((p) => p.bestSeller).slice(0, 3);
  const hampers = hampersAll.filter((p) => p.bestSeller).slice(0, 3);
  const testis = testimonials.length
    ? testimonials.slice(0, 3)
    : [
        {
          id: "1",
          author: "Aarav M.",
          role: null,
          quote:
            "Genuinely the most refined dark chocolate bar I've had in India. The packaging alone is worth it.",
          rating: 5,
        },
        {
          id: "2",
          author: "Riya S.",
          role: null,
          quote:
            "Sent the Grand Reserve hamper to a client. Received a hand-written thank you the next day.",
          rating: 5,
        },
        {
          id: "3",
          author: "Kabir V.",
          role: null,
          quote:
            "I eat one after every training session. Clean energy, no crash, and unreasonably delicious.",
          rating: 5,
        },
      ];

  return (
    <main>
      <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden">
        {banners.map((b, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ${
              idx === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={b.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container-luxe">
                <div className="max-w-xl text-primary-foreground animate-fade-up">
                  <div className="eyebrow !text-accent">{b.eyebrow}</div>
                  <h1 className="mt-5 font-display text-5xl md:text-7xl leading-[1.05] whitespace-pre-line">
                    {b.heading}
                  </h1>
                  <p className="mt-6 text-base md:text-lg text-primary-foreground/80 max-w-md">
                    {b.sub}
                  </p>
                  <Link
                    to={b.to}
                    className="btn-gold mt-8 inline-flex items-center gap-2"
                  >
                    {b.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
          <button
            onClick={() =>
              setI((v) => (v - 1 + banners.length) % banners.length)
            }
            className="w-10 h-10 rounded-full border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary transition flex items-center justify-center"
            aria-label="Previous"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-[2px] transition-all ${
                  idx === i ? "w-10 bg-accent" : "w-6 bg-primary-foreground/40"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setI((v) => (v + 1) % banners.length)}
            className="w-10 h-10 rounded-full border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary transition flex items-center justify-center"
            aria-label="Next"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      <section className="container-luxe py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <div className="eyebrow">The Collections</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-primary">
            Three ways to indulge.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Energy Bars",
              desc: "Sustained clean energy, dark chocolate depth.",
              to: "/energy-bars",
              img: hero1,
            },
            {
              title: "Gift Hampers",
              desc: "Curated boxes, hand-tied in silk.",
              to: "/gift-hampers",
              img: hero2,
            },
            {
              title: "Corporate & B2B",
              desc: "Wholesale, private label, and bulk gifting.",
              to: "/b2b",
              img: story,
            },
          ].map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl block"
            >
              <img
                src={c.img}
                alt={c.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-primary-foreground">
                <h3 className="font-display text-3xl">{c.title}</h3>
                <p className="mt-2 text-sm text-primary-foreground/80 max-w-xs">
                  {c.desc}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-accent text-xs uppercase tracking-[0.2em]">
                  Explore <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-luxe py-10 md:py-16">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="eyebrow">Best Selling</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-primary">
              Energy bars, elevated.
            </h2>
          </div>
          <Link
            to="/energy-bars"
            className="btn-outline-cocoa inline-flex items-center gap-2"
          >
            Shop all bars <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bars.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="container-luxe py-16 md:py-24">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="eyebrow">Premium Gifting</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-primary">
              Gift hampers to remember.
            </h2>
          </div>
          <Link
            to="/gift-hampers"
            className="btn-outline-cocoa inline-flex items-center gap-2"
          >
            See collection <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hampers.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-secondary py-20 md:py-28 mt-10">
        <div className="container-luxe">
          <div className="text-center max-w-xl mx-auto">
            <div className="eyebrow">Why ChocoVibes</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-primary">
              A different kind of chocolate.
            </h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-4">
            {[
              {
                Icon: Leaf,
                title: "Premium Ingredients",
                desc: "Single-origin cacao, no refined sugar, no shortcuts.",
              },
              {
                Icon: Sparkles,
                title: "Healthy Nutrition",
                desc: "Balanced macros, real food fuel, indulgence without guilt.",
              },
              {
                Icon: Truck,
                title: "Fast Delivery",
                desc: "Temperature-controlled shipping across India.",
              },
              {
                Icon: ShieldCheck,
                title: "Secure Payments",
                desc: "100% secure encrypted online payment with Razorpay.",
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="mx-auto w-14 h-14 rounded-full border border-accent/40 flex items-center justify-center text-accent">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 font-display text-xl text-primary">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-[220px] mx-auto">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-luxe py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative aspect-[5/4] rounded-2xl overflow-hidden shadow-[var(--shadow-luxe)]">
            <img
              src={story}
              alt="Corporate gifting"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="eyebrow">Corporate & Bulk</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-primary">
              Gifting that speaks for you.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed max-w-md">
              From boardroom favours to festival hampers of 5,000+ units — we
              handle private label, custom packaging and nationwide fulfillment.
              Tell us what you're planning.
            </p>
            <Link
              to="/b2b"
              className="btn-cocoa mt-8 inline-flex items-center gap-2"
            >
              Send Enquiry <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-24">
        <div className="container-luxe">
          <div className="text-center max-w-xl mx-auto">
            <div className="eyebrow">Kind words</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              Loved by connoisseurs.
            </h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {testis.map((t) => (
              <figure
                key={t.id}
                className="border border-primary-foreground/10 rounded-2xl p-8 backdrop-blur bg-primary-foreground/[0.03]"
              >
                <div className="text-accent font-display text-4xl leading-none">
                  “
                </div>
                <blockquote className="mt-3 text-primary-foreground/85 leading-relaxed">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 text-xs tracking-[0.2em] uppercase text-primary-foreground/60">
                  — {t.author}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="container-luxe py-20 md:py-28">
        <div className="text-center">
          <div className="eyebrow">@chocovibes</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-primary">
            From the studio.
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-6 gap-2">
          {[hero1, hero2, story, hero1, hero2, story].map((src, idx) => (
            <a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="relative aspect-square overflow-hidden group"
            >
              <img
                src={src}
                alt="Instagram"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition" />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
