import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import Home from './pages/Home';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BuyerDashboard from './pages/BuyerDashboard';

import './App.css';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="app-layout-wrapper">
          {/* Toast Notification Container */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#0F172A',
                color: '#FFFFFF',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
              },
            }}
          />

          {/* Glassmorphic Navbar */}
          <Navbar onOpenAuthModal={() => setShowAuthModal(true)} />

          {/* Main Route Content */}
          <div className="app-main-content">
            <Routes>
              <Route path="/" element={<Home onOpenAuthModal={() => setShowAuthModal(true)} />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/buyer-dashboard" element={<BuyerDashboard onOpenAuthModal={() => setShowAuthModal(true)} />} />
            </Routes>
          </div>

          {/* Footer */}
          <Footer />

          {/* Auth Modal */}
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
