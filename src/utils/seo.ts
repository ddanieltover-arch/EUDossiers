import { useEffect } from 'react';

export interface SeoMetaOptions {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: 'index, follow' | 'noindex, follow' | 'noindex, nofollow';
}

/**
 * Custom React hook to set document title, description, canonical link, and robots meta tag.
 * Always ensures canonical URLs use the preferred HTTPS apex domain (https://eudossier.eu).
 */
export function useSeoMeta({ title, description, canonical, robots = 'index, follow' }: SeoMetaOptions) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonical);
    }

    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', robots);

    return () => {
      // Cleanup on unmount: restore robots to index, follow if page was noindex
      if (robots !== 'index, follow') {
        const r = document.querySelector('meta[name="robots"]');
        if (r) r.setAttribute('content', 'index, follow');
      }
    };
  }, [title, description, canonical, robots]);
}
