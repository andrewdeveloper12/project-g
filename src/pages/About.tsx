import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Heart, Users, Award, Clock, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const { t } = useTranslation();

  const egyptianScientists = [
    {
      id: 1,
      name: 'Dr. Magdi Yacoub',
      title: t('about.cardiacSurgeon'),
      bio: t('about.magdiBio'),
      image: 'https://www.alainelkanninterviews.com/wp-content/uploads/2016/11/Headshot-Yacoub-390360.jpg',
      searchQuery: 'Magdi+Yacoub+site:wikipedia.org'
    },
    {
      id: 2,
      name: 'Dr. Hatem El-Gabaly',
      title: t('about.radiologyPioneer'),
      bio: t('about.hatemBio'),
      image: 'https://cdn0.scrvt.com/7b8dc61d55f0deedb776692474194f7c/c27f0cd11bdd3467/99164f88db10/v/7828775e6c06/executive_summit_2022_hatem_elgabaly.jpg',
      searchQuery: 'Hatem+El-Gabaly+site:wikipedia.org'
    },
    {
      id: 3,
      name: 'Dr. Ahmed Zewail',
      title: t('about.nobelLaureate'),
      bio: t('about.zewailBio'),
      image: 'https://knowwhois.com/upload/images/MzE2MTMwNT-father-of-femtochemistry-who-is-ahmed-zewail.jpg',
      searchQuery: 'Ahmed+Zewail+site:wikipedia.org'
    }
  ];

  const openBio = (query: string) => {
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          {t('about.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('about.subtitle')}
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-8 rounded-xl shadow-md mb-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Award className="w-6 h-6 text-teal-500 mr-2" />
              {t('about.missionTitle')}
            </h2>
            <p className="text-gray-600">
              {t('about.missionText')}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Globe className="w-6 h-6 text-blue-500 mr-2" />
              {t('about.visionTitle')}
            </h2>
            <p className="text-gray-600">
              {t('about.visionText')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Our Story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {t('about.storyTitle')}
        </h2>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Clock className="w-12 h-12 text-teal-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('about.beginningTitle')}</h3>
              <p className="text-gray-600">{t('about.beginningText')}</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('about.growthTitle')}</h3>
              <p className="text-gray-600">{t('about.growthText')}</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('about.todayTitle')}</h3>
              <p className="text-gray-600">{t('about.todayText')}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Egyptian Medical Pioneers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {t('about.egyptianPioneersTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {egyptianScientists.map((scientist) => (
            <motion.div
              key={scientist.id}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md text-center cursor-pointer transition-all hover:shadow-lg"
              onClick={() => openBio(scientist.searchQuery)}
            >
              <img 
                src={scientist.image}
                alt={scientist.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-teal-100"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {scientist.name}
              </h3>
              <p className="text-teal-500 mb-3">{scientist.title}</p>
              <p className="text-gray-600 mb-4">{scientist.bio}</p>
              <button 
                className="text-sm text-green-600 hover:text-green-800 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  openBio(scientist.searchQuery);
                }}
              >
                {t('about.viewFullBio')} →
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Values */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-gradient-to-r from-green-500 to-green-300 text-white p-8 rounded-xl mb-16"
      >
        <h2 className="text-3xl text-white font-bold mb-8 text-center">{t('about.valuesTitle')}</h2>
        <div className="grid grid-cols-1 text-white md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((value) => (
            <div key={value} className="bg-white/10 p-6 text-white rounded-lg backdrop-blur-sm">
              <h3 className="text-xl text-white font-semibold mb-2">{t(`about.value${value}Title`)}</h3>
              <p className="text-gray-700">{t(`about.value${value}Text`)}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="bg-white p-8 rounded-xl shadow-md text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {t('about.contactTitle')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          {t('about.contactText')}
        </p>
        <Link 
          to="/contactus" 
          className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition shadow-md inline-block"
        >
          {t('about.contactButton')}
        </Link>
      </motion.div>
    </div>
  );
};

export default About;