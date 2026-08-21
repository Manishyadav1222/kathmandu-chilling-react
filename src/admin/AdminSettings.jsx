import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext.jsx';

export default function AdminSettings() {
  const { data, updateSettings, exportBackup, importBackup, resetToDefaults } = useAdminData();

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
          <h1>Company Profile, Settings &amp; Backups</h1>
          <p>Configure official factory contact information, announcement tickers, and platform backups.</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="admin-alert-success">
          <span>✅ Global settings saved successfully!</span>
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

        {/* Right: Data Backup, Restore & Factory Reset */}
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
                <p>Download all products, case studies, blogs, inquiries, and settings as a standalone JSON file.</p>
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
  );
}
