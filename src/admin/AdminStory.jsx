import React, { useState, useRef } from 'react';
import { useAdminData, optimizeImageFile } from '../context/AdminDataContext.jsx';

// Preset Avatars for Quick Setup
const PRESET_AVATARS = [
  { label: 'Executive Male', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80' },
  { label: 'Female Engineer', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80' },
  { label: 'Lead Specialist', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fabrication Master', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
  { label: 'Field Engineer', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' },
];

const EMOJI_PALETTE = ['☀️', '📡', '🤝', '🚀', '❄️', '🏭', '⚡', '🏔️', '🥛', '🏆', '🛠️', '🌱'];

export default function AdminStory() {
  const {
    data,
    updateCompanyStory,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
  } = useAdminData();

  const story = data?.story || {};
  const team = data?.team || [];

  const [activeTab, setActiveTab] = useState('team'); // Default to 'team' for fast photo management
  const [saveAlert, setSaveAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');

  const fileInputRef = useRef(null);

  // Story Form State
  const [storyForm, setStoryForm] = useState({
    headline: story.headline || '',
    tagline: story.tagline || '',
    mission: story.mission || '',
    vision: story.vision || '',
    nationBuilding: story.nationBuilding || '',
    smallBusinessImpact: story.smallBusinessImpact || '',
    statYears: story.statYears || '14+',
    statProjects: story.statProjects || '450+',
    statProvinces: story.statProvinces || '7 / 7',
    statJobs: story.statJobs || '85+ Engineers & Fabricators',
  });

  // Team Modal State
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [imageUploadMode, setImageUploadMode] = useState('file'); // 'file' | 'url' | 'preset'
  const [memberForm, setMemberForm] = useState({
    name: '',
    role: '',
    department: 'Engineering & R&D',
    experience: '10+ Years Experience',
    bio: '',
    image: '',
    specialization: '',
  });

  // Milestone Modal State
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [editingMilestoneIdx, setEditingMilestoneIdx] = useState(null);
  const [milestoneForm, setMilestoneForm] = useState({
    year: '2026',
    title: '',
    desc: '',
  });

  // Future Plan Modal State
  const [futureModalOpen, setFutureModalOpen] = useState(false);
  const [editingFutureIdx, setEditingFutureIdx] = useState(null);
  const [futureForm, setFutureForm] = useState({
    icon: '☀️',
    title: '',
    desc: '',
  });

  // File Upload with Optimization
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimized = await optimizeImageFile(file);
      setMemberForm((prev) => ({
        ...prev,
        image: optimized,
      }));
    } catch (err) {
      console.error('File optimization failed:', err);
    }
  };

  // Drag and drop photo upload
  const handleDropPhoto = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const optimized = await optimizeImageFile(file);
        setMemberForm((prev) => ({
          ...prev,
          image: optimized,
        }));
      } catch (err) {
        console.error('Drop optimization failed:', err);
      }
    }
  };

  // Clear / Remove Team Photo
  const handleClearMemberPhoto = () => {
    setMemberForm((prev) => ({ ...prev, image: '' }));
  };

  // Save Main Story Changes
  const handleSaveStory = (e) => {
    e.preventDefault();
    updateCompanyStory(storyForm);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3500);
  };

  // Team CRUD
  const openAddMember = () => {
    setEditingMemberId(null);
    setImageUploadMode('file');
    setMemberForm({
      name: '',
      role: '',
      department: 'Engineering & R&D',
      experience: '8+ Years Experience',
      bio: 'Thermal engineering and project fabrication specialist at Kathmandu Chilling.',
      image: PRESET_AVATARS[0].url,
      specialization: 'Modular Cold Storage & Inverter Systems',
    });
    setTeamModalOpen(true);
  };

  const openEditMember = (m) => {
    setEditingMemberId(m.id);
    setImageUploadMode('file');
    setMemberForm({
      name: m.name || '',
      role: m.role || '',
      department: m.department || 'Engineering & R&D',
      experience: m.experience || '',
      bio: m.bio || '',
      image: m.image || '',
      specialization: m.specialization || '',
    });
    setTeamModalOpen(true);
  };

  const handleSaveMember = (e) => {
    e.preventDefault();
    const payload = {
      ...memberForm,
      image: memberForm.image || PRESET_AVATARS[0].url,
    };
    if (editingMemberId) {
      updateTeamMember(editingMemberId, payload);
    } else {
      addTeamMember(payload);
    }
    setTeamModalOpen(false);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  // Milestones CRUD
  const openAddMilestone = () => {
    setEditingMilestoneIdx(null);
    setMilestoneForm({
      year: '2026',
      title: '',
      desc: '',
    });
    setMilestoneModalOpen(true);
  };

  const openEditMilestone = (m, idx) => {
    setEditingMilestoneIdx(idx);
    setMilestoneForm({
      year: m.year || '2026',
      title: m.title || '',
      desc: m.desc || '',
    });
    setMilestoneModalOpen(true);
  };

  const handleSaveMilestone = (e) => {
    e.preventDefault();
    const currentMilestones = [...(story.milestones || [])];
    if (editingMilestoneIdx !== null) {
      currentMilestones[editingMilestoneIdx] = milestoneForm;
    } else {
      currentMilestones.push(milestoneForm);
    }
    updateCompanyStory({ milestones: currentMilestones });
    setMilestoneModalOpen(false);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  const handleDeleteMilestone = (idx) => {
    if (window.confirm('Delete this company evolution milestone?')) {
      const currentMilestones = (story.milestones || []).filter((_, i) => i !== idx);
      updateCompanyStory({ milestones: currentMilestones });
    }
  };

  // Future Plans CRUD
  const openAddFuture = () => {
    setEditingFutureIdx(null);
    setFutureForm({
      icon: '🚀',
      title: '',
      desc: '',
    });
    setFutureModalOpen(true);
  };

  const openEditFuture = (p, idx) => {
    setEditingFutureIdx(idx);
    setFutureForm({
      icon: p.icon || '☀️',
      title: p.title || '',
      desc: p.desc || '',
    });
    setFutureModalOpen(true);
  };

  const handleSaveFuture = (e) => {
    e.preventDefault();
    const currentPlans = [...(story.futurePlans || [])];
    if (editingFutureIdx !== null) {
      currentPlans[editingFutureIdx] = futureForm;
    } else {
      currentPlans.push(futureForm);
    }
    updateCompanyStory({ futurePlans: currentPlans });
    setFutureModalOpen(false);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  const handleDeleteFuture = (idx) => {
    if (window.confirm('Delete this vision roadmap plan?')) {
      const currentPlans = (story.futurePlans || []).filter((_, i) => i !== idx);
      updateCompanyStory({ futurePlans: currentPlans });
    }
  };

  // Filtered team list
  const filteredTeam = team.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDeptFilter === 'ALL' || m.department === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="admin-page">
      {/* Header Bar */}
      <div className="admin-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="live-pulse"></span>
            <span className="mono" style={{ color: 'var(--admin-cyan)', fontSize: '11px', letterSpacing: '0.1em' }}>
              STORY, MISSION &amp; TEAM STUDIO
            </span>
          </div>
          <h2>Our Team, Mission &amp; Company Evolution</h2>
          <p className="admin-subtext">
            Upload team photos, customize company evolution chronology, national mission, and small business support programs.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-admin-secondary mono"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            ↗ View Public /about Page
          </a>
        </div>
      </div>

      {saveAlert && (
        <div className="admin-alert-success" style={{ marginBottom: '20px' }}>
          ✓ Changes saved successfully! Public `/about` page updated in real time.
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="admin-tab-bar">
        <button
          className={`tab-item mono ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          👥 Engineering Team Profiles ({team.length})
        </button>
        <button
          className={`tab-item mono ${activeTab === 'mission' ? 'active' : ''}`}
          onClick={() => setActiveTab('mission')}
        >
          🎯 Mission, Vision &amp; Nation Building
        </button>
        <button
          className={`tab-item mono ${activeTab === 'milestones' ? 'active' : ''}`}
          onClick={() => setActiveTab('milestones')}
        >
          ⏳ Evolution Timeline ({story.milestones?.length || 0})
        </button>
        <button
          className={`tab-item mono ${activeTab === 'future' ? 'active' : ''}`}
          onClick={() => setActiveTab('future')}
        >
          🚀 Vision 2030 Roadmap ({story.futurePlans?.length || 0})
        </button>
      </div>

      {/* TAB 1: TEAM MEMBERS (PHOTO UPLOADER & PROFILE MANAGER) */}
      {activeTab === 'team' && (
        <div>
          {/* Controls bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px',
              background: 'rgba(8, 18, 34, 0.6)',
              padding: '16px 20px',
              borderRadius: '14px',
              border: '1px solid var(--admin-border)',
            }}
          >
            <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
              <input
                type="text"
                placeholder="🔍 Search specialist by name, role, specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'rgba(4, 10, 20, 0.8)',
                  border: '1px solid var(--admin-border)',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  width: '100%',
                  fontSize: '13px',
                }}
              />
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                style={{
                  background: 'rgba(4, 10, 20, 0.8)',
                  border: '1px solid var(--admin-border)',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '13px',
                }}
              >
                <option value="ALL">All Departments</option>
                <option value="Executive Leadership">Executive Leadership</option>
                <option value="Engineering & R&D">Engineering &amp; R&amp;D</option>
                <option value="Sanitary Manufacturing">Sanitary Manufacturing</option>
                <option value="Client Advisory & Projects">Client Advisory &amp; Projects</option>
                <option value="24/7 Operations">24/7 Operations</option>
              </select>
            </div>

            <button onClick={openAddMember} className="btn-admin-primary" style={{ padding: '12px 20px' }}>
              + Add New Team Specialist
            </button>
          </div>

          {/* Team Cards Grid */}
          <div className="admin-grid-cards">
            {filteredTeam.map((m) => (
              <div key={m.id} className="admin-card-item" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '14px' }}>
                  <div
                    style={{
                      position: 'relative',
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      padding: '2px',
                      background: 'linear-gradient(135deg, var(--admin-cyan), #3b82f6)',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={m.image}
                      alt={m.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '17px', fontWeight: '700' }}>
                      {m.name}
                    </h4>
                    <span className="mono" style={{ color: 'var(--admin-cyan)', fontSize: '12.5px', fontWeight: '600' }}>
                      {m.role}
                    </span>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{m.department}</div>
                  </div>
                </div>

                <div
                  className="mono"
                  style={{
                    fontSize: '11px',
                    color: '#ff7a45',
                    background: 'rgba(255, 122, 69, 0.1)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    marginBottom: '10px',
                    display: 'inline-block',
                    alignSelf: 'flex-start',
                  }}
                >
                  ★ {m.experience}
                </div>

                <p
                  style={{
                    fontSize: '13px',
                    color: '#cbd5e1',
                    lineHeight: '1.5',
                    marginBottom: '12px',
                    flex: 1,
                  }}
                >
                  {m.bio}
                </p>

                <div
                  style={{
                    borderTop: '1px solid var(--admin-border)',
                    paddingTop: '10px',
                    marginBottom: '12px',
                  }}
                >
                  <span className="mono" style={{ fontSize: '11px', color: '#38bdf8' }}>
                    🔧 {m.specialization}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '8px',
                    borderTop: '1px solid var(--admin-border)',
                    paddingTop: '12px',
                  }}
                >
                  <button onClick={() => openEditMember(m)} className="btn-table-edit">
                    ✏️ Edit Profile &amp; Photo
                  </button>
                  <button onClick={() => deleteTeamMember(m.id)} className="btn-table-delete">
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MISSION, VISION & NATION BUILDING */}
      {activeTab === 'mission' && (
        <form onSubmit={handleSaveStory} className="admin-form-panel">
          <div className="form-section-title">
            <h3>Hero Headlines &amp; Live Impact Statistics</h3>
          </div>

          <div className="admin-form-grid-2">
            <div className="form-group">
              <label>Page Hero Headline</label>
              <input
                type="text"
                value={storyForm.headline}
                onChange={(e) => setStoryForm({ ...storyForm, headline: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Page Tagline</label>
              <input
                type="text"
                value={storyForm.tagline}
                onChange={(e) => setStoryForm({ ...storyForm, tagline: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="admin-form-grid-4" style={{ marginTop: '12px' }}>
            <div className="form-group">
              <label>Years in Industry</label>
              <input
                type="text"
                value={storyForm.statYears}
                onChange={(e) => setStoryForm({ ...storyForm, statYears: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Projects Completed</label>
              <input
                type="text"
                value={storyForm.statProjects}
                onChange={(e) => setStoryForm({ ...storyForm, statProjects: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Provinces Covered</label>
              <input
                type="text"
                value={storyForm.statProvinces}
                onChange={(e) => setStoryForm({ ...storyForm, statProvinces: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Local Engineering Jobs</label>
              <input
                type="text"
                value={storyForm.statJobs}
                onChange={(e) => setStoryForm({ ...storyForm, statJobs: e.target.value })}
              />
            </div>
          </div>

          <div className="form-section-title" style={{ marginTop: '28px' }}>
            <h3>Core Mission &amp; National Vision</h3>
          </div>

          <div className="admin-form-grid-2">
            <div className="form-group">
              <label>🎯 Core Mission Statement</label>
              <textarea
                rows="4"
                value={storyForm.mission}
                onChange={(e) => setStoryForm({ ...storyForm, mission: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>🔭 National Vision Statement</label>
              <textarea
                rows="4"
                value={storyForm.vision}
                onChange={(e) => setStoryForm({ ...storyForm, vision: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-section-title" style={{ marginTop: '28px' }}>
            <h3>Nation Building &amp; Small Business Empowerment</h3>
          </div>

          <div className="admin-form-grid-2">
            <div className="form-group">
              <label>🇳🇵 Nation Building &amp; Import Substitution</label>
              <textarea
                rows="4"
                value={storyForm.nationBuilding}
                onChange={(e) => setStoryForm({ ...storyForm, nationBuilding: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>🌱 Small Business &amp; Cooperative Assistance Program</label>
              <textarea
                rows="4"
                value={storyForm.smallBusinessImpact}
                onChange={(e) => setStoryForm({ ...storyForm, smallBusinessImpact: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-admin-primary" style={{ padding: '14px 28px' }}>
              💾 Save Story &amp; Mission Settings
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: EVOLUTION TIMELINE MILESTONES */}
      {activeTab === 'milestones' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p className="admin-subtext">Company milestone timeline displayed on `/about` chronologically.</p>
            <button onClick={openAddMilestone} className="btn-admin-primary">
              + Add Milestone
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '110px' }}>Year / Period</th>
                  <th style={{ width: '240px' }}>Milestone Title</th>
                  <th>Description</th>
                  <th style={{ width: '130px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(story.milestones || []).map((m, idx) => (
                  <tr key={idx}>
                    <td className="mono" style={{ color: 'var(--admin-cyan)', fontWeight: 'bold', fontSize: '13px' }}>
                      {m.year}
                    </td>
                    <td><strong>{m.title}</strong></td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>{m.desc}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => openEditMilestone(m, idx)} className="btn-table-edit" style={{ marginRight: '6px' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteMilestone(idx)} className="btn-table-delete">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: VISION 2030 ROADMAP */}
      {activeTab === 'future' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p className="admin-subtext">Strategic Vision 2030 initiatives displayed on `/about`.</p>
            <button onClick={openAddFuture} className="btn-admin-primary">
              + Add Roadmap Initiative
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>Icon</th>
                  <th style={{ width: '240px' }}>Initiative Title</th>
                  <th>Strategic Description</th>
                  <th style={{ width: '130px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(story.futurePlans || []).map((p, idx) => (
                  <tr key={idx}>
                    <td style={{ fontSize: '24px' }}>{p.icon}</td>
                    <td><strong>{p.title}</strong></td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>{p.desc}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => openEditFuture(p, idx)} className="btn-table-edit" style={{ marginRight: '6px' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteFuture(idx)} className="btn-table-delete">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODERN TEAM MEMBER MODAL (WITH LIVE PREVIEW & FILE UPLOADER) */}
      {/* ============================================================ */}
      {teamModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: '820px', width: '95%' }}>
            <div className="admin-modal-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>👤</span>
                <h3>{editingMemberId ? 'Edit Team Specialist' : 'Add New Team Specialist'}</h3>
              </div>
              <button onClick={() => setTeamModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveMember} className="admin-modal-body" style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
                {/* LEFT COLUMN: FORM INPUTS & PHOTO UPLOADER */}
                <div>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ margin: 0 }}>Photo Source Mode</label>
                      {memberForm.image && (
                        <button
                          type="button"
                          onClick={handleClearMemberPhoto}
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
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <button
                        type="button"
                        className={`tab-item mono ${imageUploadMode === 'file' ? 'active' : ''}`}
                        onClick={() => setImageUploadMode('file')}
                        style={{ padding: '6px 14px', fontSize: '11.5px' }}
                      >
                        📁 Upload from Device
                      </button>
                      <button
                        type="button"
                        className={`tab-item mono ${imageUploadMode === 'url' ? 'active' : ''}`}
                        onClick={() => setImageUploadMode('url')}
                        style={{ padding: '6px 14px', fontSize: '11.5px' }}
                      >
                        🔗 Web Image URL
                      </button>
                      <button
                        type="button"
                        className={`tab-item mono ${imageUploadMode === 'preset' ? 'active' : ''}`}
                        onClick={() => setImageUploadMode('preset')}
                        style={{ padding: '6px 14px', fontSize: '11.5px' }}
                      >
                        ✨ Preset Avatars
                      </button>
                    </div>

                    {/* Mode 1: File Upload */}
                    {imageUploadMode === 'file' && (
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDropPhoto}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          border: '2px dashed var(--admin-cyan)',
                          borderRadius: '12px',
                          padding: '24px 16px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: 'rgba(53, 214, 255, 0.05)',
                          marginBottom: '16px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          style={{ display: 'none' }}
                        />
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>📸</div>
                        <strong style={{ color: '#fff', fontSize: '14px', display: 'block' }}>
                          Click to Browse or Drag &amp; Drop Photo
                        </strong>
                        <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                          Supports JPG, PNG, WEBP (Max 5MB)
                        </span>
                      </div>
                    )}

                    {/* Mode 2: Direct URL */}
                    {imageUploadMode === 'url' && (
                      <div style={{ marginBottom: '16px' }}>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/... or /images/team/..."
                          value={memberForm.image}
                          onChange={(e) => setMemberForm({ ...memberForm, image: e.target.value })}
                          style={{ width: '100%', padding: '10px 12px', background: 'rgba(4, 10, 20, 0.8)', border: '1px solid var(--admin-border)', color: '#fff', borderRadius: '8px' }}
                        />
                      </div>
                    )}

                    {/* Mode 3: Presets */}
                    {imageUploadMode === 'preset' && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                        {PRESET_AVATARS.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setMemberForm({ ...memberForm, image: p.url })}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 10px',
                              background: memberForm.image === p.url ? 'var(--admin-cyan)' : 'rgba(10, 20, 36, 0.8)',
                              color: memberForm.image === p.url ? '#050b14' : '#fff',
                              border: '1px solid var(--admin-border)',
                              borderRadius: '6px',
                              fontSize: '11px',
                              cursor: 'pointer',
                            }}
                          >
                            <img src={p.url} alt={p.label} style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
                            {p.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="admin-form-grid-2">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Er. Ramesh Yadav"
                        value={memberForm.name}
                        onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Job Title / Role</label>
                      <input
                        type="text"
                        placeholder="e.g. Managing Director & Founder"
                        value={memberForm.role}
                        onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-form-grid-2">
                    <div className="form-group">
                      <label>Department</label>
                      <select
                        value={memberForm.department}
                        onChange={(e) => setMemberForm({ ...memberForm, department: e.target.value })}
                      >
                        <option value="Executive Leadership">Executive Leadership</option>
                        <option value="Engineering & R&D">Engineering &amp; R&amp;D</option>
                        <option value="Sanitary Manufacturing">Sanitary Manufacturing</option>
                        <option value="Client Advisory & Projects">Client Advisory &amp; Projects</option>
                        <option value="24/7 Operations">24/7 Operations</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Experience Badge</label>
                      <input
                        type="text"
                        placeholder="e.g. 18+ Years in Thermal Engineering"
                        value={memberForm.experience}
                        onChange={(e) => setMemberForm({ ...memberForm, experience: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Technical Specialization</label>
                    <input
                      type="text"
                      placeholder="e.g. Industrial Refrigeration & Turnkey EPC"
                      value={memberForm.specialization}
                      onChange={(e) => setMemberForm({ ...memberForm, specialization: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio / Background</label>
                    <textarea
                      rows="3"
                      placeholder="Summary of engineering expertise and track record..."
                      value={memberForm.bio}
                      onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* RIGHT COLUMN: LIVE WEBSITE CARD PREVIEW */}
                <div>
                  <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="mono" style={{ color: 'var(--admin-cyan)', fontSize: '11px', letterSpacing: '0.08em' }}>
                      ⚡ LIVE PUBLIC CARD PREVIEW
                    </span>
                  </div>

                  <div
                    style={{
                      background: 'rgba(8, 16, 28, 0.95)',
                      border: '1px solid rgba(53, 214, 255, 0.4)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%', height: '200px', background: '#060c16' }}>
                      {memberForm.image ? (
                        <img
                          src={memberForm.image}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                          No Photo Uploaded
                        </div>
                      )}
                      <div
                        className="mono"
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '10px',
                          background: 'rgba(6, 12, 22, 0.85)',
                          border: '1px solid rgba(53, 214, 255, 0.35)',
                          color: 'var(--admin-cyan)',
                          fontSize: '10px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {memberForm.department}
                      </div>
                    </div>

                    <div style={{ padding: '16px' }}>
                      <h4 style={{ margin: '0 0 2px 0', color: '#fff', fontSize: '18px', fontWeight: '700' }}>
                        {memberForm.name || 'Specialist Name'}
                      </h4>
                      <div className="mono" style={{ color: 'var(--admin-cyan)', fontSize: '11.5px', marginBottom: '4px' }}>
                        {memberForm.role || 'Job Role'}
                      </div>
                      <div className="mono" style={{ color: '#ff7a45', fontSize: '10.5px', marginBottom: '8px' }}>
                        ★ {memberForm.experience || 'Experience Badge'}
                      </div>
                      <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4', margin: '0 0 10px 0' }}>
                        {memberForm.bio || 'Bio summary will appear here as you type...'}
                      </p>
                      <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '8px' }}>
                        <span className="mono" style={{ fontSize: '10.5px', color: '#38bdf8' }}>
                          🔧 {memberForm.specialization || 'Technical Specialization'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-modal-foot" style={{ marginTop: '24px', borderTop: '1px solid var(--admin-border)', paddingTop: '16px' }}>
                <button type="button" onClick={() => setTeamModalOpen(false)} className="btn-admin-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary" style={{ padding: '12px 24px' }}>
                  {editingMemberId ? '✓ Update Specialist Profile' : '+ Save & Add Specialist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MILESTONE MODAL */}
      {milestoneModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: '500px' }}>
            <div className="admin-modal-head">
              <h3>{editingMilestoneIdx !== null ? 'Edit Milestone' : 'Add Evolution Milestone'}</h3>
              <button onClick={() => setMilestoneModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveMilestone} className="admin-modal-body">
              <div className="form-group">
                <label>Year / Period (e.g. 2012, 2022, 2026 &amp; Beyond)</label>
                <input
                  type="text"
                  value={milestoneForm.year}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, year: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Milestone Title</label>
                <input
                  type="text"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description &amp; Impact</label>
                <textarea
                  rows="3"
                  value={milestoneForm.desc}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, desc: e.target.value })}
                  required
                />
              </div>

              <div className="admin-modal-foot">
                <button type="button" onClick={() => setMilestoneModalOpen(false)} className="btn-admin-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  {editingMilestoneIdx !== null ? 'Update Milestone' : 'Add Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FUTURE PLAN MODAL */}
      {futureModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: '520px' }}>
            <div className="admin-modal-head">
              <h3>{editingFutureIdx !== null ? 'Edit Roadmap Initiative' : 'Add Vision 2030 Initiative'}</h3>
              <button onClick={() => setFutureModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveFuture} className="admin-modal-body">
              <div className="form-group">
                <label>Select Icon Emoji</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {EMOJI_PALETTE.map((em, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFutureForm({ ...futureForm, icon: em })}
                      style={{
                        fontSize: '20px',
                        padding: '6px 10px',
                        background: futureForm.icon === em ? 'var(--admin-cyan)' : 'rgba(10, 20, 36, 0.8)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Initiative Title</label>
                <input
                  type="text"
                  value={futureForm.title}
                  onChange={(e) => setFutureForm({ ...futureForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Initiative Description</label>
                <textarea
                  rows="3"
                  value={futureForm.desc}
                  onChange={(e) => setFutureForm({ ...futureForm, desc: e.target.value })}
                  required
                />
              </div>

              <div className="admin-modal-foot">
                <button type="button" onClick={() => setFutureModalOpen(false)} className="btn-admin-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  {editingFutureIdx !== null ? 'Update Initiative' : 'Add Initiative'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
