import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Heart, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import './PropertyCard.css';

const PropertyCard = ({ property, onSelectProperty }) => {
  const { toggleWishlist, isWishlisted } = useContext(AuthContext);
  const wishlisted = isWishlisted(property._id);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case 'PG - Boys':
        return 'badge-pg';
      case '1BHK':
        return 'badge-1bhk';
      case '2BHK':
        return 'badge-2bhk';
      default:
        return 'badge-pg';
    }
  };

  const mainImage = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="card-property">
      {/* Image Wrap */}
      <div className="card-image-wrap">
        <img src={mainImage} alt={property.title} loading="lazy" />

        <div className="card-badges-top">
          <span className={`badge ${getBadgeClass(property.propertyType)}`}>
            {property.propertyType}
          </span>
          {property.isBoosted && (
            <span className="badge badge-boosted">
              <Sparkles size={12} /> Featured ⚡
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(property);
          }}
          className={`card-wishlist-btn ${wishlisted ? 'active' : ''}`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={18} fill={wishlisted ? '#E11D48' : 'none'} />
        </button>
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="card-price-row">
          <div className="card-price">
            {formatPrice(property.price)} <span className="card-price-unit">/ month</span>
          </div>
          <span className="card-deposit-text">
            Deposit: {formatPrice(property.deposit)}
          </span>
        </div>

        <h3 className="card-title" title={property.title}>
          {property.title}
        </h3>

        <div className="card-location">
          <MapPin size={14} className="card-location-icon" />
          <span className="card-location-text">
            {property.location?.locality}, {property.location?.city}
          </span>
        </div>

        {/* Key Amenities */}
        <div className="card-amenities-tags">
          {property.amenities && property.amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="amenity-chip">
              <CheckCircle2 size={10} className="amenity-check-icon" />
              {amenity}
            </span>
          ))}
          {property.amenities && property.amenities.length > 3 && (
            <span className="amenity-chip amenity-chip-more">
              +{property.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="card-footer">
          <div className="card-seller-info">
            <img
              src={property.sellerId?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=landlord'}
              alt="Seller"
              className="card-seller-avatar"
            />
            <div className="card-seller-detail">
              <span className="card-seller-name">{property.sellerId?.name || 'Verified Owner'}</span>
              <span className="card-seller-verified">
                <ShieldCheck size={10} /> Verified
              </span>
            </div>
          </div>

          <button
            onClick={() => onSelectProperty(property)}
            className="btn btn-outline-emerald btn-sm"
          >
            View Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
