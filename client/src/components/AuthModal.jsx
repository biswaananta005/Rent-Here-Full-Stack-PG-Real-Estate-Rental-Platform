import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, User, Store, Shield, Sparkles } from 'lucide-react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const { loginUser } = useContext(AuthContext);
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('buyer');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLoginTab) {
        const res = await axios.post('/api/auth/login', { email, password });
        loginUser(res.data, res.data.token);
        onClose();
      } else {
        const res = await axios.post('/api/auth/register', { name, email, password, phone, role });
        loginUser(res.data, res.data.token);
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Demo Login Trigger
  const handleQuickDemoLogin = async (demoEmail, demoPass) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email: demoEmail, password: demoPass });
      loginUser(res.data, res.data.token);
      onClose();
    } catch (error) {
      toast.error('Quick login error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container auth-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setIsLoginTab(true)}
              className={`auth-tab-btn ${isLoginTab ? 'active' : ''}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLoginTab(false)}
              className={`auth-tab-btn ${!isLoginTab ? 'active' : ''}`}
            >
              Register Account
            </button>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Quick Demo Section */}
          <div className="quick-demo-box">
            <div className="quick-demo-title">
              <Sparkles size={14} /> 1-Click Quick Demo Login (Instant Access)
            </div>
            <div className="quick-demo-grid">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@renthere.com', 'admin123')}
                className="btn btn-secondary quick-demo-btn"
              >
                <Shield size={12} style={{ color: '#DC2626' }} /> Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('seller@renthere.com', 'seller123')}
                className="btn btn-secondary quick-demo-btn"
              >
                <Store size={12} style={{ color: '#D97706' }} /> Seller
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('buyer@renthere.com', 'buyer123')}
                className="btn btn-secondary quick-demo-btn"
              >
                <User size={12} style={{ color: '#2563EB' }} /> Buyer
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLoginTab && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. +91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Account Role</label>
                  <div className="role-selector-grid">
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`btn role-select-btn ${role === 'buyer' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      <User size={14} /> Tenant / Buyer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('seller')}
                      className={`btn role-select-btn ${role === 'seller' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      <Store size={14} /> Owner / Seller
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary auth-submit-btn">
              {loading ? 'Processing...' : isLoginTab ? 'Sign In to Account' : 'Create Free Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
