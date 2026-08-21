import React from 'react';
import { useSeo } from '../hooks/useSeo';
import Breadcrumb from '../components/Breadcrumb.jsx';
import PromoBanners from '../components/PromoBanners.jsx';
import CtaBand from '../components/CtaBand.jsx';
import Contact from '../components/Contact.jsx';

export default function PromotionsPage() {
  useSeo({
    title: 'Special Campaigns, Expo Highlights & Dairy Subsidies | KCR Nepal',
    description:
      'Explore promotional campaigns, live trade expo demos, government cooperative subsidy guidance, and energy saving incentives by Kathmandu Chilling.',
    canonical: 'https://kathmanduchilling.com.np/promotions',
  });

  return (
    <div className="dedicated-page-wrapper">
      <div className="page-hero-banner">
        <div className="wrap">
          <Breadcrumb items={[{ label: 'Campaigns & Highlights' }]} />
          <div className="page-hero-content">
            <span className="page-hero-eyebrow mono">PROMOTIONS · TRADE EXPO 2026 · COOPERATIVE SUBSIDIES</span>
            <h1 className="page-hero-title">Campaigns &amp; Special Highlights</h1>
            <p className="page-hero-desc">
              Discover Kathmandu Chilling’s latest initiatives, live 3D assembly exhibits at national agricultural expos, eco-green energy incentives, and provincial technical reach.
            </p>
          </div>
        </div>
      </div>

      <PromoBanners />
      <CtaBand />
      <Contact />
    </div>
  );
}
