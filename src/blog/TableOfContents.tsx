/**
 * medcom-seo-managed — clickable table of contents sidebar.
 *
 * Renders the article's H2/H3 headings as a sticky panel on the
 * right at lg+ widths. Uses IntersectionObserver to highlight the
 * heading currently in view. Hidden on mobile (no room for it).
 *
 * Render nothing if the article has fewer than 2 headings — a ToC
 * for a single-section article is just visual noise.
 */
import { useEffect, useState } from 'react';
import type { TocItem } from './headingUtils';

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    if (items.length < 2) return;
    // Watch every heading: mark the topmost one currently in view as
    // active. rootMargin pulls the "visible" zone down 24% from the
    // top so the active highlight feels right when a heading is just
    // barely on screen.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveSlug(visible[0].target.id);
        }
      },
      { rootMargin: '-96px 0px -60% 0px', threshold: 0 },
    );

    const elements = items
      .map((it) => document.getElementById(it.slug))
      .filter((el): el is HTMLElement => el !== null);
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    const el = document.getElementById(slug);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${slug}`);
  };

  return (
    <nav aria-label="Innholdsfortegnelse" className="text-sm">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        På denne siden
      </p>
      <ul className="space-y-1.5 border-l border-border">
        {items.map((item) => {
          const isActive = activeSlug === item.slug;
          return (
            <li key={item.slug} className={item.level === 3 ? 'pl-3' : ''}>
              <a
                href={`#${item.slug}`}
                onClick={(e) => handleClick(e, item.slug)}
                className={`block -ml-px border-l-2 pl-3 py-1 leading-snug transition-colors ${
                  isActive
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
