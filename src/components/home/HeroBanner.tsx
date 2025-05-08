import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';

import  HeroImage  from '../../../public/hero.jpg.jpg'

const HeroBanner: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div
      className="relative h-screen bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${HeroImage})` // ✅ نفس اسم الصورة الأصلي
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className={`absolute inset-0 ${isRTL
            ? 'bg-gradient-to-l from-black/60 to-transparent'
            : 'bg-gradient-to-r from-black/60 to-transparent'
          }`}
      />

      <div className="relative h-full pt-20 items-center">
        <div className={`container mx-auto px-8 ${isRTL ? 'pr-20' : 'pl-20'}`}>
          <div className={`max-w-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`space-y-3 ${isRTL ? 'items-end' : 'items-start'}`}>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex text-4xl md:text-5xl font-bold text-white"
              >
                {t('hero.title1')}
              </motion.h1>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex text-4xl md:text-5xl font-bold text-green-400"
              >
                {t('hero.title2')}
              </motion.h2>
            </div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-white my-6"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link
                to="/prevention"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <Upload size={20} />
                <span>{t('hero.cta')}</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
