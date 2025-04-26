import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-12 w-12';
      case 'xl':
        return 'h-16 w-16';
      default:
        return 'h-8 w-8';
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${getSize()} animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600 dark:border-gray-600 dark:border-t-indigo-400`}
      />
    </div>
  );
};

export default LoadingSpinner; 