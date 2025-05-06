import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CtaSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`py-16 bg-gradient-to-r from-green-600 to-teal-500 text-white ${isRTL ? 'font-arabic' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl  text-white font-bold mb-4"
        >
          {t('cta.title')}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-lg text-white/90 mb-8 max-w-2xl mx-auto"
        >
          {t('cta.subtitle')}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Link
            to="/chat"
            className="inline-block bg-white text-teal-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-medium transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            {t('cta.button')}
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CtaSection;