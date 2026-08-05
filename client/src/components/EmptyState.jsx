import React from 'react';
import { SearchX, Inbox, RefreshCw } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({ title, description, icon = 'search', onReset }) => {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon-wrap">
        {icon === 'inbox' ? <Inbox size={32} /> : <SearchX size={32} />}
      </div>
      <h3 className="empty-state-title">
        {title || 'No Approved Properties Found'}
      </h3>
      <p className="empty-state-desc">
        {description || 'Try clearing your filters or searching for a different city / property category.'}
      </p>
      {onReset && (
        <button onClick={onReset} className="btn btn-primary">
          <RefreshCw size={16} /> Clear Filters & Show All
        </button>
      )}
    </div>
  );
};

export default EmptyState;
