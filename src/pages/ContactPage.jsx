import React from 'react';
import { useSeo } from '../hooks/useSeo';
import Breadcrumb from '../components/Breadcrumb.jsx';
import Contact from '../components/Contact.jsx';
import { CONTACT, buildWhatsAppLink } from '../data/content';
import { WhatsAppIcon } from '../components/Hero.jsx';

export default function ContactPage() {
  useSeo({
    title: 'Contact Kathmandu Chilling | Get Cold Room & Dairy Plant Quotations',
    description:
      'Contact Kathmandu Chilling factory office in Naya Naikap, Kathmandu. Call 9844366008 or WhatsApp 9716123132 for turnkey project quotes and 24/7 technical service.',
    canonical: 'https://kathmanduchilling.com.np/contact',
  });

  const waLink = buildWhatsAppLink('Namaste Kathmandu Chilling, I would like to request an official quotation for cold storage / dairy machinery.');

  return (
    <div className="dedicated-page-wrapper">
      <div className="page-hero-banner">
        <div className="wrap">
          <Breadcrumb items={[{ label: 'Contact & Quotations' }]} />
          <div className="page-hero-content">
            <span className="page-hero-eyebrow mono">24/7 RESPONSE · DIRECT FACTORY ENGINEERING</span>
            <h1 className="page-hero-title">Contact &amp; Request Quotation</h1>
            <p className="page-hero-desc">
              Get in touch with our refrigeration engineering team for free site surveys, technical capacity sizing, custom layout designs, and official project quotations across Nepal.
            </p>
          </div>
        </div>
      </div>

      {/* Direct Contact Quick Hub */}
      <div className="contact-quick-hub wrap">
        <div className="quick-hub-grid">
          <div className="quick-hub-card">
            <div className="hub-card-icon">📞</div>
            <div className="hub-card-info">
              <span className="mono hub-lbl">DIRECT HOTLINE</span>
              <strong>+977 {CONTACT.primaryPhone}</strong>
              <p>Direct factory consultation &amp; rapid engineering response.</p>
              <a href={`tel:${CONTACT.primaryPhone}`} className="hub-link mono">Call Now →</a>
            </div>
          </div>

          <div className="quick-hub-card highlight">
            <div className="hub-card-icon"><WhatsAppIcon size={24} /></div>
            <div className="hub-card-info">
              <span className="mono hub-lbl">WHATSAPP DESK</span>
              <strong>+977 9716123132</strong>
              <p>Instant spec sharing, PDF brochures, and layout drawings.</p>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="hub-link mono">Chat on WhatsApp →</a>
            </div>
          </div>

          <div className="quick-hub-card">
            <div className="hub-card-icon">📍</div>
            <div className="hub-card-info">
              <span className="mono hub-lbl">FACTORY &amp; WORKS</span>
              <strong>Chandragiri-14, Naya Naikap</strong>
              <p>Kathmandu Valley, Bagmati Province, Nepal.</p>
              <span className="mono hub-badge">Open: Sun–Fri 8AM–6PM</span>
            </div>
          </div>
        </div>
      </div>

      <Contact />
    </div>
  );
}
