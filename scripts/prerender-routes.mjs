#!/usr/bin/env node
/**
 * Per-route static HTML generation for SPA SEO + AEO.
 *
 * Pattern destillert fra medcom-as v3 — for every non-home route, write
 * dist/<route>/index.html as a clone of the homepage shell with:
 *   - Route-specific <title>, <meta description>, canonical
 *   - Route-specific og:* / twitter:* tags
 *   - Route-specific JSON-LD (Service / FAQ / WebPage+Speakable / Breadcrumb)
 *   - Minimal H1 + intro inside <div id="root"> for non-JS crawlers
 *     (blog posts additionally get their full rendered article body)
 *
 * Vercel filesystem precedence serves these files before falling back
 * to the SPA rewrite, so AI crawlers (GPTBot, ClaudeBot, CCBot) see
 * route-specific content without executing React.
 *
 * Also injects FAQPage schema into dist/index.html (forsiden) so the
 * runtime React FAQ has a static schema-mirror.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
// Same markdown renderer as the runtime (src/blog/renderer.ts +
// src/blog/BlogPost.tsx) so prerendered article bodies match what React
// renders. Content is first-party markdown, so marked runs alone here
// (no sanitizer — mirrors borz-athletes; isomorphic-dompurify does not
// load on the Node 18 build). Only the Tailwind class decoration is
// skipped — crawlers don't need it, and React replaces #root on mount
// anyway.
import { marked } from "marked";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const SHELL_PATH = join(DIST, "index.html");
const BLOG_CONTENT_DIR = join(ROOT, "content", "blog");
const SITE = "https://www.araratskredderi.no";

if (!existsSync(SHELL_PATH)) {
  console.error("[prerender] dist/index.html not found — did you run vite build first?");
  process.exit(1);
}

const SHELL = readFileSync(SHELL_PATH, "utf8");

// ────────────────────────────────────────────────────────────
// Route definitions — kept in sync with src/data/services.ts +
// src/data/faqs.ts. Hardcoded here because the prerender script
// is plain ESM and cannot import .ts.
// ────────────────────────────────────────────────────────────

const SERVICES = [
  {
    slug: "malsom-dresser",
    name: "Målsøm av dresser",
    description: "Skreddersydde dresser etter dine mål, fra 8 000 kr eks. mva. Leveringstid 2–4 uker.",
    priceFrom: 8000,
  },
  {
    slug: "endringer-reparasjon",
    name: "Endringer & reparasjon",
    description: "Lengdejustering, reparasjon, glidelåser og knapper. Fra 200 kr. Drop-in-vurdering på stedet.",
    priceFrom: 200,
  },
  {
    slug: "omforming",
    name: "Omforming av plagg",
    description: "Gi gamle plagg nytt liv med moderne snitt. Pris etter individuell vurdering.",
    priceFrom: null,
  },
  {
    slug: "skjorter-bluser",
    name: "Skjorter & bluser",
    description: "Skreddersydde skjorter med valg av stoff, krage og detaljer. Fra 2 500 kr.",
    priceFrom: 2500,
  },
  {
    slug: "skomakeri",
    name: "Skomakeri",
    description: "Reparasjon av såler, hæler, skinn og glidelåser. Fra 300 kr.",
    priceFrom: 300,
  },
  {
    slug: "spesialbestillinger",
    name: "Spesialbestillinger",
    description: "Brudeplagg, kostymer, uniformer og designsamarbeid. Pris etter prosjekt.",
    priceFrom: null,
  },
];

const HOME_FAQS = [
  {
    q: "Hvor finner jeg dere?",
    a: "Vi holder til i Torggata 8, 0181 Oslo, midt i Oslo sentrum. Vi ligger nær flere bussholdeplasser og T-bane-stasjoner og er enkle å nå med offentlig transport.",
  },
  {
    q: "Må jeg bestille time?",
    a: "Nei. Du kan komme innom uten avtale og få plagget vurdert mens du venter. For større prosjekter som målsøm av dress eller brudeplagg anbefaler vi å avtale tid på forhånd.",
  },
  {
    q: "Hvor lang tid tar reparasjoner?",
    a: "Enkle reparasjoner som lengdejustering eller glidelås tar 1–3 dager. Mer komplekse reparasjoner og omforminger tar 2–5 uker. Målsøm av dress: 2–4 uker fra måltaking til ferdig plagg.",
  },
  {
    q: "Hva koster det?",
    a: "Reparasjoner starter fra 200 kr. Skreddersydde skjorter fra 2 500 kr. Målsøm av dress fra 8 000 kr. Vi gir alltid bindende prisoverslag før vi setter i gang.",
  },
  {
    q: "Kan dere reparere alle typer klær og sko?",
    a: "Vi tar de fleste plagg og skotyper, fra hverdagsklær til premium og arvestykker. For helt spesielle materialer eller designerklær gir vi alltid en ærlig vurdering før vi tar oppdraget.",
  },
];

const TJENESTER_FAQS = [
  ...HOME_FAQS,
  {
    q: "Tilbyr dere hjemmebesøk?",
    a: "For spesielle anledninger og større prosjekter som brudeplagg kan vi arrangere hjemmebesøk i Oslo-området. Kontakt oss for å avtale.",
  },
];

// Mirror of priserFaqs in src/pages/Priser.tsx (kept in sync by hand —
// the prerender script is plain ESM and cannot import the .tsx source).
const PRISER_FAQS = [
  {
    q: "Hva koster det å legge opp bukser?",
    a: "Å legge opp bukser eller justere lengde koster vanligvis mellom 200 og 400 kr, avhengig av plagg, fald og hvor mye som skal endres. Kom innom Torggata 8 for en rask vurdering, så får du bindende pris før vi starter.",
  },
  {
    q: "Hva koster en skreddersydd dress?",
    a: "Målsøm av dress starter fra 8 000 kr eks. mva. Endelig pris avhenger av stoff, fôr og kompleksitet, og inkluderer konsultasjon, måltaking og prøvinger. Leveringstid er normalt 2 – 4 uker.",
  },
  {
    q: "Hva koster det å bytte glidelås?",
    a: "Pris for å bytte glidelås avhenger av plagget, om det er bukse, jakke eller kjole, og typen glidelås. Enkle bytter starter fra 200 kr. Vi vurderer plagget på stedet og gir deg en konkret pris.",
  },
  {
    q: "Får jeg vite prisen før arbeidet starter?",
    a: "Ja. Vi gir alltid et bindende prisoverslag før vi setter i gang, slik at du vet hva det koster på forhånd. Drop-in mandag til lørdag, ingen timeavtale nødvendig.",
  },
  {
    q: "Er prisene veiledende?",
    a: "Prisene her er veiledende startpriser. Endelig pris settes etter at vi har sett plagget, fordi tilstand, materiale og omfang varierer. Du betaler aldri mer enn det avtalte overslaget uten at vi har avklart det med deg først.",
  },
];

// Mirror of skomakerFaqs in src/pages/SkomakerOslo.tsx.
const SKOMAKER_FAQS = [
  {
    q: "Hva koster en skoreparasjon?",
    a: "Skomakertjenester starter fra 300 kr, og sålereparasjon fra 400 kr. Endelig pris avhenger av skotype og hva som skal gjøres. Kom innom Torggata 8 for en rask vurdering, så får du bindende pris før vi starter.",
  },
  {
    q: "Hvor lang tid tar en skoreparasjon?",
    a: "De fleste skoreparasjoner er ferdig innen 3 til 7 dager, avhengig av reservedeler og kompleksitet. Enkle hæl- og sålejobber går ofte raskere.",
  },
  {
    q: "Reparerer dere alle typer sko?",
    a: "Vi tar de fleste sko i skinn, tekstil og syntet, fra hverdagssko til premium og arvede modeller. For helt spesielle materialer gir vi en ærlig vurdering før vi tar oppdraget.",
  },
  {
    q: "Kan dere bytte glidelås i støvler?",
    a: "Ja. Vi reparerer og bytter glidelåser på støvler og annet skotøy. Ta med skoene innom, så vurderer vi om glidelåsen kan repareres eller bør byttes.",
  },
  {
    q: "Er dere både skomaker og skredder?",
    a: "Ja. I Torggata 8 har vi både skomaker og skredder under samme tak. Du kan levere sko til reparasjon og samtidig få ordnet endringer på klær, i ett og samme besøk.",
  },
  {
    q: "Hvor i Oslo holder dere til?",
    a: "Vi holder til i Torggata 8, 0181 Oslo, midt i sentrum. Det er kort vei fra Jernbanetorget og Stortinget, og enkelt å nå med buss og T-bane.",
  },
  {
    q: "Lønner det seg å reparere sko i stedet for å kjøpe nye?",
    a: "Ofte, ja, spesielt for sko i godt skinn. Sålereparasjon fra 400 kr koster som regel langt mindre enn et nytt par i tilsvarende kvalitet, og gode sko tåler flere runder med reparasjon. For rimelige sko med slitt overdel er svaret ikke alltid ja. Ta dem med til Torggata 8, så får du en ærlig vurdering og bindende pris før du bestemmer deg.",
  },
  {
    q: "Må jeg bestille time hos skomakeren?",
    a: "Nei. Vi har drop-in mandag til lørdag i Torggata 8, og du trenger ingen avtale. Kom innom med skoene, så vurderer vi dem mens du venter og gir deg bindende pris før vi starter. Vil du sjekke noe på forhånd, kan du ringe oss på 91 92 19 08.",
  },
  {
    q: "Hva skjer hvis skoen ikke kan repareres?",
    a: "Da sier vi det før du bruker penger. Ved vurderingen får du et ærlig svar på om reparasjon er mulig og om det lønner seg, og vi starter aldri uten at du har godkjent en bindende pris. Du bestemmer selv om vi skal gå videre.",
  },
];

// ────────────────────────────────────────────────────────────
// Schema fragment builders
// ────────────────────────────────────────────────────────────

function offerLd(slug, priceFrom) {
  if (priceFrom === null) return null;
  return {
    "@type": "Offer",
    url: `${SITE}/tjenester#${slug}`,
    priceCurrency: "NOK",
    availability: "https://schema.org/InStock",
    priceSpecification: {
      "@type": "PriceSpecification",
      price: String(priceFrom),
      priceCurrency: "NOK",
      valueAddedTaxIncluded: false,
    },
  };
}

function webPageSpeakableLd(url, name) {
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    isPartOf: { "@id": `${SITE}/#website` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[aria-label='Kort fortalt:']"],
    },
    mainContentOfPage: {
      "@type": "WebPageElement",
      cssSelector: "main",
    },
  };
}

function breadcrumbLd(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

function faqLd(faqs) {
  if (!faqs?.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// ────────────────────────────────────────────────────────────
// Per-route schema bundles
// ────────────────────────────────────────────────────────────

function tjenesterLd() {
  const url = `${SITE}/tjenester`;
  const itemList = {
    "@type": "ItemList",
    "@id": `${url}#service-list`,
    name: "Tjenester hos Ararat Skredderi",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: SERVICES.length,
    itemListElement: SERVICES.map((svc, i) => {
      const offer = offerLd(svc.slug, svc.priceFrom);
      const serviceNode = {
        "@type": "Service",
        "@id": `${url}#${svc.slug}`,
        name: svc.name,
        description: svc.description,
        provider: { "@id": `${SITE}/#localbusiness` },
        areaServed: { "@type": "City", name: "Oslo" },
        ...(offer ? { offers: offer } : {}),
      };
      return {
        "@type": "ListItem",
        position: i + 1,
        name: svc.name,
        item: serviceNode,
      };
    }),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      itemList,
      breadcrumbLd([
        { name: "Hjem", url: `${SITE}/` },
        { name: "Tjenester", url },
      ]),
      webPageSpeakableLd(url, "Tjenester hos Ararat Skredderi"),
      faqLd(TJENESTER_FAQS),
    ],
  };
}

function galleriLd() {
  const url = `${SITE}/galleri`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ImageGallery",
        "@id": `${url}#gallery`,
        name: "Galleri · Ararat Skredderi",
        description: "Bilder fra verkstedet, kundemøter og lokalene i Torggata 8.",
        url,
      },
      breadcrumbLd([
        { name: "Hjem", url: `${SITE}/` },
        { name: "Galleri", url },
      ]),
      webPageSpeakableLd(url, "Galleri"),
    ],
  };
}

function omOssLd() {
  const url = `${SITE}/om-oss`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${url}#aboutpage`,
        url,
        name: "Om Ararat Skredderi",
        mainEntity: { "@id": `${SITE}/#organization` },
        about: { "@id": `${SITE}/#owner` },
      },
      breadcrumbLd([
        { name: "Hjem", url: `${SITE}/` },
        { name: "Om oss", url },
      ]),
      webPageSpeakableLd(url, "Om Ararat Skredderi"),
    ],
  };
}

function kontaktLd() {
  const url = `${SITE}/kontakt`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${url}#contactpage`,
        url,
        name: "Kontakt Ararat Skredderi",
        mainEntity: { "@id": `${SITE}/#localbusiness` },
      },
      breadcrumbLd([
        { name: "Hjem", url: `${SITE}/` },
        { name: "Kontakt", url },
      ]),
      webPageSpeakableLd(url, "Kontakt"),
      faqLd(TJENESTER_FAQS),
    ],
  };
}

function personvernLd() {
  const url = `${SITE}/personvern`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: "Personvernerklæring",
        isPartOf: { "@id": `${SITE}/#website` },
      },
      breadcrumbLd([
        { name: "Hjem", url: `${SITE}/` },
        { name: "Personvern", url },
      ]),
    ],
  };
}

// One Offer node for the /priser OfferCatalog. minPrice mirrors the
// veiledende floor shown on the page; maxPrice only set where the page
// quotes a range (e.g. legge opp 200–400). All prices eks. mva.
function priceOffer({ name, minPrice, maxPrice }) {
  const spec = {
    "@type": "PriceSpecification",
    priceCurrency: "NOK",
    minPrice: String(minPrice),
    valueAddedTaxIncluded: false,
  };
  if (maxPrice != null) spec.maxPrice = String(maxPrice);
  return {
    "@type": "Offer",
    itemOffered: { "@type": "Service", name },
    priceCurrency: "NOK",
    priceSpecification: spec,
    availability: "https://schema.org/InStock",
    areaServed: { "@type": "City", name: "Oslo" },
  };
}

function priserLd() {
  const url = `${SITE}/priser`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OfferCatalog",
        "@id": `${url}#prisliste`,
        name: "Prisliste hos Ararat Skredderi",
        url,
        provider: { "@id": `${SITE}/#localbusiness` },
        itemListElement: [
          priceOffer({ name: "Legge opp bukser, skjørt eller ermer", minPrice: 200, maxPrice: 400 }),
          priceOffer({ name: "Endring og reparasjon", minPrice: 200 }),
          priceOffer({ name: "Skreddersydd skjorte eller bluse", minPrice: 2500 }),
          priceOffer({ name: "Målsøm av dress", minPrice: 8000 }),
          priceOffer({ name: "Skomakeri", minPrice: 300 }),
          priceOffer({ name: "Sålereparasjon", minPrice: 400 }),
        ],
      },
      breadcrumbLd([
        { name: "Hjem", url: `${SITE}/` },
        { name: "Priser", url },
      ]),
      webPageSpeakableLd(url, "Priser hos Ararat Skredderi"),
      faqLd(PRISER_FAQS),
    ],
  };
}

function skomakerLd() {
  const url = `${SITE}/skomaker-oslo`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: "Skomaker i Oslo sentrum",
        serviceType: "Skomakeri",
        description:
          "Skomaker i Torggata 8, midt i Oslo sentrum: sålereparasjon, hæler, skinn og glidelåser fra 300 kr. Både skomaker og skredder under ett tak.",
        provider: { "@id": `${SITE}/#localbusiness` },
        areaServed: { "@type": "City", name: "Oslo" },
        offers: {
          "@type": "Offer",
          priceCurrency: "NOK",
          availability: "https://schema.org/InStock",
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: "300",
            priceCurrency: "NOK",
            valueAddedTaxIncluded: false,
          },
        },
      },
      breadcrumbLd([
        { name: "Hjem", url: `${SITE}/` },
        { name: "Skomaker i Oslo", url },
      ]),
      webPageSpeakableLd(url, "Skomaker i Oslo sentrum"),
      faqLd(SKOMAKER_FAQS),
    ],
  };
}

// ────────────────────────────────────────────────────────────
// HTML mutation helpers
// ────────────────────────────────────────────────────────────

function htmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function injectMeta(html, { title, description, url, h1, intro, ogType, ogImage, bodyHtml }) {
  const fullTitle = `${title} | Ararat Skredderi`;
  const safeTitle = htmlEscape(fullTitle);
  const safeDesc = htmlEscape(description);
  const safeUrl = htmlEscape(url);
  const safeH1 = htmlEscape(h1);
  const safeIntro = htmlEscape(intro);

  let out = html;

  out = out.replace(/<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`);
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${safeDesc}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${safeTitle}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${safeDesc}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${safeUrl}" />`,
  );
  // og:type only overridden when the route asks for it (blog posts →
  // "article"); static routes keep the shell's default value.
  if (ogType) {
    out = out.replace(
      /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:type" content="${htmlEscape(ogType)}" />`,
    );
  }
  // og:image only overridden when the route has its own image (blog posts
  // with a hero_image); everything else keeps the default og-image.jpg.
  // twitter:image mirrors it so both card types show the same picture.
  if (ogImage) {
    out = out.replace(
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:image" content="${htmlEscape(ogImage)}" />`,
    );
    out = out.replace(
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:image" content="${htmlEscape(ogImage)}" />`,
    );
  }
  out = out.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${safeTitle}" />`,
  );
  out = out.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${safeDesc}" />`,
  );
  out = out.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${safeUrl}" />`,
  );
  out = out.replace(
    /<link\s+rel="alternate"\s+hreflang="nb-NO"\s+href="[^"]*"\s*\/?>/,
    `<link rel="alternate" hreflang="nb-NO" href="${safeUrl}" />`,
  );

  // Inject minimal H1 + Quick Answer intro into <div id="root"> for non-JS
  // crawlers. aria-label="Kort fortalt:" matches the speakable cssSelector in
  // webPageSpeakableLd so voice-assistant / AI extraction resolves to this
  // summary paragraph instead of finding nothing. Blog posts additionally
  // append their full rendered article body (bodyHtml) so no-JS AI
  // crawlers read the whole article, not just a 200-char excerpt. The
  // CLS caveat documented for the homepage does not apply here: sub-route
  // injections measured CLS 0, and React still replaces #root on mount.
  // Replacer FUNCTION (not string) so `$&`/`$'` patterns in the injected
  // content can't expand into the replacement.
  out = out.replace(
    /<div id="root"><\/div>/,
    () => `<div id="root"><h1>${safeH1}</h1><p aria-label="Kort fortalt:">${safeIntro}</p>${bodyHtml ?? ""}</div>`,
  );

  return out;
}

function injectSchema(html, schema) {
  const tag = `<script type="application/ld+json" data-prerender-route>${JSON.stringify(schema)}</script>\n  </head>`;
  return html.replace("</head>", tag);
}

function writeRouteHtml(routePath, html) {
  const outDir = join(DIST, routePath);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html, "utf8");
}

// ────────────────────────────────────────────────────────────
// Render + write
// ────────────────────────────────────────────────────────────

const ROUTES = [
  {
    path: "tjenester",
    title: "Tjenester · Skreddersøm, reparasjon og skomakeri",
    description:
      "Målsøm av dresser fra 8 000 kr, reparasjon fra 200 kr, skreddersydde skjorter fra 2 500 kr og skomakeri. Detaljert prosess og pris per tjeneste.",
    h1: "Skreddersøm, reparasjon og mer",
    intro:
      "Vi tar oppdrag fra de minste justeringene til komplette skreddersydde plagg. Alle priser er veiledende og settes endelig etter vurdering på stedet.",
    schema: tjenesterLd(),
  },
  {
    path: "priser",
    title: "Priser · Hva koster skredder og reparasjon i Oslo?",
    description:
      "Veiledende prisliste for skreddersøm, reparasjon og skomakeri i Oslo sentrum. Legge opp bukser 200–400 kr, skreddersydd skjorte fra 2 500 kr, målsøm av dress fra 8 000 kr, skomakeri fra 300 kr.",
    h1: "Priser på skreddersøm og reparasjon",
    intro:
      "Veiledende startpriser for skreddersøm, reparasjon, omforming og skomakeri i Oslo sentrum. Du får alltid et bindende prisoverslag før vi starter.",
    schema: priserLd(),
  },
  {
    path: "skomaker-oslo",
    title: "Skomaker i Oslo sentrum · Skredder på samme sted",
    description:
      "Skomaker i Torggata 8, midt i Oslo sentrum: sålereparasjon, hæler, skinn og glidelåser fra 300 kr. Det eneste stedet i sentrum med både skomaker og skredder under ett tak.",
    h1: "Skomaker i Oslo sentrum",
    intro:
      "I Torggata 8 finner du både skomaker og skredder under ett tak. Vi reparerer såler, hæler, skinn og glidelåser, og kan samtidig ta endringen på klærne mens du er her.",
    schema: skomakerLd(),
  },
  {
    path: "galleri",
    title: "Galleri · Verkstedet og lokalene",
    description:
      "Bilder fra verkstedet og lokalene i Torggata 8: skreddersøm, sysøm, kundemøter, stoffvalg og fasaden. Bak håndverket hos Ararat Skredderi.",
    h1: "Bak håndverket",
    intro:
      "Bilder fra verkstedet, kundemøter og lokalene i Torggata 8. Klikk på et bilde for å se det i full størrelse.",
    schema: galleriLd(),
  },
  {
    path: "om-oss",
    title: "Om oss · Skreddermester med 50+ års erfaring",
    description:
      "Ararat Skredderi har levert kvalitetshåndverk i over 50 år. Skreddermester Ahmad Abdulhamid i Torggata 8, Oslo sentrum.",
    h1: "50+ år med håndverkstradisjon",
    intro:
      "Vår skredderbutikk i Oslo har i mer enn 50 år levert kvalitetsarbeid innen reparasjon, tilpasning og søm av nye klær.",
    schema: omOssLd(),
  },
  {
    path: "kontakt",
    title: "Kontakt · Torggata 8, Oslo · Ring +47 91 92 19 08",
    description:
      "Kontakt Ararat Skredderi i Torggata 8, 0181 Oslo. Drop-in mandag–lørdag. Ring 91 92 19 08 eller send e-post.",
    h1: "Kom innom eller ring oss",
    intro:
      "Drop-in mandag til lørdag. Ingen avtale nødvendig. Vi gir alltid en ærlig vurdering og bindende prisoverslag før vi starter på plagget ditt.",
    schema: kontaktLd(),
  },
  {
    path: "personvern",
    title: "Personvernerklæring",
    description:
      "Hvordan Ararat Skredderi behandler personopplysninger i henhold til GDPR og personopplysningsloven.",
    h1: "Personvernerklæring",
    intro: "Hvordan vi behandler personopplysninger og dine rettigheter etter GDPR.",
    schema: personvernLd(),
  },
  {
    // Workaround: Vercel SPA-rewrite trigger inkonsistent for /blog,
    // så vi prerender en blogg-index så filesystem-presedensen alltid
    // finner noe. Reell artikkelliste lastes klient-side fra
    // content/blog/*.md når React mounter.
    path: "blog",
    title: "Blogg · Råd og innsikt fra verkstedet",
    description:
      "Artikler og råd fra Ararat Skredderi i Torggata 8, Oslo. Skreddersøm, reparasjon, omforming og skomakeri.",
    h1: "Blogg",
    intro:
      "Tanker, praktiske råd og konkrete eksempler fra verkstedet i Torggata 8.",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Blog",
          "@id": `${SITE}/blog#blog`,
          url: `${SITE}/blog`,
          name: "Ararat Skredderi blogg",
          publisher: { "@id": `${SITE}/#organization` },
        },
        breadcrumbLd([
          { name: "Hjem", url: `${SITE}/` },
          { name: "Blogg", url: `${SITE}/blog` },
        ]),
        webPageSpeakableLd(`${SITE}/blog`, "Blogg"),
      ],
    },
  },
];

// Artikkel-lenkeliste for den prerendrede /blog-indexen. Uten denne så
// no-JS-crawlere bare H1+intro på /blog og kunne ikke OPPDAGE artiklene
// derfra (de reelle kortene lastes klient-side). Bygges fra samme
// content/blog/*.md som artikkel-prerenderen lenger ned.
function blogIndexBodyHtml() {
  if (!existsSync(BLOG_CONTENT_DIR)) return "";
  const items = readdirSync(BLOG_CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parseFrontmatter(readFileSync(join(BLOG_CONTENT_DIR, f), "utf8"))?.data)
    .filter((d) => d?.slug && d?.title)
    .sort((a, b) => String(b.published_at ?? "").localeCompare(String(a.published_at ?? "")));
  if (items.length === 0) return "";
  const lis = items
    .map((d) => `<li><a href="/blog/${htmlEscape(d.slug)}">${htmlEscape(d.title)}</a></li>`)
    .join("");
  return `<h2>Artikler</h2><ul>${lis}</ul>`;
}

let count = 0;

for (const r of ROUTES) {
  const url = `${SITE}/${r.path}`;
  const html = injectSchema(
    injectMeta(SHELL, {
      title: r.title,
      description: r.description,
      url,
      h1: r.h1,
      intro: r.intro,
      bodyHtml: r.path === "blog" ? blogIndexBodyHtml() : undefined,
    }),
    r.schema,
  );
  writeRouteHtml(r.path, html);
  count++;
}

// ────────────────────────────────────────────────────────────
// Blog articles — for every content/blog/*.md, prerender a static
// HTML at dist/blog/<slug>/index.html so /blog/<slug> serves a real
// document instead of 404'ing. Vercel SPA-rewriten har vist seg
// upålitelig på dette prosjektet (regex matcher /tjenester via
// prerender, men ikke /blog/x via fallback). Prerender løser både
// 404-en og SEO/AEO (hver artikkel får riktig title, meta, canonical
// og BlogPosting-schema fra dag én).
// ────────────────────────────────────────────────────────────

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  const [, block, body] = match;
  const data = {};
  for (const line of block.split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rawValue] = kv;
    let value = rawValue.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      try {
        value = value.startsWith('"') ? JSON.parse(value) : value.slice(1, -1);
      } catch {
        value = value.slice(1, -1);
      }
    }
    data[key] = value;
  }
  return { data, body };
}

function buildExcerpt(body, maxChars = 200) {
  const stripped = body
    .replace(/^>\s*\*\*.*?\*\*:?\s*/m, "")
    .replace(/^#+\s.*$/gm, "")
    .replace(/[*_`#[\]>]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  if (stripped.length <= maxChars) return stripped;
  const cut = stripped.slice(0, maxChars);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

function blogPostingLd(article, url) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: article.title,
        description: article.meta_description ?? "",
        image: article.hero_image ? `${SITE}${article.hero_image}` : undefined,
        datePublished: article.published_at,
        dateModified: article.updated_at ?? article.published_at,
        url,
        author: { "@id": `${SITE}/#owner` },
        publisher: { "@id": `${SITE}/#organization` },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        keywords: article.keyword,
      },
      breadcrumbLd([
        { name: "Hjem", url: `${SITE}/` },
        { name: "Blogg", url: `${SITE}/blog` },
        { name: article.title, url },
      ]),
      webPageSpeakableLd(url, article.title),
    ],
  };
}

if (existsSync(BLOG_CONTENT_DIR)) {
  const mdFiles = readdirSync(BLOG_CONTENT_DIR).filter((f) => f.endsWith(".md"));
  for (const file of mdFiles) {
    const raw = readFileSync(join(BLOG_CONTENT_DIR, file), "utf8");
    const parsed = parseFrontmatter(raw);
    if (!parsed?.data?.slug || !parsed?.data?.title) continue;
    const article = parsed.data;
    const url = `${SITE}/blog/${article.slug}`;
    const excerpt = buildExcerpt(parsed.body);
    // Full article body — same marked renderer as the runtime
    // (src/blog/BlogPost.tsx), so crawlers get the complete text.
    const bodyHtml = marked.parse(parsed.body);
    const html = injectSchema(
      injectMeta(SHELL, {
        title: article.meta_title ?? article.title,
        description: article.meta_description ?? excerpt,
        url,
        h1: article.title,
        intro: excerpt,
        ogType: "article",
        ogImage: article.hero_image ? `${SITE}${article.hero_image}` : undefined,
        bodyHtml,
      }),
      blogPostingLd(article, url),
    );
    writeRouteHtml(`blog/${article.slug}`, html);
    count++;
  }
}

// ────────────────────────────────────────────────────────────
// Forsiden (homepage) — the homepage IS dist/index.html (the SPA shell),
// so vite leaves <div id="root"></div> empty. Unlike the sub-routes above,
// nothing injected crawler-visible content here, so a no-JS AI crawler
// (GPTBot, ClaudeBot, CCBot, PerplexityBot — none execute JS) saw an empty
// body on the single most important URL. Inject the same kind of static
// H1 + Quick Answer + services + NAP + FAQ we give every sub-route, plus a
// WebPage(+Speakable) node. React's createRoot replaces #root on mount, so
// real users still get the full SPA; only no-JS crawlers see this fallback.
// ────────────────────────────────────────────────────────────

function homeWebPageLd() {
  const url = `${SITE}/`;
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: "Ararat Skredderi · skreddersøm, reparasjon og skomakeri i Oslo",
    isPartOf: { "@id": `${SITE}/#website` },
    about: { "@id": `${SITE}/#localbusiness` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[aria-label='Kort fortalt:']"],
    },
    mainContentOfPage: {
      "@type": "WebPageElement",
      cssSelector: "main",
    },
  };
}

function homeContentHtml() {
  // Keep this DELIBERATELY minimal: h1 + a single Quick Answer paragraph,
  // matching the CLS-safe shape used by every sub-route. React's createRoot
  // wipes #root on mount and renders the full SPA, so anything injected here
  // is paint-then-replace. A large block (services <ul>, NAP, FAQ <dl>) made
  // the homepage shift CLS 0.759 vs CLS 0 on the small sub-route injections.
  // The detailed content lives in (a) the static <head> @graph
  // (Organization/LocalBusiness/Person — full NAP, geo, hours, sameAs) and
  // (b) the FAQPage + WebPage schema injected just below — so no-JS crawlers
  // still get the structured facts without the layout-shift penalty.
  const h1 = "Ararat Skredderi, skredder i Oslo sentrum";
  const qa =
    "Ararat Skredderi i Torggata 8, 0181 Oslo, tilbyr skreddersøm, " +
    "reparasjon, omforming og skomakeri. Skreddermester Ahmad Abdulhamid " +
    "har over 50 års erfaring. Drop-in mandag til lørdag, ingen timeavtale " +
    "nødvendig.";
  return (
    `<div id="root">` +
    `<h1>${htmlEscape(h1)}</h1>` +
    `<p aria-label="Kort fortalt:"><strong>Kort fortalt:</strong> ${htmlEscape(qa)}</p>` +
    `</div>`
  );
}

{
  let homeHtml = readFileSync(SHELL_PATH, "utf8");

  // 1) Crawler-visible content into the (otherwise empty) React root.
  homeHtml = homeHtml.replace(/<div id="root"><\/div>/, homeContentHtml());

  // 2) Homepage schema: WebPage(+Speakable) + FAQPage in one @graph.
  const homeGraph = [homeWebPageLd()];
  const homeFaq = faqLd(HOME_FAQS);
  if (homeFaq) homeGraph.push(homeFaq);
  const tag = `<script type="application/ld+json" data-prerender-home>${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": homeGraph,
  })}</script>\n  </head>`;
  homeHtml = homeHtml.replace("</head>", tag);

  writeFileSync(SHELL_PATH, homeHtml, "utf8");
  count++;
}

console.log(
  `[prerender] Wrote ${count} per-route HTML files with route-specific title, meta, canonical, JSON-LD and H1+intro body content`,
);
