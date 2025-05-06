import React from 'react';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  fullScreen = false, 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  const containerClasses = fullScreen 
    ? 'flex justify-center items-center h-screen' 
    : 'flex justify-center items-center';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div 
        className={`animate-spin rounded-full border-t-transparent ${sizeClasses[size]} border-teal-500`}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;