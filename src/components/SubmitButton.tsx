import React from 'react';

interface SubmitButtonProps {
  onClick: () => void;
  isLoading: boolean;
  color: 'green' | 'red' | 'blue' |  'purple';
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
        return 'bg-green-500 hover:bg-green-600 focus:ring-green-300';
      case 'red':
        return 'bg-red-500 hover:bg-red-600 focus:ring-red-300';
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300';
      case 'purple':
        return 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-300';
      default:
        return 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-300';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`${getColorClasses()} text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center 
      mr-2 inline-flex items-center justify-center transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-4 focus:ring-opacity-50 w-full
      disabled:opacity-70 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {label}...
        </>
      ) : (
        label
      )}
    </button>
  );
};

export default SubmitButton;