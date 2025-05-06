import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { KeyRound, Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    if (name === 'confirmPassword' || name === 'password') {
      setPasswordError('');
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError(t('auth.passwordMismatch'));
      return false;
    }
    if (formData.password.length < 6) {
      setPasswordError(t('auth.passwordTooShort'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // In a real app, you would call an API to reset the password
      // For this mock app, we'll simulate a successful password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(t('auth.resetPasswordError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-md"
      >
        <div className="text-center mb-8">
          <KeyRound className="w-12 h-12 text-teal-500 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">{t('auth.resetPasswordTitle')}</h1>
          <p className="text-gray-600">{t('auth.resetPasswordSubtitle')}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="text-center">
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{t('auth.passwordResetSuccess')}</span>
            </div>
            <p className="text-gray-600 mb-6">{t('auth.redirectingToLogin')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.newPassword')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder={t('auth.newPasswordPlaceholder')}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">{t('auth.passwordRequirements')}</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    passwordError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                />
              </div>
              {passwordError && (
                <p className="mt-1 text-xs text-red-600">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <KeyRound className="w-5 h-5 mr-2" />
              )}
              {t('auth.updatePasswordButton')}
            </button>

            <div className="text-center mt-4">
              <Link
                to="/login"
                className="inline-flex items-center text-teal-600 hover:text-teal-500 text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {t('auth.backToLogin')}
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;