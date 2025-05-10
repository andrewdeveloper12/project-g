import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Clock, HeartPulse, Activity, Droplets, Wind, Edit } from 'lucide-react';
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

// Mock health data
const mockHealthData = {
  normal: {
    bloodPressure: '120/80',
    heartRate: '72',
    bloodSugar: '90',
    oxygen: '98%'
  },
  elevated: {
    bloodPressure: '135/85',
    heartRate: '85',
    bloodSugar: '110',
    oxygen: '96%'
  },
  critical: {
    bloodPressure: '150/95',
    heartRate: '95',
    bloodSugar: '140',
    oxygen: '92%'
  }
};

const UserProfile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [healthStatus, setHealthStatus] = useState<'normal' | 'elevated' | 'critical'>('normal');
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
  const currentHealthData = mockHealthData[healthStatus];

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const healthMetricVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  const handleHealthStatusChange = () => {
    const statuses: Array<'normal' | 'elevated' | 'critical'> = ['normal', 'elevated', 'critical'];
    const currentIndex = statuses.indexOf(healthStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setHealthStatus(statuses[nextIndex]);
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
              ? 'border-teal-500 text-gray-700' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          } ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}
        >
          <User size={18} />
          <span>{t('profile.personalInfo')}</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center space-x-2 border-b-2 px-4 py-2 ${
            activeTab === 'history' 
              ? 'border-teal-500 text-black' 
              : 'border-transparent text-gray-500 hover:text-black'
          } ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}
        >
          <Clock size={18} />
          <span className="text-black">{t('profile.history')}</span>
        </button>
      </div>

      {/* Health Data Summary Section */}
      {activeTab === 'history' && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              onClick={handleHealthStatusChange}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <HeartPulse size={18} />
              <span>{t('profile.healthDataSummary')}</span>
            </button>
            
            <button
              onClick={() => console.log('Edit health data')}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
            >
              <Edit size={18} />
              <span>{t('profile.editHealthData')}</span>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              variants={healthMetricVariants}
              initial="hidden"
              animate="visible"
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Activity size={16} />
                <span className="text-sm">{t('profile.bloodPressure')}</span>
              </div>
              <div className="text-2xl font-bold">
                {currentHealthData.bloodPressure}
                <span className="text-sm text-gray-500 ml-1">mmHg</span>
              </div>
            </motion.div>

            <motion.div
              variants={healthMetricVariants}
              initial="hidden"
              animate="visible"
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <HeartPulse size={16} />
                <span className="text-sm">{t('profile.heartRate')}</span>
              </div>
              <div className="text-2xl font-bold">
                {currentHealthData.heartRate}
                <span className="text-sm text-gray-500 ml-1">bpm</span>
              </div>
            </motion.div>

            <motion.div
              variants={healthMetricVariants}
              initial="hidden"
              animate="visible"
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Droplets size={16} />
                <span className="text-sm">{t('profile.bloodSugar')}</span>
              </div>
              <div className="text-2xl font-bold">
                {currentHealthData.bloodSugar}
                <span className="text-sm text-gray-500 ml-1">mg/dL</span>
              </div>
            </motion.div>

            <motion.div
              variants={healthMetricVariants}
              initial="hidden"
              animate="visible"
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Wind size={16} />
                <span className="text-sm">{t('profile.oxygen')}</span>
              </div>
              <div className="text-2xl font-bold">
                {currentHealthData.oxygen}
              </div>
            </motion.div>
          </div>
        </div>
      )}

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