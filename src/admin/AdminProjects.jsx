import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext.jsx';

export default function AdminProjects() {
  const { data, addProject, updateProject, deleteProject } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    client: '',
    location: '',
    year: '2025',
    capacity: '',
    equipment: '',
    img: '',
    desc: '',
    results: '',
    testimonial: '',
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      title: '',
      client: '',
      location: 'Kathmandu Valley, Bagmati Province',
      year: '2025',
      capacity: '50 MT',
      equipment: 'Modular PUF Cold Room',
      img: '/images/projects/chandragiri-project.jpg',
      desc: 'Turnkey industrial cooling installation with dual-stage compressor and automated defrost control.',
      results: '99.8% temperature stability with 32% reduced monthly electricity cost.',
      testimonial: 'Kathmandu Chilling delivered the project ahead of schedule with great engineering support.',
    });
    setModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingId(proj.id);
    setForm({
      title: proj.title || '',
      client: proj.client || '',
      location: proj.location || '',
      year: proj.year || '2025',
      capacity: proj.capacity || '',
      equipment: proj.equipment || '',
      img: proj.img || '',
      desc: proj.desc || '',
      results: proj.results || '',
      testimonial: proj.testimonial || '',
    });
    setModalOpen(true);
  };

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setForm((prev) => ({ ...prev, img: uploadEvent.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      updateProject(editingId, form);
    } else {
      addProject(form);
    }
    setModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete case study "${title}"?`)) {
      deleteProject(id);
    }
  };

  return (
    <div className="admin-page-content">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumbs mono">CASE STUDIES · 7 PROVINCES</div>
          <h1>Completed Projects &amp; Installations</h1>
          <p>Showcase turnkey commercial refrigeration &amp; dairy installations across Nepal.</p>
        </div>
        <button type="button" className="btn-admin-primary" onClick={openAddModal}>
          <span>+ Add New Case Study</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="admin-projects-grid">
        {data.projects.map((proj) => (
          <div className="admin-project-card" key={proj.id}>
            <div className="project-card-media">
              <img src={proj.img} alt={proj.title} />
              <span className="project-year-badge mono">{proj.year}</span>
              <span className="project-cap-badge mono">{proj.capacity}</span>
            </div>
            <div className="project-card-body">
              <div className="project-loc mono">📍 {proj.location}</div>
              <h3>{proj.title}</h3>
              <div className="project-client">
                <strong>Client:</strong> {proj.client}
              </div>
              <div className="project-equip mono">
                <strong>Equip:</strong> {proj.equipment}
              </div>
              <p className="project-desc">{proj.desc}</p>
              {proj.testimonial && (
                <div className="project-quote">
                  <em>"{proj.testimonial}"</em>
                </div>
              )}
            </div>
            <div className="admin-prod-footer">
              <button
                type="button"
                className="btn-table-edit mono"
                onClick={() => openEditModal(proj)}
              >
                ✏️ Edit Case Study
              </button>
              <button
                type="button"
                className="btn-table-delete mono"
                onClick={() => handleDelete(proj.id, proj.title)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>{editingId ? 'Edit Project Case Study' : 'Add Project Case Study'}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="admin-modal-form">
              <div className="modal-form-grid">
                <div className="form-field span-2">
                  <label>Project Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. 50 MT Apple & Potato Cold Storage Facility"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Client / Enterprise Name</label>
                  <input
                    type="text"
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    placeholder="e.g. Chandragiri Agro Cooperative"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Location &amp; Province</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Bharatpur, Chitwan"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Capacity (MT / LPH)</label>
                  <input
                    type="text"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    placeholder="e.g. 5,000 LPH or 50 MT"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Completion Year</label>
                  <input
                    type="text"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="2025"
                    required
                  />
                </div>

                <div className="form-field span-2">
                  <label>Equipment Installed</label>
                  <input
                    type="text"
                    value={form.equipment}
                    onChange={(e) => setForm({ ...form, equipment: e.target.value })}
                    placeholder="e.g. 2x 25MT PUF Cold Rooms with Bitzer Scroll Units"
                    required
                  />
                </div>

                {/* Project Image */}
                <div className="form-field span-2">
                  <label>Project Photograph (Upload File or Enter URL)</label>
                  <div className="image-input-split">
                    <input
                      type="text"
                      value={form.img}
                      onChange={(e) => setForm({ ...form, img: e.target.value })}
                      placeholder="/images/projects/chandragiri-project.jpg"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFile}
                    />
                  </div>
                  {form.img && (
                    <div className="image-preview-box">
                      <img src={form.img} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className="form-field span-2">
                  <label>Project Overview &amp; Technical Scope</label>
                  <textarea
                    rows={3}
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                    placeholder="Engineering details, challenges solved, insulation installed..."
                  />
                </div>

                <div className="form-field span-2">
                  <label>Performance Results &amp; ROI</label>
                  <input
                    type="text"
                    value={form.results}
                    onChange={(e) => setForm({ ...form, results: e.target.value })}
                    placeholder="e.g. Slashed milk temperature in 90 mins with zero curdling loss"
                  />
                </div>

                <div className="form-field span-2">
                  <label>Client Testimonial Quote</label>
                  <textarea
                    rows={2}
                    value={form.testimonial}
                    onChange={(e) => setForm({ ...form, testimonial: e.target.value })}
                    placeholder="What the client said about Kathmandu Chilling's service..."
                  />
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-save">
                  {editingId ? 'Save Case Study' : 'Publish Case Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
