import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, MapPin, Phone, Mail, Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import './PropertyDetailsModal.css';

const PropertyDetailsModal = ({ property, onClose, onOpenAuthModal }) => {
  const { user, isWishlisted, toggleWishlist } = useContext(AuthContext);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  if (!property) return null;

  const wishlisted = isWishlisted(property._id);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const resolveImageUrl = (imgStr) => {
    if (!imgStr) return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80';
    if (imgStr.startsWith('/uploads')) {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      return `${baseUrl}${imgStr}`;
    }
    return imgStr;
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in as a Buyer to send an inquiry to the owner.');
      onOpenAuthModal();
      return;
    }

    if (user.role !== 'buyer') {
      toast.error('Only Buyer accounts can submit property inquiries.');
      return;
    }

    if (!inquiryMessage.trim()) {
      toast.error('Please write a brief inquiry message.');
      return;
    }

    try {
      setSendingInquiry(true);
      await axios.post('/api/inquiries', {
        propertyId: property._id,
        message: inquiryMessage,
      });
      toast.success('Inquiry sent successfully! The landlord will get back to you shortly.');
      setInquiryMessage('');
      setShowInquiryForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setSendingInquiry(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-container-large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-badges">
            <span className={`badge ${property.propertyType === 'PG - Boys' ? 'badge-pg' : property.propertyType === '1BHK' ? 'badge-1bhk' : 'badge-2bhk'}`}>
              {property.propertyType}
            </span>
            {property.isBoosted && (
              <span className="badge badge-boosted">
                <Sparkles size={12} /> Featured Listing ⚡
              </span>
            )}
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Main Image & Thumbnails */}
          <div className="details-section">
            <div className="gallery-main-wrap">
              <img
                src={property.images && property.images[activeImgIndex] ? resolveImageUrl(property.images[activeImgIndex]) : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'}
                alt={property.title}
                className="gallery-main-img"
              />
            </div>

            {property.images && property.images.length > 1 && (
              <div className="gallery-thumbs-row">
                {property.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={resolveImageUrl(img)}
                    alt={`Thumb ${idx}`}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`gallery-thumb-img ${activeImgIndex === idx ? 'active' : ''}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Title & Price Header */}
          <div className="details-header-row">
            <div>
              <h2 className="details-title">{property.title}</h2>
              <div className="details-address">
                <MapPin size={16} className="icon-emerald" />
                <span>{property.location?.address}</span>
              </div>
            </div>

            <div className="details-price-box">
              <div className="details-price-main">
                {formatPrice(property.price)} <span className="details-price-unit">/ mo</span>
              </div>
              <span className="details-deposit">
                Refundable Deposit: <strong>{formatPrice(property.deposit)}</strong>
              </span>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="details-section">
            <h4 className="details-section-title">About this property</h4>
            <p className="details-description-text">{property.description}</p>
          </div>

          {/* Amenities & Rules Grid */}
          <div className="details-grid-2col">
            {/* Amenities */}
            <div className="amenities-card-box">
              <h4 className="amenities-card-title">
                <CheckCircle2 size={18} className="icon-emerald" /> Included Amenities
              </h4>
              <div className="amenities-chips-wrap">
                {property.amenities && property.amenities.length > 0 ? (
                  property.amenities.map((item, idx) => (
                    <span key={idx} className="amenity-chip-modal">
                      ✓ {item}
                    </span>
                  ))
                ) : (
                  <span className="details-deposit">Standard amenities included.</span>
                )}
              </div>
            </div>

            {/* House Rules */}
            <div className="amenities-card-box">
              <h4 className="amenities-card-title">
                <ShieldCheck size={18} style={{ color: 'var(--accent-teal)' }} /> House Rules & Guidelines
              </h4>
              <ul className="rules-list">
                {property.rules && property.rules.length > 0 ? (
                  property.rules.map((rule, idx) => (
                    <li key={idx}>• {rule}</li>
                  ))
                ) : (
                  <li>• Standard residential conduct applies.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Landlord Contact Box */}
          <div className="landlord-contact-card">
            <div className="landlord-contact-inner">
              <div className="landlord-profile-info">
                <img
                  src={property.sellerId?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=landlord'}
                  alt="Landlord"
                  className="landlord-avatar-img"
                />
                <div>
                  <h4 className="landlord-name-text">
                    {property.sellerId?.name || 'Verified Property Owner'}
                  </h4>
                  <div className="landlord-details-row">
                    <span><Phone size={13} className="icon-inline" /> {user ? (property.sellerId?.phone || '+91 9876543210') : '+91 98765***** (Log in to view)'}</span>
                    <span><Mail size={13} className="icon-inline" /> {user ? (property.sellerId?.email || 'seller@renthere.com') : 'seller@***** (Log in to view)'}</span>
                  </div>
                </div>
              </div>

              {!user && (
                <button onClick={onOpenAuthModal} className="btn btn-primary btn-sm">
                  Sign In to Unlock Phone Number
                </button>
              )}
            </div>
          </div>

          {/* Direct Inquiry Form */}
          {user && user.role === 'buyer' && (
            <div className="inquiry-form-section">
              {!showInquiryForm ? (
                <button onClick={() => setShowInquiryForm(true)} className="btn btn-primary w-full">
                  <Send size={18} /> Send Direct Message / Inquiry to Landlord
                </button>
              ) : (
                <form onSubmit={handleSendInquiry} className="inquiry-form-card">
                  <h4 className="amenities-card-title">
                    <Send size={16} className="icon-emerald" /> Compose Inquiry to {property.sellerId?.name || 'Owner'}
                  </h4>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="e.g. Hello, I am looking to move in by next month. Can we schedule a site visit this Saturday?"
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    required
                  />
                  <div className="inquiry-form-actions">
                    <button type="button" onClick={() => setShowInquiryForm(false)} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                    <button type="submit" disabled={sendingInquiry} className="btn btn-primary btn-sm">
                      {sendingInquiry ? 'Sending Message...' : 'Submit Inquiry'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;
