import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import EmptyState from '../components/EmptyState';
import { Heart, Send } from 'lucide-react';
import './BuyerDashboard.css';

const BuyerDashboard = ({ onOpenAuthModal }) => {
  const { user, wishlist } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('wishlist'); // 'wishlist' | 'inquiries'
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    if (user && user.role === 'buyer') {
      fetchBuyerInquiries();
    }
  }, [user]);

  const fetchBuyerInquiries = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/inquiries/buyer');
      setInquiries(res.data);
    } catch (error) {
      console.error('Error fetching buyer inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container dashboard-container">
      {/* Header */}
      <div className="buyer-header-banner">
        <span className="badge badge-2bhk buyer-header-badge">
          Tenant Seeker Hub
        </span>
        <h1 className="dashboard-title">Welcome, {user?.name}</h1>
        <p className="dashboard-subtitle">
          Manage your saved property wishlist and track responses from landlords for submitted inquiries.
        </p>
      </div>

      {/* Tabs */}
      <div className="tab-nav-bar">
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
        >
          <Heart size={18} /> Saved Wishlist ({wishlist.length})
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
        >
          <Send size={18} /> Sent Inquiries ({inquiries.length})
        </button>
      </div>

      {/* Wishlist Grid */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlist.length > 0 ? (
            <div className="grid-marketplace">
              {wishlist.map((prop) => (
                <PropertyCard
                  key={prop._id}
                  property={prop}
                  onSelectProperty={(p) => setSelectedProperty(p)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Your Wishlist is Empty"
              description="Click the heart icon on any PG or rental listing to bookmark it for quick access."
            />
          )}
        </div>
      )}

      {/* Sent Inquiries Log */}
      {activeTab === 'inquiries' && (
        <div>
          {inquiries.length > 0 ? (
            <div className="seller-listings-list">
              {inquiries.map((inq) => (
                <div key={inq._id} className="card buyer-inquiry-item">
                  <div className="buyer-inquiry-header">
                    <div>
                      <h4 className="buyer-inquiry-title">
                        Inquiry for "{inq.propertyId?.title}"
                      </h4>
                      <p className="buyer-inquiry-sub">
                        Landlord: <strong>{inq.sellerId?.name}</strong> ({inq.sellerId?.phone} | {inq.sellerId?.email})
                      </p>
                    </div>

                    <span className={`badge ${inq.status === 'contacted' ? 'badge-approved' : inq.status === 'read' ? 'badge-2bhk' : 'badge-pending'}`}>
                      {inq.status === 'contacted' ? 'Landlord Contacted You' : inq.status === 'read' ? 'Message Read' : 'Awaiting Reply'}
                    </span>
                  </div>

                  <div className="buyer-inquiry-msg">
                    "{inq.message}"
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Inquiries Sent Yet"
              description="Browse approved listings on the homepage and click 'Send Direct Message to Landlord' to submit an inquiry."
              icon="inbox"
            />
          )}
        </div>
      )}

      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onOpenAuthModal={onOpenAuthModal}
        />
      )}
    </div>
  );
};

export default BuyerDashboard;
