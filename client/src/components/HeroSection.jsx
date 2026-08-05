import React from 'react';
import { Search, MapPin, Home, IndianRupee, Sparkles, Filter, X } from 'lucide-react';
import './HeroSection.css';

const HeroSection = ({
  city,
  setCity,
  propertyType,
  setPropertyType,
  priceRange,
  setPriceRange,
  searchQuery,
  setSearchQuery,
  onResetFilters,
  totalResults,
}) => {
  return (
    <section className="hero-banner">
      <div className="container">
        <div className="hero-pill">
          <Sparkles size={14} /> 100% Admin-Verified Property Listings
        </div>

        <h1 className="hero-title">
          Find. Connect. <span className="hero-title-accent">Move In.</span>
        </h1>

        <p className="hero-subtitle">
          Search premium PG accommodations for boys, cozy 1BHK flats, and luxury 2BHK rental apartments with verified landlord contact details.
        </p>

        {/* Interactive Search & Filter Card */}
        <div className="search-filter-card">
          <div className="search-filter-grid">
            {/* Search Keyword */}
            <div className="input-relative">
              <label className="form-label form-label-uppercase">
                Search Keyword
              </label>
              <div className="input-relative">
                <Search size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input input-padded"
                  placeholder="e.g. Koramangala, Wi-Fi, Balcony..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Location / City */}
            <div>
              <label className="form-label form-label-uppercase">
                City / Location
              </label>
              <div className="input-relative">
                <MapPin size={18} className="input-icon" />
                <select
                  className="form-select input-padded"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">All Cities</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi NCR">Delhi NCR / Gurugram</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Kota">Kota</option>
                </select>
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="form-label form-label-uppercase">
                Property Category
              </label>
              <div className="input-relative">
                <Home size={18} className="input-icon" />
                <select
                  className="form-select input-padded"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="All">All Types (PG, 1BHK, 2BHK)</option>
                  <option value="PG - Boys">PG - Boys</option>
                  <option value="1BHK">1BHK Apartment</option>
                  <option value="2BHK">2BHK Apartment</option>
                </select>
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="form-label form-label-uppercase">
                Monthly Budget
              </label>
              <div className="input-relative">
                <IndianRupee size={18} className="input-icon" />
                <select
                  className="form-select input-padded"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="All">Any Rent</option>
                  <option value="under10k">Under ₹10,000/mo</option>
                  <option value="10k-20k">₹10,000 - ₹20,000/mo</option>
                  <option value="20k-40k">₹20,000 - ₹40,000/mo</option>
                  <option value="above40k">Above ₹40,000/mo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Active Filter Bar */}
          <div className="filter-bar-bottom">
            <div className="filter-count-info">
              <Filter size={14} /> Showing <strong>{totalResults}</strong> verified live propert{totalResults === 1 ? 'y' : 'ies'}
            </div>

            {(city || propertyType !== 'All' || priceRange !== 'All' || searchQuery) && (
              <button
                onClick={onResetFilters}
                className="btn btn-secondary btn-sm btn-reset-filter"
              >
                <X size={14} /> Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
