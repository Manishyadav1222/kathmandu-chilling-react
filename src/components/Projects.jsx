import { useState } from 'react';
import { PROJECTS, buildWhatsAppLink } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import { useAdminData } from '../context/AdminDataContext.jsx';
import { WhatsAppIcon } from './Hero.jsx';
import SmartImage from './SmartImage.jsx';

export default function Projects() {
  const headReveal = useReveal();
  const { data } = useAdminData();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filters = ['All', 'Cold Storage', 'Dairy Plants', 'Pharma & Hospital', 'Blast Freezers', 'Transport Refrigeration', 'Commercial Retail'];

  const allProjects = data?.projects && data.projects.length > 0 ? data.projects : PROJECTS;

  const filteredProjects =
    activeFilter === 'All'
      ? allProjects
      : allProjects.filter((p) => {
          const cat = (p.category || p.equipment || '').toLowerCase();
          return cat.includes(activeFilter.toLowerCase());
        });

  return (
    <section className="projects-section" id="projects">
      <div className="wrap">
        <div className="section-head reveal" ref={headReveal}>
          <div className="eyebrow">Proven Field Installations</div>
          <h2>Completed Cold-Chain &amp; Dairy Projects</h2>
          <p>
            Explore our turnkey engineering installations across Kathmandu Valley, Chitwan, Pokhara,
            Butwal, and Biratnagar.
          </p>

          {/* Sector Filter Tabs */}
          <div className="projects-filter-bar">
            {filters.map((f) => (
              <button
                key={f}
                className={`proj-filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <article className="project-card" key={project.id || project.slug}>
              <div className="project-media">
                <SmartImage src={project.img || project.image} alt={project.title} icon="🏭" ratio="16/10" />
                <span className="project-cat-badge">{project.category || 'Industrial Cold Chain'}</span>
                {project.tempAchieved && <span className="project-temp-badge mono">{project.tempAchieved}</span>}
              </div>

              <div className="project-body">
                <div className="project-meta-row mono">
                  <span className="project-loc">📍 {project.location || 'Nepal'}</span>
                  <span className="project-year">Yr {project.year || '2025'}</span>
                </div>

                <h3>{project.title}</h3>
                <div className="project-client-name">
                  <strong>Client:</strong> {project.client || 'Commercial Enterprise'}
                </div>
                <p>{project.summary || project.desc || 'Turnkey cold chain engineering and installation.'}</p>

                {/* Performance Metrics Row */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="project-metrics-grid">
                    {project.metrics.map((m, idx) => (
                      <div className="p-metric-item" key={idx}>
                        <span className="p-metric-val">{m.val}</span>
                        <span className="p-metric-label">{m.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="project-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => setSelectedProject(project)}
                  >
                    View Project Details →
                  </button>
                  <a
                    href={buildWhatsAppLink(`Hi Kathmandu Chilling, I saw your ${project.title} project and would like to build a similar system.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wa-mini"
                    aria-label={`Ask about ${project.title} on WhatsApp`}
                  >
                    <WhatsAppIcon size={14} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Close modal">
              ✕
            </button>

            <div className="modal-header">
              <div className="modal-badge-row mono">
                <span className="badge-highlight">{selectedProject.category || 'Cold Chain'}</span>
                <span>📍 {selectedProject.location}</span>
                <span>Year {selectedProject.year}</span>
              </div>
              <h2>{selectedProject.title}</h2>
              <div className="modal-client">Client: <strong>{selectedProject.client}</strong></div>
            </div>

            <div className="modal-media">
              <SmartImage src={selectedProject.img || selectedProject.image} alt={selectedProject.title} icon="🏭" ratio="16/9" />
            </div>

            <div className="modal-body">
              <p className="modal-desc">{selectedProject.summary || selectedProject.desc}</p>

              {/* Metrics */}
              {selectedProject.metrics && selectedProject.metrics.length > 0 && (
                <div className="modal-metrics-row">
                  {selectedProject.metrics.map((m, i) => (
                    <div className="modal-metric-card" key={i}>
                      <span className="m-val">{m.val}</span>
                      <span className="m-lbl">{m.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Equipment Supplied */}
              {((selectedProject.equipmentSupplied && selectedProject.equipmentSupplied.length > 0) || selectedProject.equipment) && (
                <div className="modal-equipment-section">
                  <h4>Equipment &amp; Hardware Supplied:</h4>
                  <ul>
                    {(selectedProject.equipmentSupplied || [selectedProject.equipment]).map((eq, i) => (
                      <li key={i}>✓ {eq}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProject.testimonial && (
                <div className="modal-testimonial-box" style={{ marginTop: '16px', padding: '14px', background: 'rgba(53, 214, 255, 0.06)', borderRadius: '8px', borderLeft: '3px solid var(--admin-cyan)' }}>
                  <strong style={{ color: '#fff', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Client Feedback:</strong>
                  <em style={{ color: '#cbd5e1', fontSize: '13px' }}>"{selectedProject.testimonial}"</em>
                </div>
              )}

              <div className="modal-cta-box" style={{ marginTop: '20px' }}>
                <a
                  href={buildWhatsAppLink(`Hi Kathmandu Chilling, I am interested in designing a project similar to ${selectedProject.title} (${selectedProject.capacity || 'custom'}).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn whatsapp btn-large"
                >
                  <WhatsAppIcon size={18} /> Discuss Similar Project on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
