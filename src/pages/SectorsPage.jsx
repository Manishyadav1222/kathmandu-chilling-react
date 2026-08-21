import React from 'react';
import { useSeo } from '../hooks/useSeo';
import Breadcrumb from '../components/Breadcrumb.jsx';
import Sectors from '../components/Sectors.jsx';
import IndustryShowcase from '../components/IndustryShowcase.jsx';
import CtaBand from '../components/CtaBand.jsx';
import Contact from '../components/Contact.jsx';

export default function SectorsPage() {
  useSeo({
    title: 'Industries & Sectors Served — Dairy, Agriculture, Pharma, Meat | Nepal',
    description:
      'Customized refrigeration engineering for dairy cooperatives, agro-horticulture cold storage, pharmaceutical vaccine cold-chains, and hotel commercial kitchens.',
    canonical: 'https://kathmanduchilling.com.np/sectors',
  });

  return (
    <div className="dedicated-page-wrapper">
      <div className="page-hero-banner">
        <div className="wrap">
          <Breadcrumb items={[{ label: 'Industries & Sectors Served' }]} />
          <div className="page-hero-content">
            <span className="page-hero-eyebrow mono">COMMERCIAL APPLICATIONS · TAILORED REFRIGERATION</span>
            <h1 className="page-hero-title">Industries &amp; Sectors We Serve</h1>
            <p className="page-hero-desc">
              From high-capacity apple cold storage in Mustang to temperature-regulated vaccine depots in Kathmandu and rapid chilling vats for Chitwan dairy farms.
            </p>
          </div>
        </div>
      </div>

      <Sectors />
      <IndustryShowcase />
      <CtaBand />
      <Contact />
    </div>
  );
}
