import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, Facebook } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { login, loginWithGoogle, loginWithFacebook, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const isRTL = i18n.language === 'ar';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password, formData.remember);
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8"  dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-md"
      >
        <div className="text-center mb-8">
          <LogIn className="w-12 h-12 text-teal-500 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">{t('auth.loginTitle')}</h1>
          <p className="text-gray-600">{t('auth.loginSubtitle')}</p>
        </div>

        {error && (
          <div className={`mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <AlertCircle className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'} flex-shrink-0`} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.email')}
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`${isRTL ? 'pr-10' : 'pl-10'} w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                placeholder={t('auth.emailPlaceholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          <div>
            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center mb-1`}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.password')}
              </label>
              <Link to="/forgot-password" className="text-sm text-teal-600 hover:text-teal-500">
                {t('auth.forgotPassword')}
              </Link>
            </div>
            <div className="relative">
              <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`${isRTL ? 'pr-10' : 'pl-10'} w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                placeholder={t('auth.passwordPlaceholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={formData.remember}
              onChange={handleChange}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className={`${isRTL ? 'mr-2' : 'ml-2'} block text-sm text-gray-700`}>
              {t('auth.rememberMe')}
            </label>
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
              <LogIn className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            )}
            {t('auth.loginButton')}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">{t('auth.orContinueWith')}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={loginWithGoogle}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
            </button>
            <button
              onClick={loginWithFacebook}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Facebook className="h-5 w-5 text-blue-600" />
            </button>
          </div>
        </div>

        <p className={`mt-6 text-center text-sm text-gray-600 ${isRTL ? 'flex flex-row-reverse justify-center' : ''}`}>
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-medium text-teal-600 hover:text-teal-500">
            {t('auth.registerNow')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;