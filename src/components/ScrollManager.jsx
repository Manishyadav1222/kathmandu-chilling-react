import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Restores scroll position on route changes. If the new location carries a
 * hash (e.g. /#products), scrolls to that section instead of the top.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
