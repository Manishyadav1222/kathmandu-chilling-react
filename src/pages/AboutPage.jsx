import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb.jsx';
import { useAdminData } from '../context/AdminDataContext.jsx';
import { useSeo } from '../hooks/useSeo';
import { buildWhatsAppLink } from '../data/content';
import { WhatsAppIcon } from '../components/Hero.jsx';

export default function AboutPage() {
  const { data } = useAdminData();
  const story = data?.story || {};
  const team = data?.team || [];
  const contact = data?.contact || {};
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'Executive Leadership' | 'Engineering & R&D' | 'Sanitary Manufacturing' | 'Client Advisory & Projects' | '24/7 Operations'

  useSeo({
    title: 'Our Story & Team — Kathmandu Chilling & Refrigerator Udhyog',
    description:
      'Discover Kathmandu Chilling’s evolution since 2012, our mission for national food security, small business empowerment, and meet our pioneer refrigeration engineering team in Nepal.',
    canonical: 'https://kathmanduchilling.com.np/about',
  });

  const filteredTeam = useMemo(() => {
    if (activeTab === 'all') return team;
    return team.filter((m) => m.department === activeTab);
  }, [team, activeTab]);

  const waLink = buildWhatsAppLink(
    'Hi Kathmandu Chilling, I would like to schedule a factory visit at Naikap and meet your engineering team.'
  );

  return (
    <div className="about-page-container">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'Our Story & Team', to: '/about' },
        ]}
      />

      {/* Hero Header Section */}
      <section className="about-hero-section">
        <div className="wrap">
          <div className="about-hero-badge mono">
            <span className="live-pulse"></span>
            <span>PROUDLY 100% ENGINEERED IN NEPAL · ESTD. 2012</span>
          </div>
          <h1 className="about-hero-title">
            {story.headline || 'Engineered in Nepal, Built for the Nation'}
          </h1>
          <p className="about-hero-sub">
            {story.tagline ||
              'Empowering Agriculture, Dairy Cooperatives & Small Businesses Across 7 Provinces'}
          </p>

          {/* Quick Impact Stats */}
          <div className="about-stats-grid">
            <div className="about-stat-card">
              <span className="stat-num neon-text">{story.statYears || '14+'}</span>
              <span className="stat-label">Years of Thermal Engineering</span>
            </div>
            <div className="about-stat-card">
              <span className="stat-num neon-text">{story.statProjects || '450+'}</span>
              <span className="stat-label">Turnkey Cold Storage & Dairy Plants</span>
            </div>
            <div className="about-stat-card">
              <span className="stat-num neon-text">{story.statProvinces || '7 / 7'}</span>
              <span className="stat-label">Provinces Covered Nationwide</span>
            </div>
            <div className="about-stat-card">
              <span className="stat-num neon-text">{story.statJobs || '85+'}</span>
              <span className="stat-label">Local High-Skill Engineering Jobs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Nation Building Philosophy */}
      <section className="about-mission-section">
        <div className="wrap">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="card-top-icon">🎯</div>
              <span className="mono card-tag">OUR PURPOSE</span>
              <h2>Our Core Mission</h2>
              <p>
                {story.mission ||
                  'To eliminate post-harvest agricultural losses and dairy spoilage across Nepal by engineering energy-efficient, robust, and accessible refrigeration systems built with pride in Kathmandu.'}
              </p>
            </div>

            <div className="mission-card">
              <div className="card-top-icon">🔭</div>
              <span className="mono card-tag">LONG-TERM GOAL</span>
              <h2>Our National Vision</h2>
              <p>
                {story.vision ||
                  'To build a self-reliant Nepal where every farmer, cooperative, and food entrepreneur has access to decentralized, world-class cold chain infrastructure without relying on expensive foreign imports.'}
              </p>
            </div>
          </div>

          {/* Nation Building & Small Business Pillar Cards */}
          <div className="pillars-grid">
            <div className="pillar-card highlight-cyan">
              <div className="pillar-icon">🇳🇵</div>
              <h3>Nation Building &amp; Import Substitution</h3>
              <p>
                {story.nationBuilding ||
                  'By manufacturing 100% of our refrigeration and dairy machinery locally in Naikap, Kathmandu, we create high-skill engineering jobs for Nepalese youth, reduce national import dependency, and keep capital circulating within the local economy.'}
              </p>
              <div className="pillar-tags">
                <span>✓ High-Skill Youth Employment</span>
                <span>✓ Zero Foreign Import Delays</span>
                <span>✓ 100% Genuine Spare Parts Locally</span>
              </div>
            </div>

            <div className="pillar-card highlight-orange">
              <div className="pillar-icon">🌱</div>
              <h3>Empowering Small Businesses &amp; Cooperatives</h3>
              <p>
                {story.smallBusinessImpact ||
                  'We actively support grassroots agro-entrepreneurs, dairy cooperatives, and SME startups with free DPR layout consultations, flexible installment structures, and government subsidy paperwork assistance to make industrial cooling affordable for all.'}
              </p>
              <div className="pillar-tags">
                <span>✓ Free DPR Project Blueprints</span>
                <span>✓ MoALD Subsidy Documentation</span>
                <span>✓ Flexible Phased Milestones</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Evolution Timeline */}
      <section className="about-timeline-section">
        <div className="wrap">
          <div className="section-head text-center">
            <span className="mono text-ice">CHRONOLOGY OF INNOVATION</span>
            <h2>Our Evolution &amp; Milestones</h2>
            <p>A journey from a local Kathmandu precision workshop to Nepal's cold chain benchmark.</p>
          </div>

          <div className="timeline-container">
            {(story.milestones || []).map((m, idx) => (
              <div key={idx} className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-marker">
                  <span className="marker-dot"></span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-year mono">{m.year}</div>
                  <h4>{m.title}</h4>
                  <p>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Leadership & Engineering Team */}
      <section className="about-team-section">
        <div className="wrap">
          <div className="section-head text-center">
            <span className="mono text-ice">THE MINDS BEHIND KCR</span>
            <h2>Meet Our Pioneer Engineering Team</h2>
            <p>Experienced thermal architects, certified SS 304 fabricators, and dedicated after-sales specialists.</p>
          </div>

          {/* Department Filter Tabs */}
          <div className="team-filter-tabs">
            <button
              className={`filter-btn mono ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Specialists ({team.length})
            </button>
            <button
              className={`filter-btn mono ${activeTab === 'Executive Leadership' ? 'active' : ''}`}
              onClick={() => setActiveTab('Executive Leadership')}
            >
              Leadership
            </button>
            <button
              className={`filter-btn mono ${activeTab === 'Engineering & R&D' ? 'active' : ''}`}
              onClick={() => setActiveTab('Engineering & R&D')}
            >
              Thermal &amp; R&amp;D
            </button>
            <button
              className={`filter-btn mono ${activeTab === 'Sanitary Manufacturing' ? 'active' : ''}`}
              onClick={() => setActiveTab('Sanitary Manufacturing')}
            >
              Sanitary Fabrication
            </button>
            <button
              className={`filter-btn mono ${activeTab === 'Client Advisory & Projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('Client Advisory & Projects')}
            >
              Agro Subsidies &amp; DPR
            </button>
            <button
              className={`filter-btn mono ${activeTab === '24/7 Operations' ? 'active' : ''}`}
              onClick={() => setActiveTab('24/7 Operations')}
            >
              Field Service
            </button>
          </div>

          {/* Team Grid */}
          <div className="team-grid">
            {filteredTeam.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-photo-wrap">
                  <img src={member.image} alt={member.name} loading="lazy" />
                  <div className="team-dept-badge mono">{member.department}</div>
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <span className="team-role mono">{member.role}</span>
                  <span className="team-exp mono">★ {member.experience}</span>
                  <p className="team-bio">{member.bio}</p>
                  <div className="team-spec">
                    <span className="spec-tag mono">🔧 {member.specialization}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Roadmap 2030 */}
      <section className="about-future-section">
        <div className="wrap">
          <div className="future-card-banner">
            <div className="future-header">
              <span className="mono text-ice">VISION 2030 ROADMAP</span>
              <h2>Building Nepal’s Next-Generation Cold Chain</h2>
              <p>Where we are heading next to empower remote mountain valleys and modern commercial hubs.</p>
            </div>

            <div className="future-grid">
              {(story.futurePlans || []).map((plan, idx) => (
                <div key={idx} className="future-item">
                  <div className="future-icon">{plan.icon}</div>
                  <h4>{plan.title}</h4>
                  <p>{plan.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visit Factory & Schedule Consultation CTA */}
      <section className="about-cta-section">
        <div className="wrap">
          <div className="about-cta-card">
            <div className="about-cta-text">
              <h2>Visit Our Naikap Factory &amp; Testing Facility</h2>
              <p>
                See our heavy-duty PUF panel lamination lines, live cold room thermal pull-down chambers,
                and discuss your project directly with our lead thermal engineers.
              </p>
              <div className="cta-meta mono">
                <span>📍 {contact.location || 'Chandragiri-14, Naya Naikap, Kathmandu'}</span>
                <span>📞 +977 {contact.phone1 || '9844366008'}</span>
              </div>
            </div>
            <div className="about-cta-actions">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn whatsapp btn-large">
                <WhatsAppIcon /> Book Factory Tour on WhatsApp
              </a>
              <Link to="/contact" className="btn secondary btn-large">
                Request Free DPR Consultation →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
