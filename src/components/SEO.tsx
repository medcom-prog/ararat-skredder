import { useEffect } from "react";
import { BUSINESS } from "@/data/business";

interface SEOProps {
  /** Page-specific title — appended with " | Ararat Skredderi" */
  title: string;
  description: string;
  /** Absolute URL of the canonical version of this page */
  canonical: string;
  /** Per-page schema graph(s) emitted in addition to the sitewide @graph */
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  /** Optional og:image override; defaults to brand og-image */
  ogImage?: string;
}

/**
 * Updates document head metadata + injects per-route JSON-LD schema.
 *
 * Note: this runs at runtime React. The same per-route schema is ALSO
 * injected at build time by scripts/prerender-routes.mjs so non-JS AI
 * crawlers see it without executing React. Both pathways emit identical
 * shapes — runtime is the fallback / dev-mode source of truth.
 */
export function SEO({ title, description, canonical, jsonLd, ogImage }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | Ararat Skredderi`;
    document.title = fullTitle;

    setMeta("name", "description", description);
    setLink("canonical", canonical);

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta(
      "property",
      "og:image",
      ogImage ?? `${BUSINESS.domain}/og-image.jpg`,
    );

    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta(
      "name",
      "twitter:image",
      ogImage ?? `${BUSINESS.domain}/og-image.jpg`,
    );

    // Remove old runtime schema before injecting new
    document
      .querySelectorAll('script[data-runtime-jsonld="true"]')
      .forEach((el) => el.remove());

    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      items.forEach((item) => {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.dataset.runtimeJsonld = "true";
        s.textContent = JSON.stringify(item);
        document.head.appendChild(s);
      });
    }

    return () => {
      document
        .querySelectorAll('script[data-runtime-jsonld="true"]')
        .forEach((el) => el.remove());
    };
  }, [title, description, canonical, jsonLd, ogImage]);

  return null;
}

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}
