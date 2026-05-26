import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { BUSINESS, yearsExperience } from "@/data/business";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.71a8.16 8.16 0 0 0 4.93 1.62V6.88a4.84 4.84 0 0 1-2-.19Z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div className="container-wide section-tight">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand + about */}
          <div className="md:col-span-5">
            <Link
              to="/"
              className="inline-flex items-baseline gap-2 font-display text-2xl uppercase tracking-wide"
            >
              <span className="text-white">Ararat</span>
              <span className="text-accent-soft">Skredderi</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              Profesjonell skreddersøm, reparasjon, omforming og skomakeri i
              hjertet av Oslo. Over {yearsExperience} års erfaring med
              kvalitetshåndverk.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={BUSINESS.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Ararat Skredderi på Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-accent hover:scale-110"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={BUSINESS.social.tiktok}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Ararat Skredderi på TikTok"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-accent hover:scale-110"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h2 className="font-display text-lg uppercase tracking-wide text-white">
              Kontakt
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-soft" />
                <a
                  href={BUSINESS.address.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-white"
                >
                  {BUSINESS.address.street}
                  <br />
                  {BUSINESS.address.postalCode} {BUSINESS.address.city}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent-soft" />
                <a
                  href={`tel:${BUSINESS.contact.phoneE164}`}
                  className="hover:text-white"
                >
                  {BUSINESS.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent-soft" />
                <a
                  href={`mailto:${BUSINESS.contact.email}`}
                  className="hover:text-white"
                >
                  {BUSINESS.contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="md:col-span-3">
            <h2 className="font-display text-lg uppercase tracking-wide text-white">
              Åpningstider
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {BUSINESS.hours.map((h) => (
                <li key={h.days} className="flex items-baseline justify-between gap-3">
                  <span>{h.days}</span>
                  <span className="font-mono text-white/60">
                    {h.closed ? "Stengt" : `${h.open}–${h.close}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} Ararat Skredderi · Org.nr {BUSINESS.orgNumber} ·
            Drevet av{" "}
            <a
              href="https://www.medcom.no"
              target="_blank"
              rel="noreferrer noopener"
              className="underline-offset-4 hover:text-white hover:underline"
            >
              Medcom
            </a>
          </p>
          <Link to="/personvern" className="hover:text-white">
            Personvern
          </Link>
        </div>
      </div>
    </footer>
  );
}
