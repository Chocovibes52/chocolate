import { createFileRoute } from "@tanstack/react-router";
import story from "@/assets/story.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — ChocoVibes" },
      { name: "description", content: "The story, mission, and quality commitment behind ChocoVibes chocolate." },
      { property: "og:title", content: "Our Story — ChocoVibes" },
      { property: "og:description", content: "The story, mission, and quality commitment behind ChocoVibes." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <main>
      <section className="container-luxe pt-20 pb-10 max-w-3xl text-center mx-auto">
        <div className="eyebrow">Our Story</div>
        <h1 className="mt-4 font-display text-5xl md:text-6xl text-primary leading-tight">A love letter to cacao.</h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          ChocoVibes began in a Mumbai studio kitchen in 2019, with a single copper pot and a stubborn belief that chocolate deserved better. Today we work directly with cacao growers in the Western Ghats, tempering each batch by hand.
        </p>
      </section>

      <section className="container-luxe">
        <img src={story} alt="Cacao pods and dark chocolate" className="w-full rounded-2xl shadow-[var(--shadow-luxe)]" />
      </section>

      <section className="container-luxe py-20 grid md:grid-cols-3 gap-10">
        {[
          { title: "Mission", body: "To make chocolate that respects the pod, the grower, and the person eating it." },
          { title: "Vision", body: "A world where indulgence is thoughtful, ethical, and unashamedly beautiful." },
          { title: "Quality", body: "Single-origin cacao, no refined sugar, cold-chain shipping. No compromises." },
        ].map((s) => (
          <div key={s.title}>
            <div className="eyebrow">{s.title}</div>
            <p className="mt-4 font-display text-2xl text-primary leading-snug">{s.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
