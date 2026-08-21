import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext.jsx';
import { buildWhatsAppLink } from '../data/content';
import { WhatsAppIcon } from '../components/Hero.jsx';

export default function AdminDashboard() {
  const { data, updateInquiryStatus, exportBackup } = useAdminData();

  const totalInquiries = data.inquiries.length;
  const newInquiries = data.inquiries.filter((i) => i.status === 'New').length;
  const quotedInquiries = data.inquiries.filter((i) => i.status === 'Quoted').length;
  const totalProducts = data.categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const totalProjects = data.projects.length;
  const totalBlogs = data.blogs.length;

  const recentInquiries = data.inquiries.slice(0, 5);

  const statusColors = {
    New: '#35d6ff',
    Contacted: '#f59e0b',
    Quoted: '#a855f7',
    Won: '#10b981',
    Closed: '#6b7280',
  };

  return (
    <div className="admin-page-content">
      {/* Page Title Row */}
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumbs mono">OVERVIEW · EXECUTIVE DASHBOARD</div>
          <h1>Platform Operations &amp; Intelligence</h1>
        </div>
        <div className="admin-header-actions">
          <button
            type="button"
            className="btn-admin-action mono"
            onClick={exportBackup}
          >
            <span>📥 Export Backup JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        <div className="kpi-card" style={{ borderColor: 'rgba(53,214,255,0.4)' }}>
          <div className="kpi-top">
            <span className="kpi-icon">✉️</span>
            {newInquiries > 0 && <span className="kpi-badge mono">{newInquiries} New</span>}
          </div>
          <div className="kpi-val mono">{totalInquiries}</div>
          <div className="kpi-label">Quotation Inquiries</div>
          <div className="kpi-sub mono">{quotedInquiries} active proposals sent</div>
        </div>

        <div className="kpi-card" style={{ borderColor: 'rgba(60,208,112,0.4)' }}>
          <div className="kpi-top">
            <span className="kpi-icon">🧊</span>
            <span className="kpi-badge green mono">{data.categories.length} Categories</span>
          </div>
          <div className="kpi-val mono">{totalProducts}</div>
          <div className="kpi-label">Equipment Models</div>
          <div className="kpi-sub mono">Cold Rooms, BMCs, Dairy Plants</div>
        </div>

        <div className="kpi-card" style={{ borderColor: 'rgba(255,122,69,0.4)' }}>
          <div className="kpi-top">
            <span className="kpi-icon">🏭</span>
            <span className="kpi-badge orange mono">7 Provinces</span>
          </div>
          <div className="kpi-val mono">{totalProjects}</div>
          <div className="kpi-label">Completed Installations</div>
          <div className="kpi-sub mono">Commercial &amp; Cooperative Hubs</div>
        </div>

        <div className="kpi-card" style={{ borderColor: 'rgba(168,85,247,0.4)' }}>
          <div className="kpi-top">
            <span className="kpi-icon">📖</span>
            <span className="kpi-badge purple mono">AI SEO Indexed</span>
          </div>
          <div className="kpi-val mono">{totalBlogs}</div>
          <div className="kpi-label">Published Articles</div>
          <div className="kpi-sub mono">Engineering guides &amp; Schema FAQs</div>
        </div>
      </div>

      {/* Quick Launchpad Buttons */}
      <div className="admin-quick-actions-bar">
        <span className="launchpad-label mono">⚡ QUICK ACTIONS:</span>
        <Link to="/admin/products" className="btn-launchpad">
          <span>+ Add Equipment</span>
        </Link>
        <Link to="/admin/projects" className="btn-launchpad">
          <span>+ New Project Case Study</span>
        </Link>
        <Link to="/admin/blogs" className="btn-launchpad">
          <span>+ Publish Blog Guide</span>
        </Link>
        <Link to="/admin/inquiries" className="btn-launchpad">
          <span>View All Inquiries →</span>
        </Link>
      </div>

      {/* Split Section: Recent Inquiries & Equipment Snapshot */}
      <div className="admin-split-grid">
        {/* Left: Recent Inquiries Table */}
        <div className="admin-panel-card">
          <div className="panel-card-head">
            <div>
              <h3>Recent Customer Inquiries</h3>
              <p>Direct quotation submissions from the website and sizing calculator.</p>
            </div>
            <Link to="/admin/inquiries" className="panel-link mono">
              View All ({data.inquiries.length}) →
            </Link>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Interest</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inq) => {
                  const waMsg = `Hi ${inq.name}, thank you for inquiring about ${inq.interest} from Kathmandu Chilling.`;
                  const waLink = buildWhatsAppLink(waMsg, inq.phone.replace(/[^0-9]/g, ''));
                  return (
                    <tr key={inq.id}>
                      <td>
                        <strong>{inq.name}</strong>
                        <div className="td-sub mono">{inq.phone}</div>
                      </td>
                      <td>
                        <span className="interest-pill">{inq.interest}</span>
                      </td>
                      <td>{inq.district || 'Nepal'}</td>
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
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-table-wa"
                          title="WhatsApp Reply"
                        >
                          <WhatsAppIcon size={14} />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Equipment Overview & System Telemetry */}
        <div className="admin-panel-card">
          <div className="panel-card-head">
            <div>
              <h3>Active Equipment Catalog</h3>
              <p>Top commercial refrigeration &amp; dairy lines.</p>
            </div>
            <Link to="/admin/products" className="panel-link mono">
              Manage ({totalProducts}) →
            </Link>
          </div>

          <div className="catalog-mini-list">
            {data.categories.flatMap((c) => c.items).slice(0, 5).map((item) => (
              <div className="catalog-mini-row" key={item.slug}>
                <div className="mini-thumb">
                  <img src={item.img} alt={item.title} />
                </div>
                <div className="mini-info">
                  <strong>{item.title}</strong>
                  <span className="mono">{item.tempTag}</span>
                </div>
                <Link to={`/products/${item.slug}`} target="_blank" rel="noopener noreferrer" className="btn-mini-preview mono">
                  3D View ↗
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
