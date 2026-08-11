#!/usr/bin/env node
/**
 * Generates dist/sitemap.xml from a static list of routes.
 * Runs as part of `npm run build` after vite build.
 */
import { writeFileSync, mkdirSync, existsSync, readdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_FILE = join(ROOT, "dist", "sitemap.xml");
const BLOG_CONTENT_DIR = join(ROOT, "content", "blog");
const SITE = "https://www.araratskredderi.no";

// lastmod must be REAL (pattern ported from legene-brygga-2). Build date as
// fallback meant every deploy bumped lastmod on all static routes with zero
// content change — a false freshness signal Google learns to ignore.
//   - Articles: their own updated_at/published_at from frontmatter.
//   - Static routes: last commit date of scripts/prerender-routes.mjs, which
//     is where their prerendered content lives. If that file changed, the
//     content changed.
// If git is unavailable, omit lastmod — partial lastmod is valid per the
// sitemap spec, a lie is not.
function lastCommitDate(relativePath) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", relativePath], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
}
const STATIC_LASTMOD = lastCommitDate("scripts/prerender-routes.mjs");

const ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/tjenester", changefreq: "monthly", priority: "0.9" },
  { path: "/priser", changefreq: "monthly", priority: "0.9" },
  { path: "/skomaker-oslo", changefreq: "monthly", priority: "0.8" },
  { path: "/galleri", changefreq: "monthly", priority: "0.8" },
  { path: "/om-oss", changefreq: "monthly", priority: "0.7" },
  { path: "/kontakt", changefreq: "yearly", priority: "0.8" },
  { path: "/personvern", changefreq: "yearly", priority: "0.3" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
];

// Auto-discover blog articles from content/blog/*.md
if (existsSync(BLOG_CONTENT_DIR)) {
  for (const file of readdirSync(BLOG_CONTENT_DIR).filter((f) => f.endsWith(".md"))) {
    const raw = readFileSync(join(BLOG_CONTENT_DIR, file), "utf8");
    const slugMatch = raw.match(/^slug:\s*["']?([^"'\n]+)["']?\s*$/m);
    const updatedMatch = raw.match(/^updated_at:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m);
    const publishedMatch = raw.match(/^published_at:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m);
    if (slugMatch) {
      ROUTES.push({
        path: `/blog/${slugMatch[1].trim()}`,
        changefreq: "monthly",
        priority: "0.6",
        lastmod: updatedMatch?.[1] ?? publishedMatch?.[1],
      });
    }
  }
}

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  ROUTES.map((r) => {
    const lastmod = r.lastmod ?? STATIC_LASTMOD;
    return (
      `  <url>\n    <loc>${SITE}${r.path}</loc>\n` +
      (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : "") +
      `    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
    );
  }).join("\n") +
  `\n</urlset>\n`;

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, xml, "utf8");
console.log(
  `[sitemap] Wrote ${OUT_FILE} with ${ROUTES.length} routes`,
);
