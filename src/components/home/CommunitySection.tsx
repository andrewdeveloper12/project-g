import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UserPlus2 } from 'lucide-react';

interface CommunityPostProps {
  initials: string;
  name: string;
  timeAgoHours: number;
  message: string;
  likes: number;
  comments: number;
  isRTL?: boolean;
}

const CommunityPost: React.FC<CommunityPostProps> = ({
  initials,
  name,
  timeAgoHours,
  message,
  likes,
  comments,
  isRTL = false,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg border border-green-500 shadow-sm p-5 w-full max-w-md min-h-[220px]"
    >
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm">
          {initials}
        </div>
        <div className={isRTL ? 'mr-2' : 'ml-2'}>
          <p className="font-medium text-gray-900 text-sm">{name}</p>
          <p className="text-xs text-gray-500">
            {t('community.timeAgo.hours', { count: timeAgoHours })}
          </p>
        </div>
      </div>
      <p className="text-gray-700 text-sm mb-4">{message}</p>
      <div className="flex justify-between items-center text-xs text-gray-600">
        <div className="flex items-center space-x-3">
          <span>❤️ {likes}</span>
          <span>💬 {comments}</span>
        </div>
        <Link to="/" className="text-green-600 font-medium hover:underline">
          {isRTL ? 'عرض المناقشة' : 'View Discussion'}
        </Link>
      </div>
    </motion.div>
  );
};

const CommunitySection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <section className="py-12 bg-[#DFF6E3]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Title centered */}
        <h2 className={`text-xl font-bold text-gray-900 mb-6 text-center ${isRTL ? 'font-arabic' : ''}`}>
          {t('community.title')}
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-5 justify-center items-stretch">
          <CommunityPost
            initials="SJ"
            name={t('community.post1.name')}
            timeAgoHours={2}
            message={t('community.post1.message')}
            likes={24}
            comments={7}
            isRTL={isRTL}
          />
          <CommunityPost
            initials="AH"
            name={t('community.post2.name')}
            timeAgoHours={16}
            message={t('community.post2.message')}
            likes={50}
            comments={26}
            isRTL={isRTL}
          />
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="bg-white border border-green-500 rounded-lg p-6 text-center shadow-sm max-w-md w-full"
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 rounded-full border border-green-500 text-green-500 flex items-center justify-center">
                <UserPlus2 size={18} />
              </div>
            </div>
            <h3 className={`text-base font-semibold text-gray-900 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
              {t('community.joinTitle')}
            </h3>
            <p className={`text-gray-600 text-sm mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {t('community.joinDesc')}
            </p>
            <Link
              to="CommunityPage"
              className="bg-green-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-green-700 transition"
            >
              {t('community.joinButton')}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
