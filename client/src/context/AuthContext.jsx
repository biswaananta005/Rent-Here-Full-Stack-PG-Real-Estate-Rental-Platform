import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('rent_here_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('rent_here_token') || null;
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('rent_here_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const loginUser = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('rent_here_user', JSON.stringify(userData));
    localStorage.setItem('rent_here_token', tokenData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;
    toast.success(`Welcome back, ${userData.name}! Logged in as ${userData.role.toUpperCase()}`);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rent_here_user');
    localStorage.removeItem('rent_here_token');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Successfully logged out');
  };

  const toggleWishlist = (property) => {
    const exists = wishlist.some((item) => item._id === property._id);
    let updated;
    if (exists) {
      updated = wishlist.filter((item) => item._id !== property._id);
      toast.success('Removed from your wishlist');
    } else {
      updated = [...wishlist, property];
      toast.success('Added to your wishlist!');
    }
    setWishlist(updated);
    localStorage.setItem('rent_here_wishlist', JSON.stringify(updated));
  };

  const isWishlisted = (propertyId) => {
    return wishlist.some((item) => item._id === propertyId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        wishlist,
        loginUser,
        logoutUser,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
