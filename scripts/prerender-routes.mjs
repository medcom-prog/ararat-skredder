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

// Speiling av src/data/services.ts (title → name). `description` og
// `priceFrom` mater Service/Offer-schemaet; `fullDescription`, `features`,
// `process` og `pricing*` mater den crawler-synlige /tjenester-bodyen, slik
// at en no-JS-crawler leser det samme som en bruker ser i React.
// HOLD I SYNC med src/data/services.ts.
const SERVICES = [
  {
    slug: "malsom-dresser",
    name: "Målsøm av dresser",
    description: "Skreddersydde dresser etter dine mål, fra 8 000 kr eks. mva. Leveringstid 2–4 uker.",
    priceFrom: 8000,
    fullDescription:
      "Vi skreddersyr elegante dresser etter dine mål og preferanser. En grundig prosess gir perfekt passform og en stil som matcher både personlighet og anledning, fra konsultasjon og måltaking til prøving og finjustering.",
    features: [
      "Nøyaktig måltaking og personlig konsultasjon",
      "Premium stoffvalg: ull, lin, silke",
      "Klassisk og moderne snitt",
      "Prøving og tilpasning underveis",
    ],
    process: [
      { step: "Konsultasjon", description: "Diskuter preferanser og behov med en erfaren skredder." },
      { step: "Måltaking", description: "Nøyaktige kroppsmål for skreddersydd passform." },
      { step: "Designvalg", description: "Stoff, snitt og detaljer som passer din stil." },
      { step: "Prøving og tilpasning", description: "Finjustering for maksimal komfort." },
    ],
    pricingLabel: "Fra 8 000 kr",
    pricingNote: "Avhenger av stoff og kompleksitet",
    readMore: [
      { href: "/blog/skreddersydd-dress-oslo", label: "5 ting du bør vite før du bestiller dress" },
      { href: "/blog/hva-koster-skreddersydd-dress", label: "Hva koster en skreddersydd dress?" },
    ],
  },
  {
    slug: "endringer-reparasjon",
    name: "Endringer & reparasjon",
    description: "Lengdejustering, reparasjon, glidelåser og knapper. Fra 200 kr. Drop-in-vurdering på stedet.",
    priceFrom: 200,
    fullDescription:
      "Vi utfører endringer og reparasjoner som får plaggene til å sitte bedre og vare lenger, fra enkle justeringer til komplekse jobber. Bukser, skjørt, ermer, knapper, glidelåser og alt der imellom.",
    features: [
      "Lengdejustering av bukser, skjørt og ermer",
      "Inn- og uttak for justert passform",
      "Reparasjon av rifter, hull og slitasje",
      "Glidelåser og knapper byttes raskt",
    ],
    process: [
      { step: "Innlevering", description: "Kom innom Torggata 8. Vi vurderer plagget på stedet." },
      { step: "Prisoverslag", description: "Konkret pris og leveringstid før vi setter i gang." },
      { step: "Håndverk", description: "Erfarne skreddere utfører arbeidet med presisjon." },
      { step: "Henting", description: "Plagget klart til avtalt tid, pakket og pent." },
    ],
    pricingLabel: "Fra 200 kr",
    pricingNote: "Pris settes etter vurdering på stedet",
    readMore: [{ href: "/blog/sy-om-dress-oslo", label: "Sy om dressen i stedet for å kjøpe ny" }],
  },
  {
    slug: "omforming",
    name: "Omforming av plagg",
    description: "Gi gamle plagg nytt liv med moderne snitt. Pris etter individuell vurdering.",
    priceFrom: null,
    fullDescription:
      "Har du et plagg du elsker som ikke lenger passer eller føles utdatert? Vi gir det nytt liv: oppgradering av snitt, fasong eller detaljer for et moderne uttrykk uten å miste det som gjorde plagget spesielt i utgangspunktet.",
    features: [
      "Gammel dress blir moderne blazer",
      "Lang kjole blir tidløs midikjole",
      "For stor skjorte blir skreddersydd passform",
      "Arvestykker fornyet med varsomhet",
    ],
    process: [
      { step: "Konsept", description: "Vi diskuterer hva plagget skal bli." },
      { step: "Skisse og pris", description: "Forslag på endringer og bindende prisoverslag." },
      { step: "Omforming", description: "Håndverket utføres med respekt for originalstoffet." },
      { step: "Tilpasning", description: "Endelig prøving for perfekt passform." },
    ],
    pricingLabel: "Pris etter vurdering",
    pricingNote: "Vurderes individuelt etter kompleksitet",
    readMore: [{ href: "/blog/tilpasning-dress-oslo", label: "Tilpasning av dress: justering eller skreddersøm?" }],
  },
  {
    slug: "skjorter-bluser",
    name: "Skjorter & bluser",
    description: "Skreddersydde skjorter med valg av stoff, krage og detaljer. Fra 2 500 kr.",
    priceFrom: 2500,
    fullDescription:
      "Skreddersydde skjorter og bluser med perfekt passform. Du velger stoff, krage, mansjett og alle detaljer, fra premium bomull til silke, sateng, lin og tekniske stoffer.",
    features: [
      "Premium bomull, silke, sateng, lin",
      "Klassisk og moderne kragesnitt",
      "Måltatt passform, ikke standardstørrelser",
      "Skreddersydde for kontor, fest eller hverdag",
    ],
    process: [
      { step: "Stoffvalg", description: "Vi viser deg utvalget, fra hverdagsbomull til premiumsilke." },
      { step: "Måltaking", description: "Nøyaktige mål for skuldre, bryst, midje og lengde." },
      { step: "Søm", description: "Skjorten eller blusen sys på bestilling i vårt verksted." },
      { step: "Prøving", description: "Endelig prøving for perfekt passform." },
    ],
    pricingLabel: "Fra 2 500 kr",
    pricingNote: "Avhenger av stoff og design",
    readMore: [],
  },
  {
    slug: "skomakeri",
    name: "Skomakeri",
    description: "Reparasjon av såler, hæler, skinn og glidelåser. Fra 300 kr.",
    priceFrom: 300,
    fullDescription:
      "Vi utfører alle typer skoreparasjoner i skinn, tekstil og syntet. Kom innom for vurdering. Spesialitet på reparasjon av arvede sko og høykvalitetsmodeller som fortjener et nytt liv.",
    features: [
      "Sålereparasjon og utskifting",
      "Hælreparasjon og utskifting",
      "Lapping og fiks av rifter i skinn",
      "Reparasjon og utskifting av glidelåser på støvler",
    ],
    process: [
      { step: "Vurdering", description: "Drop-in for vurdering og prisoverslag." },
      { step: "Materialvalg", description: "Riktig såle eller hæl etter skoens kvalitet og bruk." },
      { step: "Reparasjon", description: "Utføres på verkstedet vårt." },
      { step: "Henting", description: "Klart på avtalt tid." },
    ],
    pricingLabel: "Fra 300 kr",
    pricingNote: "Avhenger av skotype og reparasjon",
    readMore: [{ href: "/skomaker-oslo", label: "Les mer om skomaker i Oslo sentrum" }],
  },
  {
    slug: "spesialbestillinger",
    name: "Spesialbestillinger",
    description: "Brudeplagg, kostymer, uniformer og designsamarbeid. Pris etter prosjekt.",
    priceFrom: null,
    fullDescription:
      "Har du en idé eller et spesielt behov? Vi tar utfordrende prosjekter og spesialbestillinger: brudekjoler og brudgomsdresser, kostymer for teater og film, profesjonelle uniformer og samarbeid med merker og designere.",
    features: [
      "Brudekjoler og brudgomsdresser",
      "Kostymer for teater, film og event",
      "Profesjonelle og seremonielle uniformer",
      "Samarbeid med merker og designere",
    ],
    process: [
      { step: "Konsept-møte", description: "Vi diskuterer visjon, budsjett og tidsramme." },
      { step: "Skisse og tilbud", description: "Konkret forslag med pris og leveringsplan." },
      { step: "Produksjon", description: "Iterativ produksjon med prøvinger underveis." },
      { step: "Levering", description: "Endelig prøving før overlevering." },
    ],
    pricingLabel: "Etter avtale",
    pricingNote: "Vurderes individuelt etter prosjekt",
    readMore: [{ href: "/blog/sy-om-brudekjole-oslo", label: "Sy om brudekjole i Oslo: slik fungerer det" }],
  },
];

// Speiling av priceGroups i src/pages/Priser.tsx. Hvert kr-tall er hentet
// ordrett fra kilden — ingen avrunding, ingen gjetting.
const PRICE_GROUPS = [
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
    readMore: { label: "Sy om dressen i stedet for å kjøpe ny", href: "/blog/sy-om-dress-oslo" },
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
    readMore: { label: "Hva koster en skreddersydd dress?", href: "/blog/hva-koster-skreddersydd-dress" },
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
    readMore: null,
  },
];

// Speiling av BUSINESS.hours i src/data/business.ts.
const HOURS = [
  { days: "Mandag – fredag", time: "10:00–19:00" },
  { days: "Lørdag", time: "10:00–18:00" },
  { days: "Søndag", time: "Stengt" },
];

// Speiling av BUSINESS.contact + BUSINESS.address i src/data/business.ts.
const NAP = {
  street: "Torggata 8",
  postalCode: "0181",
  city: "Oslo",
  phone: "+47 91 92 19 08",
  email: "ararat_skredder@hotmail.com",
};

// Speiling av galleryCategories + galleryImages i src/data/gallery.ts.
// Alt-tekstene er kundens egne bildebeskrivelser og er det eneste tekstlige
// innholdet /galleri faktisk har.
const GALLERY_CATEGORIES = [
  { id: "skreddersom", label: "Skreddersøm" },
  { id: "verksted", label: "Verksted" },
  { id: "kunde", label: "Kundemøte" },
  { id: "lokaler", label: "Lokaler" },
  { id: "skomakeri", label: "Skomakeri" },
];

const GALLERY_IMAGES = [
  { alt: "Ahmad presser en skjorte med dampjern på verkstedet", category: "skreddersom" },
  { alt: "Detalj av Ahmad som presser kragen på en skjorte", category: "skreddersom" },
  { alt: "Ahmad syr på industri-symaskinen", category: "skreddersom" },
  { alt: "Sysøm i nærbilde, presisjon på symaskin", category: "skreddersom" },
  { alt: "Ahmad konsentrert ved symaskinen", category: "skreddersom" },
  { alt: "Ahmad arbeider på en sykkelfabrikk-symaskin", category: "verksted" },
  { alt: "Symaskin i bruk, kontroll over stinglengde", category: "verksted" },
  { alt: "Ahmad måler buksebein på en kunde", category: "kunde" },
  { alt: "Måltaking med målbånd langs siden", category: "kunde" },
  { alt: "Konsultasjon med kunde i sittegruppe", category: "kunde" },
  { alt: "Personlig kundekonsultasjon ved bordet", category: "kunde" },
  { alt: "Ahmad viser stoffvalg til en kunde", category: "kunde" },
  { alt: "Stoffvalg, gjennomgang av materialer", category: "kunde" },
  { alt: "Ahmad bak disken i butikken", category: "lokaler" },
  { alt: "Ahmad i sittegruppen i butikken", category: "lokaler" },
  { alt: "Sittegruppen i Ararat Skredderi, Torggata 8", category: "lokaler" },
  { alt: "Interiør, venteområde med klassisk møblement", category: "lokaler" },
  { alt: "Fasaden på Ararat Skredderi i Torggata 8", category: "lokaler" },
  { alt: "Inngangen til Ararat Skredderi fra gateplan", category: "lokaler" },
  { alt: "Skiltet til Ararat Skredderi", category: "lokaler" },
  { alt: "Skredderens arbeidsstasjon med verktøy", category: "verksted" },
  { alt: "Trådhylle med fargesortiment", category: "verksted" },
  { alt: "Skredderutstyr og tråd på verkstedet", category: "verksted" },
  { alt: "Spoler og tråd organisert på hylle", category: "verksted" },
  { alt: "Stoff lagt pent ut for syinspeksjon", category: "verksted" },
  { alt: "Stoff klargjort på arbeidsbordet", category: "verksted" },
  { alt: "Flere stoffer lagt ut for valg", category: "verksted" },
  { alt: "Klesstativ med ferdige plagg til henting", category: "verksted" },
  { alt: "Ahmad arbeider med skoreparasjon", category: "skomakeri" },
  { alt: "Skomakermaskin i bruk på verkstedet", category: "skomakeri" },
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

const BRAND_SUFFIX = "Ararat Skredderi";

// Idempotent suffiks-påføring. Artikler som allerede har «| Ararat Skredderi»
// i sin egen frontmatter fikk den påført en gang til, og fire artikler lå live
// med «… | Ararat Skredderi | Ararat Skredderi». Samme feil traff medcom.no på
// tre bransjesider 29.07.2026, og fiksen ble aldri båret hit.
// Strip alltid en eksisterende suffiks før du legger på.
function withBrandSuffix(title) {
  const stripped = String(title).replace(
    new RegExp(`(\\s*\\|\\s*${BRAND_SUFFIX})+\\s*$`, "i"),
    "",
  );
  return `${stripped} | ${BRAND_SUFFIX}`;
}

function injectMeta(html, { title, description, url, h1, intro, ogType, ogImage, bodyHtml }) {
  const fullTitle = withBrandSuffix(title);
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
// Crawler-synlig body per rute.
//
// Uten dette så en no-JS-crawler (GPTBot, ClaudeBot, PerplexityBot — ingen
// av dem kjører JS) bare H1 + én intro-setning på de kommersielle sidene:
// målt live var /tjenester 26 ord, /priser 25 og /kontakt 27, mot 1129 for
// en bloggartikkel. Alt under er ordrett speiling av de tilsvarende
// React-sidene i src/pages/, slik at crawleren leser det samme som en
// bruker ser. Interne lenker peker kun til URL-er som finnes i sitemap.xml.
// HOLD I SYNC med src/pages/.
// ────────────────────────────────────────────────────────────

const p = (t) => `<p>${t}</p>`;
const esc = htmlEscape;

function listHtml(items) {
  return `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
}

function faqBodyHtml(faqs, heading = "Vanlige spørsmål") {
  return (
    `<h2>${esc(heading)}</h2>` +
    faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")
  );
}

function linksBodyHtml(heading, links) {
  return (
    `<h2>${esc(heading)}</h2><ul>` +
    links.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join("") +
    "</ul>"
  );
}

function hoursTableHtml() {
  return (
    "<table><caption>Åpningstider</caption>" +
    "<thead><tr><th>Dag</th><th>Åpent</th></tr></thead><tbody>" +
    HOURS.map((h) => `<tr><td>${esc(h.days)}</td><td>${esc(h.time)}</td></tr>`).join("") +
    "</tbody></table>"
  );
}

// /tjenester — speiler hero, QuickAnswer, alle seks tjenesteblokker
// (fullDescription, features, prosess og pris), FAQ og sluttseksjon fra
// src/pages/Tjenester.tsx + src/data/services.ts.
function tjenesterBodyHtml() {
  const quick = listHtml([
    "Målsøm fra 8 000 kr: dresser, skjorter og bluser etter dine mål.",
    "Reparasjon fra 200 kr: lengdejustering, glidelås, knapper og rifter.",
    "Omforming etter avtale: gi gamle plagg nytt liv med moderne snitt.",
    "Skomakeri fra 300 kr: såler, hæler, skinn og glidelåser.",
  ]);

  const blocks = SERVICES.map((svc) => {
    const steps = svc.process
      .map((s) => `<li><strong>${esc(s.step)}:</strong> ${esc(s.description)}</li>`)
      .join("");
    const more = svc.readMore.length
      ? `<ul>${svc.readMore.map((m) => `<li><a href="${m.href}">${esc(m.label)}</a></li>`).join("")}</ul>`
      : "";
    return (
      `<h2 id="${esc(svc.slug)}">${esc(svc.name)}</h2>` +
      p(esc(svc.fullDescription)) +
      `<h3>Dette inngår</h3>${listHtml(svc.features)}` +
      `<h3>Vår prosess</h3><ol>${steps}</ol>` +
      p(`Pris: ${esc(svc.pricingLabel)}. ${esc(svc.pricingNote)}.`) +
      more
    );
  }).join("");

  return (
    "<h2>Kort fortalt</h2>" +
    quick +
    blocks +
    "<h2>Slik får du prisoverslag</h2>" +
    p(
      "Alle priser er veiledende og settes endelig etter vurdering på stedet. Kom innom Torggata 8 for vurdering på stedet, eller ring oss på 91 92 19 08 for en uforpliktende samtale.",
    ) +
    faqBodyHtml(TJENESTER_FAQS) +
    linksBodyHtml("Les mer", [
      { href: "/priser", label: "Se full prisliste" },
      { href: "/skomaker-oslo", label: "Skomaker i Oslo sentrum" },
      { href: "/om-oss", label: "Om Ararat Skredderi" },
      { href: "/kontakt", label: "Kontakt og åpningstider" },
      { href: "/blog/skreddersom-oslo", label: "Skreddersøm i Oslo: pris og leveringstid" },
    ])
  );
}

// /priser — speiler de tre prisgruppene fra src/pages/Priser.tsx som ekte
// tabeller. Hvert kr-tall er ordrett fra kilden.
function priserBodyHtml() {
  const quick = listHtml([
    "Reparasjon og endring fra 200 kr: legge opp bukser, glidelås, knapper og rifter.",
    "Skreddersydd skjorte fra 2 500 kr, dress etter mål fra 8 000 kr eks. mva.",
    "Skomakeri fra 300 kr: såler, hæler, skinn og glidelåser.",
    "Alltid bindende overslag på stedet. Drop-in mandag til lørdag, ingen timeavtale.",
  ]);

  const groups = PRICE_GROUPS.map((g) => {
    const rows = g.rows
      .map(
        (r) =>
          `<tr><td>${esc(r.service)}</td><td>${esc(r.price)}</td><td>${esc(r.note ?? "")}</td></tr>`,
      )
      .join("");
    const more = g.readMore
      ? `<p><a href="${g.readMore.href}">${esc(g.readMore.label)}</a></p>`
      : "";
    return (
      `<h2>${esc(g.title)}</h2>` +
      p(esc(g.intro)) +
      `<table><caption>${esc(g.title)}</caption>` +
      "<thead><tr><th>Tjeneste</th><th>Pris</th><th>Merknad</th></tr></thead>" +
      `<tbody>${rows}</tbody></table>` +
      more
    );
  }).join("");

  return (
    "<h2>Kort fortalt</h2>" +
    quick +
    groups +
    "<h2>Om prisene</h2>" +
    p(
      'Alle priser er veiledende startpriser eks. mva. der ikke annet er oppgitt. Endelig pris settes etter vurdering av plagget. <a href="/tjenester">Se hva som inngår i hver tjeneste</a>.',
    ) +
    faqBodyHtml(PRISER_FAQS, "Vanlige spørsmål om pris") +
    linksBodyHtml("Les mer", [
      { href: "/tjenester", label: "Alle tjenester i detalj" },
      { href: "/skomaker-oslo", label: "Priser på skomakerarbeid" },
      { href: "/kontakt", label: "Kom innom Torggata 8" },
      { href: "/blog/skreddersom-oslo", label: "Skreddersøm i Oslo: priser og leveringstid" },
      { href: "/blog/tilpasning-dress-oslo", label: "Tilpasning av dress: justering eller skreddersøm?" },
    ])
  );
}

// /om-oss — speiler hero, QuickAnswer, historie-seksjonen, verdiene og
// nøkkeltallene fra src/pages/OmOss.tsx.
function omOssBodyHtml() {
  const quick = listHtml([
    "Håndverk siden første sting: skreddermesteren har over 50 års erfaring innen skreddersøm og reparasjon.",
    "Skreddermester Ahmad Abdulhamid tar hver oppgave personlig, fra brudekjole til hverdagsbukse.",
    "Torggata 8 i Oslo sentrum, lett tilgjengelig med buss og T-bane. Drop-in mandag til lørdag.",
    "Norsk, engelsk og arabisk: vi snakker språket ditt og forstår plagget ditt.",
  ]);

  const values = [
    {
      title: "Lidenskap for håndverk",
      body: "Vi brenner for skreddersøm og tar stolthet i hver eneste detalj. Hver søm fortjener oppmerksomhet.",
    },
    {
      title: "Kvalitet i fokus",
      body: "Beste materialer og presisjonsteknikker. Vi velger ikke snarveier som går utover holdbarheten.",
    },
    {
      title: "Personlig service",
      body: "Hver kunde får individuell oppmerksomhet og skreddersydde løsninger som passer akkurat deg.",
    },
  ]
    .map((v) => `<h3>${esc(v.title)}</h3><p>${esc(v.body)}</p>`)
    .join("");

  return (
    "<h2>Kort fortalt</h2>" +
    quick +
    "<h2>Håndverket bak butikken</h2>" +
    p("«Vi tar stolthet i håndverket vårt. Detaljer som varer.»") +
    p(
      "Skreddersøm er ikke bare et yrke. Det er en disiplin som krever tålmodighet, presisjon og en dyp respekt for materialene. Skreddermester Ahmad Abdulhamid har øvd dette håndverket i over 50 år, fra første lærdom hos en eldre mester til daglig drift av Ararat Skredderi i Torggata 8.",
    ) +
    p(
      "Vår filosofi er enkel: hvert plagg fortjener oppmerksomhet, og hver kunde fortjener et resultat de er stolte av. Det betyr at vi tar tiden vi trenger på konsultasjon, måltaking og prøving, og at vi sier ifra hvis et plagg ikke kan reddes, fremfor å fakturere for et arbeid som ikke gir verdi.",
    ) +
    p(
      "Vi tar imot alt fra de minste reparasjonene til kompliserte brudekjoler. Vi snakker norsk, engelsk og arabisk. Og vi har holdt til samme sted i hjertet av Oslo siden butikken åpnet, fordi stedet, kundene og håndverket henger sammen.",
    ) +
    "<h2>Hva vi står for</h2>" +
    values +
    "<h2>Ararat Skredderi i tall</h2>" +
    listHtml([
      "50+ års erfaring hos skreddermesteren",
      "6 kjernetjenester",
      "3 språk: norsk, engelsk og arabisk",
    ]) +
    "<h2>Vil du møte oss?</h2>" +
    p(
      "Kom innom Torggata 8 for en uforpliktende prat. Vi tar gjerne en kaffekopp og diskuterer hva vi kan gjøre for plagget ditt.",
    ) +
    linksBodyHtml("Les mer", [
      { href: "/tjenester", label: "Se tjenester" },
      { href: "/priser", label: "Veiledende prisliste" },
      { href: "/galleri", label: "Bilder fra verkstedet" },
      { href: "/kontakt", label: "Kontakt oss" },
      { href: "/blog", label: "Råd og innsikt fra verkstedet" },
    ])
  );
}

// /kontakt — speiler kontaktkortene, åpningstidene og notatet om større
// prosjekter fra src/pages/Kontakt.tsx + src/data/business.ts.
function kontaktBodyHtml() {
  return (
    "<h2>Slik når du oss</h2>" +
    "<h3>Ring oss</h3>" +
    p(
      `${esc(NAP.phone)}. Raskest når du har konkret spørsmål eller trenger pris med en gang.`,
    ) +
    "<h3>Besøk oss</h3>" +
    p(
      `${esc(NAP.street)}, ${esc(NAP.postalCode)} ${esc(NAP.city)}. Drop-in mandag til lørdag. Ingen avtale nødvendig.`,
    ) +
    "<h3>E-post</h3>" +
    p(
      `${esc(NAP.email)}. For større prosjekter eller meldinger utenom åpningstid.`,
    ) +
    "<h3>Skriv til oss</h3>" +
    p("Fyll ut skjemaet på siden. Vi svarer som regel innen samme arbeidsdag.") +
    "<h2>Når vi har åpent</h2>" +
    hoursTableHtml() +
    p(
      "For større prosjekter og brudeplagg anbefaler vi å avtale tid så vi setter av nok tid til konsultasjon. Drop-in fungerer fint for vurdering, reparasjoner og spørsmål.",
    ) +
    faqBodyHtml(TJENESTER_FAQS, "Før du kommer innom") +
    linksBodyHtml("Les mer", [
      { href: "/tjenester", label: "Alle tjenester" },
      { href: "/priser", label: "Veiledende prisliste" },
      { href: "/skomaker-oslo", label: "Skomaker i Oslo sentrum" },
      { href: "/om-oss", label: "Om Ararat Skredderi" },
    ])
  );
}

// /galleri — bildene er sidens eneste reelle innhold, og alt-tekstene er
// kundens egne beskrivelser (src/data/gallery.ts). Uten dem så en
// no-JS-crawler ingenting av hva galleriet faktisk viser.
function galleriBodyHtml() {
  const groups = GALLERY_CATEGORIES.map((cat) => {
    const imgs = GALLERY_IMAGES.filter((i) => i.category === cat.id);
    if (!imgs.length) return "";
    return (
      `<h2>${esc(cat.label)} (${imgs.length} bilder)</h2>` +
      listHtml(imgs.map((i) => i.alt))
    );
  }).join("");

  return (
    "<h2>Hva galleriet viser</h2>" +
    p(
      `Bilder fra verkstedet og lokalene i Torggata 8: skreddersøm, sysøm, kundemøter, stoffvalg og fasaden. Galleriet inneholder ${GALLERY_IMAGES.length} bilder fordelt på ${GALLERY_CATEGORIES.length} kategorier, og hvert bilde er beskrevet under.`,
    ) +
    groups +
    linksBodyHtml("Les mer", [
      { href: "/tjenester", label: "Tjenestene bak bildene" },
      { href: "/om-oss", label: "Om skreddermesteren" },
      { href: "/skomaker-oslo", label: "Skomaker i Oslo sentrum" },
      { href: "/kontakt", label: "Kom innom Torggata 8" },
    ])
  );
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
    bodyHtml: tjenesterBodyHtml(),
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
    bodyHtml: priserBodyHtml(),
    schema: priserLd(),
  },
  {
    path: "skomaker-oslo",
    title: "Skomaker i Oslo sentrum · Skredder på samme sted",
    description:
      "Skomaker i Torggata 8, midt i Oslo sentrum: sålereparasjon, hæler, skinn og glidelåser fra 300 kr. Skomaker og skredder under ett tak, så sko og plagg leveres i samme besøk.",
    h1: "Skomaker i Oslo sentrum",
    intro:
      "I Torggata 8 finner du både skomaker og skredder under ett tak. Vi reparerer såler, hæler, skinn og glidelåser, og kan samtidig ta endringen på klærne mens du er her.",
    bodyHtml: skomakerBodyHtml(),
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
    bodyHtml: galleriBodyHtml(),
    schema: galleriLd(),
  },
  {
    path: "om-oss",
    title: "Om oss · Skreddermester med 50+ års erfaring",
    description:
      "Skreddermester Ahmad Abdulhamid har 50+ års erfaring med håndverket. Ararat Skredderi i Torggata 8, Oslo sentrum.",
    h1: "50+ år med håndverkstradisjon",
    intro:
      "Skreddermester Ahmad Abdulhamid har i mer enn 50 år levert kvalitetsarbeid innen reparasjon, tilpasning og søm av nye klær.",
    bodyHtml: omOssBodyHtml(),
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
    bodyHtml: kontaktBodyHtml(),
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
    // Ruten var 10 ord for crawlere uten JS — page-sweep flagget den som
    // tom-for-crawler. Selve erklæringen er hardkodet JSX i
    // src/pages/Personvern.tsx, og å kopiere den hit ville gitt to kilder for
    // samme juridiske tekst. Derfor gjengis KUN strukturen (overskriftene) og
    // de faktiske opplysningene som allerede finnes i NAP-speilingen over.
    // Paragrafteksten står ett sted, i komponenten.
    //
    // Vil du at også brødteksten skal prerendres: trekk de åtte <Section>-ene
    // ut til src/data/personvern.data.mjs og la BÅDE komponenten og dette
    // skriptet lese den. Ikke dupliser.
    // Feltet heter bodyHtml i dette repoet, ikke body (som i medcom-as). Første
    // forsøk brukte body: og ble stille ignorert — siden så ut til å ha 268 ord,
    // men det var nav, footer og meta. #root inneholdt fortsatt bare H1 og
    // ingress. page-sweep hadde rett; jeg antok feltnavnet i stedet for å lese
    // injectMeta-signaturen på linje 737.
    bodyHtml:
      "<h2>Hva denne erklæringen dekker</h2>" +
      "<p>Ararat Skredderi (org.nr. 989361244) ved Ahmad Abdulhamid er behandlingsansvarlig for personopplysninger som behandles via nettsiden og i den daglige driften av butikken i " +
      `${NAP.street}, ${NAP.postalCode} ${NAP.city}.</p>` +
      `<p>Kontakt i personvernsaker: ${NAP.email}, telefon ${NAP.phone}.</p>` +
      "<h2>Innhold</h2><ul>" +
      [
        "Behandlingsansvarlig",
        "Hvilke opplysninger vi behandler",
        "Rettslig grunnlag",
        "Lagring og sletting",
        "Deling med tredjeparter",
        "Informasjonskapsler (cookies)",
        "Dine rettigheter",
        "Kontakt for spørsmål om personvern",
      ]
        .map((t) => `<li>${t}</li>`)
        .join("") +
      "</ul>",
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
    bodyHtml: blogIndexBodyHtml(),
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

// Skomaker-dybden (hælbytte/glidelås/levering) lå kun i React (SkomakerOslo.tsx)
// og var usynlig for no-JS AI-crawlere — kun FAQ-en fantes i rå HTML (som
// JSON-LD). Speiler seksjonene ordrett inn i #root så «skomaker oslo»-dybden
// (1000/mnd) faktisk leses av GPTBot/ClaudeBot. HOLD I SYNC med SkomakerOslo.tsx.
function skomakerBodyHtml() {
  return (
    "<h2>Hva vi reparerer</h2>" +
    "<p>Vi utfører alle typer skoreparasjoner i skinn, tekstil og syntet, med spesialitet på arvede sko og høykvalitetsmodeller som fortjener et nytt liv. Kom innom for vurdering og prisoverslag.</p>" +
    listHtml([
      "Sålereparasjon og utskifting av hele såler",
      "Hælreparasjon og nye hæler",
      "Lapping og fiks av rifter i skinn",
      "Reparasjon og bytte av glidelåser på støvler",
    ]) +
    "<h2>Både skomaker og skredder, på samme adresse</h2>" +
    "<p>De fleste i Oslo må til én butikk for skoen og en annen for klærne. Hos Ararat Skredderi gjør vi begge deler på samme sted. Skreddermester Ahmad Abdulhamid har over 50 års erfaring med håndverket, og kombinasjonen av skomakeri og skreddersøm gjør at du kan levere både sko og plagg i ett og samme besøk.</p>" +
    "<p>Skal hælene fikses og buksa legges opp før en anledning, ordner vi det samtidig. Det sparer deg en tur, og du forholder deg til ett verksted som kjenner både skinn og stoff.</p>" +
    "<h2>Hælbytte og nye såler, i praksis</h2>" +
    "<p>En slitt hæl eller såle betyr sjelden at skoen er ferdig. Prosessen er enkel: du kommer innom Torggata 8 med skoene, vi vurderer dem på stedet og gir bindende pris før vi starter. Deretter velger vi hæl eller såle etter skoens kvalitet og hvordan du bruker den, utfører arbeidet på verkstedet og har skoene klare til avtalt tid.</p>" +
    "<p>Om det lønner seg, handler om utgangspunktet. Sko i godt skinn tåler gjerne flere runder med nye hæler og såler, og med sålereparasjon fra 400 kr blir regnestykket ofte bedre enn å kjøpe nytt i samme kvalitet. For rimelige sko med slitt overdel er svaret ikke alltid ja, og da sier vi det.</p>" +
    "<h2>Glidelås i støvler og annet skotøy</h2>" +
    "<p>En ødelagt glidelås betyr ikke at støvelen må kastes. Vurderingen kommer alltid først: kan glidelåsen repareres, eller må den byttes helt? Svaret får du på stedet, sammen med bindende pris før vi gjør noe som helst.</p>" +
    "<p>Skinnet rundt glidelåsen får samme omtanke som resten av skoen. Vi jobber i skinn, tekstil og syntet, og arvede eller kostbare modeller behandles med ekstra varsomhet. Trenger jakka eller buksa også ny glidelås, ordner skredderen det i samme lokale.</p>" +
    "<h2>Levering og pris</h2>" +
    "<p>De fleste skoreparasjoner er klare innen 3-7 dager. En enkel hæljobb kan gå raskere, mens reparasjoner som venter på spesielle reservedeler ligger i den øvre enden av spennet. Prisen settes ved vurderingen, og den er bindende: fra 300 kr for skomakerarbeid og fra 400 kr for sålereparasjon. Kom innom i åpningstiden, mandag til lørdag, uten avtale.</p>" +
    "<h2>Midt i Oslo sentrum</h2>" +
    "<p>Vi holder til i Torggata 8, 0181 Oslo, kort vei fra Jernbanetorget og Stortinget. Enkelt å nå med buss og T-bane, og rett ved Oslo City.</p>" +
    hoursTableHtml() +
    faqBodyHtml(SKOMAKER_FAQS) +
    linksBodyHtml("Les mer", [
      { href: "/tjenester", label: "Se alle skreddertjenestene våre" },
      { href: "/priser", label: "Gå til prislisten" },
      { href: "/kontakt", label: "Kontakt og åpningstider" },
      { href: "/om-oss", label: "Om skreddermesteren" },
    ])
  );
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
      bodyHtml: r.bodyHtml,
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
  // REVERTERT 03.08.2026, samme dag som den ble lagt til (278c52d).
  //
  // Jeg utvidet denne blokken med tjenesteliste, prisetabell, åpningstids-
  // tabell og NAP-avsnitt fordi page-sweep målte forsiden til 36 ord for
  // crawlere. Men kommentaren rett over — som jeg lot stå uendret — sier
  // eksplisitt at NØYAKTIG den kombinasjonen ble målt til CLS 0.759 mot 0,
  // og commit 40df178 fjernet den i juni av den grunn. Jeg overkjørte en
  // datert måling uten å måle selv.
  //
  // Reversert fordi kostnaden er lav: llms.txt har alle tjenestene med
  // priser, åpningstider, NAP og org.nr, og head-graf-en har adresse,
  // telefon, geo, åpningstider og FAQPage. AI-motorer får altså faktaene
  // uansett, gjennom kanaler uten layout-kostnad.
  //
  // Vil du utvide forsiden igjen: MÅL CLS først (PageSpeed Insights med
  // API-nøkkel, eller Lighthouse lokalt), og skriv tallet inn her.
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

// 404.html — Vercel serverer denne med ekte HTTP 404 for stier som ikke
// matcher noe. Uten den fikk brukere Vercels bare standard-404 (målt
// 2026-07-29: 79 tegn, ingen branding, ingen vei videre), fordi SPA-
// rewriten aldri rakk å laste React-NotFound-siden. noindex + ingen
// canonical, så en soft-404 aldri kan indekseres.
{
  let nf = SHELL
    .replace(/<title>[^<]*<\/title>/, "<title>Siden finnes ikke | Ararat Skredderi</title>")
    .replace(/<link[^>]+rel="canonical"[^>]*>\s*/g, "")
    .replace(/<meta[^>]+name="robots"[^>]*>\s*/g, "");
  nf = nf.replace("</head>", `<meta name="robots" content="noindex, nofollow">\n  </head>`);
  nf = nf.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    () => `<div id="root"><h1>Siden finnes ikke</h1><p>Vi finner ikke siden du leter etter. Den er kanskje flyttet eller fjernet. <a href="/">Gå til forsiden</a>, se <a href="/tjenester">tjenestene våre</a> eller <a href="/kontakt">ta kontakt</a>.</p></div>`,
  );
  writeFileSync(join(DIST, "404.html"), nf, "utf8");
}

console.log(
  `[prerender] Wrote ${count} per-route HTML files with route-specific title, meta, canonical, JSON-LD and H1+intro body content`,
);
