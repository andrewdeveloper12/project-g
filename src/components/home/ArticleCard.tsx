// import React from 'react';
// import { motion } from 'framer-motion';
// import { Article } from '../types';
// import { ChevronRight } from 'lucide-react';
// import { useTranslation } from 'react-i18next';

// interface ArticleCardProps {
//   article: Article;
//   delay?: number;
// }

// const ArticleCard: React.FC<ArticleCardProps> = ({ article, delay = 0 }) => {
//   const {
//     imageUrl,
//     category,
//     title,
//     description,
//     author,
//     date,
//     featured,
//   } = article;

//   const { t } = useTranslation();

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ delay, duration: 0.5 }}
//       viewport={{ once: true }}
//       className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col cursor-pointer ${
//         featured ? 'border-l-4 border-green-500' : 'border'
//       }`}
//       onClick={() => window.location.href = '/resources'}
//     >
//       <div className="relative w-full h-52 overflow-hidden">
//         <img
//           src={imageUrl}
//           alt={title}
//           className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//         />
//         {featured && (
//           <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//             {t('featured')} {/* مميز */}
//           </div>
//         )}
//       </div>
      
//       <div className="p-5 flex flex-col flex-grow">
//         <div className="mb-3">
//           <span className="inline-block px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
//             {t(`categories.${category}`)} {/* ترجمات الفئات */}
//           </span>
//         </div>

//         <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
//           {title} {/* العنوان يأتي من البيانات */}
//         </h3>
        
//         <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
//           {description} {/* الوصف يأتي من البيانات */}
//         </p>
        
//         <div className="flex items-center justify-between text-xs mt-auto">
//           <div className="flex items-center gap-2">
//             <img 
//               src={author.avatar} 
//               alt={t(`scientists.${author.name}`)} 
//               className="w-6 h-6 rounded-full object-cover border border-gray-200" 
//             />
//             <span className="text-gray-700">
//               {t('author_by', { name: t(`scientists.${author.name}`) })} {/* كتب بواسطة [اسم المؤلف] */}
//             </span>
//           </div>
//           <span className="text-gray-500">{date}</span> {/* التاريخ يأتي من البيانات */}
//         </div>

//         <div className="flex items-center text-green-600 text-sm font-medium mt-4">
//           <span>{t('read_more')}</span> {/* اقرأ المزيد */}
//           <ChevronRight className="w-4 h-4 ml-1" />
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default ArticleCard;