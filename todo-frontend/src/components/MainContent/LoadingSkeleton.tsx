import React from 'react';

const LoadingSkeleton = () => {
  const skeletonRows = [1, 2, 3];

  return (
    <div className="skeleton-container" aria-busy="true" aria-live="polite">
      {skeletonRows.map((n) => (
        <div key={n} className="skeleton-item" style={{ listStyle: 'none' }}>
          <div 
            className="skeleton-shimmer" 
            style={{ 
              height: '60px', 
              borderRadius: '12px', 
              marginBottom: '12px',
              backgroundColor: 'var(--bg-secondary)', 
              opacity: 0.6
            }} 
          />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;