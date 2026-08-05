import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BrandLogo from './BrandLogo';
import { Home, Heart, ShieldAlert, PlusCircle, LogIn, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onOpenAuthModal }) => {
  const { user, logoutUser, wishlist } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-glass">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <BrandLogo size="medium" />

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <Home size={18} className="nav-icon" />
              Marketplace
            </Link>
          </li>

          {user && user.role === 'buyer' && (
            <li>
              <Link to="/buyer-dashboard" className={`nav-link ${isActive('/buyer-dashboard') ? 'active' : ''}`}>
                <Heart size={18} className="nav-icon" />
                Wishlist & Inquiries
                {wishlist.length > 0 && (
                  <span className="badge badge-pg nav-badge">{wishlist.length}</span>
                )}
              </Link>
            </li>
          )}

          {user && user.role === 'seller' && (
            <li>
              <Link to="/seller-dashboard" className={`nav-link ${isActive('/seller-dashboard') ? 'active' : ''}`}>
                <PlusCircle size={18} className="nav-icon" />
                Seller Dashboard
              </Link>
            </li>
          )}

          {user && user.role === 'admin' && (
            <li>
              <Link to="/admin-dashboard" className={`nav-link ${isActive('/admin-dashboard') ? 'active' : ''}`}>
                <ShieldAlert size={18} className="nav-icon" />
                Admin Panel
              </Link>
            </li>
          )}
        </ul>

        {/* Action Controls */}
        <div className="nav-actions">
          {user ? (
            <div className="user-profile-bar">
              <span className={`badge ${user.role === 'admin' ? 'badge-rejected' : user.role === 'seller' ? 'badge-boosted' : 'badge-2bhk'}`}>
                {user.role === 'admin' ? 'Super Admin' : user.role === 'seller' ? 'Verified Landlord' : 'Tenant Seeker'}
              </span>

              <div className="user-avatar-box">
                <img src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} alt="Avatar" className="user-avatar-img" />
                <span className="user-name-text">{user.name.split(' ')[0]}</span>
              </div>

              <button onClick={logoutUser} className="btn btn-secondary btn-sm" title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuthModal} className="btn btn-primary">
              <LogIn size={18} />
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
