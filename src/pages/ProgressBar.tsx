import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
    const percentage = Math.round((completed / total) * 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className="bg-blue-500 h-4 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
      <div className="text-right text-sm mt-1">
        {completed}/{total} ({percentage}%)
      </div>
    </div>
  );
};

export default ProgressBar;