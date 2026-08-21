import React from 'react';
import { useSeo } from '../hooks/useSeo';
import Breadcrumb from '../components/Breadcrumb.jsx';
import Projects from '../components/Projects.jsx';
import Clients from '../components/Clients.jsx';
import CtaBand from '../components/CtaBand.jsx';
import Contact from '../components/Contact.jsx';

export default function ProjectsPage() {
  useSeo({
    title: 'Cold Storage & Dairy Plant Turnkey Projects Across Nepal | KCR',
    description:
      'Explore 450+ completed commercial cold room, blast chiller, chilling vat, and automated dairy installations in Kathmandu, Chitwan, Pokhara, Butwal, and Biratnagar.',
    canonical: 'https://kathmanduchilling.com.np/projects',
  });

  return (
    <div className="dedicated-page-wrapper">
      <div className="page-hero-banner">
        <div className="wrap">
          <Breadcrumb items={[{ label: 'Completed Projects & Case Studies' }]} />
          <div className="page-hero-content">
            <span className="page-hero-eyebrow mono">450+ INSTALLATIONS · NATIONWIDE 7 PROVINCES</span>
            <h1 className="page-hero-title">Completed Cold-Chain &amp; Dairy Projects</h1>
            <p className="page-hero-desc">
              Browse proven field installations across commercial cooperatives, pharmaceutical depots, meat processing hubs, and fruit &amp; vegetable cold storage chambers throughout Nepal.
            </p>
          </div>
        </div>
      </div>

      <Projects />
      <Clients />
      <CtaBand />
      <Contact />
    </div>
  );
}
