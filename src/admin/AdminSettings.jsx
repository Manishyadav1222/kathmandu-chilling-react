import React, { useState, useRef } from 'react';
import { useAdminData, optimizeImageFile } from '../context/AdminDataContext.jsx';

export default function AdminSettings() {
  const {
    data,
    updateSettings,
    addClient,
    updateClient,
    deleteClient,
    exportBackup,
    importBackup,
    resetToDefaults,
  } = useAdminData();

  const [form, setForm] = useState({
    name: data.contact?.name || 'Kathmandu Chilling & Refrigerator Udhyog Pvt. Ltd.',
    phone1: data.contact?.phone1 || '+977 9851000000',
    phone2: data.contact?.phone2 || '+977 9801000000',
    email: data.contact?.email || 'info@kathmanduchilling.com.np',
    location: data.contact?.location || 'Kathmandu, Nepal',
    hours: data.contact?.hours || 'Sun–Fri: 8:00 AM – 6:00 PM (24/7 Emergency Support)',
    announcement: data.announcement || '',
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  // Client / Partner Management State
  const [newClientName, setNewClientName] = useState('');
  const [newClientImg, setNewClientImg] = useState('');
  const [newClientType, setNewClientType] = useState('Enterprise');
  const clientFileRef = useRef(null);

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(
      {
        name: form.name,
        phone1: form.phone1,
        phone2: form.phone2,
        email: form.email,
        location: form.location,
        hours: form.hours,
      },
      form.announcement
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Client Logo Upload
  const handleClientLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimized = await optimizeImageFile(file);
        setNewClientImg(optimized);
      } catch (err) {
        console.error('Client logo upload error:', err);
      }
    }
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClientName.trim()) return;
    addClient({
      name: newClientName.trim(),
      img: newClientImg.trim() || '/images/kcr-logo.svg',
      type: newClientType,
    });
    setNewClientName('');
    setNewClientImg('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteClient = (id, name) => {
    if (window.confirm(`Remove partner / client logo "${name}"?`)) {
      deleteClient(id);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = importBackup(event.target.result);
        if (res.success) {
          setImportStatus({ success: true, message: 'Platform data restored successfully!' });
        } else {
          setImportStatus({ success: false, message: res.message || 'Failed to parse backup JSON.' });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all data back to factory defaults? All custom changes will be reverted.'
      )
    ) {
      resetToDefaults();
      alert('System reset to default state.');
      window.location.reload();
    }
  };

  return (
    <div className="admin-page-content">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumbs mono">SYSTEM · GLOBAL CONFIGURATION</div>
          <h1>Company Profile, Client Logos &amp; Settings</h1>
          <p>Configure official factory contact information, partner logos, announcement tickers, and platform backups.</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="admin-alert-success">
          <span>✅ Settings &amp; logos updated successfully! Frontend refreshed in real time.</span>
        </div>
      )}

      {importStatus && (
        <div className={importStatus.success ? 'admin-alert-success' : 'admin-alert-error'}>
          <span>{importStatus.success ? '✅' : '⚠️'} {importStatus.message}</span>
        </div>
      )}

      <div className="admin-settings-grid">
        {/* Left: Company Contact & Profile Settings Form */}
        <div className="admin-panel-card">
          <div className="panel-card-head">
            <div>
              <h3>Official Company Profile &amp; Contact Info</h3>
              <p>These details are automatically displayed across headers, footers, contact forms, and structured SEO schema.</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="admin-settings-form">
            <div className="form-field span-2">
              <label>Official Company Legal Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-field">
              <label>Primary Phone / Hotline</label>
              <input
                type="text"
                value={form.phone1}
                onChange={(e) => setForm({ ...form, phone1: e.target.value })}
                required
              />
            </div>

            <div className="form-field">
              <label>Secondary Phone / WhatsApp Hotline</label>
              <input
                type="text"
                value={form.phone2}
                onChange={(e) => setForm({ ...form, phone2: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label>Official Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-field">
              <label>Factory / Office Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>

            <div className="form-field span-2">
              <label>Working Hours &amp; Emergency Support Terms</label>
              <input
                type="text"
                value={form.hours}
                onChange={(e) => setForm({ ...form, hours: e.target.value })}
                required
              />
            </div>

            <div className="form-field span-2">
              <label>Marquee Top Announcement Banner</label>
              <input
                type="text"
                value={form.announcement}
                onChange={(e) => setForm({ ...form, announcement: e.target.value })}
                placeholder="Announcement banner text..."
              />
            </div>

            <div className="settings-form-actions">
              <button type="submit" className="btn-admin-primary">
                💾 Save Company Settings
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Partners / Client Logos & Backups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Partner & Client Logos Management */}
          <div className="admin-panel-card">
            <div className="panel-card-head">
              <div>
                <h3>Clients &amp; Partner Logos Strip ({(data?.clients || []).length})</h3>
                <p>Manage enterprise clients and logos scrolling across the homepage client marquee.</p>
              </div>
            </div>

            {/* List of current clients */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginBottom: '16px' }}>
              {(data?.clients || []).map((client) => (
                <div
                  key={client.id || client.name}
                  style={{
                    background: 'rgba(5, 15, 30, 0.7)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    padding: '8px',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  <div style={{ width: '100%', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                    {client.img ? (
                      <img src={client.img} alt={client.name} style={{ maxHeight: '40px', maxWidth: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '20px' }}>🏢</span>
                    )}
                  </div>
                  <strong style={{ fontSize: '11px', color: '#fff', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {client.name}
                  </strong>
                  <button
                    type="button"
                    onClick={() => handleDeleteClient(client.id || client.name, client.name)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '10px',
                      padding: '2px 6px',
                      marginTop: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Client / Partner Form */}
            <form onSubmit={handleAddClient} style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 'bold', color: 'var(--admin-cyan)', marginBottom: '8px' }}>
                + Add Client / Partner Logo
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enterprise / Cooperative Name (e.g. DDC Nepal)"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  required
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Logo URL (/images/... or https://...)"
                    value={newClientImg}
                    onChange={(e) => setNewClientImg(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="file"
                    ref={clientFileRef}
                    onChange={handleClientLogoUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => clientFileRef.current?.click()}
                    className="btn-admin-secondary mono"
                    style={{ fontSize: '11px', padding: '6px 10px' }}
                  >
                    📁 Upload
                  </button>
                  {newClientImg && (
                    <button
                      type="button"
                      onClick={() => setNewClientImg('')}
                      style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none', borderRadius: '6px', padding: '0 8px', cursor: 'pointer', fontSize: '11px' }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <button type="submit" className="btn-admin-primary mono" style={{ fontSize: '12px', padding: '8px' }}>
                  + Add Client Logo
                </button>
              </div>
            </form>
          </div>

          {/* Data Backup, Restore & Factory Reset */}
          <div className="admin-panel-card">
            <div className="panel-card-head">
              <div>
                <h3>Data Persistence &amp; Backups</h3>
                <p>Export your full website database to JSON or restore a previous snapshot.</p>
              </div>
            </div>

            <div className="backup-hub-body">
              {/* Export */}
              <div className="backup-action-box">
                <div className="backup-box-icon">📥</div>
                <div className="backup-box-info">
                  <strong>Export Full Database Backup</strong>
                  <p>Download all products, case studies, blogs, team, and settings as JSON.</p>
                </div>
                <button
                  type="button"
                  className="btn-backup-download mono"
                  onClick={exportBackup}
                >
                  Download JSON Backup
                </button>
              </div>

              {/* Restore */}
              <div className="backup-action-box">
                <div className="backup-box-icon">📤</div>
                <div className="backup-box-info">
                  <strong>Restore Database from JSON</strong>
                  <p>Upload a previously exported backup file to restore products, leads, and blogs.</p>
                </div>
                <label className="btn-backup-upload mono">
                  <span>Select Backup JSON</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Factory Reset */}
              <div className="backup-action-box danger">
                <div className="backup-box-icon">⚠️</div>
                <div className="backup-box-info">
                  <strong style={{ color: '#ef4444' }}>Reset to Factory Defaults</strong>
                  <p>Clears local customizations and reloads initial manufacturer data.</p>
                </div>
                <button
                  type="button"
                  className="btn-backup-reset mono"
                  onClick={handleReset}
                >
                  Reset Database
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
