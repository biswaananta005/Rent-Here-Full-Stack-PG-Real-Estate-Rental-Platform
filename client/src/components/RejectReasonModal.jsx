import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, AlertTriangle } from 'lucide-react';
import './RejectReasonModal.css';

const RejectReasonModal = ({ property, onClose, onRejectSuccess }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toast.error('Please specify a rejection reason for the landlord.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.patch(`/api/admin/properties/${property._id}/reject`, {
        rejectionReason,
      });

      toast.success(`Property "${property.title}" has been rejected.`);
      if (onRejectSuccess) onRejectSuccess(res.data.property);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container reject-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header reject-modal-header">
          <div className="reject-header-title">
            <AlertTriangle size={20} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Reject Property Listing</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn" style={{ color: 'var(--status-rejected-text)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="reject-target-desc">
            Target property: <strong>"{property.title}"</strong> (Submitted by {property.sellerId?.name || 'Seller'}).
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Reason for Rejection *</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="e.g. Property photos lack sufficient lighting, unverified ownership address, or misleading rent figures."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
            </div>

            <div className="reject-actions-row">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-danger">
                {loading ? 'Rejecting...' : 'Confirm Listing Rejection'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RejectReasonModal;
