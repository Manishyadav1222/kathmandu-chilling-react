import React from 'react';
import { useSeo } from '../hooks/useSeo';
import Breadcrumb from '../components/Breadcrumb.jsx';
import Products from '../components/Products.jsx';
import IndustryShowcase from '../components/IndustryShowcase.jsx';
import TechEdge from '../components/TechEdge.jsx';
import CtaBand from '../components/CtaBand.jsx';
import Contact from '../components/Contact.jsx';

export default function ProductsPage() {
  useSeo({
    title: 'Industrial Refrigeration & Dairy Processing Machinery Catalog | Nepal',
    description:
      'Explore cold storage rooms, walk-in chillers, blast freezers, bulk milk chilling vats (BMC), and automated dairy processing plants by Kathmandu Chilling in Nepal.',
    canonical: 'https://kathmanduchilling.com.np/products',
  });

  return (
    <div className="dedicated-page-wrapper">
      <div className="page-hero-banner">
        <div className="wrap">
          <Breadcrumb items={[{ label: 'Products & Machinery' }]} />
          <div className="page-hero-content">
            <span className="page-hero-eyebrow mono">ENGINEERED IN NEPAL · ISO CERTIFIED</span>
            <h1 className="page-hero-title">Industrial Refrigeration &amp; Dairy Machinery</h1>
            <p className="page-hero-desc">
              High-efficiency cold storage chambers, shock blast freezers, insulated road milk tankers, and complete dairy processing lines tailored for Nepali terrain and climate conditions.
            </p>
          </div>
        </div>
      </div>

      <Products />
      <IndustryShowcase />
      <TechEdge />
      <CtaBand />
      <Contact />
    </div>
  );
}
