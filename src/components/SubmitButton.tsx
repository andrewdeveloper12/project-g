import React from 'react';
import { motion } from 'framer-motion';

interface SubmitButtonProps {
  onClick: () => void;
  isLoading: boolean;
  color: 'green' | 'red' | 'blue' | 'purple';
  label: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  onClick, 
  isLoading, 
  color, 
  label 
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'bg-green-500 hover:bg-green-600';
      case 'red':
        return 'bg-red-500 hover:bg-red-600';
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'purple':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading}
      className={`px-6 py-2 rounded-lg text-white font-medium ${getColorClasses()} 
                transition duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {label}
        </div>
      ) : (
        label
      )}
    </motion.button>
  );
};

export default SubmitButton;