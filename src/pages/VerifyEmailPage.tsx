import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../components/Context/AuthContext';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const VerifyEmailPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { verifyEmail, loading, error, clearError } = useAuth();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [success, setSuccess] = useState('');

  const email = location.state?.email || '';
  const isRTL = i18n.language === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyEmail(email, otp);
      setSuccess(t('auth.verificationSuccess'));
    } catch (err) {
      // Error handled by auth context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md"
      >
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-teal-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('auth.verifyEmailTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.verifyEmailSubtitle')} <span className="font-medium">{email}</span>
          </p>
        </div>

        {error && (
          <div className={`p-4 rounded-md bg-red-50 text-red-700 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <AlertCircle className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className={`p-4 rounded-md bg-green-50 text-green-700 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CheckCircle className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
            <span>{success}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              {t('auth.verificationCode')}
            </label>
            <div className="mt-1 relative">
              <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  clearError();
                }}
                className={`appearance-none block w-full ${
                  isRTL ? 'pr-10' : 'pl-10'
                } px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
                placeholder={t('auth.verificationCodePlaceholder')}
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Mail className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            )}
            {t('auth.verifyEmailButton')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;