import React, { useState, useRef } from 'react';
import { useAdminData, optimizeImageFile } from '../context/AdminDataContext.jsx';

const PLATFORM_OPTIONS = [
  'Direct Upload',
  'TikTok',
  'Facebook',
  'Instagram',
  'YouTube Shorts',
];

const CATEGORY_OPTIONS = [
  'Cold Storage',
  'Dairy Processing',
  'Blast Freezers',
  'Transport Refrigeration',
  'Turnkey Dairy Plants',
  'Factory Testing',
];

export default function AdminVideos() {
  const { data, addVideo, updateVideo, deleteVideo } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saveAlert, setSaveAlert] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const videoFileInputRef = useRef(null);
  const posterFileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Cold Storage',
    platform: 'Direct Upload',
    ratio: '9:16',
    videoUrl: '',
    posterUrl: '',
    tag: 'SITE REEL',
    tagColor: '#35d6ff',
    duration: '0:45',
    desc: '',
    waMsg: '',
  });

  const videos = data?.videos || [];

  const filteredVideos =
    selectedFilter === 'All'
      ? videos
      : videos.filter(
          (v) =>
            v.category === selectedFilter ||
            v.platform === selectedFilter
        );

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      title: '',
      category: 'Cold Storage',
      platform: 'Direct Upload',
      ratio: '9:16',
      videoUrl: '/videos/0821_1.mp4',
      posterUrl: '/images/coldroom.jpeg',
      tag: 'SITE REEL',
      tagColor: '#35d6ff',
      duration: '0:45',
      desc: 'Live site installation of modular cold storage chamber with dual scroll condensing units.',
      waMsg: 'Hi Kathmandu Chilling, I am inquiring about this video reel and would like quotation.',
    });
    setModalOpen(true);
  };

  const openEditModal = (vid) => {
    setEditingId(vid.id);
    setForm({
      title: vid.title || '',
      category: vid.category || 'Cold Storage',
      platform: vid.platform || 'Direct Upload',
      ratio: vid.ratio || '9:16',
      videoUrl: vid.videoUrl || '',
      posterUrl: vid.posterUrl || '',
      tag: vid.tag || 'SITE REEL',
      tagColor: vid.tagColor || '#35d6ff',
      duration: vid.duration || '0:45',
      desc: vid.desc || '',
      waMsg: vid.waMsg || '',
    });
    setModalOpen(true);
  };

  // Video File Upload Handler
  const handleVideoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local blob URL or read as base64
      const url = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, videoUrl: url }));
    }
  };

  // Poster File Upload Handler
  const handlePosterFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimized = await optimizeImageFile(file);
        setForm((prev) => ({ ...prev, posterUrl: optimized }));
      } catch (err) {
        console.error('Poster upload failed:', err);
      }
    }
  };

  // Clear / Remove Video
  const handleClearVideo = () => {
    setForm((prev) => ({ ...prev, videoUrl: '' }));
  };

  // Clear / Remove Poster
  const handleClearPoster = () => {
    setForm((prev) => ({ ...prev, posterUrl: '' }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      category: form.category,
      platform: form.platform,
      ratio: form.ratio,
      videoUrl: form.videoUrl,
      posterUrl: form.posterUrl,
      tag: form.tag,
      tagColor: form.tagColor,
      duration: form.duration,
      desc: form.desc,
      waMsg: form.waMsg,
    };

    if (editingId) {
      updateVideo(editingId, payload);
    } else {
      addVideo(payload);
    }

    setModalOpen(false);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete video reel "${title}"?`)) {
      deleteVideo(id);
      setSaveAlert(true);
      setTimeout(() => setSaveAlert(false), 3000);
    }
  };

  return (
    <div className="admin-page-content">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumbs mono">VIDEOS · 9:16 VERTICAL SHORTS &amp; REELS</div>
          <h1>Video Reels &amp; Project Shorts Manager</h1>
          <p>Upload direct MP4 site videos, TikTok, Facebook Shorts, and live factory testing reels displayed on the website.</p>
        </div>
        <button type="button" className="btn-admin-primary" onClick={openAddModal}>
          <span>+ Upload / Add New Video Reel</span>
        </button>
      </div>

      {saveAlert && (
        <div className="admin-alert-success" style={{ marginBottom: '20px' }}>
          ✓ Video reel saved successfully! Frontend updated in real time.
        </div>
      )}

      {/* Filter Tabs */}
      <div className="admin-filter-tabs" style={{ marginBottom: '20px' }}>
        <button
          className={`filter-tab ${selectedFilter === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('All')}
        >
          All Videos ({videos.length})
        </button>
        {CATEGORY_OPTIONS.map((cat) => (
          <button
            key={cat}
            className={`filter-tab ${selectedFilter === cat ? 'active' : ''}`}
            onClick={() => setSelectedFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      <div className="admin-videos-grid">
        {filteredVideos.map((vid) => (
          <div className="admin-video-card" key={vid.id}>
            <div className="admin-video-media-916">
              {vid.videoUrl ? (
                <video
                  src={vid.videoUrl}
                  poster={vid.posterUrl}
                  controls
                  muted
                  playsInline
                />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#071322', color: '#64748b', fontSize: '32px' }}>
                  📹
                </div>
              )}
              <span className="admin-temp-pill mono" style={{ top: '10px', left: '10px' }}>
                {vid.platform}
              </span>
              <span className="admin-model-badge mono" style={{ top: '10px', right: '10px' }}>
                {vid.ratio || '9:16'}
              </span>
            </div>

            <div className="admin-video-body">
              <div className="admin-prod-cat mono" style={{ color: vid.tagColor || 'var(--admin-cyan)' }}>
                {vid.category} · {vid.tag}
              </div>
              <h3>{vid.title}</h3>
              <p className="admin-video-desc">{vid.desc}</p>
              <div className="admin-video-meta mono">
                <span>⏱ {vid.duration || '0:45'}</span>
                <span>👀 {vid.views || '1.5K'}</span>
              </div>
            </div>

            <div className="admin-prod-footer">
              <button
                type="button"
                className="btn-table-edit mono"
                onClick={() => openEditModal(vid)}
              >
                ✏️ Edit Video
              </button>
              <button
                type="button"
                className="btn-table-delete mono"
                onClick={() => handleDelete(vid.id, vid.title)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Video Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>{editingId ? 'Edit Video Reel' : 'Upload & Add New 9:16 Video Reel'}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="admin-modal-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                {/* Left Form Inputs */}
                <div className="modal-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-field">
                    <label>Video Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. 50 MT Cold Room Modular Installation"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-field">
                      <label>Industry Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        required
                      >
                        {CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-field">
                      <label>Platform Source</label>
                      <select
                        value={form.platform}
                        onChange={(e) => setForm({ ...form, platform: e.target.value })}
                        required
                      >
                        {PLATFORM_OPTIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-field">
                      <label>Aspect Ratio</label>
                      <select
                        value={form.ratio}
                        onChange={(e) => setForm({ ...form, ratio: e.target.value })}
                      >
                        <option value="9:16">9:16 Vertical Reel (TikTok / Shorts)</option>
                        <option value="16:9">16:9 Widescreen Video</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label>Duration (e.g. 0:45)</label>
                      <input
                        type="text"
                        value={form.duration}
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        placeholder="0:45"
                      />
                    </div>
                  </div>

                  {/* Video File / URL Input */}
                  <div className="form-field">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ margin: 0 }}>Video Source (MP4 / WebM / Embed URL)</label>
                      {form.videoUrl && (
                        <button
                          type="button"
                          onClick={handleClearVideo}
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
                          ✕ Remove Video
                        </button>
                      )}
                    </div>

                    {/* File Upload Box */}
                    <div
                      onClick={() => videoFileInputRef.current?.click()}
                      style={{
                        border: '2px dashed var(--admin-cyan)',
                        borderRadius: '10px',
                        padding: '14px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'rgba(53, 214, 255, 0.04)',
                        marginBottom: '8px',
                      }}
                    >
                      <input
                        type="file"
                        ref={videoFileInputRef}
                        onChange={handleVideoFileUpload}
                        accept="video/mp4,video/webm,video/ogg"
                        style={{ display: 'none' }}
                      />
                      <span style={{ fontSize: '22px', display: 'block', marginBottom: '2px' }}>📁 📹</span>
                      <strong style={{ color: '#fff', fontSize: '13px' }}>
                        Browse Device to Upload MP4 Video
                      </strong>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        Supports 9:16 Vertical &amp; 16:9 Video Files
                      </div>
                    </div>

                    <input
                      type="text"
                      value={form.videoUrl}
                      onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                      placeholder="Or enter path: /videos/0821.mp4 or video URL..."
                    />
                  </div>

                  {/* Poster Thumbnail Upload */}
                  <div className="form-field">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ margin: 0 }}>Custom Poster / Thumbnail Image</label>
                      {form.posterUrl && (
                        <button
                          type="button"
                          onClick={handleClearPoster}
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
                          ✕ Remove Poster
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={form.posterUrl}
                        onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
                        placeholder="/images/coldroom.jpeg or https://..."
                        style={{ flex: 1 }}
                      />
                      <input
                        type="file"
                        ref={posterFileInputRef}
                        onChange={handlePosterFileUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => posterFileInputRef.current?.click()}
                        className="btn-admin-secondary mono"
                        style={{ fontSize: '11px', padding: '6px 12px' }}
                      >
                        📁 Upload
                      </button>
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Video Caption &amp; Description</label>
                    <textarea
                      rows={3}
                      value={form.desc}
                      onChange={(e) => setForm({ ...form, desc: e.target.value })}
                      placeholder="Detailed engineering scope shown in the video..."
                    />
                  </div>

                  <div className="form-field">
                    <label>Custom WhatsApp Inquiry Message</label>
                    <input
                      type="text"
                      value={form.waMsg}
                      onChange={(e) => setForm({ ...form, waMsg: e.target.value })}
                      placeholder="Hi Kathmandu Chilling, I am inquiring about this video..."
                    />
                  </div>
                </div>

                {/* Right Column: Live 9:16 Video Phone Preview */}
                <div>
                  <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="mono" style={{ color: 'var(--admin-cyan)', fontSize: '11px', letterSpacing: '0.08em' }}>
                      ⚡ LIVE 9:16 VERTICAL REEL PREVIEW
                    </span>
                  </div>

                  <div
                    style={{
                      background: '#040810',
                      border: '2px solid rgba(53, 214, 255, 0.4)',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      aspectRatio: '9/16',
                      maxHeight: '480px',
                      margin: '0 auto',
                      position: 'relative',
                      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(53, 214, 255, 0.2)',
                    }}
                  >
                    {form.videoUrl ? (
                      <video
                        src={form.videoUrl}
                        poster={form.posterUrl}
                        controls
                        muted
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', padding: '20px', textAlign: 'center' }}>
                        <span style={{ fontSize: '36px', marginBottom: '8px' }}>📹</span>
                        <span>No Video Selected</span>
                        <span style={{ fontSize: '11px', marginTop: '4px' }}>Upload an MP4 or enter a video URL</span>
                      </div>
                    )}

                    <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '14px', background: 'linear-gradient(transparent, rgba(0,0,0,0.95))', pointerEvents: 'none' }}>
                      <div className="mono" style={{ color: 'var(--admin-cyan)', fontSize: '10px', marginBottom: '2px' }}>
                        {form.category?.toUpperCase()} · {form.platform}
                      </div>
                      <div style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold', lineHeight: '1.3' }}>
                        {form.title || 'Video Title Preview'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="btn-modal-cancel" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-save">
                  {editingId ? '✓ Save Video Changes' : '+ Publish Video Reel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
