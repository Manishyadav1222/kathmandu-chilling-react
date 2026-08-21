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

  const filters = ['All', 'Cold Storage', 'Dairy Plants', 'Pharma & Hospital', 'Blast Freezers', 'Transport Refrigeration'];

  const allProjects = data?.projects || PROJECTS;

  const filteredProjects =
    activeFilter === 'All'
      ? allProjects
      : allProjects.filter((p) => (p.category || p.equipment || '').toLowerCase().includes(activeFilter.toLowerCase()) || activeFilter === 'All');

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
            <article className="project-card" key={project.id}>
              <div className="project-media">
                <SmartImage src={project.img} alt={project.title} icon="🏭" ratio="16/10" />
                <span className="project-cat-badge">{project.category}</span>
                <span className="project-temp-badge mono">{project.tempAchieved}</span>
              </div>

              <div className="project-body">
                <div className="project-meta-row mono">
                  <span className="project-loc">📍 {project.location}</span>
                  <span className="project-year">Yr {project.year}</span>
                </div>

                <h3>{project.title}</h3>
                <div className="project-client-name">
                  <strong>Client:</strong> {project.client}
                </div>
                <p>{project.summary}</p>

                {/* Performance Metrics Row */}
                <div className="project-metrics-grid">
                  {project.metrics?.map((m, idx) => (
                    <div className="p-metric-item" key={idx}>
                      <span className="p-metric-val">{m.val}</span>
                      <span className="p-metric-label">{m.label}</span>
                    </div>
                  ))}
                </div>

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
                <span className="badge-highlight">{selectedProject.category}</span>
                <span>📍 {selectedProject.location}</span>
                <span>Year {selectedProject.year}</span>
              </div>
              <h2>{selectedProject.title}</h2>
              <div className="modal-client">Client: <strong>{selectedProject.client}</strong></div>
            </div>

            <div className="modal-media">
              <SmartImage src={selectedProject.img} alt={selectedProject.title} icon="🏭" ratio="16/9" />
            </div>

            <div className="modal-body">
              <p className="modal-desc">{selectedProject.summary}</p>

              {/* Metrics */}
              <div className="modal-metrics-row">
                {selectedProject.metrics?.map((m, i) => (
                  <div className="modal-metric-card" key={i}>
                    <span className="m-val">{m.val}</span>
                    <span className="m-lbl">{m.label}</span>
                  </div>
                ))}
              </div>

              {/* Equipment Supplied */}
              {selectedProject.equipmentSupplied?.length > 0 && (
                <div className="modal-equipment-section">
                  <h4>Equipment &amp; Hardware Supplied:</h4>
                  <ul>
                    {selectedProject.equipmentSupplied.map((eq, i) => (
                      <li key={i}>✓ {eq}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="modal-cta-box">
                <a
                  href={buildWhatsAppLink(`Hi Kathmandu Chilling, I am interested in designing a project similar to ${selectedProject.title} (${selectedProject.capacity}).`)}
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
