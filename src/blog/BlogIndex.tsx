/**
 * medcom-seo-managed — /blog listing page.
 * Ararat-specific: App.tsx already renders Header + Footer globally,
 * so this page only renders the article-list content.
 */
import { Link } from 'react-router-dom';
import { articles } from './articles';
import { MetaHead } from './MetaHead';

export function BlogIndex() {
  const canonical = typeof window !== 'undefined' ? `${window.location.origin}/blog` : undefined;

  return (
    <>
      <MetaHead
        title="Blogg"
        description="Artikler, råd og perspektiver fra teamet."
        canonical={canonical}
      />
      <section className="bg-background">
        <div className="container mx-auto max-w-5xl px-4 py-12 md:py-20">
          <header className="mb-10 md:mb-16 space-y-3">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground">
              Blogg
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Tanker, praktiske råd og konkrete eksempler.
            </p>
          </header>

          {articles.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="text-muted-foreground">Ingen artikler publisert enda.</p>
              <p className="text-xs text-muted-foreground">Kom tilbake om litt — vi legger ut nytt regelmessig.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:gap-8 md:grid-cols-2">
              {articles.map((a) => (
                <Link
                  key={a.slug}
                  to={`/blog/${a.slug}`}
                  className="group block rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  {a.hero_image && (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={a.hero_image}
                        alt={a.title}
                        className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5 md:p-6 space-y-2 md:space-y-3">
                    {a.published_at && (
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {new Date(a.published_at).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                    <h2 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {a.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {a.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
