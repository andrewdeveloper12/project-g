import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Link2, 
  Download,
  ExternalLink,
  Heart,
  Activity,
  Droplets,
  Wind
} from 'lucide-react';

const Resources: React.FC = () => {
  const { t } = useTranslation();

  const categories = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: t('resources.heartTitle'),
      resources: [
        {
          title: t('resources.heart1Title'),
          type: 'article',
          link: 'https://www.heart.org/en/health-topics/heart-attack/about-heart-attacks',
          description: t('resources.heart1Desc')
        },
        {
          title: t('resources.heart2Title'),
          type: 'video',
          link: 'https://www.youtube.com/watch?v=eQ9m5cZzdmw',
          description: t('resources.heart2Desc')
        },
        {
          title: t('resources.heart3Title'),
          type: 'pdf',
          link: '#',
          description: t('resources.heart3Desc')
        }
      ]
    },
    {
      icon: <Activity className="w-8 h-8 text-teal-500" />,
      title: t('resources.bpTitle'),
      resources: [
        {
          title: t('resources.bp1Title'),
          type: 'article',
          link: 'https://www.mayoclinic.org/diseases-conditions/high-blood-pressure/symptoms-causes/syc-20373410',
          description: t('resources.bp1Desc')
        },
        {
          title: t('resources.bp2Title'),
          type: 'video',
          link: 'https://www.youtube.com/watch?v=Ab9OZsDECZw',
          description: t('resources.bp2Desc')
        },
        {
          title: t('resources.bp3Title'),
          type: 'pdf',
          link: '#',
          description: t('resources.bp3Desc')
        }
      ]
    },
    {
      icon: <Droplets className="w-8 h-8 text-green-500" />,
      title: t('resources.diabetesTitle'),
      resources: [
        {
          title: t('resources.diabetes1Title'),
          type: 'article',
          link: 'https://www.diabetes.org/diabetes',
          description: t('resources.diabetes1Desc')
        },
        {
          title: t('resources.diabetes2Title'),
          type: 'video',
          link: 'https://www.youtube.com/watch?v=wZAjVQWbMlE',
          description: t('resources.diabetes2Desc')
        },
        {
          title: t('resources.diabetes3Title'),
          type: 'pdf',
          link: '#',
          description: t('resources.diabetes3Desc')
        }
      ]
    },
    {
      icon: <Wind className="w-8 h-8 text-purple-500" />,
      title: t('resources.anemiaTitle'),
      resources: [
        {
          title: t('resources.anemia1Title'),
          type: 'article',
          link: 'https://www.mayoclinic.org/diseases-conditions/anemia/symptoms-causes/syc-20351360',
          description: t('resources.anemia1Desc')
        },
        {
          title: t('resources.anemia2Title'),
          type: 'video',
          link: 'https://www.youtube.com/watch?v=mOrRJBqm744',
          description: t('resources.anemia2Desc')
        },
        {
          title: t('resources.anemia3Title'),
          type: 'pdf',
          link: '#',
          description: t('resources.anemia3Desc')
        }
      ]
    }
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-red-500" />;
      case 'pdf':
        return <Download className="w-5 h-5 text-green-500" />;
      default:
        return <Link2 className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <BookOpen className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          {t('resources.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('resources.subtitle')}
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-16"
      >
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="">
            <input
              type="text"
              placeholder={t('resources.searchPlaceholder')}
              className="w-full p-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <svg
              className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Resource Categories */}
      {categories.map((category, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center mb-6">
            {category.icon}
            <h2 className="text-2xl font-bold text-gray-800 ml-3">{category.title}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {category.resources.map((resource, resourceIndex) => (
              <div key={resourceIndex} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="flex items-center mb-3">
                  {getResourceIcon(resource.type)}
                  <span className="text-sm font-medium text-gray-500 ml-2 uppercase">
                    {resource.type}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-green-500 hover:text-green-600 transition"
                >
                  {resource.type === 'pdf' ? t('resources.download') : t('resources.view')}
                  <ExternalLink className="ml-1 w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* External Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('resources.externalTitle')}</h2>
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-8 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-3">{t('resources.organizations')}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.who.int/" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-200 transition">
                    <ExternalLink className="mr-2 w-4 h-4" />
                    {t('resources.who')}
                  </a>
                </li>
                <li>
                  <a href="https://www.heart.org/" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-200 transition">
                    <ExternalLink className="mr-2 w-4 h-4" />
                    {t('resources.aha')}
                  </a>
                </li>
                <li>
                  <a href="https://www.diabetes.org/" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-200 transition">
                    <ExternalLink className="mr-2 w-4 h-4" />
                    {t('resources.ada')}
                  </a>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-3">{t('resources.journals')}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.nejm.org/" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-200 transition">
                    <ExternalLink className="mr-2 w-4 h-4" />
                    {t('resources.nejm')}
                  </a>
                </li>
                <li>
                  <a href="https://jamanetwork.com/" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-200 transition">
                    <ExternalLink className="mr-2 w-4 h-4" />
                    {t('resources.jama')}
                  </a>
                </li>
                <li>
                  <a href="https://www.thelancet.com/" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-200 transition">
                    <ExternalLink className="mr-2 w-4 h-4" />
                    {t('resources.lancet')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Community Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="bg-white p-8 rounded-xl shadow-md text-center mb-16"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t('resources.communityTitle')}
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-6">
          {t('resources.communityText')}
        </p>
        <button className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition shadow-md">
          {t('resources.joinButton')}
        </button>
      </motion.div>

      {/* Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="bg-gray-50 p-8 rounded-xl border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {t('resources.feedbackTitle')}
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {t('resources.feedbackText')}
        </p>
        <div className="flex justify-center">
          <button className="px-6 py-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition shadow-sm text-gray-700">
            {t('resources.suggestButton')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Resources;