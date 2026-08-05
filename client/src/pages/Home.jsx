import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import HeroSection from '../components/HeroSection';
import PropertyCard from '../components/PropertyCard';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { Building2 } from 'lucide-react';
import './Home.css';

const Home = ({ onOpenAuthModal }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters initialized from URL query params
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || 'All');
  const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const urlCity = searchParams.get('city');
    const urlPropType = searchParams.get('propertyType');
    if (urlCity !== null) setCity(urlCity);
    if (urlPropType !== null) setPropertyType(urlPropType);
  }, [searchParams]);

  const fetchApprovedProperties = async () => {
    try {
      setLoading(true);
      let minPrice = '';
      let maxPrice = '';

      if (priceRange === 'under10k') {
        maxPrice = 10000;
      } else if (priceRange === '10k-20k') {
        minPrice = 10000;
        maxPrice = 20000;
      } else if (priceRange === '20k-40k') {
        minPrice = 20000;
        maxPrice = 40000;
      } else if (priceRange === 'above40k') {
        minPrice = 40000;
      }

      const params = {
        city,
        propertyType,
        minPrice,
        maxPrice,
        search: searchQuery,
      };

      const res = await axios.get('/api/properties', { params });
      setProperties(res.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedProperties();
  }, [city, propertyType, priceRange, searchQuery]);

  const handleResetFilters = () => {
    setCity('');
    setPropertyType('All');
    setPriceRange('All');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div>
      {/* Hero Search Section */}
      <HeroSection
        city={city}
        setCity={(val) => {
          setCity(val);
          setSearchParams((prev) => {
            if (val) prev.set('city', val);
            else prev.delete('city');
            return prev;
          });
        }}
        propertyType={propertyType}
        setPropertyType={(val) => {
          setPropertyType(val);
          setSearchParams((prev) => {
            if (val && val !== 'All') prev.set('propertyType', val);
            else prev.delete('propertyType');
            return prev;
          });
        }}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onResetFilters={handleResetFilters}
        totalResults={properties.length}
      />

      {/* Public Marketplace Grid */}
      <main className="container home-main-section">
        <div className="home-header-row">
          <div>
            <span className="badge badge-2bhk home-section-badge">
              <Building2 size={12} /> Live Marketplace Feed
            </span>
            <h2 className="home-section-title">Available PG & Rental Properties</h2>
          </div>

          <div className="home-count-text">
            Showing <strong>{properties.length}</strong> live approved listings
          </div>
        </div>

        {loading ? (
          <SkeletonLoader count={6} />
        ) : properties.length > 0 ? (
          <div className="grid-marketplace">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onSelectProperty={(prop) => setSelectedProperty(prop)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Matching Listings Found"
            description="There are currently no approved rental properties matching your selected city or filters."
            onReset={handleResetFilters}
          />
        )}
      </main>

      {/* Property Details Lightbox Modal */}
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

export default Home;
