/**
 * medcom-seo-managed — loads + parses markdown articles at build time.
 * Vite bundles content/blog/*.md via import.meta.glob.
 *
 * We parse frontmatter inline rather than using gray-matter because
 * gray-matter depends on Node's Buffer global, which silently fails
 * in the browser bundle (returns no data). Since our frontmatter is
 * machine-written by the portal with a fixed shape (key: "value"),
 * a 20-line parser handles it perfectly.
 */

export interface Article {
  title: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
  updated_at?: string;
  keyword?: string;
  hero_image?: string;
  content: string;
  excerpt: string;
}

// Eagerly import all markdown files as raw strings at build time.
// Vite 5 syntax: { query: '?raw', import: 'default', eager: true }.
const modules = import.meta.glob('/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/**
 * Parse a very constrained YAML frontmatter shape:
 *   ---
 *   key1: "value with spaces"
 *   key2: "2026-04-24"
 *   ---
 *
 * JSON.stringify is used by the portal's publisher to quote every
 * value, so we only need to strip the surrounding quotes and JSON-
 * unescape. If the file has no frontmatter we return null.
 */
function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } | null {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  const [, block, body] = match;
  const data: Record<string, string> = {};
  for (const line of block.split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rawValue] = kv;
    let value = rawValue.trim();
    // Strip matching surrounding quotes (JSON or single).
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
  return { data, content: body };
}

function buildExcerpt(body: string, maxChars = 180): string {
  const stripped = body
    .replace(/^#+\s.*$/gm, '')
    .replace(/[*_`#\[\]]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  if (stripped.length <= maxChars) return stripped;
  const cut = stripped.slice(0, maxChars);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

function parseOne(raw: string): Article | null {
  const parsed = parseFrontmatter(raw);
  if (!parsed) return null;
  const { data, content } = parsed;
  if (!data.slug || !data.title) return null;
  return {
    title: data.title,
    slug: data.slug,
    meta_title: data.meta_title,
    meta_description: data.meta_description,
    published_at: data.published_at,
    updated_at: data.updated_at,
    keyword: data.keyword,
    hero_image: data.hero_image,
    content: content.trim(),
    excerpt: buildExcerpt(content),
  };
}

export const articles: Article[] = Object.values(modules)
  .map(parseOne)
  .filter((a): a is Article => a !== null)
  .sort((a, b) => (b.published_at ?? '').localeCompare(a.published_at ?? ''));

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
