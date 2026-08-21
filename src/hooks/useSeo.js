import { useEffect } from 'react';

const SITE_NAME = 'Kathmandu Chilling & Refrigerator Udhyog Pvt. Ltd.';

/**
 * Lightweight per-page SEO manager for an SPA:
 *  - updates <title> and the meta description
 *  - adds / updates a canonical <link>
 *  - injects JSON-LD structured data (used on blog posts)
 *
 * Call it from any page component, e.g.:
 *   useSeo({ title: '...', description: '...', canonical: 'https://...', jsonLd: {...} });
 */
export function useSeo({ title, description, canonical, jsonLd } = {}) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement('meta');
      desc.name = 'description';
      document.head.appendChild(desc);
    }
    desc.setAttribute('content', description || '');

    let link = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    } else if (link) {
      link.remove();
    }

    let script = document.getElementById('kc-jsonld');
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = 'kc-jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [title, description, canonical, jsonLd]);
}
