import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Check, Phone } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuickAnswer } from "@/components/QuickAnswer";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Reveal } from "@/components/Reveal";
import { BUSINESS } from "@/data/business";
import { services } from "@/data/services";
import { generalFaqs } from "@/data/faqs";
import { galleryImages } from "@/data/gallery";

const serviceImageMap: Record<string, string> = {
  "malsom-dresser": "/images/gallery/araratironingshirt.jpg",
  "endringer-reparasjon": "/images/gallery/araratsowingwithmachine.jpg",
  "omforming": "/images/gallery/pointingatfabric.jpg",
  "skjorter-bluser": "/images/gallery/araratironingshirt-2.jpg",
  "skomakeri": "/images/gallery/araratdoingshoework.jpg",
  "spesialbestillinger": "/images/gallery/sittingwithcustomer.jpg",
};

export default function Tjenester() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [hash]);

  return (
    <>
      {/* Per-route schema (a rich ItemList of Service nodes with Offer
          pricing, plus BreadcrumbList, WebPage+Speakable and FAQPage) is
          injected into <head> by scripts/prerender-routes.mjs, which is
          what crawlers read. Re-emitting a thinner ItemList here would
          duplicate the node in the rendered DOM, so SEO only manages
          title/meta/canonical. */}
      <SEO
        title="Tjenester · Skreddersøm, reparasjon og skomakeri"
        description="Målsøm av dresser fra 8 000 kr, reparasjon fra 200 kr, skreddersydde skjorter fra 2 500 kr og skomakeri. Detaljert prosess og pris per tjeneste."
        canonical={BUSINESS.domain + "/tjenester"}
      />

      <div className="container-wide pt-6">
        <Breadcrumbs items={[{ label: "Tjenester", href: "/tjenester" }]} />
      </div>

      {/* Hero */}
      <section className="container-wide pt-8 pb-10 md:pt-14 md:pb-16">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow">Tjenester</p>
            <h1 className="mt-4 text-display-1 text-foreground">
              Skreddersøm,{" "}
              <span className="font-serif font-medium italic text-accent">
                reparasjon og mer
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Vi tar oppdrag fra de minste justeringene til komplette
              skreddersydde plagg. Alle priser er veiledende og settes endelig
              etter vurdering på stedet.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <QuickAnswer
            label="Kort fortalt:"
            schemaName="Tjenester hos Ararat Skredderi"
            className="mt-8"
            points={[
              { name: "Målsøm fra 8 000 kr", description: "Dresser, skjorter og bluser etter dine mål." },
              { name: "Reparasjon fra 200 kr", description: "Lengdejustering, glidelås, knapper og rifter." },
              { name: "Omforming etter avtale", description: "Gi gamle plagg nytt liv med moderne snitt." },
              { name: "Skomakeri fra 300 kr", description: "Såler, hæler, skinn og glidelåser." },
            ]}
          />
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-8">
            <Button asChild variant="outline" size="md">
              <Link to="/priser">
                Se full prisliste
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Service blocks — alternating layout */}
      <section className="space-y-16 md:space-y-24 pb-20">
        {services.map((svc, i) => {
          const isReverse = i % 2 === 1;
          const Icon = svc.icon;
          return (
            <article
              key={svc.slug}
              id={svc.slug}
              className="container-wide scroll-mt-24"
            >
              <Reveal>
                <div
                  className={`grid items-start gap-8 md:gap-14 ${
                    isReverse ? "md:grid-cols-[1fr_1.1fr]" : "md:grid-cols-[1.1fr_1fr]"
                  }`}
                >
                  <div
                    className={`relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted ${
                      isReverse ? "md:order-last" : ""
                    }`}
                  >
                    <img
                      src={serviceImageMap[svc.slug] ?? galleryImages[0].src}
                      alt={`${svc.title} hos Ararat Skredderi`}
                      loading="lazy"
                      decoding="async"
                      width="1200"
                      height="1500"
                      className="h-full w-full object-cover"
                    />
                  </div>

                <div>
                  <div className="inline-flex items-center gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {`0${i + 1} / 0${services.length}`}
                    </p>
                  </div>

                  <h2 className="mt-5 text-display-2 text-foreground">
                    {svc.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                    {svc.fullDescription}
                  </p>

                  {/* Features */}
                  <ul className="mt-6 space-y-2.5">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm md:text-base">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span className="text-foreground/90">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Process */}
                  <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
                    <p className="eyebrow">Vår prosess</p>
                    <ol className="mt-4 space-y-3">
                      {svc.process.map((step, idx) => (
                        <li key={step.step} className="flex gap-4">
                          <span className="font-serif text-xl italic text-accent/80">
                            {`0${idx + 1}`}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{step.step}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Pricing */}
                  <div className="mt-6 flex flex-col gap-2 rounded-2xl bg-navy p-5 text-white sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-wider text-accent-soft">
                        Pris
                      </p>
                      <p className="mt-1 font-display text-2xl uppercase tracking-wide">
                        {svc.pricing.label}
                      </p>
                      {svc.pricing.note ? (
                        <p className="text-xs text-white/60">{svc.pricing.note}</p>
                      ) : null}
                    </div>
                    <Button asChild variant="primary" size="md">
                      <a href={`tel:${BUSINESS.contact.phoneE164}`}>
                        <Phone className="h-4 w-4" />
                        Få prisoverslag
                      </a>
                    </Button>
                  </div>

                  {svc.readMore?.length ? (
                    <div className="mt-4 flex flex-col gap-2">
                      {svc.readMore.map((link) => (
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
              </div>
              </Reveal>
            </article>
          );
        })}
      </section>

      {/* Cluster links down to general skredder articles (handoff § 3.3) */}
      <section className="container-narrow pb-16">
        <p className="eyebrow">Fra verkstedet</p>
        <div className="mt-4 flex flex-col gap-2">
          <Link
            to="/blog/skreddersom-oslo"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-soft"
          >
            Skreddersøm i Oslo: hva det koster og hvor lang tid det tar
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/blog/skredder-majorstuen"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-soft"
          >
            Skredder på Majorstuen? Derfor er turen til Torggata verdt et kvarter
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/blog/skredder-eller-fikse-selv"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-soft"
          >
            Skredder eller fikse selv? Slik avgjør du
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
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
            {/* emitSchema={false}: prerender-routes.mjs owns the canonical
                /tjenester FAQPage in <head>; emitting here too duplicates it. */}
            <FAQAccordion items={generalFaqs} emitSchema={false} />
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
            uforpliktende samtale.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="navy" size="lg">
              <a href={`tel:${BUSINESS.contact.phoneE164}`}>
                <Phone className="h-4 w-4" />
                Ring {BUSINESS.contact.phone}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
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
