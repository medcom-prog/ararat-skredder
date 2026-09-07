import { Link } from "react-router-dom";
import { ArrowRight, Check, MapPin, Phone, Ruler } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuickAnswer } from "@/components/QuickAnswer";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Reveal } from "@/components/Reveal";
import { BUSINESS, yearsExperience } from "@/data/business";
import type { FAQ } from "@/data/faqs";

/**
 * /skreddersydd-dress-oslo — pengeside for dress-familien. Fram til 07.09.2026
 * eide bloggartikkelen «5 ting du bør vite» det kommersielle søket
 * «skreddersydd dress oslo» (GSC sc-domain:araratskredderi.no, 08.08–07.09:
 * 107 visninger, pos 11,9) sammen med ankeret /tjenester#malsom-dresser.
 * Live SERP 07.09: tjenestesider og forsider fra skreddere, lokalt kart og
 * annonser. Intensjonen er kjøp, og den fortjener en egen side på nivå med
 * /skomaker-oslo.
 *
 * FAKTAPOLICY: alt her står allerede på nettstedet (services.ts, priser,
 * bloggartiklene). Fra 8 000 kr, 2–4 uker, prøving inkludert, kostnadsfri
 * konsultasjon, drop-in mandag til lørdag. Ingen nye pris-spenn, ingen
 * garantier, ingen tall som ikke finnes i kilden.
 *
 * Per-route schema (Service, WebPage+Speakable, BreadcrumbList, FAQPage)
 * injiseres i <head> av scripts/prerender-routes.mjs; SEO her styrer bare
 * title/meta/canonical og FAQAccordion kjører med emitSchema={false}.
 */

const valg = [
  "Stoff: ull, lin og silke, valgt etter sesong og bruk",
  "Snitt: klassisk to-knapps, ett-knapps til bryllup, tre-knapps for høy statur",
  "Detaljer: lommer, knapper, fôrfarge og knapphull",
  "Prøving og finjustering til passformen sitter",
];

const dressFaqs: FAQ[] = [
  {
    question: "Hva koster en skreddersydd dress i Oslo?",
    answer:
      "Målsøm av dress hos Ararat Skredderi starter på 8 000 kr. Stoffet avgjør mest, deretter snitt og detaljer. Du får bindende pris etter konsultasjonen, før arbeidet starter.",
  },
  {
    question: "Hvor lang tid tar det å få sydd en dress?",
    answer:
      "Normalt 2 til 4 uker fra første måltaking til ferdig dress. Det dekker konsultasjon, måltaking, prøving og ferdigsying. Skal dressen brukes i bryllup i mai til august, anbefaler vi å bestille minst 6 uker før.",
  },
  {
    question: "Må jeg bestille time?",
    answer:
      "Nei. Vi har drop-in mandag til lørdag i Torggata 8, og konsultasjonen er kostnadsfri. Vil du være sikker på at skreddermesteren er ledig, kan du ringe 91 92 19 08 på forhånd.",
  },
  {
    question: "Hvor mange prøvinger inngår?",
    answer:
      "Én eller flere prøvinger er inkludert i prisen. De fleste trenger to besøk etter måltakingen: én prøving i grovsøm og henting med eventuelle småjusteringer på stedet.",
  },
  {
    question: "Kan jeg velge stoff selv?",
    answer:
      "Ja. Du velger stoff fra prøvene i verkstedet, i ull, lin eller silkeblanding. Vi forklarer hva som passer til anledning, sesong og hvordan du planlegger å bruke dressen etterpå.",
  },
  {
    question: "Hva er forskjellen på skreddersydd og tilpasset dress?",
    answer:
      "En skreddersydd dress sys fra grunnen etter dine mål. En tilpasset dress er en hyllevare som justeres. Tilpasning starter på 200 kr og passer når kroppen ligger nær standardstørrelsene og dressen skal brukes få ganger.",
  },
  {
    question: "Syr dere dress til bryllup?",
    answer:
      "Ja, både til brudgom og forlovere. Vi anbefaler å komme innom et par måneder før, så det er tid til prøving og eventuelt stoffbytte uten tidspress.",
  },
  {
    question: "Kan jeg få skjorte i samme besøk?",
    answer:
      "Ja. Skreddersydd skjorte starter på 2 500 kr, med valg av stoff, krage og detaljer, og kan bestilles sammen med dressen.",
  },
];

export default function SkreddersyddDressOslo() {
  return (
    <>
      <SEO
        title="Skreddersydd dress i Oslo · Torggata 8"
        description="Skreddersydd dress i Oslo sentrum: målsøm fra 8 000 kr, 2 til 4 ukers leveringstid, prøving inkludert. Kostnadsfri konsultasjon i Torggata 8, drop-in mandag til lørdag."
        canonical={BUSINESS.domain + "/skreddersydd-dress-oslo"}
      />

      <div className="container-wide pt-6">
        <Breadcrumbs
          items={[{ label: "Skreddersydd dress i Oslo", href: "/skreddersydd-dress-oslo" }]}
        />
      </div>

      {/* Hero */}
      <section className="container-wide pt-8 pb-10 md:pt-14 md:pb-16">
        <div className="grid items-end gap-8 md:grid-cols-12 md:gap-10">
          <Reveal as="div" className="md:col-span-7 min-w-0">
            <p className="eyebrow">Målsøm</p>
            <h1 className="mt-4 text-display-1 text-foreground break-words">
              <span className="block">Skreddersydd dress i Oslo</span>
              <span className="block font-serif font-medium italic text-accent">
                sydd etter dine mål i Torggata 8
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              En dress sydd etter mål starter med kroppen din, ikke med en
              standardstørrelse. Hos Ararat Skredderi i Oslo sentrum tar vi
              målene, du velger stoff og snitt, og dressen prøves underveis til
              den sitter. Fra 8 000 kr, ferdig på 2 til 4 uker.
            </p>
          </Reveal>
          <Reveal as="div" delay={120} className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted">
              <img
                src="/images/gallery/sittingwithcustomer.jpg"
                alt="Konsultasjon om skreddersydd dress hos Ararat Skredderi i Torggata 8, Oslo"
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
          schemaName="Skreddersydd dress i Oslo"
          className="mt-16"
          points={[
            {
              name: "Målsøm fra 8 000 kr",
              description: "Stoffet avgjør mest. Bindende pris før vi starter.",
            },
            {
              name: "Leveringstid 2 til 4 uker",
              description: "Konsultasjon, måltaking, prøving og ferdigsying.",
            },
            {
              name: "Prøving og finjustering inkludert",
              description: "Én eller flere prøvinger til passformen sitter.",
            },
            {
              name: "Kostnadsfri konsultasjon i Torggata 8",
              description: "Drop-in mandag til lørdag, midt i Oslo sentrum.",
            },
          ]}
        />
      </section>

      {/* Hva du får */}
      <section className="container-wide pb-4">
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Ruler className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-display-2 text-foreground">
              Hva du får i en dress
              <span className="font-serif italic"> sydd etter mål</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Skredderen tar 25 til 30 mål, ikke bare brystmål og lengde.
              Skulderhelning, hoftebredde, armlengde og hvordan ryggen krummer.
              Mønsteret tegnes etter disse målene, og stoffet kuttes på nytt
              for hver kunde. Det er forskjellen på skreddersydd og justert
              hyllevare.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="primary" size="md">
                <a href={`tel:${BUSINESS.contact.phoneE164}`}>
                  <Phone className="h-4 w-4" />
                  Ring for konsultasjon
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
              {valg.map((s) => (
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

      {/* Prosessen */}
      <section className="section">
        <div className="container-narrow space-y-6 text-base leading-relaxed text-foreground md:text-lg">
          <p className="eyebrow">Slik foregår det</p>
          <h2 className="text-display-2 text-foreground">
            Tre besøk,
            <span className="font-serif italic"> 2 til 4 uker</span>
          </h2>
          <p>
            <strong>Første besøk, konsultasjon og måltaking.</strong> Du
            forteller om anledning, stil og budsjett, og velger stoff fra
            prøvene i verkstedet. Målene tas, og du får bindende pris før
            arbeidet starter. Besøket tar omtrent en time og er kostnadsfritt.
          </p>
          <p>
            <strong>Andre besøk, prøving.</strong> Etter omtrent to uker
            prøver du dressen i grovsøm. Ta gjerne med skoene og skjorten du
            planlegger å bruke, så vurderes helheten. Alt som ikke sitter,
            justeres.
          </p>
          <p>
            <strong>Tredje besøk, henting.</strong> Dressen er ferdig presset,
            fôret og kontrollert. Små justeringer gjøres på stedet.
          </p>
          <p>
            Hele løpet tar normalt 2 til 4 uker. I bryllupssesongen, mai til
            august, anbefaler vi å bestille minst 6 uker før datoen.
          </p>
        </div>
      </section>

      {/* Pris */}
      <section className="section bg-surface">
        <div className="container-narrow space-y-6 text-base leading-relaxed text-foreground md:text-lg">
          <p className="eyebrow">Pris</p>
          <h2 className="text-display-2 text-foreground">
            Hva koster en
            <span className="font-serif italic"> skreddersydd dress?</span>
          </h2>
          <p>
            Målsøm av dress starter på 8 000 kr. Stoffet er den største
            faktoren, deretter kommer snitt og detaljer. En klassisk to-knapps
            i ull er enklere å bygge enn en tre-delers smoking med vest, og
            prisen følger arbeidet. Ekstra prøvinger koster ikke ekstra.
          </p>
          <p>
            Du får bindende pris etter konsultasjonen, før vi klipper i
            stoffet. Vil du forstå hva som driver prisen før du kommer innom,
            har vi skrevet en egen{" "}
            <Link to="/blog/hva-koster-skreddersydd-dress" className="text-accent hover:underline">
              prisguide for skreddersydd dress
            </Link>
            . Startpriser for alt vi gjør står i{" "}
            <Link to="/priser" className="text-accent hover:underline">
              prislisten
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Anledning */}
      <section className="section">
        <div className="container-narrow space-y-6 text-base leading-relaxed text-foreground md:text-lg">
          <p className="eyebrow">Anledning</p>
          <h2 className="text-display-2 text-foreground">
            Bryllup, jobb
            <span className="font-serif italic"> eller fest</span>
          </h2>
          <p>
            Til bryllup syr vi dress til både brudgom og forlovere. Brudgommen
            velger som regel snitt, stoff og detaljer først, og forloverne
            legger seg etter det, enten med samme dress eller bare samme
            stoff. En vanlig løsning er målsøm til brudgommen og tilpasning av
            kjøpte dresser til forloverne. Les mer om{" "}
            <Link to="/blog/dress-til-bryllup-oslo" className="text-accent hover:underline">
              dress til bryllup
            </Link>
            .
          </p>
          <p>
            Til jobb er en klassisk forretningsdress i ull det vanligste valget:
            to-knapps, klassiske detaljer, et stoff som holder fasongen gjennom
            en lang dag. Til fest og kveldsarrangement er smoking et alternativ,
            med satengrevers og andre krav til passform enn en vanlig dress.
          </p>
        </div>
      </section>

      {/* Skreddersydd eller tilpasset */}
      <section className="section bg-surface">
        <div className="container-narrow space-y-6 text-base leading-relaxed text-foreground md:text-lg">
          <p className="eyebrow">Ærlig vurdering</p>
          <h2 className="text-display-2 text-foreground">
            Skreddersydd,
            <span className="font-serif italic"> eller tilpasset hyllevare?</span>
          </h2>
          <p>
            Skreddersydd lønner seg når kroppen ikke matcher
            standardstørrelsene, når dressen skal brukes mye, eller når
            anledningen krever et plagg som faktisk er ditt. Trenger du en
            dress raskt, til én anledning, og har en standardkropp, er en
            justert hyllevare ofte det fornuftige valget. Tilpasning starter på
            200 kr, og vi gjør det gjerne.
          </p>
          <p>
            Vi sier det som det er, også når svaret er at du ikke trenger
            målsøm. Les mer om{" "}
            <Link to="/blog/tilpasning-dress-oslo" className="text-accent hover:underline">
              tilpasning av dress
            </Link>{" "}
            eller{" "}
            <Link to="/blog/skreddersydd-dress-oslo" className="text-accent hover:underline">
              fem ting du bør vite før du bestiller
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Skreddermesteren */}
      <section className="section">
        <div className="container-narrow space-y-6 text-base leading-relaxed text-foreground md:text-lg">
          <p className="eyebrow">Håndverket</p>
          <h2 className="text-display-2 text-foreground">
            Skreddermester
            <span className="font-serif italic"> Ahmad Abdulhamid</span>
          </h2>
          <p>
            Skreddermester Ahmad Abdulhamid har over {yearsExperience} års
            erfaring med håndverket, og tar hver dress personlig fra måltaking
            til siste prøving. Vi snakker norsk, engelsk og arabisk, og
            verkstedet i Torggata 8 tar også{" "}
            <Link to="/tjenester" className="text-accent hover:underline">
              endringer, reparasjon og skjorter etter mål
            </Link>
            , så dressen og resten av garderoben kan ordnes på ett sted.
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
            {/* emitSchema={false}: prerender-routes.mjs eier FAQPage for
                /skreddersydd-dress-oslo i <head>; å sende den her også dobler. */}
            <FAQAccordion items={dressFaqs} emitSchema={false} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-accent-gradient py-16 text-white">
        <div className="container-wide text-center">
          <h2 className="text-display-2 text-white">
            Kom innom for
            <span className="font-serif italic"> en kostnadsfri konsultasjon</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/90 md:text-lg">
            Drop-in mandag til lørdag i Torggata 8. Vi tar målene, går gjennom
            stoffprøver og gir deg bindende pris før noe sys.
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
