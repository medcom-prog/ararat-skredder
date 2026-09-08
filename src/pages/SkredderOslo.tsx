import { Link } from "react-router-dom";
import { ArrowRight, Check, MapPin, Phone, Scissors } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuickAnswer } from "@/components/QuickAnswer";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Reveal } from "@/components/Reveal";
import { BUSINESS } from "@/data/business";
import type { FAQ } from "@/data/faqs";

/**
 * /skredder-oslo — eiersiden for kjernefamilien «skredder oslo».
 *
 * Bakgrunn (GSC sc-domain:araratskredderi.no, 2026-08-07 → 2026-09-05, query×page):
 * familien hadde ingen egen side. «skredder oslo» (327 visn., pos 10,6) traff
 * forsiden, «skredder» (187 visn., pos 12,8) og «skredder oslo» igjen (93 visn.,
 * pos 16,3) traff /priser, «billig skredder oslo» (101 visn.) traff en
 * bloggartikkel, og «skredder oslo sentrum» (51 visn.) traff til og med
 * /skomaker-oslo. Fem URL-er delte én kommersiell familie på ~1 000 visninger.
 *
 * Live SERP for «skredder oslo» er lokalt pakke- og servicesidepreget
 * (skredderverksteder med egne sider, ikke guider), altså samme sidetype som
 * /skomaker-oslo, som allerede virker: pos 8,5 og 19 klikk i samme vindu.
 *
 * Faktapolicy: bare tall og påstander som allerede står publisert på
 * nettstedet (fra 200 kr, 200–400 kr, fra 2 500 kr, fra 8 000 kr, fra 300 kr,
 * 1–3 dager, 2–5 uker, 2–4 uker). «50+ år» tilhører skreddermester Ahmad
 * personlig, ikke bedriften (Brreg 2006). Ingen «beste», ingen ventetidsløfter.
 *
 * Per-rute schema (Service, WebPage+Speakable, BreadcrumbList, FAQPage)
 * injiseres i <head> av scripts/prerender-routes.mjs, så SEO her styrer bare
 * title/meta/canonical og FAQAccordion kjører med emitSchema={false}.
 * HOLD I SYNC med skredderBodyHtml() og SKREDDER_FAQS i prerender-skriptet.
 */

const jobs = [
  "Legge opp bukser, skjørt og ermer",
  "Ta inn eller ut i livet for bedre passform",
  "Bytte glidelås i bukser, jakker og kjoler",
  "Reparere rifter, sømmer, knapper og fôr",
  "Omforming og tilpasning av plagg du allerede eier",
  "Skreddersydde skjorter, bluser og dresser etter mål",
];

const skredderFaqs: FAQ[] = [
  {
    question: "Hva koster en skredder i Oslo?",
    answer:
      "Hos Ararat Skredderi starter reparasjon og endring på 200 kr. Å legge opp bukser, skjørt eller ermer koster 200 – 400 kr, og glidelås starter på 200 kr. Skreddersydd skjorte starter på 2 500 kr og målsøm av dress på 8 000 kr eks. mva. Du får alltid bindende pris etter at vi har sett plagget, aldri et anslag over telefon.",
  },
  {
    question: "Må jeg bestille time hos skredderen?",
    answer:
      "Nei. Vi har drop-in mandag til lørdag i Torggata 8, og du trenger ingen avtale. Ta med plagget, så vurderer vi det mens du venter og gir deg bindende pris før vi starter. Vil du sjekke noe på forhånd, kan du ringe oss på 91 92 19 08.",
  },
  {
    question: "Hvor lang tid tar det?",
    answer:
      "Enkle endringer som lengdejustering, glidelås eller knapper er vanligvis ferdig innen 1 – 3 dager. Omforming og mer omfattende arbeid tar 2 – 5 uker. Målsøm av dress tar normalt 2 – 4 uker fra måltaking til ferdig plagg. Vi avtaler hentetidspunkt ved innlevering.",
  },
  {
    question: "Hvor i Oslo holder skredderen til?",
    answer:
      "Vi holder til i Torggata 8, 0181 Oslo, midt i sentrum. Det er kort vei fra Jernbanetorget og Stortinget, og enkelt å nå med buss og T-bane.",
  },
  {
    question: "Syr dere for både dame og herre?",
    answer:
      "Ja. Vi tar endringer, reparasjon og omforming av både dame- og herreklær, og syr skjorter, bluser og dresser etter mål. Brudeplagg, kostymer og uniformer tar vi som spesialbestillinger.",
  },
  {
    question: "Finnes det en billig skredder i Oslo sentrum?",
    answer:
      "Prisen avhenger av jobben, ikke av adressen. Hos oss starter de vanligste endringene på 200 kr, og du får bindende pris før arbeidet begynner, slik at du kan si nei hvis det ikke er verdt det. Vi priser ingenting usett, nettopp fordi et lavt telefonanslag som vokser underveis ikke er billig for noen.",
  },
  {
    question: "Kan dere fikse plagget mens jeg venter?",
    answer:
      "Vi vurderer plagget mens du venter og gir deg pris med en gang, men selve arbeidet legges i køen på verkstedet. Enkle jobber er som regel klare innen 1 – 3 dager.",
  },
  {
    question: "Er dere både skredder og skomaker?",
    answer:
      "Ja. I Torggata 8 har vi skredder og skomaker under samme tak. Du kan levere både klær og sko i ett og samme besøk, og slipper å oppsøke to verksteder.",
  },
  {
    question: "Hvilke språk snakker dere?",
    answer:
      "Vi snakker norsk, engelsk og arabisk i butikken.",
  },
];

export default function SkredderOslo() {
  return (
    <>
      <SEO
        title="Skredder i Oslo sentrum · Torggata 8"
        description="Skredder i Torggata 8, Oslo sentrum: endringer og reparasjon fra 200 kr, skjorte fra 2 500 kr, dress etter mål fra 8 000 kr. Bindende pris, drop-in mandag til lørdag."
        canonical={BUSINESS.domain + "/skredder-oslo"}
      />

      <div className="container-wide pt-6">
        <Breadcrumbs items={[{ label: "Skredder i Oslo", href: "/skredder-oslo" }]} />
      </div>

      {/* Hero */}
      <section className="container-wide pt-8 pb-10 md:pt-14 md:pb-16">
        <div className="grid items-end gap-8 md:grid-cols-12 md:gap-10">
          <Reveal as="div" className="md:col-span-7 min-w-0">
            <p className="eyebrow">Skredder</p>
            <h1 className="mt-4 text-display-1 text-foreground break-words">
              <span className="block">Skredder i Oslo sentrum</span>
              <span className="block font-serif font-medium italic text-accent">
                med bindende pris før vi starter
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Torggata 8 ligger noen minutter fra Jernbanetorget. Ta med plagget
              uten avtale, så ser vi på det mens du venter og sier hva det
              koster. Endringer og reparasjon starter på 200 kr, og skredderen
              og skomakeren holder til i samme lokale.
            </p>
          </Reveal>
          <Reveal as="div" delay={120} className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted">
              <img
                src="/images/gallery/araratmeasuringcustomerpants.jpg"
                alt="Skreddersøm hos Ararat Skredderi i Torggata 8, Oslo sentrum"
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
          schemaName="Skredder i Oslo sentrum"
          className="mt-16"
          points={[
            {
              name: "Skredder midt i Oslo sentrum",
              description: "Torggata 8, kort vei fra Jernbanetorget og Stortinget.",
            },
            {
              name: "Endringer og reparasjon fra 200 kr",
              description: "Legge opp 200 – 400 kr, glidelås fra 200 kr.",
            },
            {
              name: "Skreddersøm etter mål",
              description: "Skjorte fra 2 500 kr, dress fra 8 000 kr eks. mva.",
            },
            {
              name: "Drop-in mandag til lørdag",
              description: "Ingen timeavtale, bindende pris før vi starter.",
            },
          ]}
        />
      </section>

      {/* What we do */}
      <section className="container-wide pb-4">
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Scissors className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-display-2 text-foreground">
              Hva skredderen
              <span className="font-serif italic"> gjør</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Mesteparten av det som kommer inn døra er endringer: noe er for
              langt, for vidt eller har røket. Vi tar også omforming av plagg du
              allerede eier, og syr skjorter, bluser og dresser etter mål.
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
              {jobs.map((s) => (
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

      {/* Endringer */}
      <section className="section">
        <div className="container-narrow space-y-6 text-base leading-relaxed text-foreground md:text-lg">
          <p className="eyebrow">Endringer og reparasjon</p>
          <h2 className="text-display-2 text-foreground">
            Det folk oftest
            <span className="font-serif italic"> kommer med</span>
          </h2>
          <p>
            En bukse som er for lang, en jakke som er for vid over ryggen, en
            glidelås som har røket midt i sesongen. Dette er jobbene vi gjør
            flest av, og de fleste av dem er ferdig innen 1 – 3 dager.
          </p>
          <p>
            Lengdejustering av bukser, skjørt og ermer koster 200 – 400 kr,
            avhengig av plagget og om falden skal beholdes. Å ta inn eller ut i
            livet starter på 200 kr. Bytte av glidelås starter også på 200 kr,
            men prisen avhenger av om det er bukse, jakke eller kjole, og hvilken
            type glidelås som må inn. Derfor ser vi på plagget først.
          </p>
        </div>
      </section>

      {/* Skreddersøm */}
      <section className="section bg-surface">
        <div className="container-narrow space-y-6 text-base leading-relaxed text-foreground md:text-lg">
          <p className="eyebrow">Skreddersøm</p>
          <h2 className="text-display-2 text-foreground">
            Nye plagg
            <span className="font-serif italic"> etter mål</span>
          </h2>
          <p>
            Skreddermester Ahmad Abdulhamid har over 50 års erfaring med
            håndverket, og tar plagg fra måltaking til ferdig resultat. En
            skreddersydd skjorte eller bluse starter på 2 500 kr og tar normalt
            2 – 3 uker. Målsøm av dress starter på 8 000 kr eks. mva. og tar
            2 – 4 uker, med prøvinger underveis.
          </p>
          <p>
            Omforming er det andre sporet: et arvet plagg som skal passe deg, en
            kjole som skal moderniseres, en jakke som skal få nytt liv. Slike
            oppdrag tar 2 – 5 uker, avhengig av hva som skal gjøres. Brudeplagg,
            kostymer og uniformer tar vi som spesialbestillinger, priset etter
            prosjekt.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              to="/skreddersydd-dress-oslo"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-soft"
            >
              Skreddersydd dress i Oslo: pris, prosess og leveringstid
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/blog/skreddersydd-skjorte-oslo"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-soft"
            >
              Skreddersydd skjorte i Oslo: slik foregår det
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pris og tid */}
      <section className="section">
        <div className="container-narrow space-y-6 text-base leading-relaxed text-foreground md:text-lg">
          <p className="eyebrow">Pris og tid</p>
          <h2 className="text-display-2 text-foreground">
            Dette kan du
            <span className="font-serif italic"> forvente</span>
          </h2>
          <p>
            Vi priser ingenting usett. Du kommer innom med plagget, vi ser på det
            mens du venter, og du får en bindende pris før arbeidet starter. Da
            kan du også si nei, uten at det har kostet deg noe. Full prisliste
            ligger på prissiden.
          </p>
          <p>
            Leveringstiden avhenger av jobben. Enkle endringer 1 – 3 dager,
            omforming 2 – 5 uker, dress etter mål 2 – 4 uker. Hentetidspunkt
            avtaler vi ved innlevering, så du vet når plagget er klart. Vi har
            drop-in mandag til lørdag og snakker norsk, engelsk og arabisk.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              to="/priser"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-soft"
            >
              Se full prisliste
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/blog/legge-opp-bukse-oslo"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-soft"
            >
              Legge opp bukse i Oslo på 1–3 dager
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/blog/skreddersom-oslo"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-soft"
            >
              Skreddersøm i Oslo: hva det koster og hvor lang tid det tar
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Skomaker på samme sted */}
      <section className="section bg-surface">
        <div className="container-narrow space-y-6 text-base leading-relaxed text-foreground md:text-lg">
          <p className="eyebrow">Under ett tak</p>
          <h2 className="text-display-2 text-foreground">
            Skredder og skomaker
            <span className="font-serif italic"> i samme lokale</span>
          </h2>
          <p>
            I Torggata 8 sitter skredderen og skomakeren sammen. Har du en jakke
            som skal tas inn og et par sko som trenger nye såler, leverer du
            begge deler i samme besøk. Skomakerarbeid starter på 300 kr og
            sålereparasjon på 400 kr.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              to="/skomaker-oslo"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-soft"
            >
              Skomaker i Oslo sentrum
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section">
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
            <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
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
            {/* emitSchema={false}: prerender-routes.mjs eier den kanoniske
                /skredder-oslo FAQPage i <head>. */}
            <FAQAccordion items={skredderFaqs} emitSchema={false} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-accent-gradient py-16 text-white">
        <div className="container-wide text-center">
          <h2 className="text-display-2 text-white">
            Ta med plagget
            <span className="font-serif italic"> innom</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/90 md:text-lg">
            Drop-in mandag til lørdag i Torggata 8. Vi ser på plagget på stedet og
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
