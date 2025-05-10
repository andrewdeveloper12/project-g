import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Heart, Droplets, Activity, Wind, MessageCircle, ArrowRight } from 'lucide-react';

import HeroBanner from './HeroBanner';
import ArticlesSection from './ArticlesSection';
import CommunitySection from './CommunitySection';
import CtaSection from './CtaSection';

const Home: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Wind className="w-8 h-8 md:w-10 md:h-10 text-red-500" />,
      title: t('home.anemia'),
      description: t('home.anemiadesc'),
      path: '/anemia',
    },
    {
      icon: <Droplets className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />,
      title: t('home.Diabetes'),
      description: t('home.DiabetesDesc'),
      path: '/diabetes',
    },
    {
      icon: <Activity className="w-8 h-8 md:w-10 md:h-10 text-green-500" />,
      title: t('home.BloodPreasure'),
      description: t('home.BloodPreasureDesc'),
      path: '/blood-pressure',
    },
    {
      icon: <Heart className="w-8 h-8 md:w-10 md:h-10 text-purple-500" />,
      title: t('home.heartHealth'),
      description: t('home.heartHealthDesc'),
      path: '/heartAssessment',
    },
  ];

  const additionalFeatures = [
    {
      icon: <Shield className="w-10 h-10 md:w-12 md:h-12 text-teal-500" />,
      title: t('home.prevention'),
      description: t('home.preventionDesc'),
      path: '/prevention'
    },
    {
      icon: <MessageCircle className="w-10 h-10 md:w-12 md:h-12 text-orange-500" />,
      title: t('home.resources'),
      description: t('home.resourcesDesc'),
      path: '/resources'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroBanner />

      {/* Health Assessments Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-12 md:py-16 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-10 px-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('home.healthAssessmentsTitle')}</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
              {t('home.healthAssessmentsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
              >
                <div className="flex justify-center mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{feature.description}</p>
                <div className="flex justify-center">
                  <Link
                    to={feature.path}
                    className="inline-flex items-center text-xs sm:text-sm font-medium text-teal-600 hover:text-teal-800 transition-transform hover:translate-x-1"
                  >
                    <span className="mr-1">{t('home.startAssessment')}</span>
                    <ArrowRight size={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <CommunitySection />
      <ArticlesSection />
      <CtaSection />

      {/* Education Video Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-12 md:py-16 bg-white px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 md:mb-8 text-center">{t('home.educationResources')}</h2>
          <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg max-w-4xl mx-auto">
            <iframe
              className="w-full h-[200px] sm:h-[300px] md:h-[400px]"
              src="https://www.youtube.com/embed/nAsNFnsqqag?si=PdZhI_2mFMb5UFUv"
              title={t('home.educationResources')}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </motion.section>

      {/* Additional Resources Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-12 md:py-16 bg-gray-50 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-10 px-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('home.additionalResourcesTitle')}</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
              {t('home.additionalResourcesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-100 rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <div className="mb-3 sm:mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-gray-600">{feature.description}</p>
                <div className="flex justify-center">
                  <Link
                    to={feature.path}
                    className="inline-flex items-center text-xs sm:text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    <span className="mr-1">{t('home.learnMore')}</span>
                    <ArrowRight size={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;