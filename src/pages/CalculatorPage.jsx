import React from 'react';
import { useSeo } from '../hooks/useSeo';
import Breadcrumb from '../components/Breadcrumb.jsx';
import ColdCalculator from '../components/ColdCalculator.jsx';
import TechEdge from '../components/TechEdge.jsx';
import CtaBand from '../components/CtaBand.jsx';
import Contact from '../components/Contact.jsx';

export default function CalculatorPage() {
  useSeo({
    title: 'Cold Storage Sizing, PUF Thickness & Power ROI Calculator | Nepal',
    description:
      'Interactive engineering calculator to estimate cold room tonnage, compressor HP, high-density PUF panel thickness, and monthly electricity savings in NPR.',
    canonical: 'https://kathmanduchilling.com.np/calculator',
  });

  return (
    <div className="dedicated-page-wrapper">
      <div className="page-hero-banner">
        <div className="wrap">
          <Breadcrumb items={[{ label: 'Sizing & ROI Calculator' }]} />
          <div className="page-hero-content">
            <span className="page-hero-eyebrow mono">ENGINEERING TOOL · INSTANT HEAT-LOAD ESTIMATOR</span>
            <h1 className="page-hero-title">Cold Storage Capacity &amp; Energy ROI Calculator</h1>
            <p className="page-hero-desc">
              Calculate the required floor space, PUF panel insulation thickness, compressor capacity (HP), and projected electricity savings for your agricultural, dairy, or meat cold-chain investment in Nepal.
            </p>
          </div>
        </div>
      </div>

      <ColdCalculator />
      <TechEdge />
      <CtaBand />
      <Contact />
    </div>
  );
}
