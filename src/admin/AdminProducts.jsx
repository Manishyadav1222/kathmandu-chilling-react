import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAdminData, optimizeImageFile } from '../context/AdminDataContext.jsx';

export default function AdminProducts() {
  const { data, addProduct, updateProduct, deleteProduct } = useAdminData();
  const [selectedCat, setSelectedCat] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);
  const [saveAlert, setSaveAlert] = useState(false);
  const fileInputRef = useRef(null);

  // Form State
  const [form, setForm] = useState({
    categoryId: 'refrigeration',
    icon: '🧊',
    title: '',
    shortTitle: '',
    tempTag: '',
    tagline: '',
    desc: '',
    img: '',
    modelType: 'coldRoom',
    tempRange: '',
    capacityRange: '',
    panelThickness: '',
    compressorType: '',
    warranty: '2 Years Manufacturer Warranty',
    highlights: '',
    applications: '',
    gallery: [],
  });

  // State for adding an extra gallery photo
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');

  const categories = data?.categories || [];

  const allProducts = categories.flatMap((c) =>
    (c.items || []).map((item) => ({ ...item, categoryId: c.id, categoryName: c.title }))
  );

  const filteredProducts =
    selectedCat === 'all'
      ? allProducts
      : allProducts.filter((p) => p.categoryId === selectedCat);

  const openAddModal = () => {
    setEditingSlug(null);
    setForm({
      categoryId: categories[0]?.id || 'refrigeration',
      icon: '🧊',
      title: '',
      shortTitle: '',
      tempTag: '−20°C → +10°C',
      tagline: '',
      desc: '',
      img: '/images/coldroom.jpeg',
      modelType: 'coldRoom',
      tempRange: '−20°C to +10°C',
      capacityRange: '10 MT to 500 MT',
      panelThickness: '120mm PUF (42 kg/m³)',
      compressorType: 'Copeland/Bitzer Scroll Unit',
      warranty: '2 Years Comprehensive Warranty',
      highlights: 'High density 42 kg/m³ PUF panels\nZero thermal leakage tongue-and-groove joint\nDigital temperature controller with alarm',
      applications: 'Agro cold storage\nDairy hubs\nMeat & poultry processing',
      gallery: [{ url: '/images/coldroom.jpeg', caption: 'High-Performance Factory Build' }],
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingSlug(product.slug || product.id);
    const existingGallery =
      product.gallery && product.gallery.length > 0
        ? product.gallery
        : product.img
        ? [{ url: product.img, caption: product.title || 'Product Photo' }]
        : [];

    setForm({
      categoryId: product.categoryId || categories[0]?.id || 'refrigeration',
      icon: product.icon || '🧊',
      title: product.title || '',
      shortTitle: product.shortTitle || '',
      tempTag: product.tempTag || '',
      tagline: product.tagline || '',
      desc: product.desc || '',
      img: product.img || '',
      modelType: product.modelType || 'coldRoom',
      tempRange: product.specs?.tempRange || '',
      capacityRange: product.specs?.capacityRange || product.specs?.processingCapacity || '',
      panelThickness: product.specs?.panelThickness || '',
      compressorType: product.specs?.compressorType || '',
      warranty: product.specs?.warranty || '2 Years Warranty',
      highlights: Array.isArray(product.highlights) ? product.highlights.join('\n') : (product.highlights || ''),
      applications: Array.isArray(product.applications) ? product.applications.join('\n') : (product.applications || ''),
      gallery: existingGallery,
    });
    setModalOpen(true);
  };

  // Primary Photo File Upload with Auto-Optimization
  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimized = await optimizeImageFile(file);
        setForm((prev) => ({
          ...prev,
          img: optimized,
          gallery:
            prev.gallery.length === 0
              ? [{ url: optimized, caption: prev.title || 'Main Photo' }]
              : prev.gallery.map((g, idx) => (idx === 0 ? { ...g, url: optimized } : g)),
        }));
      } catch (err) {
        console.error('Image upload failed:', err);
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
        console.error('Image drop failed:', err);
      }
    }
  };

  // Remove / Clear Primary Photo
  const handleClearPhoto = () => {
    setForm((prev) => ({ ...prev, img: '' }));
  };

  // Add Extra Gallery Photo
  const handleAddGalleryPhoto = () => {
    if (!newGalleryUrl.trim()) return;
    setForm((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        { url: newGalleryUrl.trim(), caption: newGalleryCaption.trim() || 'Additional View' },
      ],
    }));
    setNewGalleryUrl('');
    setNewGalleryCaption('');
  };

  // Remove Gallery Photo
  const handleRemoveGalleryPhoto = (index) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== index),
    }));
  };

  // Set Gallery Photo as Primary
  const handleSetPrimaryGalleryPhoto = (photoUrl) => {
    setForm((prev) => ({ ...prev, img: photoUrl }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const productPayload = {
      icon: form.icon || '🧊',
      title: form.title,
      shortTitle: form.shortTitle || form.title,
      tempTag: form.tempTag,
      tagline: form.tagline,
      desc: form.desc,
      img: form.img,
      modelType: form.modelType,
      specs: {
        tempRange: form.tempRange,
        capacityRange: form.capacityRange,
        panelThickness: form.panelThickness,
        compressorType: form.compressorType,
        warranty: form.warranty,
      },
      highlights: form.highlights
        ? form.highlights.split('\n').map((s) => s.trim()).filter((s) => s.length > 0)
        : [],
      applications: form.applications
        ? form.applications.split('\n').map((s) => s.trim()).filter((s) => s.length > 0)
        : [],
      gallery:
        form.gallery.length > 0
          ? form.gallery
          : form.img
          ? [{ url: form.img, caption: form.title }]
          : [],
    };

    if (editingSlug) {
      updateProduct(editingSlug, productPayload, form.categoryId);
    } else {
      addProduct(form.categoryId, productPayload);
    }

    setModalOpen(false);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  const handleDelete = (slug, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      deleteProduct(slug);
      setSaveAlert(true);
      setTimeout(() => setSaveAlert(false), 3000);
    }
  };

  return (
    <div className="admin-page-content">
      {/* Header Row */}
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumbs mono">MANAGEMENT · EQUIPMENT CATALOG</div>
          <h1>Products &amp; Machinery Manager</h1>
          <p>Create, update, and manage industrial refrigeration lines, photos, 3D models, and technical specs.</p>
        </div>
        <button type="button" className="btn-admin-primary" onClick={openAddModal}>
          <span>+ Add New Equipment</span>
        </button>
      </div>

      {saveAlert && (
        <div className="admin-alert-success" style={{ marginBottom: '20px' }}>
          ✓ Product changes saved successfully! Frontend updated in real time.
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="admin-filter-tabs">
        <button
          className={`filter-tab ${selectedCat === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCat('all')}
        >
          All Equipment ({allProducts.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={`filter-tab ${selectedCat === c.id ? 'active' : ''}`}
            onClick={() => setSelectedCat(c.id)}
          >
            {c.title} ({c.items?.length || 0})
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="admin-products-grid">
        {filteredProducts.map((p) => (
          <div className="admin-product-card" key={p.slug || p.id}>
            <div className="admin-prod-media">
              {p.img ? (
                <img src={p.img} alt={p.title} />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#071322', color: '#64748b', fontSize: '32px' }}>
                  {p.icon || '🧊'}
                </div>
              )}
              <span className="admin-temp-pill mono">{p.tempTag}</span>
              <span className="admin-model-badge mono">3D: {p.modelType}</span>
            </div>
            <div className="admin-prod-body">
              <div className="admin-prod-cat mono">{p.categoryName}</div>
              <h3>{p.icon} {p.title}</h3>
              <p className="admin-prod-tagline">{p.tagline || p.desc}</p>
              <div className="admin-prod-specs-box mono">
                <div><span>Cap:</span> {p.specs?.capacityRange || p.specs?.processingCapacity || 'Custom'}</div>
                <div><span>Warranty:</span> {p.specs?.warranty || '2 Years'}</div>
              </div>
            </div>
            <div className="admin-prod-footer">
              <Link to={`/products/${p.slug}`} target="_blank" rel="noopener noreferrer" className="btn-table-view mono">
                View 3D ↗
              </Link>
              <button
                type="button"
                className="btn-table-edit mono"
                onClick={() => openEditModal(p)}
              >
                ✏️ Edit
              </button>
              <button
                type="button"
                className="btn-table-delete mono"
                onClick={() => handleDelete(p.slug || p.id, p.title)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>{editingSlug ? `Edit "${form.title || 'Equipment'}"` : 'Add New Equipment Model'}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="admin-modal-form">
              <div className="modal-form-grid">
                {/* Category Selection */}
                <div className="form-field">
                  <label>Equipment Category</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3D Model Visualizer Type */}
                <div className="form-field">
                  <label>Interactive 3D WebGL Model</label>
                  <select
                    value={form.modelType}
                    onChange={(e) => setForm({ ...form, modelType: e.target.value })}
                  >
                    <option value="coldRoom">Cold Storage Room (Modular Chamber)</option>
                    <option value="chillingVat">Bulk Milk Chilling VAT (BMC)</option>
                    <option value="blastChiller">Shock Blast Chiller</option>
                    <option value="walkInFreezer">Walk-in Freezer</option>
                    <option value="dairyPlant">Automated Dairy Plant PHE</option>
                    <option value="roadTanker">Insulated Road Milk Tanker</option>
                    <option value="kitchenEquipment">Commercial Stainless Kitchen</option>
                    <option value="pharmaRoom">Hospital / Pharma Cold Room</option>
                    <option value="displayUnit">Commercial Display Chiller</option>
                  </select>
                </div>

                {/* Title */}
                <div className="form-field span-2">
                  <label>Product Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Inverter Modular Cold Storage Room"
                    required
                  />
                </div>

                {/* Short Title, Icon & Temp Tag */}
                <div className="form-field">
                  <label>Short Title (for navigation tabs)</label>
                  <input
                    type="text"
                    value={form.shortTitle}
                    onChange={(e) => setForm({ ...form, shortTitle: e.target.value })}
                    placeholder="e.g. Cold Room"
                  />
                </div>

                <div className="form-field">
                  <label>Icon Emoji</label>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="e.g. 🧊 or 🥛"
                  />
                </div>

                <div className="form-field span-2">
                  <label>Temperature Tag / Operating Range</label>
                  <input
                    type="text"
                    value={form.tempTag}
                    onChange={(e) => setForm({ ...form, tempTag: e.target.value })}
                    placeholder="e.g. −20°C → +10°C"
                    required
                  />
                </div>

                {/* ============================================================ */}
                {/* PRIMARY PHOTO UPLOADER, URL INPUT & REMOVE / CLEAR BUTTON */}
                {/* ============================================================ */}
                <div className="form-field span-2">
                  <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Primary Product Photo</span>
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
                    <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>📁 📸</span>
                    <strong style={{ color: '#fff', fontSize: '13px' }}>
                      Click to Browse File or Drag &amp; Drop Photo
                    </strong>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      JPG, PNG, WEBP · Auto-compressed for instantaneous rendering
                    </div>
                  </div>

                  <div className="image-input-split">
                    <input
                      type="text"
                      value={form.img}
                      onChange={(e) => setForm({ ...form, img: e.target.value })}
                      placeholder="Or enter image URL: /images/coldroom.jpeg or https://..."
                    />
                  </div>

                  {form.img ? (
                    <div className="image-preview-box" style={{ marginTop: '8px', position: 'relative' }}>
                      <img src={form.img} alt="Live Product Preview" />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <span className="preview-label mono">✓ Active Live Photo</span>
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
                      ℹ️ No photo assigned. Branded fallback card icon will be rendered on the website.
                    </div>
                  )}
                </div>

                {/* ============================================================ */}
                {/* MULTI-PHOTO GALLERY MANAGEMENT */}
                {/* ============================================================ */}
                <div className="form-field span-2" style={{ background: 'rgba(5, 15, 30, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--admin-cyan)' }}>
                    📸 Multi-Photo Gallery &amp; Angle Views ({form.gallery?.length || 0})
                  </label>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>
                    Photos displayed in the high-res gallery tab on the dedicated product specification page.
                  </p>

                  {/* List of existing gallery photos */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                    {form.gallery.map((g, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(0,0,0,0.4)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: g.url === form.img ? '2px solid var(--admin-cyan)' : '1px solid rgba(255,255,255,0.1)',
                          position: 'relative',
                        }}
                      >
                        <img src={g.url} alt={g.caption} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                        <div style={{ padding: '6px', fontSize: '10.5px' }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#e2e8f0' }}>
                            {g.caption || `Photo ${idx + 1}`}
                          </div>
                          <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                            {g.url !== form.img && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryGalleryPhoto(g.url)}
                                style={{ background: 'var(--admin-cyan)', color: '#000', border: 'none', borderRadius: '3px', fontSize: '9px', padding: '2px 4px', cursor: 'pointer' }}
                              >
                                Set Main
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryPhoto(idx)}
                              style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '9px', padding: '2px 4px', cursor: 'pointer', marginLeft: 'auto' }}
                            >
                              ✕ Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Gallery Photo Input */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="Enter photo URL (/images/... or https://...)"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      style={{ flex: 2, minWidth: '200px' }}
                    />
                    <input
                      type="text"
                      placeholder="Photo Caption (e.g. Interior view)"
                      value={newGalleryCaption}
                      onChange={(e) => setNewGalleryCaption(e.target.value)}
                      style={{ flex: 1, minWidth: '140px' }}
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryPhoto}
                      className="btn-admin-secondary mono"
                      style={{ padding: '8px 14px', fontSize: '12px' }}
                    >
                      + Add Photo
                    </button>
                  </div>
                </div>

                {/* Tagline & Description */}
                <div className="form-field span-2">
                  <label>Marketing Tagline</label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    placeholder="Short punchy feature line..."
                  />
                </div>

                <div className="form-field span-2">
                  <label>Full Description</label>
                  <textarea
                    rows={3}
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                    placeholder="Detailed engineering specifications and capabilities..."
                  />
                </div>

                {/* Key Technical Specs */}
                <div className="form-field">
                  <label>Capacity Range</label>
                  <input
                    type="text"
                    value={form.capacityRange}
                    onChange={(e) => setForm({ ...form, capacityRange: e.target.value })}
                    placeholder="e.g. 10 MT to 500 MT"
                  />
                </div>

                <div className="form-field">
                  <label>PUF Panel Insulation</label>
                  <input
                    type="text"
                    value={form.panelThickness}
                    onChange={(e) => setForm({ ...form, panelThickness: e.target.value })}
                    placeholder="e.g. 120mm High Density (42 kg/m³)"
                  />
                </div>

                <div className="form-field">
                  <label>Compressor System</label>
                  <input
                    type="text"
                    value={form.compressorType}
                    onChange={(e) => setForm({ ...form, compressorType: e.target.value })}
                    placeholder="e.g. Bitzer / Copeland Scroll Unit"
                  />
                </div>

                <div className="form-field">
                  <label>Warranty Terms</label>
                  <input
                    type="text"
                    value={form.warranty}
                    onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                    placeholder="e.g. 2 Years on Compressor & Spares"
                  />
                </div>

                {/* Highlights List */}
                <div className="form-field span-2">
                  <label>Key Features &amp; Highlights (1 per line)</label>
                  <textarea
                    rows={4}
                    value={form.highlights}
                    onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                    placeholder="Cam-lock tongue-and-groove jointing&#10;Tropicalized copper condenser&#10;Microprocessor touch panel"
                  />
                </div>

                {/* Applications List */}
                <div className="form-field span-2">
                  <label>Industry Applications (1 per line)</label>
                  <textarea
                    rows={3}
                    value={form.applications}
                    onChange={(e) => setForm({ ...form, applications: e.target.value })}
                    placeholder="Dairy collection centers&#10;Apple cold storage in Mustang&#10;Hospital vaccine storage"
                  />
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-save">
                  {editingSlug ? '✓ Save Changes' : '+ Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
