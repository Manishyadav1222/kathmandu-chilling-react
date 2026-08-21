import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CONTACT, buildWhatsAppLink } from '../data/content';
import { useLang } from '../hooks/useLang.jsx';
import { WhatsAppIcon } from './Hero.jsx';

const NAV_LINKS = [
  { to: '/products', key: 'navProducts', icon: '🧊' },
  { to: '/about', key: 'navAbout', icon: '🏛️' },
  { to: '/projects', key: 'navProjects', icon: '🏭' },
  { to: '/why-us', key: 'navWhy', icon: '🏆' },
  { to: '/blog', key: 'navBlog', icon: '📖' },
  { to: '/contact', key: 'navContact', icon: '✉️' },
];

export default function Header() {
  const { t, lang, toggleLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // Scroll listener for sticky header styling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 25);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  // Close drawer on ESC key and auto-close on window resize
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth > 1024) setDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isLinkActive = (to) => {
    if (to === '/' && location.pathname === '/') return true;
    if (to !== '/' && location.pathname === to) return true;
    if (to === '/products' && location.pathname.startsWith('/products/')) return true;
    if (to === '/blog' && location.pathname.startsWith('/blog/')) return true;
    return false;
  };

  const waLink = buildWhatsAppLink('Hi Kathmandu Chilling, I would like to inquire about your cooling and dairy solutions.');

  return (
    <>
      <header className={`neon-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-wrapper">
          {/* Official KCR Brand Seal */}
          <Link to="/" className="brand" aria-label="Kathmandu Chilling Home">
            <div className="brand-logo-glow">
              <img src={CONTACT.logo} alt="Kathmandu Chilling KCR logo" />
            </div>
            <div className="brand-text">
              <div className="brand-title-row">
                <strong>Kathmandu Chilling</strong>
                <span className="brand-badge-kcr">KCR</span>
              </div>
              <span className="brand-sub">Cooling &amp; Dairy Systems · Nepal</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="links" aria-label="Main Navigation">
            {NAV_LINKS.map((l) => {
              const active = isLinkActive(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`nav-link-item ${active ? 'active' : ''}`}
                >
                  <span>{t(l.key)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions: Lang Switch & Neon Quote CTA */}
          <div className="nav-cta">
            <button
              className="lang-switch-btn mono"
              onClick={toggleLang}
              aria-label="Switch Language between English and Nepali"
            >
              <span className="lang-globe">🌐</span>
              <span>{lang === 'en' ? 'नेपाली' : 'English'}</span>
            </button>

            <Link to="/contact" className="btn btn-neon-quote">
              <span className="btn-neon-pulse"></span>
              <span>{t('navQuote')}</span>
            </Link>

            {/* Mobile Drawer Toggle */}
            <button
              className="menu-toggle-btn"
              aria-label="Toggle mobile menu"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <span className={`bar ${drawerOpen ? 'open' : ''}`}></span>
              <span className={`bar ${drawerOpen ? 'open' : ''}`}></span>
              <span className={`bar ${drawerOpen ? 'open' : ''}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop overlay for Mobile Drawer */}
      {drawerOpen && (
        <div
          className="mobile-backdrop visible"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Navigation */}
      {drawerOpen && (
        <aside
          className="mobile-drawer open"
          aria-label="Mobile Navigation Menu"
        >
          <div className="mobile-drawer-inner">
            {/* Drawer Top Header Row */}
            <div className="mobile-drawer-head">
              <div className="mobile-drawer-brand">
                <div className="drawer-logo-glow">
                  <img src={CONTACT.logo} alt="KCR logo" />
                </div>
                <div className="drawer-brand-text">
                  <div className="drawer-title-row">
                    <strong>Kathmandu Chilling</strong>
                    <span className="brand-badge-kcr">KCR</span>
                  </div>
                  <span>Industrial Refrigeration &amp; Dairy</span>
                </div>
              </div>

              <button
                type="button"
                className="mobile-close-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDrawerOpen(false);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDrawerOpen(false);
                }}
                aria-label="Close navigation menu"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Navigation Links */}
            <nav className="mobile-nav-list">
              {NAV_LINKS.map((l, idx) => {
                const active = isLinkActive(l.to);
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setDrawerOpen(false)}
                    className={`mobile-nav-item ${active ? 'active' : ''}`}
                  >
                    <div className="mobile-item-left">
                      <span className="mobile-item-idx mono">0{idx + 1}</span>
                      <span className="mobile-item-icon">{l.icon}</span>
                      <span className="mobile-item-label">{t(l.key)}</span>
                    </div>
                    <span className="mobile-item-arrow">→</span>
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer Actions */}
            <div className="mobile-drawer-foot">
              <button
                className="lang-switch-btn mono mobile-lang-btn"
                onClick={toggleLang}
              >
                <span className="lang-globe">🌐</span>
                <span>Language: {lang === 'en' ? 'नेपाली भाषा' : 'English'}</span>
              </button>

              <Link
                to="/contact"
                className="btn btn-neon-quote mobile-quote-btn"
                onClick={() => setDrawerOpen(false)}
              >
                <span className="btn-neon-pulse"></span>
                <span>{t('navQuote')}</span>
              </Link>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-wa-link"
                onClick={() => setDrawerOpen(false)}
              >
                <WhatsAppIcon size={16} />
                <span>WhatsApp Quick Inquiry</span>
              </a>

              <div className="mobile-drawer-copyright mono">
                <span>© {new Date().getFullYear()} Kathmandu Chilling &amp; Refrigerator</span>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
