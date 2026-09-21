import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
const logo = { url: "/brand/chocovibes-mark.png" };

export function Footer() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container-luxe py-16 grid gap-12 md:grid-cols-4">
        <div>
          <img
            src={logo.url}
            alt="ChocoVibes"
            className="h-16 w-auto bg-primary-foreground rounded-lg p-2"
          />
          <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed max-w-xs">
            Small-batch, single-origin chocolate crafted with obsession.
            Ethically sourced, elegantly made.
          </p>
          <div className="mt-6 flex gap-4">
            {[Instagram, Facebook, Twitter, Youtube].map((I, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="text-primary-foreground/70 hover:text-accent transition"
              >
                <I size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="eyebrow mb-4">Shop</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/energy-bars" className="hover:text-accent transition">
                Energy Bars
              </Link>
            </li>
            <li>
              <Link to="/gift-hampers" className="hover:text-accent transition">
                Gift Hampers
              </Link>
            </li>
            <li>
              <Link to="/b2b" className="hover:text-accent transition">
                Corporate & B2B
              </Link>
            </li>
            <li>
              <Link to="/track-order" className="hover:text-accent transition">
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4">Company</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-accent transition">
                Our Story
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent transition">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-accent transition">
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/policies/$type"
                params={{ type: "shipping" }}
                className="hover:text-accent transition"
              >
                Shipping
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4">Get in touch</div>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li>
              <a
                href="mailto:Chocovibes52@gmail.com"
                className="hover:text-accent transition"
              >
                Chocovibes52@gmail.com
              </a>
            </li>
            <li>
              <a
                href="tel:+919662034448"
                className="hover:text-accent transition"
              >
                +91 96620 34448
              </a>
            </li>
            <li>
              F9, Om Shivam Complex,
              <br />
              nr. Gangeshwar Mahadev Mandir,
              <br />
              Chatrapati Shivaji Nagar, Adajan Gam,
              <br />
              Adajan, Surat, Gujarat 395009
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container-luxe py-6 flex flex-col sm:flex-row gap-3 justify-between text-xs text-primary-foreground/60">
          <div>
            © {new Date().getFullYear()} ChocoVibes. All rights reserved.
          </div>
          <div className="flex gap-5">
            <Link
              to="/policies/$type"
              params={{ type: "privacy" }}
              className="hover:text-accent"
            >
              Privacy
            </Link>
            <Link
              to="/policies/$type"
              params={{ type: "terms" }}
              className="hover:text-accent"
            >
              Terms
            </Link>
            <Link
              to="/policies/$type"
              params={{ type: "refund" }}
              className="hover:text-accent"
            >
              Refund
            </Link>
            <Link
              to="/policies/$type"
              params={{ type: "shipping" }}
              className="hover:text-accent"
            >
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
