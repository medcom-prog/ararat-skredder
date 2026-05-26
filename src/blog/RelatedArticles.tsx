/**
 * medcom-seo-managed — Relaterte artikler footer.
 *
 * Auto-generated internal-link block that appears at the bottom of
 * every article. Pulls 3-5 other articles from the same blog (any
 * other slug than the current one), most-recent first. Strengthens
 * the internal link graph — every new article boosts the rest.
 *
 * Renders nothing if there are no other articles yet, so a brand-new
 * blog with one article doesn't show an empty section.
 */
import { Link } from 'react-router-dom';
import { articles } from './articles';

interface RelatedArticlesProps {
  currentSlug: string;
}

export function RelatedArticles({ currentSlug }: RelatedArticlesProps) {
  const others = articles
    .filter((a) => a.slug !== currentSlug)
    .slice(0, 4);

  if (others.length === 0) return null;

  return (
    <section className="mt-16 md:mt-20 pt-10 border-t border-border">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-6">
        Relaterte artikler
      </h2>
      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        {others.map((a) => (
          <Link
            key={a.slug}
            to={`/blog/${a.slug}`}
            className="group block rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all"
          >
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
              {a.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {a.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
