import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddPropertyModal from '../components/AddPropertyModal';
import BoostModal from '../components/BoostModal';
import EmptyState from '../components/EmptyState';
import { PlusCircle, Sparkles, Trash2, MessageSquare, Building2 } from 'lucide-react';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'inquiries'

  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [boostProperty, setBoostProperty] = useState(null);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      const [propRes, inqRes] = await Promise.all([
        axios.get('/api/properties/seller'),
        axios.get('/api/inquiries/seller'),
      ]);
      setProperties(propRes.data);
      setInquiries(inqRes.data);
    } catch (error) {
      toast.error('Failed to load seller dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, []);

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) return;

    try {
      await axios.delete(`/api/properties/${id}`);
      toast.success('Property listing deleted');
      setProperties(properties.filter((p) => p._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      await axios.patch(`/api/inquiries/${inquiryId}/status`, { status: newStatus });
      toast.success(`Inquiry marked as ${newStatus}`);
      setInquiries(
        inquiries.map((inq) => (inq._id === inquiryId ? { ...inq, status: newStatus } : inq))
      );
    } catch (error) {
      toast.error('Status update failed');
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
      {/* Header Banner */}
      <div className="seller-header-banner">
        <div>
          <span className="badge badge-boosted" style={{ marginBottom: '0.4rem' }}>
            Landlord Control Center
          </span>
          <h1 className="dashboard-title">Welcome, {user?.name}</h1>
          <p className="dashboard-subtitle">
            Manage property listings, track admin approvals, boost advertisements, and process buyer inquiries.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-lg">
          <PlusCircle size={20} /> List New Property
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-nav-bar">
        <button
          onClick={() => setActiveTab('listings')}
          className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
        >
          <Building2 size={18} /> My Advertisements ({properties.length})
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
        >
          <MessageSquare size={18} /> Buyer Inquiries ({inquiries.length})
          {inquiries.some((i) => i.status === 'unread') && (
            <span className="badge badge-pg">New</span>
          )}
        </button>
      </div>

      {/* Content: Listings */}
      {activeTab === 'listings' && (
        <div>
          {loading ? (
            <p>Loading your properties...</p>
          ) : properties.length > 0 ? (
            <div className="seller-listings-list">
              {properties.map((prop) => (
                <div key={prop._id} className="card seller-property-card">
                  <div className="seller-prop-info-box">
                    <img
                      src={prop.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=300&q=80'}
                      alt={prop.title}
                      className="seller-prop-thumb"
                    />
                    <div>
                      <div className="seller-prop-meta">
                        <span className={`badge ${prop.status === 'approved' ? 'badge-approved' : prop.status === 'pending' ? 'badge-pending' : 'badge-rejected'}`}>
                          {prop.status === 'approved' ? 'Live / Approved' : prop.status === 'pending' ? 'Pending Admin Review' : 'Rejected'}
                        </span>

                        {prop.isBoosted && (
                          <span className="badge badge-boosted">
                            <Sparkles size={12} /> Featured Boost
                          </span>
                        )}
                        <span className="badge badge-pg">{prop.propertyType}</span>
                      </div>

                      <h3 className="seller-prop-title">{prop.title}</h3>
                      <p className="seller-prop-location">
                        {prop.location?.locality}, {prop.location?.city} • <strong>{formatPrice(prop.price)}/mo</strong>
                      </p>

                      {/* Display Rejection Reason if rejected */}
                      {prop.status === 'rejected' && prop.rejectionReason && (
                        <div className="seller-rejection-box">
                          <strong>Reason:</strong> {prop.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="seller-actions-group">
                    {prop.status === 'approved' && (
                      <button onClick={() => setBoostProperty(prop)} className="btn btn-outline-emerald btn-sm">
                        <Sparkles size={14} /> Boost Listing
                      </button>
                    )}

                    <button onClick={() => handleDeleteProperty(prop._id)} className="btn btn-secondary btn-sm btn-delete-prop">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Property Listings Created Yet"
              description="Click List New Property to post your PG accommodation, 1BHK, or 2BHK rental."
            />
          )}
        </div>
      )}

      {/* Content: Inquiries */}
      {activeTab === 'inquiries' && (
        <div>
          {inquiries.length > 0 ? (
            <div className="seller-listings-list">
              {inquiries.map((inq) => (
                <div key={inq._id} className="card inquiry-card">
                  <div className="inquiry-card-header">
                    <div className="inquiry-buyer-info">
                      <img
                        src={inq.buyerId?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=buyer'}
                        alt="Buyer"
                        className="inquiry-buyer-avatar"
                      />
                      <div>
                        <h4 className="inquiry-buyer-name">{inq.buyerId?.name || 'Tenant Seeker'}</h4>
                        <div className="inquiry-buyer-contact">
                          Phone: <strong>{inq.buyerId?.phone}</strong> • Email: <strong>{inq.buyerId?.email}</strong>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className={`badge ${inq.status === 'contacted' ? 'badge-approved' : inq.status === 'read' ? 'badge-2bhk' : 'badge-pending'}`}>
                        {inq.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="inquiry-message-box">
                    <strong>Inquiry for "{inq.propertyId?.title}":</strong> "{inq.message}"
                  </div>

                  <div className="inquiry-actions-row">
                    <button
                      onClick={() => handleUpdateInquiryStatus(inq._id, 'read')}
                      className="btn btn-secondary btn-sm"
                    >
                      Mark Read
                    </button>
                    <button
                      onClick={() => handleUpdateInquiryStatus(inq._id, 'contacted')}
                      className="btn btn-primary btn-sm"
                    >
                      Mark Contacted
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Buyer Inquiries Received"
              description="When interested tenants inquire about your listings, their messages will appear here."
              icon="inbox"
            />
          )}
        </div>
      )}

      {/* Add Property Modal */}
      {showAddModal && (
        <AddPropertyModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onPropertyCreated={(newProp) => {
            setProperties([newProp, ...properties]);
          }}
        />
      )}

      {/* Boost Modal */}
      {boostProperty && (
        <BoostModal
          property={boostProperty}
          onClose={() => setBoostProperty(null)}
          onBoostSuccess={(updatedProp) => {
            setProperties(properties.map((p) => (p._id === updatedProp._id ? updatedProp : p)));
          }}
        />
      )}
    </div>
  );
};

export default SellerDashboard;
