#!/usr/bin/env node
/**
 * sync-llms-articles.mjs — keep the "## Artikler" section of public/llms.txt
 * in sync with content/blog/.
 *
 * Ported from nor-west-motors/scripts/sync-llms-guides.mjs, which exists
 * because twenty published guides there were invisible in llms.txt — the one
 * file AI crawlers read first to understand the site. The file is static in
 * public/ and copied untouched by the build, so every new article silently
 * fell out of it. No sweep saw it: the articles existed, ranked in the
 * sitemap, had content, and llms.txt was a valid document. It just never
 * mentioned them. Hence the block is generated instead of hand-maintained.
 *
 * Everything outside the markers is untouched. Runs in the build chain
 * BEFORE vite build, since vite copies public/ into dist verbatim.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const LLMS = join(ROOT, 'public', 'llms.txt');
const BLOG = join(ROOT, 'content', 'blog');
const SITE = 'https://www.araratskredderi.no';

const START = '## Artikler';
const END = '<!-- /artikler -->';

/** Extracts a single frontmatter field. Tolerates both " and ' quoting. */
function field(source, name) {
  const m = source.match(new RegExp(`^${name}:\\s*["']?(.*?)["']?\\s*$`, 'm'));
  return m ? m[1].trim() : '';
}

const articles = readdirSync(BLOG)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const raw = readFileSync(join(BLOG, f), 'utf8');
    const fm = raw.slice(0, raw.indexOf('\n---', 4));
    return {
      slug: field(fm, 'slug') || f.replace(/\.md$/, ''),
      title: field(fm, 'title'),
      // meta_description is the shortest honest summary we have already
      // written and fact-checked. Do not invent a new one here — that would
      // give us two versions.
      desc: field(fm, 'meta_description'),
      date: field(fm, 'published_at'),
    };
  })
  .filter((a) => a.title)
  .sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.slug.localeCompare(b.slug));

const block =
  `${START}\n\n` +
  `Artikler og råd fra verkstedet. ${articles.length} artikler, nyeste først.\n\n` +
  articles.map((a) => `- [${a.title}](${SITE}/blog/${a.slug}): ${a.desc}`).join('\n') +
  `\n\n${END}`;

let txt = readFileSync(LLMS, 'utf8');
const i = txt.indexOf(START);
const j = txt.indexOf(END);

if (i !== -1 && j !== -1) {
  txt = txt.slice(0, i) + block + txt.slice(j + END.length);
} else if (i !== -1) {
  // Section exists without end marker: replace up to the next ## heading.
  const next = txt.indexOf('\n## ', i + START.length);
  txt = txt.slice(0, i) + block + (next === -1 ? '\n' : '\n' + txt.slice(next));
} else {
  // First run without an existing section: insert before «## Autoritet»,
  // otherwise append at the end.
  const anchor = txt.indexOf('## Autoritet');
  txt = anchor !== -1
    ? txt.slice(0, anchor) + block + '\n\n' + txt.slice(anchor)
    : txt.replace(/\s*$/, '\n\n') + block + '\n';
}

writeFileSync(LLMS, txt, 'utf8');
console.log(`[llms] Synced ${articles.length} articles into public/llms.txt`);
