import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext.jsx';

export default function AdminPromotions() {
  const { data, updatePromotion } = useAdminData();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const openEditModal = (promo) => {
    setEditingId(promo.id);
    setForm({ ...promo });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      updatePromotion(editingId, form);
      setEditingId(null);
    }
  };

  return (
    <div className="admin-page-content">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumbs mono">CAMPAIGNS · PROMOTIONS &amp; EXPOS</div>
          <h1>Promotional Campaign Posters Manager</h1>
          <p>Customize the high-impact promotional campaign cards displayed on the homepage.</p>
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="admin-promos-grid">
        {data.promotions.map((p) => (
          <div
            key={p.id}
            className="admin-promo-card"
            style={{ background: p.bgGradient, borderColor: p.accentColor }}
          >
            <div className="admin-promo-top">
              <span
                className="promo-category-pill mono"
                style={{
                  background: `${p.tagColor}22`,
                  color: p.tagColor,
                  borderColor: `${p.tagColor}44`,
                }}
              >
                {p.tag}
              </span>
              <button
                type="button"
                className="btn-edit-promo-pill mono"
                onClick={() => openEditModal(p)}
              >
                ✏️ Edit Poster
              </button>
            </div>

            <div className="admin-promo-body">
              <h3 className="promo-title">
                <span>{p.title}</span>
                <strong style={{ color: p.accentColor }}>{p.highlight}</strong>
              </h3>
              <p className="promo-subtitle">{p.subtitle}</p>
              <div className="promo-highlight-badge">
                <span>{p.badge}</span>
              </div>
            </div>

            <div className="admin-promo-foot mono">
              <span>{p.footerText}</span>
              <span style={{ color: p.accentColor }}>CTA: {p.actionText}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="admin-modal-backdrop" onClick={() => setEditingId(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>Edit Promotional Campaign Card</h3>
              <button type="button" className="modal-close-btn" onClick={() => setEditingId(null)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="admin-modal-form">
              <div className="modal-form-grid">
                <div className="form-field">
                  <label>Category Tag</label>
                  <input
                    type="text"
                    value={form.tag || ''}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Tag Accent Color</label>
                  <input
                    type="text"
                    value={form.tagColor || ''}
                    onChange={(e) => setForm({ ...form, tagColor: e.target.value })}
                    placeholder="#35d6ff"
                    required
                  />
                </div>

                <div className="form-field span-2">
                  <label>Main Headline</label>
                  <input
                    type="text"
                    value={form.title || ''}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-field span-2">
                  <label>Highlight Text (Glow Color)</label>
                  <input
                    type="text"
                    value={form.highlight || ''}
                    onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                    required
                  />
                </div>

                <div className="form-field span-2">
                  <label>Subtitle &amp; Campaign Copy</label>
                  <textarea
                    rows={3}
                    value={form.subtitle || ''}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Badge Ribbon Text</label>
                  <input
                    type="text"
                    value={form.badge || ''}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Action Button Text</label>
                  <input
                    type="text"
                    value={form.actionText || ''}
                    onChange={(e) => setForm({ ...form, actionText: e.target.value })}
                  />
                </div>

                <div className="form-field span-2">
                  <label>Custom WhatsApp Inquiry Message</label>
                  <input
                    type="text"
                    value={form.waMsg || ''}
                    onChange={(e) => setForm({ ...form, waMsg: e.target.value })}
                  />
                </div>

                <div className="form-field span-2">
                  <label>Footer Note</label>
                  <input
                    type="text"
                    value={form.footerText || ''}
                    onChange={(e) => setForm({ ...form, footerText: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-save">
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
