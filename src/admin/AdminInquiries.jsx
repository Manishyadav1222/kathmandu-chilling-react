import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext.jsx';
import { buildWhatsAppLink } from '../data/content';
import { WhatsAppIcon } from '../components/Hero.jsx';

export default function AdminInquiries() {
  const { data, updateInquiryStatus, deleteInquiry } = useAdminData();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInq, setSelectedInq] = useState(null);
  const [noteText, setNoteText] = useState('');

  const statusColors = {
    New: '#35d6ff',
    Contacted: '#f59e0b',
    Quoted: '#a855f7',
    Won: '#10b981',
    Closed: '#6b7280',
  };

  const filteredInquiries = data.inquiries.filter((inq) => {
    const matchesStatus = filterStatus === 'all' || inq.status === filterStatus;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      inq.name?.toLowerCase().includes(query) ||
      inq.phone?.toLowerCase().includes(query) ||
      inq.district?.toLowerCase().includes(query) ||
      inq.interest?.toLowerCase().includes(query) ||
      inq.details?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const openNotesModal = (inq) => {
    setSelectedInq(inq);
    setNoteText(inq.notes || '');
  };

  const saveNotes = () => {
    if (selectedInq) {
      updateInquiryStatus(selectedInq.id, selectedInq.status, noteText);
      setSelectedInq(null);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Name', 'Phone', 'Email', 'District', 'Interest', 'Status', 'Details', 'Notes'];
    const rows = filteredInquiries.map((i) => [
      i.id,
      new Date(i.date).toLocaleString(),
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.district || '').replace(/"/g, '""')}"`,
      `"${(i.interest || '').replace(/"/g, '""')}"`,
      i.status,
      `"${(i.details || '').replace(/"/g, '""')}"`,
      `"${(i.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `kcr-leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete inquiry from "${name}"?`)) {
      deleteInquiry(id);
    }
  };

  return (
    <div className="admin-page-content">
      {/* Header Row */}
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumbs mono">CRM · LEADS &amp; QUOTATIONS</div>
          <h1>Customer Inquiries &amp; Quotations CRM</h1>
          <p>Track, manage, and follow up on customer leads received from website quote forms and sizing calculators.</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="btn-admin-action mono" onClick={exportCSV}>
            <span>📊 Export to CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-crm-controls">
        <div className="admin-crm-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by client name, phone number, district, or equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        <div className="admin-status-filter-pills">
          {['all', 'New', 'Contacted', 'Quoted', 'Won', 'Closed'].map((s) => {
            const count = s === 'all' ? data.inquiries.length : data.inquiries.filter((i) => i.status === s).length;
            return (
              <button
                key={s}
                className={`crm-status-pill ${filterStatus === s ? 'active' : ''} mono`}
                onClick={() => setFilterStatus(s)}
              >
                <span>{s === 'all' ? 'All Leads' : s}</span>
                <span className="pill-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inquiries Table Card */}
      <div className="admin-panel-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Client Name &amp; Contact</th>
                <th>District / Location</th>
                <th>Equipment Interest</th>
                <th>Message / Specifications</th>
                <th>Lead Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--steel)' }}>
                    No customer inquiries found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => {
                  const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
                  const waMsg = `Namaste ${inq.name}, Kathmandu Chilling has received your inquiry regarding ${inq.interest}. How may we assist with sizing and quotations?`;
                  const waLink = buildWhatsAppLink(waMsg, cleanPhone);

                  return (
                    <tr key={inq.id}>
                      <td className="mono" style={{ fontSize: '11px', color: 'var(--steel-dim)' }}>
                        {new Date(inq.date).toLocaleDateString()}<br />
                        {new Date(inq.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td>
                        <strong>{inq.name}</strong>
                        <div className="td-sub mono">
                          <a href={`tel:${inq.phone}`} style={{ color: 'var(--ice)' }}>📞 {inq.phone}</a>
                        </div>
                        {inq.email && <div className="td-sub mono">{inq.email}</div>}
                      </td>
                      <td>
                        <span className="mono">{inq.district || 'Nepal'}</span>
                      </td>
                      <td>
                        <span className="interest-pill">{inq.interest}</span>
                      </td>
                      <td>
                        <p className="inq-details-text">{inq.details || '—'}</p>
                      </td>
                      <td>
                        <select
                          className="status-select mono"
                          value={inq.status}
                          style={{
                            color: statusColors[inq.status] || '#ffffff',
                            borderColor: statusColors[inq.status] || '#ffffff',
                          }}
                          onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Quoted">Quoted</option>
                          <option value="Won">Won</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-table-notes mono"
                          onClick={() => openNotesModal(inq)}
                        >
                          {inq.notes ? '📝 Edit Note' : '+ Note'}
                        </button>
                        {inq.notes && (
                          <div className="notes-preview-snippet mono">
                            {inq.notes.slice(0, 35)}...
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="table-btn-group">
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-table-wa"
                            title="Direct WhatsApp Message"
                          >
                            <WhatsAppIcon size={14} />
                          </a>
                          <a
                            href={`tel:${inq.phone}`}
                            className="btn-table-call"
                            title="Call Phone"
                          >
                            📞
                          </a>
                          <button
                            type="button"
                            className="btn-table-delete"
                            onClick={() => handleDelete(inq.id, inq.name)}
                            title="Delete Lead"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes Modal */}
      {selectedInq && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedInq(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="admin-modal-head">
              <h3>Internal Lead Notes: {selectedInq.name}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedInq(null)}>✕</button>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '13px', color: 'var(--steel)', marginBottom: '14px' }}>
                Add follow-up notes, site survey dates, quoted amount, or special technical requirements for this lead:
              </p>
              <textarea
                rows={5}
                style={{ width: '100%', marginBottom: '18px' }}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g. Quoted NPR 1,200,000 for 50 MT Cold Room. Site visit scheduled for Sunday in Chitwan..."
              />
              <div className="modal-footer-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setSelectedInq(null)}>
                  Cancel
                </button>
                <button type="button" className="btn-modal-save" onClick={saveNotes}>
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
