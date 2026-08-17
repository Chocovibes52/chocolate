import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
const logo = { url: "/brand/chocovibes-mark.png" };

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { count } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeAtDesktop = window.matchMedia("(min-width: 768px)");
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    closeAtDesktop.addEventListener("change", handleDesktopChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      closeAtDesktop.removeEventListener("change", handleDesktopChange);
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { to: "/shop", label: "Shop" },
    { to: "/energy-bars", label: "Energy Bars" },
    { to: "/gift-hampers", label: "Gift Hampers" },
    { to: "/b2b", label: "Corporate & B2B" },
    { to: "/about", label: "Our Story" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-[100] transition-all duration-500 ${
        scrolled ? "bg-background/90 backdrop-blur border-b border-border shadow-sm" : "bg-background/60 backdrop-blur-sm"
      }`}
    >
      <div className="container-luxe flex items-center justify-between h-16 md:h-20">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative z-10 min-h-11 min-w-11 text-primary hover:bg-muted md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <span className="relative block h-5 w-5" aria-hidden="true">
            <span className={`absolute left-0 top-1 h-0.5 w-5 bg-current transition-transform duration-250 ${open ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`absolute left-0 top-2.5 h-0.5 w-5 bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 top-4 h-0.5 w-5 bg-current transition-transform duration-250 ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </span>
        </Button>

        <Link to="/" className="flex items-center gap-2 group" aria-label="ChocoVibes home">
          <img src={logo.url} alt="ChocoVibes" className="h-10 md:h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="gold-underline text-[0.78rem] uppercase tracking-[0.18em] text-primary/80 hover:text-primary transition"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-primary">
          <button aria-label="Search" className="hidden sm:block hover:text-accent transition">
            <Search size={18} />
          </button>
          <Link to={user ? "/account" : "/auth"} aria-label="Account" className="hover:text-accent transition relative">
            <User size={18} />
            {user && (
              <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-accent" />
            )}
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative hover:text-accent transition">
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 text-[10px] rounded-full bg-accent text-accent-foreground flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {mounted && createPortal(
        <div
          className={`fixed inset-x-0 bottom-0 top-16 z-[90] md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
          aria-hidden={!open}
        >
          <Button
            type="button"
            variant="ghost"
            aria-label="Close navigation menu"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className={`absolute inset-0 h-full w-full rounded-none bg-primary/20 p-0 backdrop-blur-[2px] transition-opacity duration-250 hover:bg-primary/20 ${open ? "opacity-100" : "opacity-0"}`}
          />
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className={`absolute inset-x-0 top-0 max-h-full overflow-y-auto overscroll-contain border-t border-border bg-background shadow-luxe transition-[transform,opacity] duration-250 ease-out ${open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
          >
            <div className="container-luxe py-4">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center border-b border-border font-display text-2xl text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  activeProps={{ className: "text-accent" }}
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to={user ? "/account" : "/auth"}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="flex min-h-14 items-center font-display text-2xl text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              >
                {user ? "Account" : "Sign in"}
              </Link>
            </div>
          </nav>
        </div>,
        document.body,
      )}
    </header>
  );
}
