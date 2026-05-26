/**
 * medcom-seo-managed — Tailwind-aware markdown renderer.
 *
 * Uses marked with a custom Renderer that attaches Tailwind utility
 * classes to the generated HTML. This way we avoid the
 * @tailwindcss/typography plugin dependency and let the client's
 * existing colour tokens (text-foreground, text-primary, etc.) style
 * the article consistently with the rest of their site.
 */
import { marked, Renderer } from 'marked';
import { slugify } from './headingUtils';

const renderer = new Renderer();

renderer.heading = function (text, level) {
  const cls: Record<number, string> = {
    1: 'text-3xl md:text-4xl font-semibold tracking-tight text-foreground mt-10 mb-4',
    2: 'text-2xl md:text-3xl font-semibold tracking-tight text-foreground mt-10 mb-4 scroll-mt-24',
    3: 'text-xl font-semibold tracking-tight text-foreground mt-8 mb-3 scroll-mt-24',
    4: 'text-lg font-semibold text-foreground mt-6 mb-2',
  };
  const classes = cls[level] ?? cls[4];
  // Add stable anchor IDs for H2/H3 so the sidebar ToC can deep-link
  // to each section. scroll-mt-24 keeps the heading clear of the
  // sticky header when navigated to. Plain-text strip for the slug
  // because heading content can already be HTML-escaped at this point.
  const plainText = text.replace(/<[^>]+>/g, '');
  const id = (level === 2 || level === 3) ? ` id="${slugify(plainText)}"` : '';
  return `<h${level}${id} class="${classes}">${text}</h${level}>\n`;
};

renderer.paragraph = function (text) {
  return `<p class="my-4 leading-relaxed text-foreground/90">${text}</p>\n`;
};

renderer.list = function (body, ordered) {
  const tag = ordered ? 'ol' : 'ul';
  const listCls = ordered ? 'list-decimal' : 'list-disc';
  return `<${tag} class="my-4 ${listCls} pl-6 space-y-1.5 text-foreground/90">${body}</${tag}>\n`;
};

renderer.listitem = function (text) {
  return `<li class="leading-relaxed">${text}</li>\n`;
};

renderer.link = function (href, title, text) {
  const t = title ? ` title="${title}"` : '';
  return `<a href="${href}"${t} class="text-primary underline-offset-4 hover:underline" rel="noopener">${text}</a>`;
};

renderer.strong = function (text) {
  return `<strong class="font-semibold text-foreground">${text}</strong>`;
};

renderer.em = function (text) {
  return `<em class="italic">${text}</em>`;
};

renderer.blockquote = function (quote) {
  return `<blockquote class="my-6 border-l-4 border-primary/40 pl-4 italic text-muted-foreground">${quote}</blockquote>\n`;
};

renderer.code = function (code, lang) {
  const langCls = lang ? ` language-${lang}` : '';
  return `<pre class="my-6 rounded-lg bg-muted p-4 overflow-x-auto"><code class="text-sm font-mono${langCls}">${code}</code></pre>\n`;
};

renderer.codespan = function (code) {
  return `<code class="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">${code}</code>`;
};

renderer.hr = function () {
  return '<hr class="my-10 border-border" />\n';
};

renderer.image = function (href, title, text) {
  const t = title ? ` title="${title}"` : '';
  return `<img src="${href}"${t} alt="${text ?? ''}" class="my-6 rounded-xl w-full" loading="lazy" />`;
};

marked.setOptions({
  renderer,
  gfm: true,
  breaks: false,
});

export function renderMarkdown(source: string): string {
  return marked.parse(source) as string;
}
