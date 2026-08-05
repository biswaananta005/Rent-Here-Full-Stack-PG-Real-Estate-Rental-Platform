import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Plus, Upload, Building2, ShieldAlert } from 'lucide-react';
import './AddPropertyModal.css';

const AddPropertyModal = ({ isOpen, onClose, onPropertyCreated }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('PG - Boys');
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');

  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const availableAmenities = [
    'Wi-Fi', 'Power Backup', 'Food Included', 'AC', 'Furnished', 
    'Housekeeping', 'Washing Machine', 'Biometric Entry', 'CCTV Security', 
    'Geyser', 'Covered Parking', 'Elevator', 'Gym', 'Swimming Pool'
  ];
  const [selectedAmenities, setSelectedAmenities] = useState(['Wi-Fi', 'Power Backup', 'AC']);
  const [rulesInput, setRulesInput] = useState('No smoking inside rooms, Visitors allowed till 9 PM');

  if (!isOpen) return null;

  const handleToggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages([...images, imageUrlInput.trim()]);
    setImageUrlInput('');
    toast.success('Image URL added');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImg(true);
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages([...images, res.data.imageUrl]);
      toast.success('Property image uploaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !price || !deposit || !locality || !address) {
      toast.error('Please fill in all mandatory property fields.');
      return;
    }

    if (images.length === 0) {
      toast.error('Please add at least 1 image URL or file upload.');
      return;
    }

    const rulesArray = rulesInput
      .split(',')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const payload = {
      title,
      description,
      propertyType,
      price: Number(price),
      deposit: Number(deposit),
      location: {
        city,
        locality,
        address,
      },
      images,
      amenities: selectedAmenities,
      rules: rulesArray,
    };

    try {
      setLoading(true);
      const res = await axios.post('/api/properties', payload);
      toast.success('Property submitted! Status set to "Pending Admin Review".');
      if (onPropertyCreated) onPropertyCreated(res.data);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container add-property-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={20} style={{ color: 'var(--accent-emerald)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>List New Property Advertisement</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Admin Pending Warning Note */}
          <div className="notice-pipeline-box">
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>
              <strong>Pipeline Notice:</strong> Newly created listings default to <code>"pending"</code> status and will be queued for Admin review before appearing on the public search feed.
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid-title-cat">
              <div className="form-group">
                <label className="form-label">Property Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Stanza Style Executive Boys PG with Food"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Property Category *</label>
                <select
                  className="form-select"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="PG - Boys">PG - Boys</option>
                  <option value="1BHK">1BHK Apartment</option>
                  <option value="2BHK">2BHK Apartment</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label">Monthly Rent (₹) *</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 8500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Security Deposit (₹) *</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 17000"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label">City *</label>
                <select
                  className="form-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Kota">Kota</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Locality / Area *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Koramangala 4th Block"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Street Address *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Plot #42, 80 Feet Road, Koramangala"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Property Description *</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Describe furnishings, balcony, proximity to tech parks/colleges..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Amenities Checkboxes */}
            <div className="form-group">
              <label className="form-label">Select Amenities</label>
              <div className="amenities-selector-wrap">
                {availableAmenities.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleToggleAmenity(amenity)}
                      className={`btn amenity-select-btn ${isChecked ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {isChecked ? '✓ ' : '+ '} {amenity}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Images */}
            <div className="form-group">
              <label className="form-label">Property Photos (URL or Local Upload)</label>
              <div className="upload-input-row">
                <input
                  type="url"
                  className="form-input"
                  placeholder="Paste image URL (e.g. Unsplash link)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                />
                <button type="button" onClick={handleAddImageUrl} className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                  <Plus size={14} /> Add URL
                </button>
                <label className="btn btn-outline-emerald btn-sm btn-upload-file">
                  <Upload size={14} /> {uploadingImg ? 'Uploading...' : 'File Upload'}
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="file-input-hidden" />
                </label>
              </div>

              {images.length > 0 && (
                <div className="image-previews-wrap">
                  {images.map((img, idx) => (
                    <div key={idx} className="image-preview-item">
                      <img src={img} alt="Preview" className="image-preview-thumb" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="image-preview-remove-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">House Rules (Comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Gate closes at 11 PM, No smoking, Visitors allowed till 8 PM"
                value={rulesInput}
                onChange={(e) => setRulesInput(e.target.value)}
              />
            </div>

            <div className="form-submit-actions">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Submitting...' : 'Submit Listing for Admin Approval'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyModal;
