import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Sparkles, Zap, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import './BoostModal.css';

const BoostModal = ({ property, onClose, onBoostSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState(7);
  const [loading, setLoading] = useState(false);

  if (!property) return null;

  const handleActivateBoost = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`/api/properties/${property._id}/boost`, {
        boostDays: selectedPlan,
      });

      toast.success(`Boost activated successfully for "${property.title}"!`);
      if (onBoostSuccess) onBoostSuccess(res.data.property);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to activate boost');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container boost-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header boost-header">
          <div>
            <span className="badge badge-boosted" style={{ marginBottom: '0.25rem' }}>
              <Sparkles size={12} /> Priority Placement
            </span>
            <h3 className="boost-header-title">
              Boost Property Advertisement
            </h3>
          </div>
          <button onClick={onClose} className="boost-close-btn">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <p className="boost-target-desc">
            Target property: <strong>"{property.title}"</strong>. Choose a boost duration to lock top sorting on the public marketplace and attract up to 5x more tenant inquiries!
          </p>

          {/* Tier Cards */}
          <div className="boost-grid-2col">
            {/* 7-Day Plan */}
            <div
              onClick={() => setSelectedPlan(7)}
              className={`boost-plan-card ${selectedPlan === 7 ? 'active' : ''}`}
            >
              <div className="boost-plan-top">
                <Zap size={20} style={{ color: '#D97706' }} />
                {selectedPlan === 7 && <Check size={18} style={{ color: 'var(--accent-emerald-dark)' }} />}
              </div>
              <h4 className="boost-plan-title">7-Day Featured</h4>
              <div className="boost-plan-price">
                ₹299 <span className="boost-plan-sub">(Simulated)</span>
              </div>
              <ul className="boost-feature-list">
                <li>✓ "Featured ⚡" Badge</li>
                <li>✓ Top 3 Grid Placement</li>
                <li>✓ 7 Days Visibility</li>
              </ul>
            </div>

            {/* 30-Day Premium Plan */}
            <div
              onClick={() => setSelectedPlan(30)}
              className={`boost-plan-card ${selectedPlan === 30 ? 'active' : ''}`}
            >
              <div className="boost-plan-top">
                <Sparkles size={20} style={{ color: '#059669' }} />
                {selectedPlan === 30 && <Check size={18} style={{ color: 'var(--accent-emerald-dark)' }} />}
              </div>
              <h4 className="boost-plan-title">30-Day Premium</h4>
              <div className="boost-plan-price">
                ₹899 <span className="boost-plan-sub">(Simulated)</span>
              </div>
              <ul className="boost-feature-list">
                <li>✓ Ultra-Featured Gold Tag</li>
                <li>✓ Priority #1 Sort Rank</li>
                <li>✓ 30 Days Visibility</li>
              </ul>
            </div>
          </div>

          <div className="boost-notice-box">
            <ShieldCheck size={16} style={{ color: 'var(--accent-emerald)' }} />
            <span>
              Boosts are simulated in this demo. In a production environment, you would integrate with a payment gateway to process payments and activate boosts.
            </span>
          </div>
        </div>
        <div className="boost-footer-actions">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleActivateBoost} disabled={loading} className="btn btn-primary">
            {loading ? 'Activating Boost...' : `Activate ${selectedPlan}-Day Boost Now`}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoostModal;
