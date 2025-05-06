import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Edit2, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

const ProfileTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const updatedUsers = registeredUsers.map((u: any) => {
          if (u.id === user.id) {
            return { 
              ...u, 
              name: formData.name, 
              email: formData.email 
            };
          }
          return u;
        });
        
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        
        const updatedUser = { 
          ...user, 
          name: formData.name, 
          email: formData.email
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      
      setSuccess(t('profile.updateSuccess'));
      setIsEditing(false);
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
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
    <div className="space-y-6">
      {error && (
        <div className="mb-4 flex items-center rounded-md bg-red-50 p-3 text-red-700">
          <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center rounded-md bg-green-50 p-3 text-green-700">
          <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h2 className="text-xl font-semibold text-gray-800">{t('profile.personalInfo')}</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center space-x-2 rounded-md px-4 py-2 transition ${
            isEditing 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-teal-500 text-white hover:bg-teal-600'
          }`}
        >
          <Edit2 size={18} />
          <span className={isRTL ? 'order-first' : ''}>{isEditing ? t('profile.cancelEdit') : t('profile.editProfile')}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={`block text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : ''}`}>
            {t('profile.name')}
          </label>
          <div className="relative mt-1">
            <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center`}>
              <User className="h-5 w-5 text-gray-400" />
            </div>
            {isEditing ? (
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full rounded-md border border-gray-300 ${isRTL ? 'pr-10 text-right' : 'pl-10'} py-2 focus:border-teal-500 focus:ring-teal-500`}
                required
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            ) : (
              <div className={`block w-full rounded-md border border-gray-200 bg-gray-50 ${isRTL ? 'pr-10 text-right' : 'pl-10'} py-2`}>
                {user?.name}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className={`block text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : ''}`}>
            {t('profile.email')}
          </label>
          <div className="relative mt-1">
            <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center`}>
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            {isEditing ? (
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full rounded-md border border-gray-300 ${isRTL ? 'pr-10 text-right' : 'pl-10'} py-2 focus:border-teal-500 focus:ring-teal-500`}
                required
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            ) : (
              <div className={`block w-full rounded-md border border-gray-200 bg-gray-50 ${isRTL ? 'pr-10 text-right' : 'pl-10'} py-2`}>
                {user?.email}
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <h3 className={`text-lg font-medium text-gray-900 ${isRTL ? 'text-right' : ''}`}>{t('profile.changePassword')}</h3>
            
            <div>
              <label htmlFor="currentPassword" className={`block text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : ''}`}>
                {t('profile.currentPassword')}
              </label>
              <div className="relative mt-1">
                <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center`}>
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`block w-full rounded-md border border-gray-300 ${isRTL ? 'pr-10 text-right' : 'pl-10'} py-2 focus:border-teal-500 focus:ring-teal-500`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className={`block text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : ''}`}>
                {t('profile.newPassword')}
              </label>
              <div className="relative mt-1">
                <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center`}>
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`block w-full rounded-md border border-gray-300 ${isRTL ? 'pr-10 text-right' : 'pl-10'} py-2 focus:border-teal-500 focus:ring-teal-500`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : ''}`}>
                {t('profile.confirmPassword')}
              </label>
              <div className="relative mt-1">
                <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center`}>
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${
                    passwordError ? 'border-red-500' : 'border-gray-300'
                  } ${isRTL ? 'pr-10 text-right' : 'pl-10'} py-2 focus:border-teal-500 focus:ring-teal-500`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              {passwordError && (
                <p className={`mt-1 text-xs text-red-600 ${isRTL ? 'text-right' : ''}`}>{passwordError}</p>
              )}
            </div>
          </div>
        )}

        {isEditing && (
          <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} pt-4`}>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center space-x-2 rounded-md bg-teal-500 px-6 py-2 text-white transition hover:bg-teal-600 ${
                loading ? 'cursor-not-allowed opacity-70' : ''
              }`}
            >
              {loading ? (
                <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Save size={18} className={isRTL ? 'order-last' : ''} />
              )}
              <span>{t('profile.saveChanges')}</span>
            </button>
          </div>
        )}
      </form>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className={`mb-4 text-lg font-medium text-gray-900 ${isRTL ? 'text-right' : ''}`}>{t('profile.healthSummary')}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-teal-50 p-4">
            <h4 className={`text-sm font-medium text-teal-800 ${isRTL ? 'text-right' : ''}`}>{t('profile.bloodPressure')}</h4>
            <p className={`mt-2 text-2xl font-bold text-teal-900 ${isRTL ? 'text-right' : ''}`}>120/80</p>
            <p className={`mt-1 text-sm text-teal-600 ${isRTL ? 'text-right' : ''}`}>{t('profile.lastMeasured')}</p>
          </div>
          
          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className={`text-sm font-medium text-blue-800 ${isRTL ? 'text-right' : ''}`}>{t('profile.heartRate')}</h4>
            <p className={`mt-2 text-2xl font-bold text-blue-900 ${isRTL ? 'text-right' : ''}`}>72 bpm</p>
            <p className={`mt-1 text-sm text-blue-600 ${isRTL ? 'text-right' : ''}`}>{t('profile.lastMeasured')}</p>
          </div>
          
          <div className="rounded-lg bg-purple-50 p-4">
            <h4 className={`text-sm font-medium text-purple-800 ${isRTL ? 'text-right' : ''}`}>{t('profile.glucose')}</h4>
            <p className={`mt-2 text-2xl font-bold text-purple-900 ${isRTL ? 'text-right' : ''}`}>95 mg/dL</p>
            <p className={`mt-1 text-sm text-purple-600 ${isRTL ? 'text-right' : ''}`}>{t('profile.lastMeasured')}</p>
          </div>
          
          <div className="rounded-lg bg-pink-50 p-4">
            <h4 className={`text-sm font-medium text-pink-800 ${isRTL ? 'text-right' : ''}`}>{t('profile.weight')}</h4>
            <p className={`mt-2 text-2xl font-bold text-pink-900 ${isRTL ? 'text-right' : ''}`}>70 kg</p>
            <p className={`mt-1 text-sm text-pink-600 ${isRTL ? 'text-right' : ''}`}>{t('profile.lastMeasured')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;