import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESS } from "@/data/business";

const NAV = [
  { to: "/", label: "Hjem", end: true },
  { to: "/tjenester", label: "Tjenester" },
  { to: "/galleri", label: "Galleri" },
  { to: "/om-oss", label: "Om oss" },
  { to: "/kontakt", label: "Kontakt" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // On the home route we sit on top of the dark hero. Until the user
  // scrolls we flip the logo + nav to a light palette so they read
  // against the navy photo. We also paint a subtle dark gradient
  // BEHIND the header (not over the hero) so the white text stays
  // readable even in light-mode browsers where the body background
  // would otherwise be white — the gradient gives the brand a tinted
  // backdrop without changing how the hero photo looks.
  const overHero = pathname === "/" && !scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : overHero
            ? "bg-gradient-to-b from-navy-dark/90 via-navy-dark/60 to-transparent"
            : "bg-transparent",
      )}
    >
      <div className="container-wide flex h-16 items-center justify-between md:h-20">
        <Link
          to="/"
          className="group inline-flex items-baseline gap-2 font-display text-xl uppercase tracking-wide md:text-2xl"
          aria-label="Ararat Skredderi, til forsiden"
        >
          <span className={overHero ? "text-white" : "text-navy"}>Ararat</span>
          <span className={overHero ? "text-accent-soft" : "text-accent"}>
            Skredderi
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Hovedmeny">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-navy text-white"
                    : overHero
                      ? "text-white/85 hover:bg-white/10 hover:text-white"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href={`tel:${BUSINESS.contact.phoneE164}`}
            className="ml-3 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:scale-105"
          >
            <Phone className="h-4 w-4" />
            {BUSINESS.contact.phone}
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? "Lukk meny" : "Åpne meny"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden",
            overHero ? "bg-white text-navy" : "bg-navy text-white",
          )}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-40 bg-background transition-[opacity,transform] duration-300 md:hidden",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <nav className="container-wide flex flex-col gap-1 pt-6" aria-label="Mobilmeny">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "rounded-2xl px-5 py-4 text-lg font-medium transition-colors",
                  isActive
                    ? "bg-navy text-white"
                    : "text-foreground hover:bg-muted",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href={`tel:${BUSINESS.contact.phoneE164}`}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-4 text-lg font-semibold text-accent-foreground shadow-lg shadow-accent/20"
          >
            <Phone className="h-5 w-5" />
            Ring {BUSINESS.contact.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
