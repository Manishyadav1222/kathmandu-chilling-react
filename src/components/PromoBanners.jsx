import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { buildWhatsAppLink } from '../data/content';
import { useAdminData } from '../context/AdminDataContext.jsx';
import { WhatsAppIcon } from './Hero.jsx';

export default function PromoBanners() {
  const headReveal = useReveal();
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const { data } = useAdminData();

  const promoCards = (data?.promotions || []).filter((p) => p.active !== false);

  return (
    <section className="promo-banners-section" id="promotions">
      <div className="wrap">
        <div className="section-head reveal" ref={headReveal}>
          <div className="eyebrow">Campaigns &amp; Special Highlights</div>
          <h2>Powering Nepal’s Cold-Chain Revolution</h2>
          <p>
            Discover our special initiatives, trade expo demonstrations, energy-saving incentives, and nationwide
            engineering support.
          </p>
        </div>

        <div className="promo-cards-grid">
          {promoCards.map((card, idx) => {
            const waLink = buildWhatsAppLink(card.waMsg);
            return (
              <div
                key={card.id}
                className={`promo-card ${hoveredIdx === idx ? 'hovered' : ''}`}
                style={{
                  background: card.bgGradient,
                  borderColor: hoveredIdx === idx ? card.accentColor : 'rgba(255,255,255,0.12)',
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Background Droplet Frost Effect */}
                <div className="promo-frost-layer"></div>

                {/* Top Bar with Brand Seal & Category Tag */}
                <div className="promo-top-bar">
                  <div className="promo-brand-badge">
                    <img src="/images/kcr-logo.svg" alt="KCR Logo" className="promo-logo-img" />
                    <div className="promo-brand-text">
                      <strong>KCR</strong>
                      <span>Kathmandu Chilling</span>
                    </div>
                  </div>
                  <span
                    className="promo-category-pill mono"
                    style={{
                      background: `${card.tagColor}22`,
                      color: card.tagColor,
                      borderColor: `${card.tagColor}44`,
                    }}
                  >
                    {card.tag}
                  </span>
                </div>

                {/* Main Poster Content */}
                <div className="promo-body">
                  <div className="promo-icon-watermark">{card.icon}</div>
                  <h3 className="promo-title">
                    <span>{card.title}</span>
                    <strong style={{ color: card.accentColor }}>{card.highlight}</strong>
                  </h3>
                  <p className="promo-subtitle">{card.subtitle}</p>

                  <div className="promo-highlight-badge">
                    <span>{card.badge}</span>
                  </div>
                </div>

                {/* Footer Strip with Actions */}
                <div className="promo-footer">
                  <span className="promo-footer-note mono">{card.footerText}</span>
                  <div className="promo-action-row">
                    {card.actionLink ? (
                      <a href={card.actionLink} className="btn promo-action-btn">
                        {card.actionText} →
                      </a>
                    ) : (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn whatsapp promo-wa-btn"
                      >
                        <WhatsAppIcon size={16} /> {card.actionText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
