import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ count = 6 }) => {
  return (
    <div className="grid-marketplace">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="card card-property">
          <div className="skeleton skeleton-image" />
          <div className="card-body">
            <div className="skeleton skeleton-text-price" />
            <div className="skeleton skeleton-text-title" />
            <div className="skeleton skeleton-text-loc" />
            <div className="skeleton-chips-row">
              <div className="skeleton skeleton-chip" />
              <div className="skeleton skeleton-chip" />
              <div className="skeleton skeleton-chip" />
            </div>
            <div className="skeleton skeleton-btn" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
