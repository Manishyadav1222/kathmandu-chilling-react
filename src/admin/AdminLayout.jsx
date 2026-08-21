import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext.jsx';
import { CONTACT } from '../data/content';
import './admin.css';

export default function AdminLayout() {
  const { auth, logout, data } = useAdminData();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clock, setClock] = useState('00:00:00');

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const newInquiriesCount = data.inquiries.filter((i) => i.status === 'New').length;
  const totalProducts = data.categories.reduce((acc, cat) => acc + cat.items.length, 0);

  const navItems = [
    { to: '/admin', end: true, label: 'Dashboard', icon: '📊' },
    { to: '/admin/inquiries', label: 'Inquiries & Leads', icon: '✉️', badge: newInquiriesCount > 0 ? newInquiriesCount : null },
    { to: '/admin/products', label: 'Products & Equipment', icon: '🧊', count: totalProducts },
    { to: '/admin/projects', label: 'Projects & Case Studies', icon: '🏭', count: data.projects.length },
    { to: '/admin/story', label: 'Story, Mission & Team', icon: '🏛️', count: (data.team || []).length },
    { to: '/admin/blogs', label: 'Blog & SEO Articles', icon: '📖', count: data.blogs.length },
    { to: '/admin/promotions', label: 'Campaign Posters', icon: '🎪' },
    { to: '/admin/settings', label: 'Settings & Backups', icon: '⚙️' },
  ];

  return (
    <div className="admin-wrapper">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-head">
          <div className="admin-brand-lockup">
            <div className="admin-brand-icon">
              <img src={CONTACT.logo} alt="KCR Logo" />
            </div>
            <div className="admin-brand-text">
              <strong>Kathmandu Chilling</strong>
              <span>Control Panel · v2.0</span>
            </div>
          </div>
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="admin-sidebar-nav">
          <div className="nav-group-label mono">MANAGEMENT SUITE</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span className="admin-nav-label">{item.label}</span>
              {item.badge && (
                <span className="admin-nav-badge pulse mono">{item.badge} New</span>
              )}
              {item.count !== undefined && !item.badge && (
                <span className="admin-nav-count mono">{item.count}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="user-avatar">👤</div>
            <div className="user-info">
              <strong>{auth.user?.name || 'Administrator'}</strong>
              <span className="mono">{auth.user?.role || 'Super Admin'}</span>
            </div>
          </div>
          <button
            type="button"
            className="btn-admin-logout mono"
            onClick={handleLogout}
          >
            <span>Sign Out</span>
            <span>🚪</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <div className="admin-main-area">
        {/* Top Navbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              ☰
            </button>
            <div className="topbar-live-status mono">
              <span className="status-indicator-dot"></span>
              <span>LIVE SYSTEM · {clock} NPT</span>
            </div>
          </div>

          <div className="admin-topbar-right">
            <Link to="/" target="_blank" rel="noopener noreferrer" className="btn-view-live mono">
              <span>Visit Live Website</span>
              <span className="external-arrow">↗</span>
            </Link>

            <Link to="/calculator" target="_blank" rel="noopener noreferrer" className="btn-view-calc mono">
              <span>ROI Calculator</span>
              <span className="external-arrow">↗</span>
            </Link>

            <div className="admin-profile-pill">
              <div className="pill-dot"></div>
              <span>{auth.user?.name || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Child Views */}
        <main className="admin-content-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
