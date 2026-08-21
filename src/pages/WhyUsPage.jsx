import React from 'react';
import { useSeo } from '../hooks/useSeo';
import Breadcrumb from '../components/Breadcrumb.jsx';
import WhyUs from '../components/WhyUs.jsx';
import Certifications from '../components/Certifications.jsx';
import Clients from '../components/Clients.jsx';
import CtaBand from '../components/CtaBand.jsx';
import Contact from '../components/Contact.jsx';

export default function WhyUsPage() {
  useSeo({
    title: 'Why Choose Kathmandu Chilling & Refrigerator Udhyog | Nepal',
    description:
      'Discover why over 450+ Nepali enterprises trust Kathmandu Chilling for turn-key cold storage, 2-year warranty, rapid mobile emergency service, and direct factory pricing.',
    canonical: 'https://kathmanduchilling.com.np/why-us',
  });

  return (
    <div className="dedicated-page-wrapper">
      <div className="page-hero-banner">
        <div className="wrap">
          <Breadcrumb items={[{ label: 'Why Choose Kathmandu Chilling' }]} />
          <div className="page-hero-content">
            <span className="page-hero-eyebrow mono">NEPAL’S LEADING MANUFACTURER · UNMATCHED RELIABILITY</span>
            <h1 className="page-hero-title">Why Choose Kathmandu Chilling (KCR)?</h1>
            <p className="page-hero-desc">
              Direct factory manufacturing in Kathmandu, local engineering support across all 7 provinces, ISO certified quality standards, and 24/7 mobile rapid response.
            </p>
          </div>
        </div>
      </div>

      <WhyUs />
      <Certifications />
      <Clients />
      <CtaBand />
      <Contact />
    </div>
  );
}
