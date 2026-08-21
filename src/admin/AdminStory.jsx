import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext.jsx';

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

  const [activeTab, setActiveTab] = useState('mission'); // 'mission' | 'milestones' | 'team' | 'future'
  const [saveAlert, setSaveAlert] = useState(false);

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
    setMemberForm({
      name: '',
      role: '',
      department: 'Engineering & R&D',
      experience: '8+ Years Experience',
      bio: 'Thermal engineering and project fabrication specialist at Kathmandu Chilling.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
      specialization: 'Modular Cold Storage & Inverter Systems',
    });
    setTeamModalOpen(true);
  };

  const openEditMember = (m) => {
    setEditingMemberId(m.id);
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
    if (editingMemberId) {
      updateTeamMember(editingMemberId, memberForm);
    } else {
      addTeamMember(memberForm);
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

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2>Our Story, Mission &amp; Team Management</h2>
          <p className="admin-subtext">
            Customize company evolution chronology, national mission, small business impact, and engineering team profiles in real time.
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
            ↗ View Public Page
          </a>
        </div>
      </div>

      {saveAlert && (
        <div className="admin-alert-success" style={{ marginBottom: '20px' }}>
          ✓ Changes saved successfully! Public `/about` page updated in real time.
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tab-bar">
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
          className={`tab-item mono ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          👥 Engineering Team ({team.length})
        </button>
        <button
          className={`tab-item mono ${activeTab === 'future' ? 'active' : ''}`}
          onClick={() => setActiveTab('future')}
        >
          🚀 Vision 2030 Roadmap ({story.futurePlans?.length || 0})
        </button>
      </div>

      {/* TAB 1: Mission, Vision & Impact */}
      {activeTab === 'mission' && (
        <form onSubmit={handleSaveStory} className="admin-form-panel">
          <div className="form-section-title">
            <h3>Hero Headlines &amp; Impact Stats</h3>
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
            <h3>Core Mission &amp; Vision</h3>
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
              <label>🇳🇵 Nation Building &amp; Import Substitution Message</label>
              <textarea
                rows="4"
                value={storyForm.nationBuilding}
                onChange={(e) => setStoryForm({ ...storyForm, nationBuilding: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>🌱 Small Business &amp; Cooperative Assistance</label>
              <textarea
                rows="4"
                value={storyForm.smallBusinessImpact}
                onChange={(e) => setStoryForm({ ...storyForm, smallBusinessImpact: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-admin-primary">
              💾 Save Story &amp; Mission Settings
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Milestones Chronology */}
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
                  <th style={{ width: '100px' }}>Year</th>
                  <th style={{ width: '220px' }}>Milestone Title</th>
                  <th>Description</th>
                  <th style={{ width: '130px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(story.milestones || []).map((m, idx) => (
                  <tr key={idx}>
                    <td className="mono" style={{ color: 'var(--admin-cyan)', fontWeight: 'bold' }}>{m.year}</td>
                    <td><strong>{m.title}</strong></td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>{m.desc}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => openEditMilestone(m, idx)} className="btn-table-edit" style={{ marginRight: '6px' }}>Edit</button>
                      <button onClick={() => handleDeleteMilestone(idx)} className="btn-table-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Team Members */}
      {activeTab === 'team' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p className="admin-subtext">Manage team members, department designations, credentials, and bios.</p>
            <button onClick={openAddMember} className="btn-admin-primary">
              + Add Team Member
            </button>
          </div>

          <div className="admin-grid-cards">
            {team.map((m) => (
              <div key={m.id} className="admin-card-item">
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '14px' }}>
                  <img
                    src={m.image}
                    alt={m.name}
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--admin-cyan)' }}
                  />
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', color: '#fff', fontSize: '16px' }}>{m.name}</h4>
                    <span className="mono" style={{ color: 'var(--admin-cyan)', fontSize: '12px' }}>{m.role}</span>
                    <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{m.department}</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '10px', lineHeight: '1.4' }}>
                  {m.bio}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--admin-orange)', marginBottom: '14px' }} className="mono">
                  🔧 {m.specialization}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--admin-border)', paddingTop: '10px' }}>
                  <button onClick={() => openEditMember(m)} className="btn-table-edit">Edit Profile</button>
                  <button onClick={() => deleteTeamMember(m.id)} className="btn-table-delete">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Future Roadmap */}
      {activeTab === 'future' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p className="admin-subtext">Strategic Vision 2030 initiatives displayed on `/about`.</p>
            <button onClick={openAddFuture} className="btn-admin-primary">
              + Add Roadmap Item
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Icon</th>
                  <th style={{ width: '240px' }}>Initiative Title</th>
                  <th>Description</th>
                  <th style={{ width: '130px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(story.futurePlans || []).map((p, idx) => (
                  <tr key={idx}>
                    <td style={{ fontSize: '20px' }}>{p.icon}</td>
                    <td><strong>{p.title}</strong></td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>{p.desc}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => openEditFuture(p, idx)} className="btn-table-edit" style={{ marginRight: '6px' }}>Edit</button>
                      <button onClick={() => handleDeleteFuture(idx)} className="btn-table-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TEAM MEMBER MODAL */}
      {teamModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: '580px' }}>
            <div className="admin-modal-head">
              <h3>{editingMemberId ? 'Edit Team Member' : 'Add New Team Member'}</h3>
              <button onClick={() => setTeamModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveMember} className="admin-modal-body">
              <div className="admin-form-grid-2">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Job Title / Role</label>
                  <input
                    type="text"
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
                    value={memberForm.experience}
                    onChange={(e) => setMemberForm({ ...memberForm, experience: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Photo URL</label>
                <input
                  type="text"
                  value={memberForm.image}
                  onChange={(e) => setMemberForm({ ...memberForm, image: e.target.value })}
                  placeholder="https://... or /images/team/..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Technical Specialization</label>
                <input
                  type="text"
                  value={memberForm.specialization}
                  onChange={(e) => setMemberForm({ ...memberForm, specialization: e.target.value })}
                  placeholder="e.g. Inverter Units & Thermodynamic Heat-Load"
                  required
                />
              </div>

              <div className="form-group">
                <label>Bio / Background</label>
                <textarea
                  rows="3"
                  value={memberForm.bio}
                  onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                  required
                />
              </div>

              <div className="admin-modal-foot">
                <button type="button" onClick={() => setTeamModalOpen(false)} className="btn-admin-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  {editingMemberId ? 'Update Member' : 'Add Member'}
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
          <div className="admin-modal" style={{ maxWidth: '500px' }}>
            <div className="admin-modal-head">
              <h3>{editingFutureIdx !== null ? 'Edit Roadmap Initiative' : 'Add Vision 2030 Initiative'}</h3>
              <button onClick={() => setFutureModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveFuture} className="admin-modal-body">
              <div className="form-group">
                <label>Icon Emoji (e.g. ☀️, 📡, 🤝, 🚀)</label>
                <input
                  type="text"
                  value={futureForm.icon}
                  onChange={(e) => setFutureForm({ ...futureForm, icon: e.target.value })}
                  required
                />
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
