import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Clock } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import ProfileTab from '../auth/ProfileTab';
import HealthHistoryTab from './HealthHistoryTab';
import LanguageSwitcher from '../auth/LanguageSwitcher';

// Mock user for dev (remove in production)
const mockUser = {
  id: 'user123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
  role: 'patient'
};

const UserProfile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const isRTL = i18n.language === 'ar';
  
  // Set mock user for development (remove in production)
  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('currentUser')) {
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      window.location.reload();
    }
    
    // Load preferred language
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [isAuthenticated, i18n]);

  const displayedUser = user || mockUser;

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="">
        <LanguageSwitcher />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 to-green-600 p-8 shadow-lg"
      >
        <div className={`flex flex-col items-center md:flex-row ${isRTL ? 'md:space-x-reverse' : ''} md:space-x-8`}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-md md:mb-0"
          >
            <img 
              src={displayedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayedUser.name)}`} 
              alt={displayedUser.name} 
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div className={`text-center text-white ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
            <motion.h1 
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-bold"
            >
              {displayedUser.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg opacity-90"
            >
              {displayedUser.email}
            </motion.p>
            {displayedUser.role && (
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-sm"
              >
                {t(`profile.role.${displayedUser.role.toLowerCase()}`)}
              </motion.span>
            )}
          </div>
        </div>
      </motion.div>

      <div className={`mb-6 flex border-b ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 border-b-2 px-4 py-2 ${
            activeTab === 'profile' 
              ? 'border-teal-500 text-black' 
              : 'border-transparent text-gray-500 hover:text-black-700'
          } ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}
        >
          <User size={18} />
          <span>{t('profile.personalInfo')}</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center space-x-2 border-b-2 px-4 py-2 ${
            activeTab === 'history' 
              ? 'border-teal-500 text-black-600' 
              : 'border-transparent text-black hover:text-black-700'
          } ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}
        >
          <Clock size={18} />
          <span>{t('profile.history')}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={tabVariants}
          className="rounded-lg bg-white p-6 shadow-md"
        >
          {activeTab === 'profile' ? <ProfileTab /> : <HealthHistoryTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;