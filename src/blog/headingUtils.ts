/**
 * medcom-seo-managed — heading slugify + ToC extraction.
 *
 * Used by the renderer (to attach `id` attrs to <h2>/<h3>) and by
 * <TableOfContents> (to build the sidebar links). One source of
 * truth so the anchor IDs always match.
 */

/**
 * Convert a heading string to a URL-safe anchor id. Norwegian-aware:
 * æ→ae, ø→o, å→a so we don't end up with empty or punycode anchors.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[æä]/g, 'ae')
    .replace(/[øö]/g, 'o')
    .replace(/å/g, 'a')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export interface TocItem {
  level: 2 | 3;
  text: string;
  slug: string;
}

/**
 * Walk the markdown source and pull out H2/H3 headings as ToC items.
 * Skips fenced code blocks so a \`\`\`ts ## comment doesn't end up in
 * the sidebar.
 */
export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  // Use char codes for the fence sentinel so we don't have to wrestle
  // with backtick escaping inside the outer template that ships this
  // file to client repos.
  const FENCE = String.fromCharCode(96).repeat(3);
  let inCodeBlock = false;
  for (const line of markdown.split('\n')) {
    if (line.startsWith(FENCE)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    const m = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (!m) continue;
    const level = m[1].length === 2 ? 2 : 3;
    const text = m[2].trim();
    items.push({ level, text, slug: slugify(text) });
  }
  return items;
}
