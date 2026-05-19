import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQAccordion } from "@/components/FAQAccordion";
import { BUSINESS } from "@/data/business";
import { generalFaqs } from "@/data/faqs";

export default function Kontakt() {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?q=Ararat+Skredderi+Torggata+8+Oslo&zoom=16&key=DUMMY`;

  return (
    <>
      <SEO
        title={`Kontakt — Torggata 8, Oslo · Ring ${BUSINESS.contact.phone}`}
        description={`Kontakt Ararat Skredderi i Torggata 8, 0181 Oslo. Drop-in mandag–lørdag. Ring ${BUSINESS.contact.phone} eller send e-post.`}
        canonical={BUSINESS.domain + "/kontakt"}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: `${BUSINESS.domain}/kontakt`,
            name: "Kontakt Ararat Skredderi",
            mainEntity: { "@id": `${BUSINESS.domain}/#localbusiness` },
          },
        ]}
      />

      <div className="container-wide pt-6">
        <Breadcrumbs items={[{ label: "Kontakt", href: "/kontakt" }]} />
      </div>

      <section className="container-wide pt-10 pb-12 md:pt-16 md:pb-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Kontakt</p>
          <h1 className="mt-4 text-display-1 text-foreground">
            Kom innom
            <br />
            <span className="font-serif font-medium italic text-accent">
              eller ring oss
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Drop-in mandag til lørdag — ingen avtale nødvendig. Vi gir alltid
            en ærlig vurdering og bindende prisoverslag før vi starter på
            plagget ditt.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="container-wide pb-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ContactCard
            icon={<MapPin className="h-5 w-5" />}
            title="Besøk oss"
            primary={
              <>
                {BUSINESS.address.street}
                <br />
                {BUSINESS.address.postalCode} {BUSINESS.address.city}
              </>
            }
            cta={{
              href: BUSINESS.address.googleMapsUrl,
              label: "Åpne i Google Maps",
              external: true,
            }}
          />
          <ContactCard
            icon={<Phone className="h-5 w-5" />}
            title="Ring oss"
            primary={BUSINESS.contact.phone}
            secondary="Vi svarer raskt på spørsmål, prisoverslag og avtaler."
            cta={{ href: `tel:${BUSINESS.contact.phoneE164}`, label: "Ring nå" }}
          />
          <ContactCard
            icon={<Mail className="h-5 w-5" />}
            title="Send e-post"
            primary={BUSINESS.contact.email}
            secondary="For større prosjekter, bilder eller spørsmål utenom åpningstid."
            cta={{
              href: `mailto:${BUSINESS.contact.email}`,
              label: "Send e-post",
            }}
          />
        </div>
      </section>

      {/* Map + hours */}
      <section className="bg-surface section">
        <div className="container-wide grid gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
            <iframe
              title="Kart til Ararat Skredderi"
              src={mapUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[360px] w-full"
              allowFullScreen
            />
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="eyebrow">Åpningstider</p>
              <h2 className="mt-3 text-display-2 text-foreground">
                Når vi
                <span className="font-serif italic"> har åpent</span>
              </h2>
            </div>
            <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
              {BUSINESS.hours.map((h) => (
                <li
                  key={h.days}
                  className="flex items-baseline justify-between gap-3 px-6 py-4"
                >
                  <span className="font-medium text-foreground">{h.days}</span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {h.closed ? "Stengt" : `${h.open}–${h.close}`}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-start gap-3 rounded-2xl bg-accent/5 p-5 text-sm text-foreground/80">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <p>
                For større prosjekter og brudeplagg anbefaler vi å avtale tid
                så vi setter av nok tid til konsultasjon. Drop-in fungerer
                fint for vurdering, reparasjoner og spørsmål.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container-narrow">
          <div className="text-center">
            <p className="eyebrow">Vanlige spørsmål</p>
            <h2 className="mt-3 text-display-2 text-foreground">
              Før du
              <span className="font-serif italic"> kommer innom</span>
            </h2>
          </div>
          <div className="mt-10">
            <FAQAccordion items={generalFaqs} />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-accent-gradient py-16 text-white">
        <div className="container-wide text-center">
          <h2 className="text-display-2 text-white">
            Klar for et
            <span className="font-serif italic"> møte?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/90 md:text-lg">
            Kom innom uten avtale eller ring oss for å avtale tid.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="navy" size="lg">
              <a href={`tel:${BUSINESS.contact.phoneE164}`}>
                <Phone className="h-4 w-4" />
                Ring {BUSINESS.contact.phone}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <a
                href={BUSINESS.address.googleMapsUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                Veibeskrivelse
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactCard({
  icon,
  title,
  primary,
  secondary,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  primary: React.ReactNode;
  secondary?: string;
  cta: { href: string; label: string; external?: boolean };
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-background p-6">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
        {icon}
      </div>
      <h3 className="mt-5 font-display text-xl uppercase tracking-wide text-foreground">
        {title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-foreground">{primary}</p>
      {secondary ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {secondary}
        </p>
      ) : null}
      <a
        href={cta.href}
        target={cta.external ? "_blank" : undefined}
        rel={cta.external ? "noreferrer noopener" : undefined}
        className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-accent hover:text-accent-soft"
      >
        {cta.label} →
      </a>
    </div>
  );
}
