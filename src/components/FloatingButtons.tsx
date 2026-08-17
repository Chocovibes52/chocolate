import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";

export function FloatingButtons() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 500);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      {show && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition animate-fade-up"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
      <a
        href="https://wa.me/919662034448"
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 rounded-full bg-[oklch(0.72_0.16_150)] text-white shadow-lg flex items-center justify-center hover:scale-105 transition"
        aria-label="WhatsApp"
      >
        <MessageCircle size={20} />
      </a>
    </div>
  );
}
