import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, User, LogIn, ChevronDown } from 'lucide-react';
import { useAuth } from './Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-2 sm:px-6">
        <div className="flex items-center space-x-3">
          {/* استبدل هذا السطر بصورة اللوجو */}
          <img 
            src="WhatsApp Image 2025-05-03 at 18.26.56_5b329edf 2@2x.png" // ضع هنا مسار الصورة
            alt="Logo"
            className="h-8 w-8 object-contain" // يمكنك تعديل الأبعاد حسب احتياجك
          />
          <h1 className="hidden text-2xl font-medium sm:block text-white">{t('common.welcome')}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 rounded-md bg-white/10 px-3 py-1 transition hover:bg-white/20"
          >
            <Globe className="h-5 w-5" />
            <span className="hidden sm:inline ">{t('common.language')}</span>
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center rounded-full p-1 transition hover:bg-black/20"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-md bg-black shadow-lg z-50"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsDropdownOpen(false);
                      }}
                      className="flex w-full items-center px-4 py-2  "
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('common.profile')}</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 "
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>{t('common.logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate('/login')}
                className="rounded-md border border-white bg-transparent px-3 py-1 text-white hover:bg-white/10"
              >
                {t('common.login')}
              </button>
              <button
                onClick={() => navigate('/register')}
                className="rounded-md bg-white px-3 py-1 text-green-600 hover:bg-white/90"
              >
                {t('common.register')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;