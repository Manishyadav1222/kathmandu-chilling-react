import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { buildWhatsAppLink } from '../data/content';
import { useLang } from '../hooks/useLang.jsx';
import { useAdminData } from '../context/AdminDataContext.jsx';
import SmartImage from './SmartImage.jsx';

const DEFAULT_PRODUCTS = [
  {
    id: 'cold-room',
    title: 'Cold Storage Room',
    category: 'Commercial Refrigeration',
    temp: '−20°C → +10°C',
    capacity: '10 MT to 500 MT',
    power: 'High COP Scroll Unit',
    image: '/images/coldroom.jpeg',
    slug: 'cold-room',
    tagline: 'High-density 120mm PUF modular cold storage engineered for zero thermal leakage.',
    accent: '#35d6ff',
  },
  {
    id: 'chilling-vat',
    title: 'Bulk Milk Chilling VAT (BMC)',
    category: 'Dairy Processing',
    temp: '< 4.0°C in < 2 Hours',
    capacity: '200L to 5,000L',
    power: '30 RPM Agitator Motor',
    image: '/images/chilling_vat.jpeg',
    slug: 'chilling-vats',
    tagline: 'Laser-welded dimple cooling jacket arrests bacterial growth and stops milk souring.',
    accent: '#00b4d8',
  },
  {
    id: 'dairy-plant',
    title: 'Automatic Dairy Processing Plant',
    category: 'Turnkey Dairy Systems',
    temp: '72°C Pasteurization → 4°C',
    capacity: '500 to 5,000 LPH',
    power: 'Regenerative PHE Line',
    image: '/images/Automatic_Dairy_Plant.jpeg',
    slug: 'dairy-plant',
    tagline: 'Complete automated milk pasteurization, homogenization, cream separation & pouch packing.',
    accent: '#3cd070',
  },
  {
    id: 'blast-chiller',
    title: 'Shock Blast Chiller & Freezer',
    category: 'Rapid Thermal Pull-Down',
    temp: '+70°C → +3°C (< 90 mins)',
    capacity: '10 to 100 kg batch',
    power: 'Turbo Fan Convection',
    image: '/images/Blastchiller.jpeg',
    slug: 'blast-chiller',
    tagline: 'Rapid temperature drop locks in culinary juiciness, flavor, and 100% HACCP food safety.',
    accent: '#ff7a45',
  },
  {
    id: 'walkin-freezer',
    title: 'Walk-in Freezer & Chiller',
    category: 'Foodservice & Pharma',
    temp: '−18°C / +2°C to +8°C',
    capacity: '100 to 1,200 cu. ft',
    power: 'Anti-Slip Aluminum Floor',
    image: '/images/Walk-in_Freezer_Chiller.jpeg',
    slug: 'walk-in-freezer',
    tagline: 'Modular walk-in room with heated door frames, emergency safety handles & LED lighting.',
    accent: '#a855f7',
  },
  {
    id: 'road-tanker',
    title: 'Insulated Road Milk Tanker',
    category: 'Transport Cold Chain',
    temp: '< 1°C Rise over 12 Hours',
    capacity: '1,000L to 10,000L',
    power: '100mm PUF Triple-Wall',
    image: '/images/Road_milk_tanke.jpeg',
    slug: 'road-milk-tanker',
    tagline: 'Heavy-duty insulated transport vessel with internal anti-surge baffles for highway transit.',
    accent: '#35d6ff',
  },
];

const CYCLE_TIME_MS = 3000; // 3 seconds per product

const ACCENTS = ['#35d6ff', '#00b4d8', '#3cd070', '#ff7a45', '#a855f7', '#10b981', '#f59e0b'];

const MARKETING_BADGES = [
  '🔥 TOP SELLING · FACTORY DIRECT DEALS',
  '🏆 450+ PROVEN INSTALLATIONS ACROSS NEPAL',
  '⚡ UP TO 40% LOWER POWER CONSUMPTION',
  '🛡️ 2-YEAR FULL ON-SITE WARRANTY',
  '📋 FREE DPR & AGRO SUBSIDY PAPERWORK',
  '🚚 24/7 NATIONWIDE SERVICE FLEET',
];

export default function Hero() {
  const { t } = useLang();
  const { data } = useAdminData();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [clock, setClock] = useState('00:00:00');
  const timerRef = useRef(null);

  // Dynamically derive products from live data.categories
  const autoProducts = useMemo(() => {
    const categories = data?.categories;
    if (!categories || categories.length === 0) return DEFAULT_PRODUCTS;

    const flattened = categories.flatMap((cat, catIdx) =>
      (cat.items || []).map((item, itemIdx) => ({
        id: item.id || item.slug,
        title: item.title,
        category: cat.title || 'Refrigeration Equipment',
        temp: item.tempTag || item.specs?.tempRange || '−20°C → +10°C',
        capacity: item.specs?.capacityRange || item.specs?.processingCapacity || 'Custom Sized',
        power: item.specs?.compressorType || 'Precision High COP Unit',
        image: item.img || '/images/coldroom.jpeg',
        icon: item.icon || '🧊',
        slug: item.slug,
        tagline: item.tagline || item.desc || 'Engineered in Nepal for extreme industrial reliability.',
        accent: ACCENTS[(catIdx * 2 + itemIdx) % ACCENTS.length],
      }))
    );

    return flattened.length > 0 ? flattened.slice(0, 8) : DEFAULT_PRODUCTS;
  }, [data]);

  // Keep index in bounds if products count changes
  useEffect(() => {
    if (currentIdx >= autoProducts.length) {
      setCurrentIdx(0);
    }
  }, [autoProducts.length, currentIdx]);

  // Clock tick
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // 3-Second Automatic Product Photo Auto-Scroll Cycle
  useEffect(() => {
    if (isPaused || autoProducts.length === 0) return;
    timerRef.current = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % autoProducts.length);
    }, CYCLE_TIME_MS);

    return () => clearInterval(timerRef.current);
  }, [isPaused, autoProducts.length]);

  const activeProduct = autoProducts[currentIdx] || autoProducts[0] || DEFAULT_PRODUCTS[0];
  const activeMarketingBadge = MARKETING_BADGES[currentIdx % MARKETING_BADGES.length];

  const waLink = buildWhatsAppLink(
    `Hi Kathmandu Chilling, I am inquiring about the ${activeProduct.title} (${activeProduct.temp}). Please send factory quotation and technical specifications.`
  );

  return (
    <section className="hero-section" id="home">
      {/* 70% Visibility Industrial Engineering Backdrop */}
      <div className="hero-bg-overlay-70">
        <div className="hero-glow-orb orb-1"></div>
        <div className="hero-glow-orb orb-2"></div>
        <div className="hero-grid-matrix"></div>
      </div>

      <div className="wrap hero-wrap">
        {/* Left Column: Headline, Lead & CTAs */}
        <div className="hero-content-col">
          <div className="hero-eyebrow-badge mono">
            <span className="live-pulse-dot"></span>
            <span>{t('heroEyebrow')}</span>
            <span className="eyebrow-sub-tag">● FACTORY OPERATIONAL</span>
          </div>

          <h1 className="hero-main-heading">
            <span className="heading-line-1">{t('heroTitle1')}</span>
            <span className="heading-line-2 hl-neon">{t('heroTitle2')}</span>
          </h1>

          <p className="hero-lead-text">{t('heroLead')}</p>

          {/* Value / Trust Highlights Strip */}
          <div className="hero-trust-pills">
            <div className="trust-pill-item">
              <span className="trust-icon">🛡️</span>
              <span>2-Yr On-Site Warranty</span>
            </div>
            <div className="trust-pill-item">
              <span className="trust-icon">⚡</span>
              <span>40% Lower Energy Cost</span>
            </div>
            <div className="trust-pill-item">
              <span className="trust-icon">📋</span>
              <span>Free DPR &amp; Subsidy Help</span>
            </div>
            <div className="trust-pill-item">
              <span className="trust-icon">🚚</span>
              <span>All 7 Provinces Delivery</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hero-btn-group">
            <a href="#contact" className="btn btn-hero-solid">
              <span>{t('heroCtaPrimary')}</span>
              <span className="btn-arrow">→</span>
            </a>

            <Link to="/calculator" className="btn btn-hero-calc">
              <span className="calc-icon">⚡</span>
              <span>{t('heroCtaSecondary')}</span>
            </Link>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-hero-whatsapp"
            >
              <WhatsAppIcon size={17} />
              <span>{t('heroCtaWhatsapp')}</span>
            </a>
          </div>

          {/* Industrial Metric Badges */}
          <div className="hero-metric-strip">
            <div className="metric-cell">
              <strong className="metric-val mono">−20°C → +10°C</strong>
              <span className="metric-desc">Precision Thermal Range</span>
            </div>
            <div className="metric-cell">
              <strong className="metric-val mono">500–10,000 LPH</strong>
              <span className="metric-desc">Dairy Plant Output</span>
            </div>
            <div className="metric-cell">
              <strong className="metric-val mono">{data?.story?.statProjects || '450+ Projects'}</strong>
              <span className="metric-desc">Installed in Nepal</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3-Second Auto-Scrolling Product Showcase Card */}
        <div
          className="hero-showcase-col"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="hero-showcase-card">
            {/* Top Telemetry Header with Dynamic Advertising Badge */}
            <div className="showcase-top-bar">
              <div className="telemetry-live-pill mono">
                <span className="telemetry-dot"></span>
                <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>{activeMarketingBadge}</span>
              </div>
              <div className="telemetry-clock mono">
                <span>{clock} NPT</span>
              </div>
            </div>

            {/* 3-Second Timer Progress Bar */}
            <div className="showcase-timer-track">
              <div
                key={`timer-${currentIdx}-${activeProduct.id}`}
                className={`showcase-timer-fill ${isPaused ? 'paused' : 'running'}`}
              ></div>
            </div>

            {/* Auto-Cycling Product Photo Stage */}
            <div className="showcase-image-stage">
              {autoProducts.map((prod, idx) => (
                <div
                  key={prod.id || idx}
                  className={`showcase-slide ${idx === currentIdx ? 'active' : ''}`}
                >
                  <img
                    key={prod.image}
                    src={prod.image}
                    alt={prod.title}
                    className="showcase-prod-img"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                  <div className="showcase-img-gradient"></div>
                </div>
              ))}

              {/* Temperature Badge Overlay */}
              <div className="showcase-temp-tag mono" style={{ borderColor: activeProduct.accent }}>
                <span className="temp-snowflake">❄️</span>
                <strong>{activeProduct.temp}</strong>
              </div>

              {/* Category Pill */}
              <div className="showcase-cat-pill mono">
                <span>{activeProduct.category}</span>
              </div>
            </div>

            {/* Product Meta & Direct 3D Navigation */}
            <div className="showcase-info-pane">
              <div className="showcase-title-row">
                <h3>{activeProduct.title}</h3>
                <span className="showcase-capacity mono">{activeProduct.capacity}</span>
              </div>
              <p className="showcase-tagline">{activeProduct.tagline}</p>

              <div className="showcase-action-row">
                <Link to={`/products/${activeProduct.slug}`} className="btn-explore-3d">
                  <span>Explore 3D Specs &amp; Details</span>
                  <span className="btn-arrow">→</span>
                </Link>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="showcase-quick-wa"
                  title="Quick WhatsApp Quotation"
                >
                  <WhatsAppIcon size={16} />
                </a>
              </div>

              {/* 3-Second Interactive Thumbnail Navigation Pills */}
              <div className="showcase-dot-nav">
                {autoProducts.map((p, idx) => (
                  <button
                    key={p.id || idx}
                    className={`dot-pill ${idx === currentIdx ? 'active' : ''}`}
                    onClick={() => setCurrentIdx(idx)}
                    title={p.title}
                    aria-label={`Jump to ${p.title}`}
                  >
                    <span className="dot-thumb-num">0{idx + 1}</span>
                    <span className="dot-thumb-name">{p.title.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Cue */}
      <div className="hero-scroll-cue">
        <span>Scroll to Explore</span>
        <span className="scroll-arrow-anim">↓</span>
      </div>
    </section>
  );
}

export function WhatsAppIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.44 1.32 4.94L2.05 22l5.29-1.38a9.9 9.9 0 0 0 4.7 1.2h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7C17.19 3.03 14.7 2 12.04 2Zm5.8 14.1c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.18-4.94-4.37-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.83 2 .9 2.14.07.15.12.32.02.51-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.27.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.27.14.43.12.59-.07.16-.19.68-.79.86-1.06.18-.27.36-.22.6-.13.24.09 1.53.72 1.79.85.26.13.43.19.5.3.07.11.07.63-.17 1.3Z" />
    </svg>
  );
}
