import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext.jsx';
import { CONTACT } from '../data/content';
import './admin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, auth } = useAdminData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [auth, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = login(username.trim(), password.trim());
      setLoading(false);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message);
      }
    }, 400);
  };

  const autofillDemo = () => {
    setUsername('admin');
    setPassword('kcr@2026');
    setError('');
  };

  return (
    <div className="admin-login-page">
      {/* Background Matrix Effect */}
      <div className="admin-login-bg">
        <div className="admin-glow-orb-1"></div>
        <div className="admin-glow-orb-2"></div>
        <div className="admin-grid-pattern"></div>
      </div>

      <div className="admin-login-card">
        {/* Brand Header */}
        <div className="admin-login-brand">
          <div className="admin-logo-circle">
            <img src={CONTACT.logo} alt="KCR Logo" />
          </div>
          <div className="admin-login-titles">
            <h2>KCR Executive Portal</h2>
            <span>Kathmandu Chilling &amp; Refrigerator Management</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="admin-alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="username">Admin Username</label>
            <div className="admin-input-wrapper">
              <span className="input-icon">👤</span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (admin)"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">Security Password</label>
            <div className="admin-input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (kcr@2026)"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="admin-login-actions">
            <button
              type="button"
              className="btn-demo-autofill mono"
              onClick={autofillDemo}
            >
              ⚡ Fill Default Credentials
            </button>
          </div>

          <button
            type="submit"
            className="btn-admin-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner"></span>
            ) : (
              <>
                <span>Secure Sign In</span>
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to="/" className="back-to-site-link">
            ← Return to Public Website
          </Link>
          <span className="security-notice mono">
            🔒 256-Bit Encrypted Admin Session
          </span>
        </div>
      </div>
    </div>
  );
}
