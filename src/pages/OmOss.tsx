import { Link } from "react-router-dom";
import { ArrowRight, Award, Heart, Sparkles, Users } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuickAnswer } from "@/components/QuickAnswer";
import { BUSINESS, yearsExperience } from "@/data/business";

const values = [
  {
    icon: Heart,
    title: "Lidenskap for håndverk",
    body: "Vi brenner for skreddersøm og tar stolthet i hver eneste detalj. Hver søm fortjener oppmerksomhet.",
  },
  {
    icon: Award,
    title: "Kvalitet i fokus",
    body: "Beste materialer og presisjonsteknikker — vi velger ikke snarveier som går utover holdbarheten.",
  },
  {
    icon: Users,
    title: "Personlig service",
    body: "Hver kunde får individuell oppmerksomhet og skreddersydde løsninger som passer akkurat deg.",
  },
];

export default function OmOss() {
  return (
    <>
      <SEO
        title="Om oss — Skreddermester med 50+ års erfaring"
        description={`Ararat Skredderi har levert kvalitetshåndverk i ${yearsExperience}+ år. Skreddermester Ahmad Abdulhamid i Torggata 8, Oslo sentrum.`}
        canonical={BUSINESS.domain + "/om-oss"}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            url: `${BUSINESS.domain}/om-oss`,
            name: "Om Ararat Skredderi",
            mainEntity: { "@id": `${BUSINESS.domain}/#organization` },
          },
        ]}
      />

      <div className="container-wide pt-6">
        <Breadcrumbs items={[{ label: "Om oss", href: "/om-oss" }]} />
      </div>

      {/* Hero */}
      <section className="container-wide pt-10 pb-12 md:pt-16 md:pb-20">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-7 min-w-0">
            <p className="eyebrow">Om oss</p>
            <h1 className="mt-4 text-display-1 text-foreground break-words">
              <span className="block">{yearsExperience}+ år med</span>
              <span className="block font-serif font-medium italic text-accent">
                håndverk
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Vår skredderbutikk i Oslo har i mer enn 50 år levert
              kvalitetsarbeid innen reparasjon, tilpasning og søm av nye klær.
              Vi tar stolthet i håndverket og fokuserer på detaljer som varer.
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <img
                src="/images/gallery/araratstandingbehindcounter.jpg"
                alt="Ahmad Abdulhamid, skreddermester"
                loading="eager"
                width="1200"
                height="1500"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <QuickAnswer
          label="Kort fortalt:"
          schemaName="Om Ararat Skredderi"
          className="mt-16"
          points={[
            {
              name: "Etablert håndverk siden første sting",
              description: `Over ${yearsExperience} års erfaring innen skreddersøm og reparasjon.`,
            },
            {
              name: "Skreddermester Ahmad Abdulhamid",
              description: "Hver oppgave tas personlig — fra brudekjole til hverdagsbukse.",
            },
            {
              name: "Torggata 8 i Oslo sentrum",
              description: "Lett tilgjengelig med buss og T-bane. Drop-in mandag til lørdag.",
            },
            {
              name: "Norsk, engelsk og arabisk",
              description: "Vi snakker språket ditt og forstår plagget ditt.",
            },
          ]}
        />
      </section>

      {/* Story */}
      <section className="section bg-surface">
        <div className="container-narrow space-y-6 text-base leading-relaxed text-foreground md:text-lg">
          <p className="font-serif text-2xl italic leading-snug text-foreground md:text-3xl">
            «Vi tar stolthet i håndverket vårt — detaljer som varer.»
          </p>
          <p>
            Skreddersøm er ikke bare et yrke. Det er en disiplin som krever
            tålmodighet, presisjon og en dyp respekt for materialene.
            Skreddermester Ahmad Abdulhamid har øvd dette håndverket i over
            50 år — fra første lærdom hos en eldre mester til daglig drift
            av Ararat Skredderi i Torggata 8.
          </p>
          <p>
            Vår filosofi er enkel: hvert plagg fortjener oppmerksomhet, og
            hver kunde fortjener et resultat de er stolte av. Det betyr at vi
            tar tiden vi trenger på konsultasjon, måltaking og prøving — og
            at vi sier ifra hvis et plagg ikke kan reddes, fremfor å fakturere
            for et arbeid som ikke gir verdi.
          </p>
          <p>
            Vi tar imot alt fra de minste reparasjonene til kompliserte
            brudekjoler. Vi snakker norsk, engelsk og arabisk. Og vi har holdt
            til samme sted i hjertet av Oslo siden butikken åpnet — fordi
            stedet, kundene og håndverket henger sammen.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container-wide">
          <div className="max-w-2xl">
            <p className="eyebrow">Våre verdier</p>
            <h2 className="mt-3 text-display-2 text-foreground">
              Hva vi
              <span className="font-serif italic"> står for</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl uppercase tracking-wide text-foreground">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-navy py-16 text-white">
        <div className="container-wide grid grid-cols-2 gap-6 text-center md:grid-cols-3">
          <Stat value={`${yearsExperience}+`} label="års erfaring" />
          <Stat value="6" label="kjernetjenester" />
          <Stat
            value="5,0★"
            label="på Google"
            extra={<Sparkles className="h-4 w-4 text-accent-soft" />}
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="section">
        <div className="container-narrow text-center">
          <h2 className="text-display-2 text-foreground">
            Vil du
            <span className="font-serif italic"> møte oss?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Kom innom Torggata 8 for en uforpliktende prat. Vi tar gjerne en
            kaffekopp og diskuterer hva vi kan gjøre for plagget ditt.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="primary" size="lg">
              <Link to="/kontakt">
                Kontakt oss
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/tjenester">Se tjenester</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({
  value,
  label,
  extra,
}: {
  value: string;
  label: string;
  extra?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-center gap-2">
        <p className="font-display text-5xl uppercase tracking-wide text-white md:text-6xl">
          {value}
        </p>
        {extra}
      </div>
      <p className="mt-2 text-sm uppercase tracking-wider text-white/60">
        {label}
      </p>
    </div>
  );
}
