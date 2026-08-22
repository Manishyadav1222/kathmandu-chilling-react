import React, { useState, useRef } from 'react';
import { useAdminData, optimizeImageFile } from '../context/AdminDataContext.jsx';

const PROJECT_CATEGORIES = [
  'Cold Storage',
  'Dairy Plants',
  'Pharma & Hospital',
  'Blast Freezers',
  'Transport Refrigeration',
  'Commercial Retail',
];

export default function AdminProjects() {
  const { data, addProject, updateProject, deleteProject } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saveAlert, setSaveAlert] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    client: '',
    location: '',
    category: 'Cold Storage',
    tempAchieved: '−20°C to +4°C',
    year: '2025',
    capacity: '',
    equipmentSupplied: '',
    img: '',
    summary: '',
    metricTemp: '−20°C',
    metricCap: '50 MT',
    metricSavings: '28%',
    metricPullDown: '3.5 hrs',
    testimonial: '',
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      title: '',
      client: '',
      location: 'Kathmandu Valley, Bagmati Province',
      category: 'Cold Storage',
      tempAchieved: '−20°C to +4°C',
      year: '2025',
      capacity: '50 MT',
      equipmentSupplied: '120mm High-Density PUF Panels\nDual 10HP Bitzer Scroll Units\nForced Evaporators\nAutomatic Cam-Lock Swing Door',
      img: '/images/projects/chandragiri-project.jpg',
      summary: 'Turnkey industrial cooling installation with dual-stage compressor and automated defrost control.',
      metricTemp: '−20°C',
      metricCap: '50 MT',
      metricSavings: '28%',
      metricPullDown: '3.5 hrs',
      testimonial: 'Kathmandu Chilling delivered the project ahead of schedule with great engineering support.',
    });
    setModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingId(proj.id);
    const equipStr = Array.isArray(proj.equipmentSupplied)
      ? proj.equipmentSupplied.join('\n')
      : proj.equipment || '';

    const metricsArr = proj.metrics || [];
    const getMetric = (lbl) => metricsArr.find((m) => m.label?.toLowerCase().includes(lbl.toLowerCase()))?.val || '';

    setForm({
      title: proj.title || '',
      client: proj.client || '',
      location: proj.location || '',
      category: proj.category || 'Cold Storage',
      tempAchieved: proj.tempAchieved || '−20°C',
      year: proj.year || '2025',
      capacity: proj.capacity || '',
      equipmentSupplied: equipStr,
      img: proj.img || '',
      summary: proj.summary || proj.desc || '',
      metricTemp: getMetric('temp') || proj.tempAchieved || '−20°C',
      metricCap: getMetric('cap') || proj.capacity || '50 MT',
      metricSavings: getMetric('sav') || getMetric('energy') || '25%',
      metricPullDown: getMetric('pull') || getMetric('time') || '3.5 hrs',
      testimonial: proj.testimonial || '',
    });
    setModalOpen(true);
  };

  // Image Upload File Handler
  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimized = await optimizeImageFile(file);
        setForm((prev) => ({ ...prev, img: optimized }));
      } catch (err) {
        console.error('Project image upload failed:', err);
      }
    }
  };

  // Drag & drop photo upload
  const handleDropPhoto = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const optimized = await optimizeImageFile(file);
        setForm((prev) => ({ ...prev, img: optimized }));
      } catch (err) {
        console.error('Project image drop failed:', err);
      }
    }
  };

  // Remove / Clear Photo
  const handleClearPhoto = () => {
    setForm((prev) => ({ ...prev, img: '' }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const equipList = form.equipmentSupplied
      ? form.equipmentSupplied.split('\n').map((s) => s.trim()).filter((s) => s.length > 0)
      : [];

    const metrics = [
      { label: 'Temperature', val: form.metricTemp || form.tempAchieved || '−20°C' },
      { label: 'Capacity', val: form.metricCap || form.capacity || 'Custom' },
      { label: 'Energy Savings', val: form.metricSavings || '25%' },
      { label: 'Pull-down Time', val: form.metricPullDown || '3.5 hrs' },
    ];

    const projectPayload = {
      title: form.title,
      client: form.client,
      location: form.location,
      category: form.category,
      tempAchieved: form.tempAchieved,
      year: form.year,
      capacity: form.capacity,
      equipment: equipList[0] || form.equipmentSupplied,
      equipmentSupplied: equipList,
      img: form.img,
      summary: form.summary,
      desc: form.summary,
      metrics,
      testimonial: form.testimonial,
    };

    if (editingId) {
      updateProject(editingId, projectPayload);
    } else {
      addProject(projectPayload);
    }

    setModalOpen(false);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete case study "${title}"?`)) {
      deleteProject(id);
      setSaveAlert(true);
      setTimeout(() => setSaveAlert(false), 3000);
    }
  };

  return (
    <div className="admin-page-content">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumbs mono">CASE STUDIES · 7 PROVINCES</div>
          <h1>Completed Projects &amp; Installations</h1>
          <p>Showcase turnkey commercial refrigeration &amp; dairy installations across Nepal with rich photographs and metrics.</p>
        </div>
        <button type="button" className="btn-admin-primary" onClick={openAddModal}>
          <span>+ Add New Case Study</span>
        </button>
      </div>

      {saveAlert && (
        <div className="admin-alert-success" style={{ marginBottom: '20px' }}>
          ✓ Case study updated successfully! Changes reflected across the website.
        </div>
      )}

      {/* Projects Grid */}
      <div className="admin-projects-grid">
        {(data?.projects || []).map((proj) => (
          <div className="admin-project-card" key={proj.id}>
            <div className="project-card-media">
              {proj.img ? (
                <img src={proj.img} alt={proj.title} />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#071322', color: '#64748b', fontSize: '32px' }}>
                  🏭
                </div>
              )}
              <span className="project-year-badge mono">{proj.year}</span>
              <span className="project-cap-badge mono">{proj.capacity}</span>
              {proj.tempAchieved && <span className="admin-temp-pill mono" style={{ top: '38px', right: '12px' }}>{proj.tempAchieved}</span>}
            </div>
            <div className="project-card-body">
              <div className="project-loc mono">📍 {proj.location} · <span style={{ color: 'var(--admin-cyan)' }}>{proj.category}</span></div>
              <h3>{proj.title}</h3>
              <div className="project-client">
                <strong>Client:</strong> {proj.client}
              </div>
              <p className="project-desc">{proj.summary || proj.desc}</p>
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
          <div className="admin-modal-card large" onClick={(e) => e.stopPropagation()}>
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
                    placeholder="e.g. 50 MT Central Agro & Dairy Cold Storage Hub"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Industry Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  >
                    {PROJECT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Temperature Achieved</label>
                  <input
                    type="text"
                    value={form.tempAchieved}
                    onChange={(e) => setForm({ ...form, tempAchieved: e.target.value })}
                    placeholder="e.g. −20°C to +4°C"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Client / Enterprise Name</label>
                  <input
                    type="text"
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    placeholder="e.g. Naikap Agricultural Cooperative"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Location &amp; Province</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Chandragiri-14, Kathmandu"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Capacity (MT / LPH)</label>
                  <input
                    type="text"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    placeholder="e.g. 50 Metric Tons (350 sq. ft)"
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

                {/* ============================================================ */}
                {/* PROJECT PHOTOGRAPH CONTROLS (UPLOAD, URL, REMOVE) */}
                {/* ============================================================ */}
                <div className="form-field span-2">
                  <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Project Photograph</span>
                    {form.img && (
                      <button
                        type="button"
                        onClick={handleClearPhoto}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        ✕ Remove Photo
                      </button>
                    )}
                  </label>

                  {/* Drag & Drop Box */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDropPhoto}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--admin-cyan)',
                      borderRadius: '10px',
                      padding: '16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: 'rgba(53, 214, 255, 0.04)',
                      marginBottom: '10px',
                    }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFile}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>📸</span>
                    <strong style={{ color: '#fff', fontSize: '13px' }}>
                      Click to Browse File or Drag &amp; Drop Case Study Photo
                    </strong>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      Supports JPG, PNG, WEBP
                    </div>
                  </div>

                  <div className="image-input-split">
                    <input
                      type="text"
                      value={form.img}
                      onChange={(e) => setForm({ ...form, img: e.target.value })}
                      placeholder="Or enter photo URL: /images/projects/... or https://..."
                    />
                  </div>

                  {form.img ? (
                    <div className="image-preview-box" style={{ marginTop: '8px' }}>
                      <img src={form.img} alt="Project Preview" />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <span className="preview-label mono">✓ Active Project Photo</span>
                        <button
                          type="button"
                          onClick={handleClearPhoto}
                          className="btn-table-delete"
                          style={{ padding: '3px 8px', fontSize: '11px' }}
                        >
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginTop: '8px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                      ℹ️ No photo assigned. Branded factory icon will be rendered on the website.
                    </div>
                  )}
                </div>

                <div className="form-field span-2">
                  <label>Project Summary &amp; Technical Scope</label>
                  <textarea
                    rows={3}
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    placeholder="Turnkey installation of multi-chamber PUF cold room with dual scroll units..."
                    required
                  />
                </div>

                <div className="form-field span-2">
                  <label>Equipment &amp; Hardware Supplied (1 per line)</label>
                  <textarea
                    rows={3}
                    value={form.equipmentSupplied}
                    onChange={(e) => setForm({ ...form, equipmentSupplied: e.target.value })}
                    placeholder="120mm High-Density PUF Panels&#10;Dual 10HP Bitzer Scroll Units&#10;Forced Evaporators"
                  />
                </div>

                {/* Performance Metrics Inputs */}
                <div className="form-field">
                  <label>Metric: Temperature</label>
                  <input
                    type="text"
                    value={form.metricTemp}
                    onChange={(e) => setForm({ ...form, metricTemp: e.target.value })}
                    placeholder="e.g. −20°C"
                  />
                </div>

                <div className="form-field">
                  <label>Metric: Capacity</label>
                  <input
                    type="text"
                    value={form.metricCap}
                    onChange={(e) => setForm({ ...form, metricCap: e.target.value })}
                    placeholder="e.g. 50 MT"
                  />
                </div>

                <div className="form-field">
                  <label>Metric: Energy Savings</label>
                  <input
                    type="text"
                    value={form.metricSavings}
                    onChange={(e) => setForm({ ...form, metricSavings: e.target.value })}
                    placeholder="e.g. 28%"
                  />
                </div>

                <div className="form-field">
                  <label>Metric: Pull-down Time</label>
                  <input
                    type="text"
                    value={form.metricPullDown}
                    onChange={(e) => setForm({ ...form, metricPullDown: e.target.value })}
                    placeholder="e.g. 3.5 hrs"
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
                  {editingId ? '✓ Save Case Study' : '+ Publish Case Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
