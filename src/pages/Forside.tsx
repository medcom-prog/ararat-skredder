import { Link } from "react-router-dom";
import { ArrowRight, Award, Clock, MapPin, Phone, Star } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { QuickAnswer } from "@/components/QuickAnswer";
import { FAQAccordion } from "@/components/FAQAccordion";
import { BUSINESS, yearsExperience } from "@/data/business";
import { services } from "@/data/services";
import { galleryImages } from "@/data/gallery";
import { homeFaqs } from "@/data/faqs";

export default function Forside() {
  const heroImage = "/images/gallery/araratsowingwithmachine.jpg";
  const aboutImage = "/images/gallery/sittingwithcustomer.jpg";
  const galleryPreview = galleryImages.slice(0, 8);

  return (
    <>
      <SEO
        title="Profesjonell skreddersøm i Oslo"
        description={`${BUSINESS.shortDescription} Over ${yearsExperience} års erfaring i Torggata 8, Oslo sentrum.`}
        canonical={BUSINESS.domain + "/"}
      />

      {/* Hero — full-bleed with photo */}
      <section className="relative isolate min-h-[88vh] overflow-hidden bg-navy-dark text-white">
        <img
          src={heroImage}
          alt="Ahmad Abdulhamid arbeider ved symaskinen i Ararat Skredderi"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-90"
          loading="eager"
          width="1600"
          height="2400"
        />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />

        <div className="container-wide flex min-h-[88vh] flex-col justify-between pt-24 pb-12 md:pt-32 md:pb-20">
          <div className="max-w-3xl">
            <p className="eyebrow text-accent-soft">
              Oslo sentrum · Etablert med 50+ års håndverk
            </p>
            <h1 className="mt-4 text-display-1 text-white">
              Skreddersøm med
              <br />
              <span className="font-serif font-medium italic text-accent-soft">
                håndverkstradisjon
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              Fra målsøm av dresser til reparasjon, omforming og skomakeri. Vi
              gir plaggene dine perfekt passform — og et lengre liv. I hjertet
              av Oslo siden første sting.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild variant="primary" size="lg">
                <a href={`tel:${BUSINESS.contact.phoneE164}`}>
                  <Phone className="h-4 w-4" />
                  Ring {BUSINESS.contact.phone}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                <Link to="/tjenester">
                  Se alle tjenester
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats strip — pinned to bottom of hero */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/15 pt-6 md:mt-0 md:grid-cols-4 md:gap-8">
            <StatItem
              icon={<Award className="h-5 w-5" />}
              label="Etablert håndverk"
              value={`${yearsExperience}+ år`}
            />
            <StatItem
              icon={<Star className="h-5 w-5 fill-current text-accent-soft" />}
              label="Google-vurdering"
              value="5,0 / 5"
            />
            <StatItem
              icon={<MapPin className="h-5 w-5" />}
              label="Adresse"
              value="Torggata 8"
            />
            <StatItem
              icon={<Clock className="h-5 w-5" />}
              label="Drop-in"
              value="Man – lør"
            />
          </div>
        </div>
      </section>

      {/* Quick Answer — direct AI-citation-friendly intro */}
      <section className="section-tight">
        <div className="container-narrow">
          <QuickAnswer
            label="Kort fortalt:"
            schemaName="Hva Ararat Skredderi tilbyr"
            points={[
              {
                name: "Skreddersøm fra grunnen av",
                description: "Målsøm av dresser, skjorter og bluser etter dine mål.",
              },
              {
                name: "Reparasjon og endringer",
                description: "Lengdejustering, reparasjon av rifter, glidelåser og knapper.",
              },
              {
                name: "Omforming og skomakeri",
                description: "Gi gamle favoritter nytt liv — også skinn, hæler og såler.",
              },
              {
                name: "Sentralt i Oslo sentrum",
                description: "Torggata 8, drop-in mandag til lørdag, ring oss eller kom innom.",
              },
            ]}
          />
        </div>
      </section>

      {/* Services grid */}
      <section className="section bg-surface">
        <div className="container-wide">
          <div className="max-w-2xl">
            <p className="eyebrow">Tjenester</p>
            <h2 className="mt-3 text-display-2 text-foreground">
              Håndverk som
              <span className="font-serif italic"> varer</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Vi tar oppdrag fra de minste reparasjonene til komplette
              skreddersydde plagg. Velg en tjeneste under for å lese mer.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => (
              <Link
                key={svc.slug}
                to={`/tjenester#${svc.slug}`}
                className="group relative flex flex-col rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  <svc.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl uppercase tracking-wide text-foreground">
                  {svc.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {svc.shortDescription}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
                  <span className="font-medium text-foreground">
                    {svc.pricing.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="navy" size="lg">
              <Link to="/tjenester">
                Se alle tjenester i detalj
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="section">
        <div className="container-wide">
          <div className="flex items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="eyebrow">Galleri</p>
              <h2 className="mt-3 text-display-2 text-foreground">
                Bak
                <span className="font-serif italic"> håndverket</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Glimt fra verkstedet og lokalene i Torggata 8.
              </p>
            </div>
            <Link
              to="/galleri"
              className="hidden shrink-0 items-center gap-2 text-sm font-medium text-accent hover:text-accent-soft md:inline-flex"
            >
              Se hele galleriet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {galleryPreview.map((img, i) => (
              <Link
                key={img.src}
                to="/galleri"
                className={`group relative block overflow-hidden rounded-xl bg-muted ${
                  i === 0 || i === 5 ? "row-span-2 aspect-[3/4] md:aspect-auto" : "aspect-square"
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  width={img.width}
                  height={img.height}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-navy-dark/0 transition-colors group-hover:bg-navy-dark/30" />
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline" size="md">
              <Link to="/galleri">
                Se hele galleriet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="section bg-navy text-white">
        <div className="container-wide grid items-center gap-12 md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <img
              src={aboutImage}
              alt="Ahmad Abdulhamid i samtale med kunde i butikken"
              loading="lazy"
              width="1200"
              height="1500"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="eyebrow text-accent-soft">Om Ararat Skredderi</p>
            <h2 className="mt-3 text-display-2 text-white">
              Over {yearsExperience} år med
              <span className="font-serif italic"> personlig håndverk</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/80 md:text-lg">
              Ararat Skredderi i Torggata 8 har levert kvalitetshåndverk siden
              første sting. Vi tar stolthet i detaljer, bruker beste materialer
              og overgår forventningene fordi vi brenner for håndverket.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/80 md:text-lg">
              Hver kunde får individuell oppmerksomhet — fra brudekjole til
              hverdagsbukse. Skreddermester Ahmad Abdulhamid tar hver oppgave
              personlig.
            </p>
            <Button asChild variant="primary" size="lg" className="mt-8">
              <Link to="/om-oss">
                Les historien vår
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust / single review highlight */}
      <section className="section-tight">
        <div className="container-narrow text-center">
          <div className="mb-4 inline-flex items-center gap-1 text-accent">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <blockquote className="font-serif text-2xl italic leading-relaxed text-foreground md:text-3xl">
            «Vi tar stolthet i håndverket vårt — detaljer som varer.»
          </blockquote>
          <p className="mt-6 text-sm uppercase tracking-wider text-muted-foreground">
            5,0 / 5 på Google · Ahmad Abdulhamid, skreddermester
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-surface">
        <div className="container-narrow">
          <div className="text-center">
            <p className="eyebrow">Vanlige spørsmål</p>
            <h2 className="mt-3 text-display-2 text-foreground">
              Lurer du
              <span className="font-serif italic"> på noe?</span>
            </h2>
          </div>
          <div className="mt-10">
            <FAQAccordion items={homeFaqs} />
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/kontakt"
              className="text-sm font-medium text-accent hover:text-accent-soft"
            >
              Se flere spørsmål og kontakt oss →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA strip */}
      <section className="bg-accent-gradient py-16 text-white">
        <div className="container-wide text-center">
          <h2 className="text-display-2 text-white">
            Klar for et nytt
            <span className="font-serif italic"> plagg?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
            Kom innom uten avtale eller ring oss direkte. Vi gir alltid en ærlig
            vurdering og et bindende prisoverslag.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="navy" size="lg">
              <a href={`tel:${BUSINESS.contact.phoneE164}`}>
                <Phone className="h-4 w-4" />
                Ring {BUSINESS.contact.phone}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              <Link to="/kontakt">Send oss en melding</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-accent-soft">
        {icon}
      </div>
      <div>
        <p className="font-display text-lg uppercase leading-none tracking-wide text-white">
          {value}
        </p>
        <p className="mt-1 text-xs text-white/60">{label}</p>
      </div>
    </div>
  );
}
