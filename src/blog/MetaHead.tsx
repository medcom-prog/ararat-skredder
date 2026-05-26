/**
 * medcom-seo-managed — injects <title> and meta tags into document.head.
 * Deliberately minimal — no react-helmet dependency.
 */
import { useEffect } from 'react';

interface MetaHeadProps {
  title: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  type?: 'website' | 'article';
}

function setMeta(name: string, content: string | undefined, attr: 'name' | 'property' = 'name') {
  if (!content) return;
  let tag = document.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export function MetaHead({ title, description, ogImage, canonical, type = 'website' }: MetaHeadProps) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    setMeta('description', description);
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', type, 'property');
    if (ogImage) {
      setMeta('og:image', ogImage, 'property');
      setMeta('twitter:image', ogImage);
    }
    setMeta('twitter:card', ogImage ? 'summary_large_image' : 'summary');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, ogImage, canonical, type]);

  return null;
}
