import React from 'react';
import { Link } from 'react-router-dom';
import './BrandLogo.css';

const BrandLogo = ({ size = 'medium', showLink = true }) => {
  const sizeClass = `brand-logo-${size}`;

  const LogoContent = (
    <div className={`brand-logo-container ${sizeClass}`}>
      <div className="brand-badge-box">
        <svg
          viewBox="0 0 100 100"
          className="brand-emblem-svg"
          fill="none"
        >
          <path d="M 28 35 L 48 22 L 48 85 L 28 85 Z" fill="#ffffff" opacity="0.45" />
          <rect x="33" y="42" width="5" height="7" rx="1" fill="#059669" />
          <rect x="33" y="54" width="5" height="7" rx="1" fill="#059669" />
          
          <path d="M 48 20 L 72 26 L 72 85 L 48 85 Z" fill="#ffffff" opacity="0.7" />
          <rect x="54" y="32" width="6" height="8" rx="1" fill="#059669" />
          <rect x="54" y="44" width="6" height="8" rx="1" fill="#059669" />
          <rect x="54" y="56" width="6" height="8" rx="1" fill="#059669" />
          
          <path d="M 72 32 L 85 36 L 85 85 L 72 85 Z" fill="#ffffff" opacity="0.35" />
          
          <path d="M 20 62 L 50 42 L 80 62 L 72 62 L 72 86 L 28 86 L 28 62 Z" fill="#ffffff" />
          <path d="M 17 61 L 50 39 L 83 61" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          
          <rect x="42" y="65" width="16" height="14" rx="2" fill="#059669" />
          <line x1="50" y1="65" x2="50" y2="79" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="42" y1="72" x2="58" y2="72" stroke="#ffffff" strokeWidth="1.5" />
        </svg>
      </div>

      <span className="brand-logo-text">
        <span className="brand-text-dark">Rent</span>
        <span className="brand-text-emerald">Here</span>
      </span>
    </div>
  );

  if (showLink) {
    return <Link to="/" className="brand-logo-link">{LogoContent}</Link>;
  }

  return LogoContent;
};

export default BrandLogo;
