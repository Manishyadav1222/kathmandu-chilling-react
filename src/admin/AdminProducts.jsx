import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext.jsx';

export default function AdminProducts() {
  const { data, addProduct, updateProduct, deleteProduct } = useAdminData();
  const [selectedCat, setSelectedCat] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);

  // Form State
  const [form, setForm] = useState({
    categoryId: 'cold',
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
  });

  const categories = data.categories;

  const allProducts = categories.flatMap((c) =>
    c.items.map((item) => ({ ...item, categoryId: c.id, categoryName: c.title }))
  );

  const filteredProducts =
    selectedCat === 'all'
      ? allProducts
      : allProducts.filter((p) => p.categoryId === selectedCat);

  const openAddModal = () => {
    setEditingSlug(null);
    setForm({
      categoryId: categories[0]?.id || 'cold',
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
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingSlug(product.slug);
    setForm({
      categoryId: product.categoryId,
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
      highlights: Array.isArray(product.highlights) ? product.highlights.join('\n') : '',
      applications: Array.isArray(product.applications) ? product.applications.join('\n') : '',
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
    const productPayload = {
      title: form.title,
      shortTitle: form.shortTitle || form.title,
      tempTag: form.tempTag,
      tagline: form.tagline,
      desc: form.desc,
      img: form.img || '/images/coldroom.jpeg',
      modelType: form.modelType,
      specs: {
        tempRange: form.tempRange,
        capacityRange: form.capacityRange,
        panelThickness: form.panelThickness,
        compressorType: form.compressorType,
        warranty: form.warranty,
      },
      highlights: form.highlights.split('\n').filter((s) => s.trim().length > 0),
      applications: form.applications.split('\n').filter((s) => s.trim().length > 0),
      gallery: [{ url: form.img, caption: form.title }],
    };

    if (editingSlug) {
      updateProduct(editingSlug, productPayload);
    } else {
      addProduct(form.categoryId, productPayload);
    }
    setModalOpen(false);
  };

  const handleDelete = (slug, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      deleteProduct(slug);
    }
  };

  return (
    <div className="admin-page-content">
      {/* Header Row */}
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumbs mono">MANAGEMENT · EQUIPMENT CATALOG</div>
          <h1>Products &amp; Machinery Manager</h1>
          <p>Create, update, and manage industrial refrigeration lines, 3D models, and technical specs.</p>
        </div>
        <button type="button" className="btn-admin-primary" onClick={openAddModal}>
          <span>+ Add New Equipment</span>
        </button>
      </div>

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
            {c.title} ({c.items.length})
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="admin-products-grid">
        {filteredProducts.map((p) => (
          <div className="admin-product-card" key={p.slug}>
            <div className="admin-prod-media">
              <img src={p.img} alt={p.title} />
              <span className="admin-temp-pill mono">{p.tempTag}</span>
              <span className="admin-model-badge mono">3D: {p.modelType}</span>
            </div>
            <div className="admin-prod-body">
              <div className="admin-prod-cat mono">{p.categoryName}</div>
              <h3>{p.title}</h3>
              <p className="admin-prod-tagline">{p.tagline}</p>
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
                onClick={() => handleDelete(p.slug, p.title)}
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
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>{editingSlug ? 'Edit Equipment Model' : 'Add New Equipment Model'}</h3>
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

                {/* Short Title & Temp Tag */}
                <div className="form-field">
                  <label>Short Title (for navigation)</label>
                  <input
                    type="text"
                    value={form.shortTitle}
                    onChange={(e) => setForm({ ...form, shortTitle: e.target.value })}
                    placeholder="e.g. Cold Room"
                  />
                </div>

                <div className="form-field">
                  <label>Temperature Tag / Range</label>
                  <input
                    type="text"
                    value={form.tempTag}
                    onChange={(e) => setForm({ ...form, tempTag: e.target.value })}
                    placeholder="e.g. −20°C → +10°C"
                    required
                  />
                </div>

                {/* Image Upload & URL */}
                <div className="form-field span-2">
                  <label>Product Image (Upload File or Enter URL)</label>
                  <div className="image-input-split">
                    <input
                      type="text"
                      value={form.img}
                      onChange={(e) => setForm({ ...form, img: e.target.value })}
                      placeholder="/images/coldroom.jpeg or https://..."
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
                      <span className="preview-label mono">Live Image Preview</span>
                    </div>
                  )}
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
                  {editingSlug ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
