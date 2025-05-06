import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLanguage);
    // Store language preference
    localStorage.setItem('i18nextLng', newLanguage);
    // Update document direction
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 p-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
      aria-label={`Switch to ${currentLanguage === 'ar' ? 'English' : 'Arabic'}`}
    >
      <Globe className="w-5 h-5" />
      <span className={currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}>
        {currentLanguage === 'ar' ? 'English' : 'العربية'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;