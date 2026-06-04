import { Link } from "react-router-dom";
import { ArrowRight, Check, Footprints, MapPin, Phone } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuickAnswer } from "@/components/QuickAnswer";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Reveal } from "@/components/Reveal";
import { BUSINESS, yearsExperience } from "@/data/business";
import type { FAQ } from "@/data/faqs";

/**
 * /skomaker-oslo — pillar page for the skomaker queries Ararat sits on page 2
 * for (skomaker oslo sentrum, skomaker oslo, billig skomaker oslo) and the
 * genuinely winnable niche AI engines already credit us with: the only place
 * in Oslo sentrum that is both skomaker and skredder under one roof.
 *
 * Per-route schema (Service, WebPage+Speakable, BreadcrumbList, FAQPage) is
 * injected into <head> by scripts/prerender-routes.mjs, so SEO here manages
 * title/meta/canonical only and FAQAccordion runs with emitSchema={false}.
 */

const services = [
  "Sålereparasjon og utskifting av hele såler",
  "Hælreparasjon og nye hæler",
  "Lapping og fiks av rifter i skinn",
  "Reparasjon og bytte av glidelåser på støvler",
];

const skomakerFaqs: FAQ[] = [
  {
    question: "Hva koster en skoreparasjon?",
    answer:
      "Skomakertjenester starter fra 300 kr, og sålereparasjon fra 400 kr. Endelig pris avhenger av skotype og hva som skal gjøres. Kom innom Torggata 8 for en rask vurdering, så får du bindende pris før vi starter.",
  },
  {
    question: "Hvor lang tid tar en skoreparasjon?",
    answer:
      "De fleste skoreparasjoner er ferdig innen 3 til 7 dager, avhengig av reservedeler og kompleksitet. Enkle hæl- og sålejobber går ofte raskere.",
  },
  {
    question: "Reparerer dere alle typer sko?",
    answer:
      "Vi tar de fleste sko i skinn, tekstil og syntet, fra hverdagssko til premium og arvede modeller. For helt spesielle materialer gir vi en ærlig vurdering før vi tar oppdraget.",
  },
  {
    question: "Kan dere bytte glidelås i støvler?",
    answer:
      "Ja. Vi reparerer og bytter glidelåser på støvler og annet skotøy. Ta med skoene innom, så vurderer vi om glidelåsen kan repareres eller bør byttes.",
  },
  {
    question: "Er dere både skomaker og skredder?",
    answer:
      "Ja. I Torggata 8 har vi både skomaker og skredder under samme tak. Du kan levere sko til reparasjon og samtidig få ordnet endringer på klær, i ett og samme besøk.",
  },
  {
    question: "Hvor i Oslo holder dere til?",
    answer:
      "Vi holder til i Torggata 8, 0181 Oslo, midt i sentrum. Det er kort vei fra Jernbanetorget og Stortinget, og enkelt å nå med buss og T-bane.",
  },
];

export default function SkomakerOslo() {
  return (
    <>
      <SEO
        title="Skomaker i Oslo sentrum · Skredder på samme sted"
        description="Skomaker i Torggata 8, midt i Oslo sentrum: sålereparasjon, hæler, skinn og glidelåser fra 300 kr. Det eneste stedet i sentrum med både skomaker og skredder under ett tak."
        canonical={BUSINESS.domain + "/skomaker-oslo"}
      />

      <div className="container-wide pt-6">
        <Breadcrumbs items={[{ label: "Skomaker i Oslo", href: "/skomaker-oslo" }]} />
      </div>

      {/* Hero */}
      <section className="container-wide pt-8 pb-10 md:pt-14 md:pb-16">
        <div className="grid items-end gap-8 md:grid-cols-12 md:gap-10">
          <Reveal as="div" className="md:col-span-7 min-w-0">
            <p className="eyebrow">Skomaker</p>
            <h1 className="mt-4 text-display-1 text-foreground break-words">
              <span className="block">Skomaker i Oslo sentrum</span>
              <span className="block font-serif font-medium italic text-accent">
                og skredder på samme sted
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              I Torggata 8 finner du både skomaker og skredder under ett tak. Vi
              reparerer såler, hæler, skinn og glidelåser, og kan samtidig ta
              endringen på buksa eller jakka mens du er her. Du slipper å gå to
              steder.
            </p>
          </Reveal>
          <Reveal as="div" delay={120} className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted">
              <img
                src="/images/gallery/araratdoingshoework.jpg"
                alt="Skomakerarbeid hos Ararat Skredderi i Torggata 8, Oslo"
                loading="eager"
                decoding="async"
                width="1200"
                height="1500"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>

        <QuickAnswer
          label="Kort fortalt:"
          schemaName="Skomaker i Oslo sentrum"
          className="mt-16"
          points={[
            {
              name: "Skomaker midt i Oslo sentrum",
              description: "Torggata 8, kort vei fra Jernbanetorget og Stortinget.",
            },
            {
              name: "Såler, hæler, skinn og glidelåser fra 300 kr",
              description: "Reparasjon i skinn, tekstil og syntet.",
            },
            {
              name: "Skredder på samme sted",
              description: "Få sko og klær ordnet i ett og samme besøk.",
            },
            {
              name: "Drop-in mandag til lørdag",
              description: "Ingen timeavtale, vi vurderer mens du venter.",
            },
          ]}
        />
      </section>

      {/* What we do */}
      <section className="container-wide pb-4">
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Footprints className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-display-2 text-foreground">
              Hva vi
              <span className="font-serif italic"> reparerer</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Vi utfører alle typer skoreparasjoner i skinn, tekstil og syntet,
              med spesialitet på arvede sko og høykvalitetsmodeller som fortjener
              et nytt liv. Kom innom for vurdering og prisoverslag.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="primary" size="md">
                <a href={`tel:${BUSINESS.contact.phoneE164}`}>
                  <Phone className="h-4 w-4" />
                  Få prisoverslag
                </a>
              </Button>
              <Button asChild variant="outline" size="md">
                <Link to="/priser">
                  Se priser
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="md:col-span-7">
            <ul className="grid gap-4 sm:grid-cols-2">
              {services.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-5 text-sm md:text-base"
                >
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-foreground/90">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The combo angle */}
      <section className="section">
        <div className="container-narrow space-y-6 text-base leading-relaxed text-foreground md:text-lg">
          <p className="eyebrow">Under ett tak</p>
          <h2 className="text-display-2 text-foreground">
            Både skomaker og skredder,
            <span className="font-serif italic"> på samme adresse</span>
          </h2>
          <p>
            De fleste i Oslo må til én butikk for skoen og en annen for klærne.
            Hos Ararat Skredderi gjør vi begge deler på samme sted. Skreddermester
            Ahmad Abdulhamid har drevet verkstedet i Torggata 8 i over{" "}
            {yearsExperience} år, og kombinasjonen av skomakeri og skreddersøm gjør
            at du kan levere både sko og plagg i ett og samme besøk.
          </p>
          <p>
            Skal hælene fikses og buksa legges opp før en anledning, ordner vi det
            samtidig. Det sparer deg en tur, og du forholder deg til ett verksted
            som kjenner både skinn og stoff.
          </p>
          <p>
            <Link to="/tjenester" className="text-accent hover:underline">
              Se alle skreddertjenestene våre
            </Link>{" "}
            eller{" "}
            <Link to="/priser" className="text-accent hover:underline">
              gå til prislisten
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Location */}
      <section className="section bg-surface">
        <div className="container-wide grid gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-6">
            <p className="eyebrow">Slik finner du oss</p>
            <h2 className="mt-3 text-display-2 text-foreground">
              Midt i
              <span className="font-serif italic"> Oslo sentrum</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Vi holder til i {BUSINESS.address.street}, {BUSINESS.address.postalCode}{" "}
              {BUSINESS.address.city}, kort vei fra Jernbanetorget og Stortinget.
              Enkelt å nå med buss og T-bane, og rett ved Oslo City.
            </p>
            <div className="mt-6 flex items-start gap-3 text-foreground">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <a
                href={BUSINESS.address.googleMapsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-accent"
              >
                {BUSINESS.address.street}, {BUSINESS.address.postalCode}{" "}
                {BUSINESS.address.city}
              </a>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="rounded-3xl border border-border bg-background p-6 md:p-8">
              <h3 className="font-display text-lg uppercase tracking-wide text-foreground">
                Åpningstider
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground md:text-base">
                {BUSINESS.hours.map((h) => (
                  <li
                    key={h.days}
                    className="flex items-baseline justify-between gap-3"
                  >
                    <span className="text-foreground/90">{h.days}</span>
                    <span className="font-mono">
                      {h.closed ? "Stengt" : `${h.open}–${h.close}`}
                    </span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="primary" size="md" className="mt-6 w-full">
                <a href={`tel:${BUSINESS.contact.phoneE164}`}>
                  <Phone className="h-4 w-4" />
                  Ring {BUSINESS.contact.phone}
                </a>
              </Button>
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
              Lurer du
              <span className="font-serif italic"> på noe?</span>
            </h2>
          </div>
          <div className="mt-10">
            {/* emitSchema={false}: prerender-routes.mjs owns the canonical
                /skomaker-oslo FAQPage in <head>; emitting here too duplicates it. */}
            <FAQAccordion items={skomakerFaqs} emitSchema={false} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-accent-gradient py-16 text-white">
        <div className="container-wide text-center">
          <h2 className="text-display-2 text-white">
            Ta med skoene
            <span className="font-serif italic"> innom</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/90 md:text-lg">
            Drop-in mandag til lørdag i Torggata 8. Vi vurderer skoen på stedet og
            gir deg bindende pris før vi starter.
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
              <Link to="/kontakt">
                Send melding
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
