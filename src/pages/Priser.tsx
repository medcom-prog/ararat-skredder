import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuickAnswer } from "@/components/QuickAnswer";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Reveal } from "@/components/Reveal";
import { BUSINESS } from "@/data/business";
import type { FAQ } from "@/data/faqs";

/**
 * /priser — itemized price list.
 *
 * Every kr value here mirrors a price already published elsewhere on the
 * live site (services.ts: reparasjon fra 200, lengdejustering 200–400,
 * skjorte fra 2 500, dress fra 8 000, skomakeri fra 300, såle fra 400).
 * Items the site does not price show "Etter vurdering" rather than an
 * invented number. This page consolidates those scattered prices onto one
 * URL targeting the high-intent "hva koster / pris skredder oslo" queries.
 *
 * Per-route schema (WebPage+Speakable, BreadcrumbList, FAQPage, OfferCatalog)
 * is injected into <head> by scripts/prerender-routes.mjs, which is what
 * crawlers read, so SEO here only manages title/meta/canonical and
 * FAQAccordion runs with emitSchema={false} to avoid a duplicate FAQPage.
 */

interface PriceRow {
  service: string;
  price: string;
  note?: string;
}

interface PriceGroup {
  title: string;
  intro: string;
  rows: PriceRow[];
  readMore?: { label: string; href: string }[];
}

const priceGroups: PriceGroup[] = [
  {
    title: "Endringer og reparasjon",
    intro:
      "De vanligste oppdragene. Vi vurderer plagget på stedet mens du venter og gir bindende pris før vi starter.",
    rows: [
      {
        service: "Legge opp bukser, skjørt eller ermer",
        price: "200 – 400 kr",
        note: "Lengdejustering. Avhenger av plagg og om fald skal beholdes.",
      },
      {
        service: "Ta inn eller ut i livet",
        price: "Fra 200 kr",
        note: "Justert passform på bukser, skjørt og jakker.",
      },
      {
        service: "Bytte glidelås",
        price: "Fra 200 kr",
        note: "Bukse, jakke eller kjole. Endelig pris etter type glidelås.",
      },
      {
        service: "Sy i knapper og mindre reparasjon",
        price: "Fra 200 kr",
        note: "Knapper, hekter og enkle sømmer.",
      },
      {
        service: "Reparere rifter, hull og slitasje",
        price: "Fra 200 kr",
        note: "Større skader får eget prisoverslag.",
      },
    ],
    readMore: [
      {
        label: "Les mer: Sy om dressen i stedet for å kjøpe ny",
        href: "/blog/sy-om-dress-oslo",
      },
      {
        label: "Les mer: Bytte glidelås, eller kan den repareres?",
        href: "/blog/reparere-bytte-glidelas-oslo",
      },
    ],
  },
  {
    title: "Skreddersøm og målsøm",
    intro: "Plagg sydd eller formet etter dine mål, fra første sting.",
    rows: [
      {
        service: "Skreddersydd skjorte eller bluse",
        price: "Fra 2 500 kr",
        note: "Stoff, krage og mansjett etter eget valg.",
      },
      {
        service: "Målsøm av dress",
        price: "Fra 8 000 kr",
        note: "Eks. mva. Leveringstid normalt 2 – 4 uker.",
      },
      {
        service: "Omforming av plagg",
        price: "Etter vurdering",
        note: "Snitt, fasong og detaljer fornyes med respekt for originalen.",
      },
      {
        service: "Brudeplagg og spesialbestillinger",
        price: "Etter prosjekt",
        note: "Konsept-møte er kostnadsfritt.",
      },
    ],
    readMore: [
      {
        label: "Les mer: Hva koster en skreddersydd dress?",
        href: "/blog/hva-koster-skreddersydd-dress",
      },
      {
        label: "Les mer: Billig skredder i Oslo? 5 faktorer som avgjør",
        href: "/blog/skredder-oslo",
      },
    ],
  },
  {
    title: "Skomakeri",
    intro:
      "Sko som varer lenger. Reparasjon i skinn, tekstil og syntet, på samme sted som skredderen.",
    rows: [
      {
        service: "Sålereparasjon og utskifting",
        price: "Fra 400 kr",
        note: "Halv eller hel såle etter skoens kvalitet.",
      },
      {
        service: "Hæler, skinn og glidelåser i sko",
        price: "Fra 300 kr",
        note: "Vurderes etter skotype og omfang.",
      },
      {
        service: "Arvede og premiumsko",
        price: "Etter vurdering",
        note: "Håndteres varsomt. Vi forstår verdien av kvalitetssko.",
      },
    ],
    readMore: [
      {
        label: "Les mer: Når bør du levere skoene til reparasjon?",
        href: "/blog/skoreparasjon-oslo",
      },
    ],
  },
];

const priserFaqs: FAQ[] = [
  {
    question: "Hva koster det å legge opp bukser?",
    answer:
      "Å legge opp bukser eller justere lengde koster vanligvis mellom 200 og 400 kr, avhengig av plagg, fald og hvor mye som skal endres. Kom innom Torggata 8 for en rask vurdering, så får du bindende pris før vi starter.",
  },
  {
    question: "Hva koster en skreddersydd dress?",
    answer:
      "Målsøm av dress starter fra 8 000 kr eks. mva. Endelig pris avhenger av stoff, fôr og kompleksitet, og inkluderer konsultasjon, måltaking og prøvinger. Leveringstid er normalt 2 – 4 uker.",
  },
  {
    question: "Hva koster det å bytte glidelås?",
    answer:
      "Pris for å bytte glidelås avhenger av plagget, om det er bukse, jakke eller kjole, og typen glidelås. Enkle bytter starter fra 200 kr. Vi vurderer plagget på stedet og gir deg en konkret pris.",
  },
  {
    question: "Får jeg vite prisen før arbeidet starter?",
    answer:
      "Ja. Vi gir alltid et bindende prisoverslag før vi setter i gang, slik at du vet hva det koster på forhånd. Drop-in mandag til lørdag, ingen timeavtale nødvendig.",
  },
  {
    question: "Er prisene veiledende?",
    answer:
      "Prisene her er veiledende startpriser. Endelig pris settes etter at vi har sett plagget, fordi tilstand, materiale og omfang varierer. Du betaler aldri mer enn det avtalte overslaget uten at vi har avklart det med deg først.",
  },
];

export default function Priser() {
  return (
    <>
      <SEO
        title="Priser · Hva koster skredder og reparasjon i Oslo?"
        description="Veiledende prisliste for skreddersøm, reparasjon og skomakeri i Oslo sentrum. Legge opp bukser 200–400 kr, skreddersydd skjorte fra 2 500 kr, målsøm av dress fra 8 000 kr, skomakeri fra 300 kr."
        canonical={BUSINESS.domain + "/priser"}
      />

      <div className="container-wide pt-6">
        <Breadcrumbs items={[{ label: "Priser", href: "/priser" }]} />
      </div>

      {/* Hero */}
      <section className="container-wide pt-8 pb-10 md:pt-14 md:pb-16">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow">Priser</p>
            <h1 className="mt-4 text-display-1 text-foreground">
              Priser på{" "}
              <span className="font-serif font-medium italic text-accent">
                skreddersøm og reparasjon
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Veiledende startpriser for skreddersøm, reparasjon, omforming og
              skomakeri i Oslo sentrum. Du får alltid et bindende prisoverslag
              før vi starter, og kan komme innom Torggata 8 for vurdering på
              stedet.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <QuickAnswer
            label="Kort fortalt:"
            schemaName="Prisliste hos Ararat Skredderi"
            className="mt-8"
            points={[
              {
                name: "Reparasjon og endring fra 200 kr",
                description: "Legge opp bukser, glidelås, knapper og rifter.",
              },
              {
                name: "Skreddersydd skjorte fra 2 500 kr",
                description: "Dress etter mål fra 8 000 kr eks. mva.",
              },
              {
                name: "Skomakeri fra 300 kr",
                description: "Såler, hæler, skinn og glidelåser.",
              },
              {
                name: "Alltid bindende overslag på stedet",
                description: "Drop-in mandag til lørdag, ingen timeavtale.",
              },
            ]}
          />
        </Reveal>
      </section>

      {/* Price tables */}
      <section className="container-wide pb-4">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {priceGroups.map((group) => (
            <Reveal key={group.title} as="div" className="min-w-0">
              <div className="flex h-full flex-col rounded-3xl border border-border bg-surface p-6 md:p-8">
                <h2 className="font-display text-xl uppercase tracking-wide text-foreground">
                  {group.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {group.intro}
                </p>
                <table className="mt-6 w-full border-collapse text-left">
                  <tbody className="divide-y divide-border">
                    {group.rows.map((row) => (
                      <tr key={row.service}>
                        <td className="py-4 pr-3 align-top">
                          <span className="font-medium text-foreground">
                            {row.service}
                          </span>
                          {row.note ? (
                            <span className="mt-1 block text-sm text-muted-foreground">
                              {row.note}
                            </span>
                          ) : null}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-3 text-right align-top font-display text-base uppercase tracking-wide text-accent">
                          {row.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {group.readMore?.length ? (
                  <div className="mt-auto flex flex-col gap-2 pt-5">
                    {group.readMore.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-soft"
                      >
                        {link.label}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>

        <p className="container-narrow mt-8 px-0 text-center text-sm text-muted-foreground">
          Alle priser er veiledende startpriser eks. mva. der ikke annet er
          oppgitt. Endelig pris settes etter vurdering av plagget.{" "}
          <Link to="/tjenester" className="text-accent hover:underline">
            Se hva som inngår i hver tjeneste
          </Link>
          .
        </p>
      </section>

      {/* FAQ */}
      <section className="section bg-surface">
        <div className="container-narrow">
          <div className="text-center">
            <p className="eyebrow">Vanlige spørsmål om pris</p>
            <h2 className="mt-3 text-display-2 text-foreground">
              Hva vil det
              <span className="font-serif italic"> koste deg?</span>
            </h2>
          </div>
          <div className="mt-10">
            {/* emitSchema={false}: prerender-routes.mjs owns the canonical
                /priser FAQPage in <head>; emitting here too duplicates it. */}
            <FAQAccordion items={priserFaqs} emitSchema={false} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-accent-gradient py-16 text-white">
        <div className="container-wide text-center">
          <h2 className="text-display-2 text-white">
            Klar for et
            <span className="font-serif italic"> prisoverslag?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/90 md:text-lg">
            Kom innom Torggata 8 for vurdering på stedet, eller ring oss for en
            uforpliktende samtale om plagget ditt.
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
