import { useEffect } from 'react';

export interface SeoMetaOptions {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: 'index, follow' | 'noindex, follow' | 'noindex, nofollow';
}

/**
 * Sets exactly one canonical URL in document.head, removing any duplicates.
 */
export function setCanonical(canonicalUrl: string) {
  if (typeof document === 'undefined') return;
  const canonicalLinks = document.querySelectorAll('link[rel="canonical"]');
  if (canonicalLinks.length > 0) {
    canonicalLinks[0].setAttribute('href', canonicalUrl);
    for (let i = 1; i < canonicalLinks.length; i++) {
      canonicalLinks[i].remove();
    }
  } else {
    const linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    linkCanonical.setAttribute('href', canonicalUrl);
    document.head.appendChild(linkCanonical);
  }
}

/**
 * Sets exactly one meta description in document.head, removing any duplicates.
 */
export function setMetaDescription(description: string) {
  if (typeof document === 'undefined') return;
  const descElements = document.querySelectorAll('meta[name="description"]');
  if (descElements.length > 0) {
    descElements[0].setAttribute('content', description);
    for (let i = 1; i < descElements.length; i++) {
      descElements[i].remove();
    }
  } else {
    const metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', description);
    document.head.appendChild(metaDesc);
  }
}

/**
 * Sets exactly one meta robots directive in document.head, removing any duplicates.
 */
export function setRobots(robots: 'index, follow' | 'noindex, follow' | 'noindex, nofollow') {
  if (typeof document === 'undefined') return;
  const robotsElements = document.querySelectorAll('meta[name="robots"]');
  if (robotsElements.length > 0) {
    robotsElements[0].setAttribute('content', robots);
    for (let i = 1; i < robotsElements.length; i++) {
      robotsElements[i].remove();
    }
  } else {
    const metaRobots = document.createElement('meta');
    metaRobots.setAttribute('name', 'robots');
    metaRobots.setAttribute('content', robots);
    document.head.appendChild(metaRobots);
  }
}

/**
 * Custom React hook to reliably set document title, description, canonical link, and robots meta tag.
 * Always ensures canonical URLs use the preferred HTTPS apex domain (https://eudossier.eu).
 * Strictly removes any duplicate canonical or meta tags on route transitions.
 */
export function useSeoMeta({ title, description, canonical, robots = 'index, follow' }: SeoMetaOptions) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      setMetaDescription(description);
    }

    if (canonical) {
      setCanonical(canonical);
    }

    setRobots(robots);

    return () => {
      // Cleanup on unmount: restore robots to index, follow if page was noindex
      if (robots !== 'index, follow') {
        setRobots('index, follow');
      }
    };
  }, [title, description, canonical, robots]);
}
