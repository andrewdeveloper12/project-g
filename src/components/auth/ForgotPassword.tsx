import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Loader2 } from 'lucide-react';
import axios from 'axios';

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Call the CareLens API endpoint for the forgot password request
      const response = await axios.post(
        'https://carelens.up.railway.app/api/auth/forgot-password', // Use correct endpoint for forgot-password
        { email }
      );
      
      // Simulate a successful response
      if (response.status === 200) {
        setMessage(t('forgotPassword.successMessage'));
      }
    } catch (err: any) {
      setError(t('forgotPassword.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="w-full max-w-md p-8 space-y-12 bg-white rounded-xl shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{t('forgotPassword.title')}</h1>
          <p className="text-sm text-gray-600">
            {t('forgotPassword.subtitle')}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {message ? (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-sm text-green-700">{message}</p>
            <Link 
              to="/login" 
              className="mt-2 inline-block text-sm font-medium text-teal-600 hover:text-teal-500"
            >
              {t('forgotPassword.backToLogin')}
            </Link>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('forgotPassword.emailLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder={t('forgotPassword.emailPlaceholder')}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    {t('forgotPassword.sending')}
                  </>
                ) : (
                  t('forgotPassword.submitButton')
                )}
              </button>
            </div>

            <div className="text-center text-sm">
              <Link 
                to="/login" 
                className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
              >
                {t('forgotPassword.rememberPassword')}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
