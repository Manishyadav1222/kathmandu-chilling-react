import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { INDUSTRY_STREAMS, buildWhatsAppLink } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import { useAdminData } from '../context/AdminDataContext.jsx';
import SmartImage from './SmartImage.jsx';

const SPOTLIGHT_CARDS = [
  {
    id: 'spotlight-1',
    brand: 'Rockwell × KCR',
    brandColor: '#ff7a45',
    tag: 'FROZEN YOGURT DAY',
    tagColor: '#ff5c93',
    title: 'THIS FROZEN YOGURT DAY',
    subtitle: 'Yogurt has a shoutout for its partner, Rockwell & KCR.',
    badge: '🍦 Sub-Zero Quick Freezing',
    bg: 'linear-gradient(145deg, #1c0d24 0%, #0d1e38 100%)',
    img: '/images/Walk-in_Freezer_Chiller.jpeg',
    waMsg: 'Hi Kathmandu Chilling, I am interested in your Frozen Yogurt & Commercial Deep Freezers.',
  },
  {
    id: 'spotlight-2',
    brand: 'KCR Tech',
    brandColor: '#35d6ff',
    tag: 'NATIONAL SCIENCE DAY',
    tagColor: '#10b981',
    title: 'NATIONAL SCIENCE DAY',
    subtitle: 'Celebrating refrigeration innovation that shapes a greener tomorrow.',
    badge: '🌱 40% Energy Savings',
    bg: 'linear-gradient(145deg, #052028 0%, #0a1b32 100%)',
    img: '/images/Automatic_Dairy_Plant.jpeg',
    waMsg: 'Hi Kathmandu Chilling, I want to learn about your energy-saving inverter cooling technology.',
  },
  {
    id: 'spotlight-3',
    brand: 'KCR EXPO',
    brandColor: '#10b981',
    tag: 'AGRO EXPO 2026',
    tagColor: '#35d6ff',
    title: "WE'VE ARRIVED AT THE FOOD EXPO",
    subtitle: 'Visit KCR at Stall S03 and experience next-gen cold chains.',
    badge: '🎪 Live 3D Simulations',
    bg: 'linear-gradient(145deg, #081d32 0%, #062a22 100%)',
    img: '/images/coldroom.jpeg',
    waMsg: 'Hi Kathmandu Chilling, I would like to schedule a VIP meeting at your expo stall.',
  },
  {
    id: 'spotlight-4',
    brand: 'Rockwell',
    brandColor: '#0088ff',
    tag: 'NEXT-GEN FREEZERS',
    tagColor: '#3cd070',
    title: 'COMMERCIAL COOLING SOLUTIONS',
    subtitle: 'High-efficiency sub-zero storage engineered for factories & cooperatives.',
    badge: '🛡️ 10-Yr Tank Warranty',
    bg: 'linear-gradient(145deg, #0a1f3d 0%, #0b1424 100%)',
    img: '/images/chilling_vat.jpeg',
    waMsg: 'Hi Kathmandu Chilling, please send quotation for Rockwell commercial deep freezers.',
  },
];

export default function IndustryShowcase() {
  const headReveal = useReveal();
  const [activeCategory, setActiveCategory] = useState('all');
  const { data } = useAdminData();

  const categories = [
    { id: 'all', label: 'All Equipment & Fields' },
    { id: 'Refrigeration', label: 'Cold Storage & Freezers' },
    { id: 'Dairy Industry', label: 'Dairy & Milk Processing' },
    { id: 'Food Processing', label: 'Blast Chillers' },
    { id: 'Transport Cold Chain', label: 'Transport Refrigeration' },
  ];

  // Dynamically derive showcase stream items from data.categories
  const allStreamItems = useMemo(() => {
    if (data?.categories && data.categories.length > 0) {
      const items = data.categories.flatMap((cat) =>
        (cat.items || []).map((item) => ({
          id: item.id || item.slug,
          title: item.title,
          category: cat.title || 'Refrigeration',
          temp: item.tempTag || item.specs?.tempRange || '−20°C to +10°C',
          metric: item.specs?.capacityRange || item.specs?.processingCapacity || item.tempTag || 'Custom Build',
          img: item.img || '/images/coldroom.jpeg',
          icon: item.icon || '🧊',
          slug: item.slug,
        }))
      );
      if (items.length > 0) return items;
    }
    return INDUSTRY_STREAMS;
  }, [data]);

  const filteredItems =
    activeCategory === 'all'
      ? allStreamItems
      : allStreamItems.filter(
          (item) => item.category.toLowerCase().includes(activeCategory.toLowerCase()) || activeCategory === 'all'
        );

  // Duplicate items for continuous seamless loop
  const streamTrack1 = [...filteredItems, ...filteredItems, ...filteredItems];
  const streamTrack2 = [...filteredItems.slice().reverse(), ...filteredItems.slice().reverse(), ...filteredItems.slice().reverse()];

  return (
    <section className="industry-showcase-section" id="industry-showcase">
      <div className="wrap">
        <div className="industry-showcase-header-grid reveal" ref={headReveal}>
          {/* Left Column: Heading, Subtitle, Filter Pills & Stats */}
          <div className="industry-showcase-left">
            <div className="eyebrow">Machinery &amp; Industry Field Showcase</div>
            <h2>Live Cold-Chain &amp; Dairy Equipment Stream</h2>
            <p>
              Continuous auto-scrolling view of our industrial machinery engineered for Nepal's dairy,
              meat, pharmaceutical, and cold-storage operations.
            </p>

            {/* Filter Pills */}
            <div className="stream-filter-pills">
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={`stream-pill ${activeCategory === c.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="showcase-telemetry-badge mono">
              <span className="telemetry-pulse"></span>
              <span>{filteredItems.length} ACTIVE MACHINERY TRACKS · 24/7 NATIONWIDE SERVICE</span>
            </div>
          </div>

          {/* Right Column: 2x2 Spotlight Graphic Cards (Matching User Request & Image) */}
          <div className="industry-showcase-right">
            <div className="showcase-spotlight-2x2">
              {SPOTLIGHT_CARDS.map((card) => {
                const waLink = buildWhatsAppLink(card.waMsg);
                return (
                  <a
                    key={card.id}
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="spotlight-poster-card"
                    style={{ background: card.bg }}
                    title={card.title}
                  >
                    <div className="spotlight-card-header">
                      <span className="spotlight-brand-pill mono" style={{ color: card.brandColor }}>
                        {card.brand}
                      </span>
                      <span className="spotlight-tag-pill mono" style={{ color: card.tagColor }}>
                        {card.tag}
                      </span>
                    </div>

                    <div className="spotlight-card-content">
                      <div className="spotlight-img-wrap">
                        <img src={card.img} alt={card.title} />
                        <div className="spotlight-img-glow"></div>
                      </div>
                      <div className="spotlight-text-wrap">
                        <h4>{card.title}</h4>
                        <p>{card.subtitle}</p>
                      </div>
                    </div>

                    <div className="spotlight-card-footer">
                      <span className="spotlight-badge mono">{card.badge}</span>
                      <span className="spotlight-wa-btn mono">Inquire ↗</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lane 1: Infinite Scroll Left */}
      <div className="stream-marquee-wrapper">
        <div className="stream-track scroll-left">
          {streamTrack1.map((item, idx) => (
            <div className="stream-card" key={`lane1-${item.id}-${idx}`}>
              <div className="stream-card-media">
                <SmartImage src={item.img} alt={item.title} icon={item.icon || '🧊'} ratio="16/10" />
                <span className="stream-temp-badge mono">{item.temp}</span>
              </div>
              <div className="stream-card-body">
                <div className="stream-meta mono">
                  <span>{item.category}</span>
                  <span className="stream-dot">·</span>
                  <span>{item.metric}</span>
                </div>
                <h4>{item.title}</h4>
                <Link to={`/products/${item.slug}`} className="stream-link mono">
                  Explore 3D Specs →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lane 2: Infinite Scroll Right */}
      <div className="stream-marquee-wrapper" style={{ marginTop: '20px' }}>
        <div className="stream-track scroll-right">
          {streamTrack2.map((item, idx) => (
            <div className="stream-card stream-card-alt" key={`lane2-${item.id}-${idx}`}>
              <div className="stream-card-media">
                <SmartImage src={item.img} alt={item.title} icon={item.icon || '❄️'} ratio="16/10" />
                <span className="stream-temp-badge alt mono">{item.temp}</span>
              </div>
              <div className="stream-card-body">
                <div className="stream-meta mono">
                  <span>{item.category}</span>
                  <span className="stream-dot">·</span>
                  <span>{item.metric}</span>
                </div>
                <h4>{item.title}</h4>
                <Link to={`/products/${item.slug}`} className="stream-link mono">
                  3D View &amp; Specs →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
