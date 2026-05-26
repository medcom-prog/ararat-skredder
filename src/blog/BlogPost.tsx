/**
 * medcom-seo-managed — /blog/:slug detail page.
 *
 * Two-column layout at lg+: article body in the centre, sticky
 * Innholdsfortegnelse (ToC) sidebar on the right. Mobile collapses
 * to a single column (ToC hidden — no room without crowding the
 * read). Related-articles auto-footer at the bottom builds the
 * internal-link graph that lifts every other article on the blog.
 */
import { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import DOMPurify from 'isomorphic-dompurify';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getArticleBySlug } from './articles';
import { MetaHead } from './MetaHead';
import { renderMarkdown } from './renderer';
import { extractToc } from './headingUtils';
import { TableOfContents } from './TableOfContents';
import { RelatedArticles } from './RelatedArticles';

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : '';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  // ToC items are derived from the raw markdown so the slugs match
  // exactly what the renderer will assign as heading ids.
  const tocItems = useMemo(
    () => (article ? extractToc(article.content) : []),
    [article],
  );

  if (!slug || !article) {
    return <Navigate to="/blog" replace />;
  }

  const html = DOMPurify.sanitize(renderMarkdown(article.content));
  const canonical = `${SITE_URL}/blog/${article.slug}`;
  const siteName = (typeof document !== 'undefined' ? document.title.split('—')[0]?.split('-')[0]?.trim() : '') || 'Medcom';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.meta_description ?? '',
    image: article.hero_image ?? undefined,
    datePublished: article.published_at,
    dateModified: article.updated_at ?? article.published_at,
    author: { '@type': 'Organization', name: siteName },
    publisher: { '@type': 'Organization', name: siteName },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  };

  return (
    <>
      <MetaHead
        title={article.meta_title ?? article.title}
        description={article.meta_description}
        ogImage={article.hero_image}
        canonical={canonical}
        type="article"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="min-h-screen bg-background pt-20 md:pt-24">
        <div className="container mx-auto max-w-6xl px-4 py-8 md:py-16 lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12">
          <article className="lg:max-w-3xl min-w-0">
            <nav className="mb-6 md:mb-8">
              <Link
                to="/blog"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Tilbake til bloggen
              </Link>
            </nav>

            <header className="mb-8 md:mb-10 space-y-3 md:space-y-4">
              {article.published_at && (
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {new Date(article.published_at).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight text-foreground">
                {article.title}
              </h1>
              {article.meta_description && (
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {article.meta_description}
                </p>
              )}
            </header>

            {article.hero_image && (
              <img
                src={article.hero_image}
                alt={article.title}
                className="mb-8 md:mb-12 w-full aspect-video object-cover rounded-xl md:rounded-2xl"
              />
            )}

            <div
              className="max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <RelatedArticles currentSlug={article.slug} />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-8">
              <TableOfContents items={tocItems} />
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
