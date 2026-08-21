import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext.jsx';

export default function AdminBlogs() {
  const { data, addBlog, updateBlog, deleteBlog } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Engineering & Technology',
    readTime: '6 min read',
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
    setForm({
      title: blog.title || '',
      category: blog.category || 'Engineering Guide',
      readTime: blog.readTime || '5 min read',
      author: blog.author || 'KCR Engineering Team',
      img: blog.img || '',
      excerpt: blog.excerpt || '',
      metaDesc: blog.metaDesc || '',
      content: typeof blog.content === 'string' ? blog.content : '',
      status: blog.status || 'Published',
      keyTakeaways: Array.isArray(blog.keyTakeaways) ? blog.keyTakeaways.join('\n') : '',
      faqQ1: blog.faqs?.[0]?.q || '',
      faqA1: blog.faqs?.[0]?.a || '',
      faqQ2: blog.faqs?.[1]?.q || '',
      faqA2: blog.faqs?.[1]?.a || '',
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
    const faqs = [];
    if (form.faqQ1 && form.faqA1) faqs.push({ q: form.faqQ1, a: form.faqA1 });
    if (form.faqQ2 && form.faqA2) faqs.push({ q: form.faqQ2, a: form.faqA2 });

    const payload = {
      title: form.title,
      category: form.category,
      readTime: form.readTime,
      author: form.author,
      img: form.img || '/images/blog/cold-room-sizing.jpg',
      excerpt: form.excerpt,
      metaDesc: form.metaDesc,
      content: form.content,
      status: form.status,
      keyTakeaways: form.keyTakeaways.split('\n').filter((s) => s.trim().length > 0),
      faqs,
    };

    if (editingId) {
      updateBlog(editingId, payload);
    } else {
      addBlog(payload);
    }
    setModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete article "${title}"?`)) {
      deleteBlog(id);
    }
  };

  return (
    <div className="admin-page-content">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumbs mono">CONTENT · SEO &amp; ARTICLES</div>
          <h1>Blog &amp; Technical Articles Publisher</h1>
          <p>Publish AI-optimized guides, Schema.org FAQs, and cold-chain engineering insights.</p>
        </div>
        <button type="button" className="btn-admin-primary" onClick={openAddModal}>
          <span>+ Create New Article</span>
        </button>
      </div>

      {/* Blogs Table */}
      <div className="admin-panel-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Category</th>
                <th>Status</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.blogs.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="blog-row-cell">
                      {b.img && (
                        <div className="blog-mini-thumb">
                          <img src={b.img} alt={b.title} />
                        </div>
                      )}
                      <div>
                        <strong>{b.title}</strong>
                        <div className="td-sub">{b.excerpt?.slice(0, 75)}...</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="cat-badge mono">{b.category}</span>
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
                        onClick={() => handleDelete(b.id, b.title)}
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

                {/* Cover Image */}
                <div className="form-field span-2">
                  <label>Cover Photograph (Upload File or Enter URL)</label>
                  <div className="image-input-split">
                    <input
                      type="text"
                      value={form.img}
                      onChange={(e) => setForm({ ...form, img: e.target.value })}
                      placeholder="/images/blog/cold-room-sizing.jpg"
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
                  {editingId ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
