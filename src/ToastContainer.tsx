import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastContainer: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        success: {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#FFFFFF',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#EF4444',
            color: '#FFFFFF',
          },
        },
        loading: {
          duration: Infinity,
          style: {
            background: '#3B82F6',
            color: '#FFFFFF',
          },
        },
      }}
    />
  );
};

export default ToastContainer;

export { ToastContainer }