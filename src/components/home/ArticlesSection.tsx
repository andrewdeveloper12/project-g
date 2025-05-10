import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Author {
  name: string;
  avatar: string;
}

interface Article {
  id: string;
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  author: Author;
  date: string;
  featured?: boolean;
  tags: string[];
  googleSearchQuery: string; // Added new field
}

interface ArticleCardProps {
  article: Article;
  delay?: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, delay = 0 }) => {
  const {
    imageUrl,
    category,
    title,
    description,
    author,
    date,
    featured,
    googleSearchQuery
  } = article;

  const { t } = useTranslation();

  const handleReadMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.google.com/search?q=${encodeURIComponent(googleSearchQuery)}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col cursor-pointer ${
        featured ? 'border-l-4 border-green-500' : 'border'
      }`}
    >
      <div className="relative w-full h-52 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {featured && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {t('featured')}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <span className="inline-block px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            {t(`categories.${category}`)}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {description}
        </p>

        <div className="flex items-center justify-between text-xs mt-auto">
          <div className="flex items-center gap-2">
            <img
              src={author.avatar}
              alt={t(`scientists.${author.name}`)}
              className="w-6 h-6 rounded-full object-cover border border-gray-200"
            />
            <span className="text-gray-700">
              {t('author_by', { name: t(`scientists.${author.name}`) })}
            </span>
          </div>
          <span className="text-gray-500">{date}</span>
        </div>

        <div
          className="flex items-center text-green-600 text-sm font-medium mt-4 hover:underline cursor-pointer"
          onClick={handleReadMore}
        >
          <span>{t('read_more')}</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </motion.div>
  );
};

const ArticlesSection: React.FC = () => {
  const { t } = useTranslation();

  const articles: Article[] = [
    {
      id: '1',
      imageUrl: 'https://images.pexels.com/photos/952478/pexels-photo-952478.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'nutrition',
      title: t('articles.items.1.title'),
      description: t('articles.items.1.description'),
      author: {
        name: 'einas ahmed',
        avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100',
      },
      date: t('articles.dates.1'),
      tags: ['nutrition', 'health', 'diet'],
      googleSearchQuery: "latest research articles about heart health and nutrition"
    },
    {
      id: '2',
      imageUrl: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'lifestyle',
      title: t('articles.items.2.title'),
      description: t('articles.items.2.description'),
      author: {
        name: 'ahmed zweil',
        avatar: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=100',
      },
      date: t('articles.dates.2'),
      tags: ['diabetes', 'lifestyle', 'health'],
      googleSearchQuery: "scientific articles about diabetes management and lifestyle changes"
    },
    {
      id: '3',
      imageUrl: 'https://images.pexels.com/photos/8105063/pexels-photo-8105063.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'diabetes',
      title: t('articles.items.3.title'),
      description: t('articles.items.3.description'),
      author: {
        name: 'ahmed_zweil',
        avatar: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=100',
      },
      date: t('articles.dates.3'),
      featured: true,
      tags: ['diabetes', 'diet', 'nutrition'],
      googleSearchQuery: "recent medical research about anemia treatment and prevention"
    },
  ];

  const handleViewAll = () => {
    window.open("https://www.google.com/search?q=medical+articles+about+heart+disease+diabetes+anemia+hypertension", "_blank");
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('articles.title')}</h2>
          <button
            onClick={handleViewAll}
            className="flex items-center text-green-600 hover:text-green-700 font-medium group"
          >
            {t('articles.viewAll')}
            <ArrowRight size={18} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {articles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ArticlesSection;