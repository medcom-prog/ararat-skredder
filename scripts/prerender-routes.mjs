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

function injectMeta(html, { title, description, url, h1, intro }) {
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

  // Inject minimal H1 + intro into <div id="root"> for non-JS crawlers
  out = out.replace(
    /<div id="root"><\/div>/,
    `<div id="root"><h1>${safeH1}</h1><p>${safeIntro}</p></div>`,
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
        author: { "@id": `${SITE}/#organization` },
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
    const html = injectSchema(
      injectMeta(SHELL, {
        title: article.meta_title ?? article.title,
        description: article.meta_description ?? excerpt,
        url,
        h1: article.title,
        intro: excerpt,
      }),
      blogPostingLd(article, url),
    );
    writeRouteHtml(`blog/${article.slug}`, html);
    count++;
  }
}

// Forsiden — inject FAQ schema directly into dist/index.html
{
  const homeFaq = faqLd(HOME_FAQS);
  if (homeFaq) {
    const homeHtml = readFileSync(SHELL_PATH, "utf8");
    const tag = `<script type="application/ld+json" data-prerender-home-faq>${JSON.stringify({
      "@context": "https://schema.org",
      ...homeFaq,
    })}</script>\n  </head>`;
    writeFileSync(SHELL_PATH, homeHtml.replace("</head>", tag), "utf8");
    count++;
  }
}

console.log(
  `[prerender] Wrote ${count} per-route HTML files with route-specific title, meta, canonical, JSON-LD and H1+intro body content`,
);
