import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { ShieldCheck, CheckCircle2, Headphones, Code2 } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrap">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="footer-logo-box">
              <BrandLogo size="medium" />
            </div>
            <p className="footer-desc">
              Find. Connect. Move In. <br />
              India's premier verified rental portal for Boys PG accommodations, 1BHK, and 2BHK homes.
            </p>
            <div className="footer-verify-tag">
              <ShieldCheck size={16} /> 100% Verified Landlords & Zero Brokerage
            </div>
          </div>

          {/* Property Categories */}
          <div>
            <h4 className="footer-heading">Property Categories</h4>
            <ul className="footer-link-list">
              <li>
                <Link to="/?propertyType=PG%20-%20Boys" className="footer-link-item">
                  Boys PG & Co-Living Spaces
                </Link>
              </li>
              <li>
                <Link to="/?propertyType=1BHK" className="footer-link-item">
                  1BHK Furnished Apartments
                </Link>
              </li>
              <li>
                <Link to="/?propertyType=2BHK" className="footer-link-item">
                  2BHK Luxury Gated Residency
                </Link>
              </li>
              <li>
                <Link to="/?city=Bhubaneswar&propertyType=PG%20-%20Boys" className="footer-link-item">
                  Infocity Scholar PGs (Bhubaneswar)
                </Link>
              </li>
              <li>
                <Link to="/?city=Hyderabad&propertyType=PG%20-%20Boys" className="footer-link-item">
                  Hitech City Boys PGs (Hyderabad)
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Locations */}
          <div>
            <h4 className="footer-heading">Featured Rental Hubs</h4>
            <ul className="footer-link-list">
              <li>
                <Link to="/?city=Bengaluru" className="footer-link-item">
                  Bengaluru (Koramangala, Indiranagar)
                </Link>
              </li>
              <li>
                <Link to="/?city=Hyderabad" className="footer-link-item">
                  Hyderabad (Hitech City, Gachibowli)
                </Link>
              </li>
              <li>
                <Link to="/?city=Bhubaneswar" className="footer-link-item">
                  Bhubaneswar (Patia, Saheed Nagar)
                </Link>
              </li>
              <li>
                <Link to="/?city=Chennai" className="footer-link-item">
                  Chennai (Velachery, OMR Corridor)
                </Link>
              </li>
              <li>
                <Link to="/?city=Pune" className="footer-link-item">
                  Pune (Viman Nagar, Hinjewadi)
                </Link>
              </li>
              <li>
                <Link to="/?city=Delhi%20NCR" className="footer-link-item">
                  Delhi NCR (Gurugram Sec 43, Noida)
                </Link>
              </li>
              <li>
                <Link to="/?city=Mumbai" className="footer-link-item">
                  Mumbai (Andheri West, Bandra)
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety Assurance */}
          <div>
            <h4 className="footer-heading">Trust & Assurance</h4>
            <ul className="footer-trust-list">
              <li className="footer-trust-item">
                <CheckCircle2 size={14} className="footer-icon-emerald" /> Direct Landlord Contact Reveal
              </li>
              <li className="footer-trust-item">
                <CheckCircle2 size={14} className="footer-icon-emerald" /> Admin-Approved Property Listings
              </li>
              <li className="footer-trust-item">
                <CheckCircle2 size={14} className="footer-icon-emerald" /> Transparent Security Deposit Terms
              </li>
              <li className="footer-trust-item">
                <Headphones size={14} className="footer-icon-emerald" /> 24/7 Tenant Assistance
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © 2026 Rent Here Technologies Inc. All rights reserved. Find. Connect. Move In.
          </div>
          <div className="footer-author-badge">
            <Code2 size={14} /> Developed by Biswa Ananta
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
