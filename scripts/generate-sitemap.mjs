#!/usr/bin/env node
/**
 * Generates dist/sitemap.xml from a static list of routes.
 * Runs as part of `npm run build` after vite build.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_FILE = join(ROOT, "dist", "sitemap.xml");
const SITE = "https://www.araratskredderi.no";
const TODAY = new Date().toISOString().slice(0, 10);

const ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/tjenester", changefreq: "monthly", priority: "0.9" },
  { path: "/galleri", changefreq: "monthly", priority: "0.8" },
  { path: "/om-oss", changefreq: "monthly", priority: "0.7" },
  { path: "/kontakt", changefreq: "yearly", priority: "0.8" },
  { path: "/personvern", changefreq: "yearly", priority: "0.3" },
];

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  ROUTES.map(
    (r) =>
      `  <url>\n    <loc>${SITE}${r.path}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
  ).join("\n") +
  `\n</urlset>\n`;

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, xml, "utf8");
console.log(
  `[sitemap] Wrote ${OUT_FILE} with ${ROUTES.length} routes`,
);
