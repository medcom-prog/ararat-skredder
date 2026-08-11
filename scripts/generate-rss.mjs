#!/usr/bin/env node
/**
 * Generates dist/blog/rss.xml after the Vite build.
 *
 * RSS 2.0 feed for the blog. Used by:
 *   - RSS readers (Feedly, NetNewsWire, etc.)
 *   - AI aggregators like Perplexity and news discovery in ChatGPT
 *   - Google News / Discover (indirect signal)
 *
 * Ported from borz-athletes/scripts/generate-rss.mjs. Articles are
 * auto-discovered from content/blog/*.md. Channel title and description are
 * read from the public/llms.txt header (H1 + blockquote) so the feed identity
 * stays in sync with the file AI crawlers read first. Runs as part of the
 * `npm run build` chain, after vite build (it writes into dist/).
 */
import { writeFileSync, mkdirSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_FILE = join(ROOT, 'dist', 'blog', 'rss.xml');
const BLOG_CONTENT_DIR = join(ROOT, 'content', 'blog');
const LLMS_FILE = join(ROOT, 'public', 'llms.txt');
const SITE = 'https://www.araratskredderi.no';

// Channel identity from the llms.txt header. Fallbacks mirror the header as
// of 2026-08-11 in case the file is ever restructured.
let FEED_TITLE = 'Ararat Skredderi';
let FEED_DESC =
  'Profesjonell skreddersøm, reparasjon, omforming og skomakeri i Oslo sentrum. Skreddermester Ahmad Abdulhamid med over 50 års erfaring.';
if (existsSync(LLMS_FILE)) {
  const llmsRaw = readFileSync(LLMS_FILE, 'utf8');
  const titleMatch = llmsRaw.match(/^#\s+(.+)$/m);
  if (titleMatch) FEED_TITLE = titleMatch[1].trim();
  const quoteMatch = llmsRaw.match(/^#\s+.+\r?\n\r?\n((?:>[^\n]*\r?\n?)+)/m);
  if (quoteMatch) {
    const desc = quoteMatch[1]
      .split(/\r?\n/)
      .map((l) => l.replace(/^>\s?/, '').trim())
      .filter(Boolean)
      .join(' ');
    if (desc) FEED_DESC = desc;
  }
}

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

function buildExcerpt(body, maxChars = 280) {
  const stripped = body
    .replace(/^>\s*\*\*.*?\*\*:?\s*/m, '')
    .replace(/^#+\s.*$/gm, '')
    .replace(/[*_`#[\]>]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  if (stripped.length <= maxChars) return stripped;
  const cut = stripped.slice(0, maxChars);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const articles = [];
if (existsSync(BLOG_CONTENT_DIR)) {
  for (const file of readdirSync(BLOG_CONTENT_DIR).filter((f) => f.endsWith('.md'))) {
    const raw = readFileSync(join(BLOG_CONTENT_DIR, file), 'utf8');
    const parsed = parseFrontmatter(raw);
    if (!parsed?.data?.slug || !parsed?.data?.title) continue;
    articles.push({
      ...parsed.data,
      excerpt: buildExcerpt(parsed.body),
    });
  }
}

articles.sort((a, b) => (b.published_at ?? '').localeCompare(a.published_at ?? ''));

const lastBuildDate = articles[0]?.published_at
  ? new Date(articles[0].published_at).toUTCString()
  : new Date().toUTCString();

const items = articles
  .map((a) => {
    const url = `${SITE}/blog/${a.slug}`;
    const pubDate = a.published_at ? new Date(a.published_at).toUTCString() : new Date().toUTCString();
    return `    <item>
      <title>${xmlEscape(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${xmlEscape(a.meta_description ?? a.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      ${a.keyword ? `<category>${xmlEscape(a.keyword)}</category>` : ''}
    </item>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(FEED_TITLE)}</title>
    <link>${SITE}/blog</link>
    <description>${xmlEscape(FEED_DESC)}</description>
    <language>nb-NO</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, xml, 'utf8');
console.log(`[rss] Wrote ${OUT_FILE} with ${articles.length} items`);
