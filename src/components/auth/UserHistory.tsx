import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../Context/AuthContext';
import { User, Mail, Lock, Edit2, Save, AlertCircle, CheckCircle } from 'lucide-react';

const UserHistory: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    if (name === 'newPassword' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const validateForm = () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setPasswordError(t('auth.passwordMismatch'));
      return false;
    }
    if (formData.newPassword && formData.newPassword.length < 6) {
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
      // In a real app, you would call an API to update the user profile
      // For this mock app, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(t('profile.updateSuccess'));
      setIsEditing(false);
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(t('profile.updateError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-md"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
          <div className="mb-6 md:mb-0 md:mr-8 flex flex-col items-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-teal-500"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-teal-100 flex items-center justify-center border-4 border-teal-500">
                <User className="w-16 h-16 text-teal-500" />
              </div>
            )}
            <button
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition flex items-center"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {t('profile.changePhoto')}
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{t('profile.title')}</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-md flex items-center ${
                  isEditing 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    : 'bg-teal-500 text-white hover:bg-teal-600'
                } transition`}
              >
                {isEditing ? (
                  <>
                    <Edit2 className="w-4 h-4 mr-2" />
                    {t('profile.cancelEdit')}
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-2" />
                    {t('profile.editProfile')}
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.name')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.email')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">{t('profile.changePassword')}</h3>
                  
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('profile.currentPassword')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('profile.newPassword')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('profile.confirmPassword')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          passwordError ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {passwordError && (
                      <p className="mt-1 text-xs text-red-600">{passwordError}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition flex items-center ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {t('profile.saveChanges')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('profile.name')}</h3>
                  <p className="mt-1 text-lg font-medium text-gray-800">{user?.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('profile.email')}</h3>
                  <p className="mt-1 text-lg font-medium text-gray-800">{user?.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('profile.accountType')}</h3>
                  <p className="mt-1 text-lg font-medium text-gray-800">
                    {user?.provider === 'google' 
                      ? t('profile.googleAccount')
                      : user?.provider === 'facebook'
                        ? t('profile.facebookAccount')
                        : t('profile.emailAccount')}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('profile.memberSince')}</h3>
                  <p className="mt-1 text-lg font-medium text-gray-800">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Health Data Summary */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{t('profile.healthSummary')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-teal-800 mb-2">{t('profile.bloodPressure')}</h3>
              <p className="text-2xl font-bold text-teal-900">118/75 <span className="text-sm font-normal">mmHg</span></p>
              <p className="text-xs text-teal-700 mt-1">{t('profile.lastMeasured')}: {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-800 mb-2">{t('profile.heartRate')}</h3>
              <p className="text-2xl font-bold text-red-900">72 <span className="text-sm font-normal">bpm</span></p>
              <p className="text-xs text-red-700 mt-1">{t('profile.lastMeasured')}: {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 mb-2">{t('profile.glucose')}</h3>
              <p className="text-2xl font-bold text-green-900">88 <span className="text-sm font-normal">mg/dL</span></p>
              <p className="text-xs text-green-700 mt-1">{t('profile.lastMeasured')}: {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-800 mb-2">{t('profile.hemoglobin')}</h3>
              <p className="text-2xl font-bold text-purple-900">14.2 <span className="text-sm font-normal">g/dL</span></p>
              <p className="text-xs text-purple-700 mt-1">{t('profile.lastMeasured')}: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">
              {t('profile.viewFullHistory')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserHistory;