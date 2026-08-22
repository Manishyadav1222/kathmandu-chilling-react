import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAdminData, optimizeImageFile } from '../context/AdminDataContext.jsx';

export default function AdminBlogs() {
  const { data, addBlog, updateBlog, deleteBlog } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saveAlert, setSaveAlert] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Engineering & Technology',
    readTime: '5 min read',
    author: 'KCR Engineering Team',
    img: '',
    excerpt: '',
    metaDesc: '',
    content: '',
    status: 'Published',
    keyTakeaways: '',
    faqQ1: '',
    faqA1: '',
    faqQ2: '',
    faqA2: '',
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      title: '',
      category: 'Cold Storage Guide',
      readTime: '5 min read',
      author: 'Kathmandu Chilling Technical Division',
      img: '/images/blog/cold-room-sizing.jpg',
      excerpt: 'Comprehensive engineering guide to calculating heat loads, PUF thickness, and compressor HP in Nepal.',
      metaDesc: 'Learn how to size a commercial cold room in Nepal with high-efficiency PUF panels and inverter compressors.',
      content: '## Executive Overview\n\nProper refrigeration sizing is critical to prevent product spoilage and excessive electricity bills.\n\n### 1. PUF Panel Selection\nHigh-density 42 kg/m³ polyurethane foam ensures zero thermal leakage in Nepal\'s Terai summers.\n\n### 2. Compressor Horsepower Rules of Thumb\nFor a 50 MT potato room at 2°C–4°C, allocate approximately 7.5 HP to 10 HP high-COP condensing units.',
      status: 'Published',
      keyTakeaways: '120mm PUF panels reduce heat gain by 35%\nInverter scroll units save up to NPR 18,000 monthly\nDual temperature sensors prevent freezing shock',
      faqQ1: 'What is the standard PUF panel thickness for Nepal cold rooms?',
      faqA1: 'We recommend 100mm for positive chillers (+2°C to +8°C) and 120mm–150mm for freezers (-18°C to -25°C).',
      faqQ2: 'How long does a modular cold room take to assemble?',
      faqA2: 'A standard 50 MT cold room can be assembled on-site in 4 to 6 business days with our cam-lock panels.',
    });
    setModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingId(blog.id);
    const blogImg = blog.image || blog.img || '';
    const readTimeStr = blog.readTime || (typeof blog.readingTime === 'number' ? `${blog.readingTime} min read` : blog.readingTime) || '5 min read';
    const tagCat = blog.category || (Array.isArray(blog.tags) ? blog.tags[0] : 'Engineering Guide');
    const takeaways = Array.isArray(blog.keyTakeaways)
      ? blog.keyTakeaways.join('\n')
      : blog.aiSummary?.keyTakeaway || '';

    // If blog has sections, reconstruct markdown content
    let contentBody = '';
    if (typeof blog.content === 'string' && blog.content.length > 0) {
      contentBody = blog.content;
    } else if (Array.isArray(blog.sections)) {
      contentBody = blog.sections
        .map((s) => `## ${s.heading || ''}\n\n${(s.paragraphs || []).join('\n\n')}`)
        .join('\n\n');
    }

    setForm({
      title: blog.title || '',
      category: tagCat,
      readTime: readTimeStr,
      author: blog.author || 'KCR Engineering Team',
      img: blogImg,
      excerpt: blog.excerpt || '',
      metaDesc: blog.metaDesc || blog.metaDescription || '',
      content: contentBody,
      status: blog.status || 'Published',
      keyTakeaways: takeaways,
      faqQ1: blog.faqs?.[0]?.q || '',
      faqA1: blog.faqs?.[0]?.a || '',
      faqQ2: blog.faqs?.[1]?.q || '',
      faqA2: blog.faqs?.[1]?.a || '',
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
        console.error('Blog image upload failed:', err);
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
        console.error('Blog image drop failed:', err);
      }
    }
  };

  // Remove / Clear Photo
  const handleClearPhoto = () => {
    setForm((prev) => ({ ...prev, img: '' }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const faqs = [];
    if (form.faqQ1 && form.faqA1) faqs.push({ q: form.faqQ1, a: form.faqA1 });
    if (form.faqQ2 && form.faqA2) faqs.push({ q: form.faqQ2, a: form.faqA2 });

    const cleanTakeaways = form.keyTakeaways
      ? form.keyTakeaways.split('\n').map((s) => s.trim()).filter((s) => s.length > 0)
      : [];

    const numReadingTime = parseInt(form.readTime, 10) || 5;

    // Parse sections from content
    const rawParagraphs = form.content.split('\n\n').map((p) => p.trim()).filter(Boolean);
    const sections = [
      {
        heading: 'Technical Analysis & Guide',
        paragraphs: rawParagraphs.length > 0 ? rawParagraphs : [form.excerpt],
      },
    ];

    const payload = {
      title: form.title,
      category: form.category,
      tags: [form.category],
      readTime: form.readTime,
      readingTime: numReadingTime,
      author: form.author,
      img: form.img,
      image: form.img,
      imageAlt: form.title,
      excerpt: form.excerpt,
      metaDesc: form.metaDesc,
      metaDescription: form.metaDesc,
      metaTitle: `${form.title} | Kathmandu Chilling Engineering Blog`,
      content: form.content,
      sections,
      status: form.status,
      keyTakeaways: cleanTakeaways,
      aiSummary: {
        keyTakeaway: cleanTakeaways[0] || form.excerpt,
        quickFacts: [],
      },
      faqs,
    };

    if (editingId) {
      updateBlog(editingId, payload);
    } else {
      addBlog(payload);
    }

    setModalOpen(false);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete article "${title}"?`)) {
      deleteBlog(id);
      setSaveAlert(true);
      setTimeout(() => setSaveAlert(false), 3000);
    }
  };

  return (
    <div className="admin-page-content">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumbs mono">CONTENT · SEO &amp; ARTICLES</div>
          <h1>Blog &amp; Technical Articles Publisher</h1>
          <p>Publish AI-optimized guides, cover photographs, Schema.org FAQs, and cold-chain engineering insights.</p>
        </div>
        <button type="button" className="btn-admin-primary" onClick={openAddModal}>
          <span>+ Create New Article</span>
        </button>
      </div>

      {saveAlert && (
        <div className="admin-alert-success" style={{ marginBottom: '20px' }}>
          ✓ Article saved successfully! Changes published in real time.
        </div>
      )}

      {/* Blogs Table */}
      <div className="admin-panel-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Article &amp; Cover</th>
                <th>Category</th>
                <th>Status</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data?.blogs || []).map((b) => (
                <tr key={b.id || b.slug}>
                  <td>
                    <div className="blog-row-cell">
                      {b.image || b.img ? (
                        <div className="blog-mini-thumb">
                          <img src={b.image || b.img} alt={b.title} />
                        </div>
                      ) : (
                        <div className="blog-mini-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a192f', color: '#64748b' }}>
                          📖
                        </div>
                      )}
                      <div>
                        <strong>{b.title}</strong>
                        <div className="td-sub">{b.excerpt?.slice(0, 75)}...</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="cat-badge mono">{b.category || (Array.isArray(b.tags) ? b.tags[0] : 'Guide')}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${b.status === 'Published' ? 'green' : 'gray'} mono`}>
                      {b.status || 'Published'}
                    </span>
                  </td>
                  <td className="mono">{b.author || 'KCR Team'}</td>
                  <td className="mono">{b.date}</td>
                  <td>
                    <div className="table-btn-group">
                      <Link to={`/blog/${b.slug}`} target="_blank" rel="noopener noreferrer" className="btn-table-view mono">
                        Preview ↗
                      </Link>
                      <button
                        type="button"
                        className="btn-table-edit mono"
                        onClick={() => openEditModal(b)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="btn-table-delete mono"
                        onClick={() => handleDelete(b.id || b.slug, b.title)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Blog Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>{editingId ? 'Edit Engineering Article' : 'Create New Engineering Article'}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="admin-modal-form">
              <div className="modal-form-grid">
                <div className="form-field span-2">
                  <label>Article Title (H1)</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Complete Cold Room Sizing Guide for Commercial Storage in Nepal"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Engineering Guide / Dairy Processing"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Estimated Read Time</label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                  />
                </div>

                <div className="form-field">
                  <label>Author</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder="e.g. Kathmandu Chilling Technical Division"
                  />
                </div>

                <div className="form-field">
                  <label>Publishing Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                {/* ============================================================ */}
                {/* ARTICLE COVER PHOTOGRAPH CONTROLS */}
                {/* ============================================================ */}
                <div className="form-field span-2">
                  <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Cover Photograph</span>
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
                        ✕ Remove Cover Photo
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
                      Click to Browse File or Drag &amp; Drop Article Cover
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
                      placeholder="Or enter image URL: /images/blog/... or https://..."
                    />
                  </div>

                  {form.img ? (
                    <div className="image-preview-box" style={{ marginTop: '8px' }}>
                      <img src={form.img} alt="Article Preview" />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <span className="preview-label mono">✓ Active Cover Photo</span>
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
                      ℹ️ No cover photo assigned. Article will render standard guide icon.
                    </div>
                  )}
                </div>

                <div className="form-field span-2">
                  <label>Article Excerpt &amp; Search Summary</label>
                  <textarea
                    rows={2}
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="Brief 2-sentence summary displayed on cards..."
                    required
                  />
                </div>

                <div className="form-field span-2">
                  <label>SEO Meta Description (Google Search Snippet)</label>
                  <input
                    type="text"
                    value={form.metaDesc}
                    onChange={(e) => setForm({ ...form, metaDesc: e.target.value })}
                    placeholder="Target keywords for Nepali cold chain search engine rankings..."
                  />
                </div>

                {/* Markdown Content */}
                <div className="form-field span-2">
                  <label>Full Article Body (Markdown Supported)</label>
                  <textarea
                    rows={8}
                    className="code-textarea mono"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="## Introduction&#10;&#10;Write article content in Markdown format..."
                    required
                  />
                </div>

                {/* Key Takeaways */}
                <div className="form-field span-2">
                  <label>AI Key Takeaways (1 per line)</label>
                  <textarea
                    rows={3}
                    value={form.keyTakeaways}
                    onChange={(e) => setForm({ ...form, keyTakeaways: e.target.value })}
                    placeholder="High-density PUF panels prevent heat gain&#10;Inverter scroll units save electricity..."
                  />
                </div>

                {/* Schema.org FAQ 1 */}
                <div className="form-field">
                  <label>Schema FAQ Question 1</label>
                  <input
                    type="text"
                    value={form.faqQ1}
                    onChange={(e) => setForm({ ...form, faqQ1: e.target.value })}
                    placeholder="Question 1..."
                  />
                </div>

                <div className="form-field">
                  <label>Schema FAQ Answer 1</label>
                  <input
                    type="text"
                    value={form.faqA1}
                    onChange={(e) => setForm({ ...form, faqA1: e.target.value })}
                    placeholder="Answer 1..."
                  />
                </div>

                {/* Schema.org FAQ 2 */}
                <div className="form-field">
                  <label>Schema FAQ Question 2</label>
                  <input
                    type="text"
                    value={form.faqQ2}
                    onChange={(e) => setForm({ ...form, faqQ2: e.target.value })}
                    placeholder="Question 2..."
                  />
                </div>

                <div className="form-field">
                  <label>Schema FAQ Answer 2</label>
                  <input
                    type="text"
                    value={form.faqA2}
                    onChange={(e) => setForm({ ...form, faqA2: e.target.value })}
                    placeholder="Answer 2..."
                  />
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-save">
                  {editingId ? '✓ Update Article' : '+ Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
