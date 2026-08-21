import { useState } from 'react';
import { Link } from 'react-router-dom';
import { INDUSTRY_STREAMS } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import SmartImage from './SmartImage.jsx';

export default function IndustryShowcase() {
  const headReveal = useReveal();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Equipment & Fields' },
    { id: 'Refrigeration', label: 'Cold Storage & Freezers' },
    { id: 'Dairy Industry', label: 'Dairy & Milk Processing' },
    { id: 'Food Processing', label: 'Blast Chillers' },
    { id: 'Transport Cold Chain', label: 'Transport Refrigeration' },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? INDUSTRY_STREAMS
      : INDUSTRY_STREAMS.filter(
          (item) => item.category.toLowerCase().includes(activeCategory.toLowerCase()) || activeCategory === 'all'
        );

  // Duplicate items for continuous seamless loop
  const streamTrack1 = [...filteredItems, ...filteredItems, ...filteredItems];
  const streamTrack2 = [...filteredItems.slice().reverse(), ...filteredItems.slice().reverse(), ...filteredItems.slice().reverse()];

  return (
    <section className="industry-showcase-section" id="industry-showcase">
      <div className="wrap">
        <div className="section-head reveal" ref={headReveal}>
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
        </div>
      </div>

      {/* Lane 1: Infinite Scroll Left */}
      <div className="stream-marquee-wrapper">
        <div className="stream-track scroll-left">
          {streamTrack1.map((item, idx) => (
            <div className="stream-card" key={`lane1-${item.id}-${idx}`}>
              <div className="stream-card-media">
                <SmartImage src={item.img} alt={item.title} icon="🧊" ratio="16/10" />
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
                <SmartImage src={item.img} alt={item.title} icon="❄️" ratio="16/10" />
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
