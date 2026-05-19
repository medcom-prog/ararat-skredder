# Ararat Skredderi — araratskredderi.no

Production website for **Ararat Skredderi** (Torggata 8, 0181 Oslo).
Vite + React + TypeScript + Tailwind. Hosted on Vercel.

## Develop

```bash
npm install
npm run dev
```

Local dev server: http://localhost:5173

## Build

```bash
npm run build
```

Runs:
1. `vite build` → `dist/`
2. `node scripts/generate-sitemap.mjs` → `dist/sitemap.xml`
3. `node scripts/prerender-routes.mjs` → per-route static HTML inside `dist/`

The per-route prerender writes `dist/<route>/index.html` for every
non-home route with route-specific `<title>`, `<meta description>`,
canonical, JSON-LD schema (`Service` + `Offer` + `FAQPage` +
`WebPage`+`SpeakableSpecification` + `BreadcrumbList`) and a minimal
`<h1>` + intro inside `<div id="root">` so non-JS AI crawlers
(GPTBot, ClaudeBot, CCBot) see real content.

Vercel serves matching files via filesystem precedence, falling back
to the SPA rewrite for unknown paths (`vercel.json`).

## AEO/SEO setup

- Sitewide `@graph` (Organization + Person owner + LocalBusiness +
  WebSite) lives in `index.html` `<head>`
- `public/robots.txt` allows 11+ AI crawlers explicitly
- `public/llms.txt` is the AI-readable company summary
- Per-route schema injected at build via `scripts/prerender-routes.mjs`
- `BreadcrumbList`, `FAQPage`, `ImageGallery` etc. also emitted at
  runtime via React (`src/components/SEO.tsx`,
  `src/components/Breadcrumbs.tsx`, `src/components/FAQAccordion.tsx`)
  so JS-aware crawlers see the same content

## Structure

```
src/
  components/
    layout/          Header + Footer
    ui/              shadcn primitives (Button)
    SEO.tsx          Runtime head + JSON-LD updater
    QuickAnswer.tsx  AEO-citation-friendly Top-N block
    Breadcrumbs.tsx  Visible + BreadcrumbList schema
    FAQAccordion.tsx Visible + FAQPage schema
  data/
    business.ts      Single source of truth for business data
    services.ts      6 services with process, pricing, FAQs
    gallery.ts       30 photos with alt-text + categories
    faqs.ts          General FAQs for forsiden/kontakt
  pages/             Forside, Tjenester, Galleri, OmOss, Kontakt, Personvern, NotFound
  lib/utils.ts       cn() helper

scripts/
  generate-sitemap.mjs   dist/sitemap.xml
  prerender-routes.mjs   dist/<route>/index.html per route
```

## Deploy

Pushes to `main` auto-deploy via Vercel. The Vercel project is wired
to this GitHub repo (`medcom-prog/ararat-skredder`). Custom domain
`araratskredderi.no` points at the latest production deploy.

## Contact form environment variables

The contact form at `/kontakt` POSTs to `api/contact.ts` (Vercel
serverless function) which sends the email via Resend. Required env
vars on the Vercel project:

| Variable           | Required | Default                                       |
|--------------------|----------|-----------------------------------------------|
| `RESEND_API_KEY`   | **yes**  | —                                             |
| `CONTACT_TO_EMAIL` | no       | `ararat_skredder@hotmail.com`                 |
| `CONTACT_FROM_EMAIL` | no     | `Ararat Skredderi <noreply@medcom.no>`        |

The `from` domain must be verified in the Resend account that owns
`RESEND_API_KEY`. Medcom's central Resend account already has
`medcom.no` verified, so `noreply@medcom.no` works out of the box
when using the shared key. Customer's email is set as `Reply-To` so
Ararat can answer the customer directly without forwarding.

If `RESEND_API_KEY` is missing, the form returns 503 with a clear
error and the frontend tells the user to ring instead.

Drevet av [Medcom](https://www.medcom.no).
