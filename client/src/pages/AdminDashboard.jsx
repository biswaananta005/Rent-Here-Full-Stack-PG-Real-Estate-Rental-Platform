import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import RejectReasonModal from '../components/RejectReasonModal';
import EmptyState from '../components/EmptyState';
import { ShieldCheck, CheckCircle2, XCircle, Users, Building2, Trash2, ShieldAlert } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'all-properties' | 'users'

  const [stats, setStats] = useState(null);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reject Modal state
  const [rejectProperty, setRejectProperty] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes, allPropRes, usersRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/pending-properties'),
        axios.get('/api/admin/all-properties'),
        axios.get('/api/admin/users'),
      ]);
      setStats(statsRes.data);
      setPendingProperties(pendingRes.data);
      setAllProperties(allPropRes.data);
      setUsersList(usersRes.data);
    } catch (error) {
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApproveProperty = async (id) => {
    try {
      await axios.patch(`/api/admin/properties/${id}/approve`);
      toast.success('Property approved! It is now live on the public marketplace.');
      setPendingProperties(pendingProperties.filter((p) => p._id !== id));
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Approval failed');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This will also remove any properties listed by them.`)) return;

    try {
      await axios.delete(`/api/admin/users/${userId}`);
      toast.success(`User "${userName}" deleted successfully`);
      setUsersList(usersList.filter((u) => u._id !== userId));
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete user failed');
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="container dashboard-container">
      {/* Superadmin Banner */}
      <div className="admin-super-banner">
        <div className="admin-banner-pill">
          <ShieldCheck size={24} style={{ color: '#10B981' }} />
          <span className="admin-banner-pill-text">
            Platform Superadmin Control
          </span>
        </div>
        <h1 className="admin-banner-title">
          Property Approval & Oversight Hub
        </h1>
        <p className="admin-banner-sub">
          Review pending property listings before they go live, track platform metrics, and handle account moderation.
        </p>
      </div>

      {/* Platform Metrics Overview Cards */}
      {stats && (
        <div className="admin-metrics-grid">
          <div className="card admin-metric-card">
            <div className="admin-metric-label">
              Pending Approvals
            </div>
            <div className="admin-metric-value val-pending">
              {stats.properties?.pending || 0}
            </div>
            <span className="admin-metric-sub">Awaiting review</span>
          </div>

          <div className="card admin-metric-card">
            <div className="admin-metric-label">
              Live Approved Ads
            </div>
            <div className="admin-metric-value val-approved">
              {stats.properties?.approved || 0}
            </div>
            <span className="admin-metric-sub">Publicly visible</span>
          </div>

          <div className="card admin-metric-card">
            <div className="admin-metric-label">
              Total Registered Users
            </div>
            <div className="admin-metric-value val-users">
              {stats.users?.total || 0}
            </div>
            <span className="admin-metric-sub">{stats.users?.sellers} Sellers • {stats.users?.buyers} Buyers</span>
          </div>

          <div className="card admin-metric-card">
            <div className="admin-metric-label">
              Total Inquiries
            </div>
            <div className="admin-metric-value val-inquiries">
              {stats.inquiries || 0}
            </div>
            <span className="admin-metric-sub">Tenant inquiries sent</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tab-nav-bar">
        <button
          onClick={() => setActiveTab('pending')}
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
        >
          <ShieldAlert size={18} /> Pending Approvals Queue ({pendingProperties.length})
        </button>

        <button
          onClick={() => setActiveTab('all-properties')}
          className={`tab-btn ${activeTab === 'all-properties' ? 'active' : ''}`}
        >
          <Building2 size={18} /> All Listings ({allProperties.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
        >
          <Users size={18} /> User Accounts ({usersList.length})
        </button>
      </div>

      {/* Pending Approvals Pipeline Queue */}
      {activeTab === 'pending' && (
        <div>
          {pendingProperties.length > 0 ? (
            <div className="seller-listings-list">
              {pendingProperties.map((prop) => (
                <div key={prop._id} className="card pending-card-item">
                  <div className="pending-card-inner">
                    <div className="pending-info-wrap">
                      <img
                        src={prop.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=300&q=80'}
                        alt={prop.title}
                        className="pending-thumb-img"
                      />
                      <div>
                        <div className="pending-meta-row">
                          <span className="badge badge-pending">Pending Review</span>
                          <span className="badge badge-pg">{prop.propertyType}</span>
                        </div>
                        <h3 className="pending-title">{prop.title}</h3>
                        <div className="pending-address-text">
                          {prop.location?.address} • Rent: <strong>{formatPrice(prop.price)}/mo</strong> (Deposit: {formatPrice(prop.deposit)})
                        </div>

                        <div className="pending-seller-box">
                          <strong>Submitted by Seller:</strong> {prop.sellerId?.name} ({prop.sellerId?.email} | {prop.sellerId?.phone})
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pending-actions-wrap">
                      <button onClick={() => handleApproveProperty(prop._id)} className="btn btn-primary btn-sm">
                        <CheckCircle2 size={16} /> Approve & Publish
                      </button>
                      <button onClick={() => setRejectProperty(prop)} className="btn btn-danger btn-sm">
                        <XCircle size={16} /> Reject with Reason
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Pending Queue is Clear!"
              description="There are currently no property listings waiting for admin approval."
              icon="inbox"
            />
          )}
        </div>
      )}

      {/* All Properties Tab */}
      {activeTab === 'all-properties' && (
        <div className="seller-listings-list">
          {allProperties.map((prop) => (
            <div key={prop._id} className="card all-prop-row">
              <div className="all-prop-info">
                <span className={`badge ${prop.status === 'approved' ? 'badge-approved' : prop.status === 'pending' ? 'badge-pending' : 'badge-rejected'}`}>
                  {prop.status}
                </span>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{prop.title}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Seller: {prop.sellerId?.name} • Rent: {formatPrice(prop.price)}/mo
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {prop.status === 'approved' && (
                  <button onClick={() => setRejectProperty(prop)} className="btn btn-secondary btn-sm btn-delete-prop">
                    Revoke Approval
                  </button>
                )}
                {prop.status === 'pending' && (
                  <button onClick={() => handleApproveProperty(prop._id)} className="btn btn-primary btn-sm">
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="seller-listings-list">
          {usersList.map((usr) => (
            <div key={usr._id} className="card user-row-item">
              <div className="user-row-left">
                <img src={usr.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} alt="User Avatar" className="user-row-avatar" />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{usr.name}</h4>
                    <span className={`badge ${usr.role === 'admin' ? 'badge-rejected' : usr.role === 'seller' ? 'badge-boosted' : 'badge-2bhk'}`}>
                      {usr.role.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {usr.email} • {usr.phone}
                  </div>
                </div>
              </div>

              {usr.role !== 'admin' && (
                <button onClick={() => handleDeleteUser(usr._id, usr.name)} className="btn btn-secondary btn-sm btn-delete-prop">
                  <Trash2 size={14} /> Delete User
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectProperty && (
        <RejectReasonModal
          property={rejectProperty}
          onClose={() => setRejectProperty(null)}
          onRejectSuccess={() => fetchAdminData()}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
