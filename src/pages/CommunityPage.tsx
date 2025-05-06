import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Users, Heart, 
  CheckCircle, HelpCircle, ArrowRight, MessageSquare
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  avatar?: string;
  initials: string;
}

interface Discussion {
  id: number;
  author: User;
  category: string;
  title: string;
  content: string;
  replies: number;
  timeAgo: number;
}

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

interface Experience {
  id: number;
  title: string;
  content: string;
  author: User;
  date: string;
  likes: number;
}

const CommunityPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showCategoryAlert, setShowCategoryAlert] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  
  const discussionsRef = useRef<HTMLDivElement>(null);

  const users: User[] = [
    { id: 1, name: isRTL ? 'فاطمة علي' : 'Sarah Johnson', initials: 'SJ' },
    { id: 2, name: isRTL ? 'محمد حسن' : 'Ahmed Hassan', initials: 'AH' },
    { id: 3, name: isRTL ? 'ماريا غارسيا' : 'Maria Garcia', initials: 'MG' },
    { id: 4, name: isRTL ? 'جيمس ويلسون' : 'James Wilson', initials: 'JW' },
  ];

  // Articles for each category
  const articles = {
    diabetes: [
      {
        id: 1,
        title: isRTL ? 'إدارة مرض السكري: نصائح يومية' : 'Diabetes Management: Daily Tips',
        content: isRTL ? 'تعلم كيفية التحكم في مستويات السكر في الدم من خلال النظام الغذائي والتمارين الرياضية والأدوية المناسبة. اكتشف الأطعمة التي يجب تجنبها والأنشطة التي تساعد في الحفاظ على مستويات مستقرة للسكر.' : 'Learn how to control blood sugar levels through diet, exercise, and proper medication. Discover foods to avoid and activities that help maintain stable sugar levels.',
        author: isRTL ? 'د. أحمد خالد' : 'Dr. Ahmed Khalid',
        date: '2023-05-15'
      },
      {
        id: 2,
        title: isRTL ? 'أحدث علاجات السكري النوع الثاني' : 'Latest Treatments for Type 2 Diabetes',
        content: isRTL ? 'استكشاف أحدث التطورات في علاج مرض السكري من النوع الثاني بما في ذلك الأدوية الجديدة والعلاجات البديلة والتقنيات الحديثة لإدارة المرض.' : 'Explore the latest developments in treating type 2 diabetes including new medications, alternative therapies, and modern techniques for disease management.',
        author: isRTL ? 'د. سارة محمد' : 'Dr. Sarah Mohamed',
        date: '2023-06-20'
      }
    ],
    heart: [
      {
        id: 1,
        title: isRTL ? 'الحفاظ على صحة القلب: دليل شامل' : 'Maintaining Heart Health: Complete Guide',
        content: isRTL ? 'اكتشف العادات اليومية التي تقوي قلبك وتقلل من خطر الإصابة بأمراض القلب والأوعية الدموية. تعرف على أفضل الأطعمة للقلب وتمارين القلب الفعالة.' : 'Discover daily habits that strengthen your heart and reduce the risk of cardiovascular disease. Learn about the best heart-healthy foods and effective cardio exercises.',
        author: isRTL ? 'د. علي محمود' : 'Dr. Ali Mahmoud',
        date: '2023-04-10'
      },
      {
        id: 2,
        title: isRTL ? 'علامات التحذير من النوبة القلبية' : 'Warning Signs of Heart Attack',
        content: isRTL ? 'تعرف على الأعراض المبكرة للنوبة القلبية وكيفية التصرف في حالات الطوارئ. هذا المقال قد ينقذ حياتك أو حياة شخص عزيز عليك.' : 'Learn about early symptoms of heart attack and how to act in emergencies. This article could save your life or the life of a loved one.',
        author: isRTL ? 'د. ليلى عبدالله' : 'Dr. Leila Abdullah',
        date: '2023-07-05'
      }
    ],
    blood_pressure: [
      {
        id: 1,
        title: isRTL ? 'خفض ضغط الدم بشكل طبيعي' : 'Lowering Blood Pressure Naturally',
        content: isRTL ? 'طرق فعالة لخفض ضغط الدم المرتفع دون الاعتماد الكامل على الأدوية. يشمل ذلك تغييرات في النظام الغذائي، تقنيات الاسترخاء، وتمارين محددة.' : 'Effective ways to lower high blood pressure without relying solely on medication. Includes dietary changes, relaxation techniques, and specific exercises.',
        author: isRTL ? 'د. يوسف ناصر' : 'Dr. Youssef Nasser',
        date: '2023-03-18'
      },
      {
        id: 2,
        title: isRTL ? 'فهم قراءات ضغط الدم' : 'Understanding Blood Pressure Readings',
        content: isRTL ? 'دليل مفصل لفهم ما تعنيه أرقام ضغط الدم الخاصة بك، ومتى يجب أن تقلق، وكيفية تفسير التغيرات في قراءاتك.' : 'A detailed guide to understanding what your blood pressure numbers mean, when to worry, and how to interpret changes in your readings.',
        author: isRTL ? 'د. هناء فاروق' : 'Dr. Hanaa Farouk',
        date: '2023-08-12'
      }
    ],
    anemia: [
      {
        id: 1,
        title: isRTL ? 'علاج فقر الدم الناتج عن نقص الحديد' : 'Treating Iron-Deficiency Anemia',
        content: isRTL ? 'أفضل المصادر الغذائية للحديد، ومتى تحتاج إلى مكملات، وكيفية تحسين امتصاص الحديد في جسمك. تعرف على الأطعمة التي تساعد والتي تعيق امتصاص الحديد.' : 'Best dietary sources of iron, when you need supplements, and how to improve iron absorption in your body. Learn about foods that help and hinder iron absorption.',
        author: isRTL ? 'د. رامي سعد' : 'Dr. Rami Saad',
        date: '2023-02-22'
      },
      {
        id: 2,
        title: isRTL ? 'أنواع فقر الدم وأسبابها' : 'Types of Anemia and Their Causes',
        content: isRTL ? 'ليس كل فقر الدم متشابهًا. تعرف على الأنواع المختلفة لفقر الدم بما في ذلك فقر الدم الناجم عن نقص الحديد، نقص B12، والأسباب الوراثية.' : 'Not all anemia is the same. Learn about different types of anemia including iron-deficiency, B12 deficiency, and hereditary causes.',
        author: isRTL ? 'د. نادية عمر' : 'Dr. Nadia Omar',
        date: '2023-09-30'
      }
    ]
  };

  // Experiences for each category
  const experiences = {
    diabetes: [
      {
        id: 1,
        title: isRTL ? 'رحلتي مع السكري النوع الأول' : 'My Journey with Type 1 Diabetes',
        content: isRTL ? 'شارك تجربتي في التعايش مع السكري النوع الأول منذ الطفولة. كيف تعلمت إدارة حالتي، التحديات التي واجهتها، والنصائح التي أود مشاركتها مع المبتدئين.' : 'Sharing my experience living with type 1 diabetes since childhood. How I learned to manage my condition, challenges I faced, and tips I want to share with beginners.',
        author: users[0],
        date: '2023-01-15',
        likes: 24
      },
      {
        id: 2,
        title: isRTL ? 'كيف خفضت A1C من 9 إلى 5.5' : 'How I Lowered My A1C from 9 to 5.5',
        content: isRTL ? 'قصة نجاحي في خفض مستويات السكر في الدم من خلال تغييرات نمط الحياة. النظام الغذائي، التمارين، وإدارة الإجهاد التي غيرت حياتي.' : 'My success story in lowering blood sugar levels through lifestyle changes. The diet, exercise, and stress management that transformed my life.',
        author: users[1],
        date: '2023-06-08',
        likes: 18
      }
    ],
    heart: [
      {
        id: 1,
        title: isRTL ? 'تعافيت من جراحة القلب المفتوح' : 'Recovering from Open Heart Surgery',
        content: isRTL ? 'تجربتي الشخصية مع جراحة القلب المفتوح والتعافي منها. ما توقعت وما حدث فعلاً، النصائح للمرضى الجدد، وكيفية التعامل مع التحديات العاطفية.' : 'My personal experience with open heart surgery and recovery. What I expected versus reality, tips for new patients, and how to handle emotional challenges.',
        author: users[2],
        date: '2023-03-22',
        likes: 15
      },
      {
        id: 2,
        title: isRTL ? 'الحياة بعد تركيب دعامة القلب' : 'Life After a Heart Stent',
        content: isRTL ? 'كيف تغيرت حياتي بعد تركيب الدعامة. التعديلات التي أجريتها على نمط حياتي، المخاوف التي واجهتها، وكيف أشعر الآن بعد عام من العملية.' : 'How my life changed after getting a stent. The lifestyle adjustments I made, fears I faced, and how I feel now one year post-procedure.',
        author: users[3],
        date: '2023-07-14',
        likes: 12
      }
    ],
    blood_pressure: [
      {
        id: 1,
        title: isRTL ? 'تخلصت من أدوية ضغط الدم' : 'How I Got Off Blood Pressure Meds',
        content: isRTL ? 'قصتي في خفض ضغط الدم المرتفع بشكل طبيعي والتخلص من الأدوية بعد 5 سنوات من الاستخدام. النظام الغذائي والتمارين التي غيرت صحتي.' : 'My story of lowering high blood pressure naturally and getting off medications after 5 years of use. The diet and exercises that transformed my health.',
        author: users[0],
        date: '2023-02-10',
        likes: 20
      },
      {
        id: 2,
        title: isRTL ? 'التعامل مع ارتفاع ضغط الدم المفاجئ' : 'Dealing with Sudden High Blood Pressure',
        content: isRTL ? 'تجربتي مع نوبات ارتفاع ضغط الدم المفاجئة. كيف تعلمت التعرف على الأعراض، ما يفعله الطبيب، وكيف أمنع تكرارها.' : 'My experience with sudden high blood pressure spikes. How I learned to recognize symptoms, what the doctor does, and how I prevent recurrences.',
        author: users[1],
        date: '2023-08-05',
        likes: 14
      }
    ],
    anemia: [
      {
        id: 1,
        title: isRTL ? 'زيادة مخزون الحديد بشكل طبيعي' : 'Increasing Iron Stores Naturally',
        content: isRTL ? 'كيف تمكنت من رفع مخزون الحديد من 5 إلى 35 بدون حقن الحديد. الأطعمة التي ساعدتني، التركيبات الغذائية، ونصائح للامتصاص الأمثل.' : 'How I raised my iron stores from 5 to 35 without iron injections. The foods that helped me, food combinations, and tips for optimal absorption.',
        author: users[2],
        date: '2023-04-18',
        likes: 16
      },
      {
        id: 2,
        title: isRTL ? 'التعايش مع فقر الدم المنجلي' : 'Living with Sickle Cell Anemia',
        content: isRTL ? 'رحلتي مع فقر الدم المنجلي منذ الطفولة. إدارة الألم، التعامل مع الأزمات، والنصائح للعائلات التي تواجه تشخيصًا جديدًا.' : 'My journey with sickle cell anemia since childhood. Pain management, dealing with crises, and advice for families facing a new diagnosis.',
        author: users[3],
        date: '2023-09-02',
        likes: 10
      }
    ]
  };

  // Discussions for each category
  const featuredDiscussions: Discussion[] = [
    {
      id: 1,
      author: users[0],
      category: 'diabetes',
      title: isRTL ? 'أفضل جهاز لمراقبة السكر المستمر' : 'Best Continuous Glucose Monitor',
      content: isRTL ? 'أبحث عن توصيات لأفضل جهاز لمراقبة السكر المستمر. ما هي تجاربكم مع الأجهزة المختلفة؟' : 'Looking for recommendations for the best continuous glucose monitor. What are your experiences with different devices?',
      replies: 24,
      timeAgo: 2,
    },
    {
      id: 2,
      author: users[1],
      category: 'heart',
      title: isRTL ? 'تمارين آمنة لمرضى القلب' : 'Safe Exercises for Heart Patients',
      content: isRTL ? 'ما هي التمارين التي تنصحون بها لشخص خضع مؤخرًا لعملية قلب مفتوح؟' : 'What exercises do you recommend for someone who recently had open heart surgery?',
      replies: 18,
      timeAgo: 5,
    },
    {
      id: 3,
      author: users[2],
      category: 'blood_pressure',
      title: isRTL ? 'بدائل طبيعية لأدوية الضغط' : 'Natural Alternatives to BP Meds',
      content: isRTL ? 'هل هناك بدائل طبيعية فعالة لأدوية ضغط الدم؟ أريد تقليل جرعتي الدوائية.' : 'Are there effective natural alternatives to blood pressure medications? I want to reduce my medication dose.',
      replies: 12,
      timeAgo: 8,
    },
    {
      id: 4,
      author: users[3],
      category: 'anemia',
      title: isRTL ? 'أفضل مكملات الحديد امتصاصًا' : 'Best Absorbed Iron Supplements',
      content: isRTL ? 'جربت عدة أنواع من الحديد لكنها تسبب لي اضطرابات هضمية. هل هناك أنواع أفضل امتصاصًا وأقل آثارًا جانبية؟' : 'I\'ve tried several iron supplements but they cause digestive issues. Are there better absorbed types with fewer side effects?',
      replies: 9,
      timeAgo: 10,
    },
    {
      id: 5,
      author: users[0],
      category: 'diabetes',
      title: isRTL ? 'وصفات حلويات لمرضى السكري' : 'Diabetic-Friendly Dessert Recipes',
      content: isRTL ? 'شاركوني وصفاتكم المفضلة للحلويات المناسبة لمرضى السكري.' : 'Please share your favorite diabetic-friendly dessert recipes.',
      replies: 15,
      timeAgo: 1,
    },
    {
      id: 6,
      author: users[1],
      category: 'heart',
      title: isRTL ? 'علامات تحسن صحة القلب' : 'Signs of Improving Heart Health',
      content: isRTL ? 'كيف أعرف أن صحة قلبي تتحسن بعد تغيير نمط الحياة؟' : 'How can I tell if my heart health is improving after lifestyle changes?',
      replies: 8,
      timeAgo: 3,
    }
  ];

  const categories = [
    { id: 'all', icon: <Users size={20} />, name: isRTL ? 'الكل' : 'All' },
    { id: 'diabetes', icon: <Heart size={20} />, name: isRTL ? 'السكري' : 'Diabetes' },
    { id: 'heart', icon: <Heart size={20} />, name: isRTL ? 'القلب' : 'Heart' },
    { id: 'blood_pressure', icon: <Heart size={20} />, name: isRTL ? 'ضغط الدم' : 'Blood Pressure' },
    { id: 'anemia', icon: <Heart size={20} />, name: isRTL ? 'فقر الدم' : 'Anemia' },
  ];

  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(item => item !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setShowCategoryAlert(false);

    try {
      if (!email || !name) {
        throw new Error(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error(isRTL ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
      }

      if (interests.length > 0) {
        setActiveCategory(interests[0]);
        setShowCategoryAlert(true);
      }

      setShowMainContent(true);
      
      setTimeout(() => {
        discussionsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      setFormSubmitted(true);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  const filteredDiscussions = activeCategory === 'all' 
    ? featuredDiscussions 
    : featuredDiscussions.filter(discussion => discussion.category === activeCategory);

  const filteredArticles = activeCategory === 'all'
    ? []
    : articles[activeCategory as keyof typeof articles] || [];

  const filteredExperiences = activeCategory === 'all'
    ? []
    : experiences[activeCategory as keyof typeof experiences] || [];

  const testimonials = [
    {
      id: 1,
      name: isRTL ? 'عبدالله محمد' : 'Robert Chen',
      condition: isRTL ? 'مريض سكري من النوع 2' : 'Type 2 Diabetes',
      quote: isRTL ? 'الانضمام إلى هذا المجتمع غير حياتي. لقد تعلمت الكثير من تجارب الآخرين وأصبحت إدارة حالتي أسهل كثيرًا.' : 'Joining this community changed my life. I\'ve learned so much from others\' experiences and managing my condition has become so much easier.',
      initials: 'RC',
    },
    {
      id: 2,
      name: isRTL ? 'سارة أحمد' : 'Lisa Torres',
      condition: isRTL ? 'ارتفاع ضغط الدم' : 'Hypertension',
      quote: isRTL ? 'الدعم الذي أتلقاه هنا لا يقدر بثمن. من النصائح العملية إلى مجرد معرفة أن الآخرين يفهمون ما أمر به.' : 'The support I receive here is invaluable. From practical tips to just knowing others understand what I\'m going through.',
      initials: 'LT',
    },
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {t('communitypages.title')}
            </h1>
            <p className={`text-lg mb-8 text-green-100 ${isRTL ? 'font-arabic' : ''}`}>
              {t('communitypages.joinDesc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Join Form - Always visible at the top */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-green-100 p-6">
          <h2 className={`text-2xl font-semibold text-gray-800 mb-6 text-center ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL ? 'انضم إلى مجتمعنا' : 'Join Our Community'}
          </h2>
          
          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} />
              </div>
              <h3 className={`text-lg font-medium text-gray-900 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL ? 'تم إرسال طلبك بنجاح!' : 'Your request has been submitted!'}
              </h3>
              <p className={`text-gray-600 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL 
                  ? 'سنرسل لك بريدًا إلكترونيًا مع تعليمات للوصول إلى المجتمع.' 
                  : 'We\'ll send you an email with instructions to access the community.'}
              </p>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setShowMainContent(true);
                }}
                className="text-white-600 hover:underline"
              >
                {isRTL ? 'استعراض المجتمع' : 'Browse Community'}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              {formError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                  {formError}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="name" className={`block text-sm font-medium text-gray-700 mb-1 ${isRTL ? 'font-arabic' : ''}`}>
                  {isRTL ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className={`block text-sm font-medium text-gray-700 mb-1 ${isRTL ? 'font-arabic' : ''}`}>
                  {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="mb-5">
                <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                  {isRTL ? 'اختر اهتماماتك الصحية' : 'Select Your Health Interests'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.filter(c => c.id !== 'all').map(category => (
                    <label key={category.id} className="flex items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={interests.includes(category.id)}
                        onChange={() => handleInterestToggle(category.id)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className={`ml-2 rtl:mr-2 rtl:ml-0 text-sm text-gray-700 ${isRTL ? 'font-arabic' : ''}`}>
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isRTL ? 'انضم الآن' : 'Join Now'}
              </button>
              
              <p className={`text-xs text-gray-500 mt-3 text-center ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL 
                  ? 'بالانضمام، أنت توافق على إرشادات المجتمع وشروط الخدمة' 
                  : 'By joining, you agree to our community guidelines and terms of service'}
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Main Content - Only shown after form submission */}
      {showMainContent && (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
              {/* Category Alert */}
              {showCategoryAlert && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4 flex items-start"
                >
                  <CheckCircle className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    {isRTL 
                      ? `يتم عرض المحتوى المتعلق بـ "${categories.find(c => c.id === activeCategory)?.name}"` 
                      : `Showing content related to "${categories.find(c => c.id === activeCategory)?.name}"`}
                    <button 
                      onClick={() => {
                        setActiveCategory('all');
                        setShowCategoryAlert(false);
                      }}
                      className="ml-2 text-white-600 hover:underline font-medium"
                    >
                      {isRTL ? 'عرض الكل' : 'Show all'}
                    </button>
                  </span>
                </motion.div>
              )}

              {/* Articles Section */}
              {filteredArticles.length > 0 && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="bg-white rounded-xl shadow-sm border border-green-100 p-6 mb-8"
                >
                  <h2 className={`text-xl font-semibold text-gray-800 mb-6 ${isRTL ? 'font-arabic' : ''}`}>
                    {isRTL ? 'مقالات موصى بها' : 'Recommended Articles'}
                  </h2>
                  <div className="space-y-6">
                    {filteredArticles.map(article => (
                      <div key={article.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <h3 className="text-lg font-medium text-gray-900">{article.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{article.author} • {article.date}</p>
                        <p className="text-gray-700 mt-3">{article.content}</p>
                        <button className="text-white-600 hover:text-black-800 text-sm font-medium mt-3">
                          {isRTL ? 'قراءة المزيد' : 'Read more'} →
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Experiences Section */}
              {filteredExperiences.length > 0 && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-white rounded-xl shadow-sm border border-green-100 p-6 mb-8"
                >
                  <h2 className={`text-xl font-semibold text-gray-800 mb-6 ${isRTL ? 'font-arabic' : ''}`}>
                    {isRTL ? 'تجارب الأعضاء' : 'Member Experiences'}
                  </h2>
                  <div className="space-y-6">
                    {filteredExperiences.map(experience => (
                      <div key={experience.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0 shrink-0">
                            {experience.author.initials}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{experience.author.name}</h3>
                            <p className="text-sm text-gray-500">{experience.date}</p>
                          </div>
                        </div>
                        <h4 className="text-lg font-medium text-gray-800 mt-3">{experience.title}</h4>
                        <p className="text-gray-700 mt-2">{experience.content}</p>
                        <div className="flex items-center mt-3 text-sm text-gray-500">
                          <Heart size={16} className="mr-1 text-red-500" />
                          <span>{experience.likes}</span>
                          <span className="mx-2">•</span>
                          <button className="text-white-600 hover:text-black-800">
                            {isRTL ? 'إضافة تعليق' : 'Add comment'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Discussions Section */}
              <motion.section
                ref={discussionsRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-green-100 p-6 mb-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-xl font-semibold text-gray-800 ${isRTL ? 'font-arabic' : ''}`}>
                    {isRTL ? 'المناقشات الحديثة' : 'Recent Discussions'}
                  </h2>
                  <div className="flex space-x-2 rtl:space-x-reverse overflow-x-auto py-1">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setShowCategoryAlert(category.id !== 'all');
                        }}
                        className={`px-3 py-1 rounded-full text-sm flex items-center ${
                          activeCategory === category.id
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="mr-1 rtl:ml-1">{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredDiscussions.map(discussion => (
                    <motion.div
                      key={discussion.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-100 pb-4 last:border-0"
                    >
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0 shrink-0">
                          {discussion.author.initials}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{discussion.author.name}</h3>
                          <h4 className="text-lg font-medium text-gray-800 mt-1">{discussion.title}</h4>
                          <p className="text-gray-700 mt-1">{discussion.content}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <MessageSquare size={14} className="mr-1 rtl:ml-1 rtl:mr-0" />
                              {discussion.replies}
                            </span>
                            <span className="mx-2">•</span>
                            <span>{t('communitypages.timeAgo.hours', { count: discussion.timeAgo })}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center mt-6">
                  <button className="text-green-800 font-medium hover:underline inline-flex items-center">
                    {isRTL ? 'عرض المزيد من المناقشات' : 'View more discussions'}
                    <ArrowRight size={16} className={isRTL ? 'mr-1 rotate-180' : 'ml-1'} />
                  </button>
                </div>
              </motion.section>
            </div>
            
            {/* Right Column */}
            <div>
              {/* Community Guidelines */}
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-green-100 p-6 mb-8 relative top-4"
              >
                <h2 className={`text-xl font-semibold text-gray-800 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                  {isRTL ? 'إرشادات المجتمع' : 'Community Guidelines'}
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle size={18} className="text-green-600 mr-2 rtl:ml-2 rtl:mr-0 shrink-0 mt-0.5" />
                    <p className={`text-sm text-gray-700 ${isRTL ? 'font-arabic' : ''}`}>
                      {isRTL 
                        ? 'كن محترمًا ولطيفًا مع الجميع' 
                        : 'Be respectful and kind to everyone'}
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle size={18} className="text-green-600 mr-2 rtl:ml-2 rtl:mr-0 shrink-0 mt-0.5" />
                    <p className={`text-sm text-gray-700 ${isRTL ? 'font-arabic' : ''}`}>
                      {isRTL 
                        ? 'شارك خبراتك ولكن تجنب تقديم المشورة الطبية المهنية' 
                        : 'Share experiences but avoid giving professional medical advice'}
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle size={18} className="text-green-600 mr-2 rtl:ml-2 rtl:mr-0 shrink-0 mt-0.5" />
                    <p className={`text-sm text-gray-700 ${isRTL ? 'font-arabic' : ''}`}>
                      {isRTL 
                        ? 'احترم خصوصية الآخرين وتجنب مشاركة المعلومات الشخصية' 
                        : 'Respect others\' privacy and avoid sharing personal information'}
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle size={18} className="text-green-600 mr-2 rtl:ml-2 rtl:mr-0 shrink-0 mt-0.5" />
                    <p className={`text-sm text-gray-700 ${isRTL ? 'font-arabic' : ''}`}>
                      {isRTL 
                        ? 'استخدم لغة مناسبة وتجنب المحتوى الضار' 
                        : 'Use appropriate language and avoid harmful content'}
                    </p>
                  </div>
                </div>
              </motion.section>
              
              {/* FAQ Section */}
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-green-100 p-6"
              >
                <h2 className={`text-xl font-semibold text-gray-800 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                  {isRTL ? 'أسئلة شائعة' : 'Frequently Asked Questions'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className={`font-medium text-gray-900 flex items-center ${isRTL ? 'font-arabic' : ''}`}>
                      <HelpCircle size={18} className="text-green-600 mr-2 rtl:ml-2 rtl:mr-0 shrink-0" />
                      {isRTL ? 'هل المجتمع مجاني للانضمام؟' : 'Is the community free to join?'}
                    </h3>
                    <p className={`text-sm text-gray-700 mt-1 pl-6 rtl:pr-6 rtl:pl-0 ${isRTL ? 'font-arabic' : ''}`}>
                      {isRTL 
                        ? 'نعم، المجتمع مجاني تمامًا للانضمام والمشاركة.' 
                        : 'Yes, the community is completely free to join and participate in.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className={`font-medium text-gray-900 flex items-center ${isRTL ? 'font-arabic' : ''}`}>
                      <HelpCircle size={18} className="text-green-600 mr-2 rtl:ml-2 rtl:mr-0 shrink-0" />
                      {isRTL ? 'هل يمكنني نشر أسئلة حول حالتي الصحية؟' : 'Can I post questions about my health condition?'}
                    </h3>
                    <p className={`text-sm text-gray-700 mt-1 pl-6 rtl:pr-6 rtl:pl-0 ${isRTL ? 'font-arabic' : ''}`}>
                      {isRTL 
                        ? 'نعم، يمكنك نشر أسئلة حول تجربتك الصحية، ولكن تذكر أن الردود من الأعضاء الآخرين لا تحل محل المشورة الطبية المهنية.' 
                        : 'Yes, you can post questions about your health experience, but remember that responses from other members don\'t replace professional medical advice.'}
                    </p>
                  </div>
                
                  <div>
                    <h3 className={`font-medium text-gray-900 flex items-center ${isRTL ? 'font-arabic' : ''}`}>
                      <HelpCircle size={18} className="text-green-600 mr-2 rtl:ml-2 rtl:mr-0 shrink-0" />
                      {isRTL ? 'كيف تحمي خصوصية بياناتي؟' : 'How is my data privacy protected?'}
                    </h3>
                    <p className={`text-sm text-gray-700 mt-1 pl-6 rtl:pr-6 rtl:pl-0 ${isRTL ? 'font-arabic' : ''}`}>
                      {isRTL 
                        ? 'نحن نأخذ خصوصيتك على محمل الجد. جميع المشاركات خاصة داخل المجتمع ولن نشارك معلوماتك الشخصية مع أطراف ثالثة.' 
                        : 'We take your privacy seriously. All posts are private within the community and we will never share your personal information with third parties.'}
                    </p>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;