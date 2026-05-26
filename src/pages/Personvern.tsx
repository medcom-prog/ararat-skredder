import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BUSINESS } from "@/data/business";

export default function Personvern() {
  return (
    <>
      <SEO
        title="Personvernerklæring"
        description="Hvordan Ararat Skredderi behandler personopplysninger i henhold til GDPR og personopplysningsloven."
        canonical={BUSINESS.domain + "/personvern"}
      />

      <div className="container-wide pt-6">
        <Breadcrumbs items={[{ label: "Personvern", href: "/personvern" }]} />
      </div>

      <article className="container-narrow py-10 md:py-16 prose-base">
        <p className="eyebrow">Personvern</p>
        <h1 className="mt-4 text-display-1 text-foreground">
          Personvern-
          <br />
          <span className="font-serif font-medium italic text-accent">
            erklæring
          </span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Sist oppdatert:{" "}
          {new Date().toLocaleDateString("nb-NO", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="mt-10 space-y-8 text-base leading-relaxed text-foreground">
          <Section title="Behandlingsansvarlig">
            <p>
              Ararat Skredderi (org.nr. {BUSINESS.orgNumber}) ved Ahmad
              Abdulhamid er behandlingsansvarlig for personopplysninger som
              behandles via nettsiden og i den daglige driften av butikken i
              Torggata 8, 0181 Oslo.
            </p>
            <p>Kontakt: {BUSINESS.contact.email} · {BUSINESS.contact.phone}</p>
          </Section>

          <Section title="Hvilke opplysninger vi behandler">
            <p>
              Vi behandler kun opplysninger som er nødvendige for å yte
              tjenestene våre eller besvare henvendelser:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Kundeopplysninger:</strong> navn, telefonnummer og
                e-postadresse, innhentet i forbindelse med
                måltaking, prosjekt eller hjemmebesøk.
              </li>
              <li>
                <strong>Måltaking og preferanser:</strong> kroppsmål,
                stoffvalg og designnotater, kun lagret så lenge det er
                nødvendig for å levere oppdraget.
              </li>
              <li>
                <strong>Kommunikasjon:</strong> e-poster, SMS og
                meldingsutveksling lagres så lenge det er nødvendig for
                oppfølging og dokumentasjon.
              </li>
            </ul>
          </Section>

          <Section title="Rettslig grunnlag">
            <p>
              Behandlingen baserer seg på et av følgende grunnlag:
              avtaleinngåelse (når du bestiller en tjeneste), berettiget
              interesse (oppfølging av eksisterende kunder) eller samtykke
              (markedsføring eller nyhetsbrev der det måtte være aktuelt).
            </p>
          </Section>

          <Section title="Lagring og sletting">
            <p>
              Vi lagrer personopplysninger så lenge det er nødvendig for å
              oppfylle formålet, typisk inntil oppdraget er fullført og
              dokumentert. Bokføringspliktige opplysninger lagres i 5 år i
              henhold til bokføringsloven. Etter dette slettes opplysningene.
            </p>
          </Section>

          <Section title="Deling med tredjeparter">
            <p>
              Vi deler ikke personopplysninger med tredjeparter utover det som
              er strengt nødvendig for å levere tjenesten (f.eks.
              underleverandører for spesialarbeid) eller pålagt ved lov. Vi
              selger aldri kundedata.
            </p>
          </Section>

          <Section title="Informasjonskapsler (cookies)">
            <p>
              Nettsiden bruker minimalt med informasjonskapsler. Vi bruker ikke
              tredjeparts-trackere for markedsføring. Eventuelle nødvendige
              tekniske cookies brukes kun for å sørge for at nettsiden
              fungerer som forventet.
            </p>
          </Section>

          <Section title="Dine rettigheter">
            <p>Du har rett til å:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Få innsyn i opplysninger vi har lagret om deg</li>
              <li>Rette feilaktige eller ufullstendige opplysninger</li>
              <li>Få slettet opplysninger som ikke lenger er nødvendige</li>
              <li>Begrense eller protestere mot behandlingen</li>
              <li>
                Få dataene utlevert i et strukturert format
                (dataportabilitet)
              </li>
              <li>
                Klage til Datatilsynet (
                <a
                  href="https://www.datatilsynet.no"
                  className="text-accent hover:text-accent-soft"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  datatilsynet.no
                </a>
                )
              </li>
            </ul>
          </Section>

          <Section title="Kontakt for spørsmål om personvern">
            <p>
              Spørsmål om hvordan vi behandler personopplysninger kan rettes
              til: {BUSINESS.contact.email} eller {BUSINESS.contact.phone}.
            </p>
          </Section>
        </div>
      </article>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
        {title}
      </h2>
      <div className="space-y-3 text-foreground/85">{children}</div>
    </section>
  );
}
