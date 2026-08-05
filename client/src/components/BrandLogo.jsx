import React from 'react';
import { Link } from 'react-router-dom';
import './BrandLogo.css';
import mylogo from '../../dist/RentHere.png';

const BrandLogo = ({ size = 'medium', showLink = true }) => {
  const sizeClass = `brand-logo-${size}`;
  const iconSizes = { small: 18, medium: 20, large: 24 };
  const iconSize = iconSizes[size] || 20;

  const LogoContent = (
    <div className={`brand-logo-container ${sizeClass}`}>
      <div className="brand-badge-box">
        <img className="brand-logo-image" src={mylogo} alt="Rent Here Logo" />
      </div>
      <span className="brand-logo-text">
        Rent<span className="brand-logo-highlight">Here</span>
      </span>
    </div>
  );

  if (showLink) {
    return <Link to="/" className="brand-logo-link">{LogoContent}</Link>;
  }

  return LogoContent;
};

export default BrandLogo;
