import React from 'react';
import { useSeo } from '../hooks/useSeo';
import Breadcrumb from '../components/Breadcrumb.jsx';
import TechEdge from '../components/TechEdge.jsx';
import Certifications from '../components/Certifications.jsx';
import WhyUs from '../components/WhyUs.jsx';
import CtaBand from '../components/CtaBand.jsx';
import Contact from '../components/Contact.jsx';

export default function TechnologyPage() {
  useSeo({
    title: 'Inverter Technology & Precision Cold-Chain Engineering | Nepal',
    description:
      'Discover Kathmandu Chilling inverter compressors, high-density PUF insulation (42 kg/m³), tropicalized copper condenser coils, and IoT remote temperature controllers.',
    canonical: 'https://kathmanduchilling.com.np/technology',
  });

  return (
    <div className="dedicated-page-wrapper">
      <div className="page-hero-banner">
        <div className="wrap">
          <Breadcrumb items={[{ label: 'Technology & Inverter Edge' }]} />
          <div className="page-hero-content">
            <span className="page-hero-eyebrow mono">PRECISION REFRIGERATION · ZERO THERMAL LEAKAGE</span>
            <h1 className="page-hero-title">Inverter Technology &amp; Engineering Edge</h1>
            <p className="page-hero-desc">
              Engineered with advanced variable-frequency inverter scroll units, CNC injected PUF panels, and zero-ODP refrigerants to slash electricity bills by up to 35% across Nepal.
            </p>
          </div>
        </div>
      </div>

      <TechEdge />
      <Certifications />
      <WhyUs />
      <CtaBand />
      <Contact />
    </div>
  );
}
