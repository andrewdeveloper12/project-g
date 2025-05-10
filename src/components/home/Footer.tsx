import { Heart, Facebook, Twitter, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const langParam = isRTL ? 'hl=ar' : 'hl=en';

  // Function to generate Google search URL
  const getGoogleSearchUrl = (query: string) => {
    return `https://www.google.com/search?${langParam}&q=${encodeURIComponent(query)}`;
  };

  return (
    <footer className="bg-[#e6f7ed] py-2 mt-20">
      <div className="container mx-auto px-2">
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Brand Section */}
          <div className="flex flex-col space-y-4">
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Heart className="text-teal-600" size={20} style={isRTL ? { marginLeft: '0.25rem' } : { marginRight: '0.25rem' }} />
              <span className={`text-lg font-medium text-teal-600 ${isRTL ? 'font-arabic' : ''}`}>
                {t('footer.brand.name')}
              </span>
            </div>
            <p className={`text-gray-700 text-sm ${isRTL ? 'font-arabic arabic-line-breaks' : ''}`}>
              {t('footer.brand.description')}
            </p>
            <p className={`text-gray-700 text-sm ${isRTL ? 'font-arabic arabic-line-breaks' : ''}`}>
              {t('footer.brand.des')}
            </p>
            <p className={`text-gray-700 text-sm ${isRTL ? 'font-arabic arabic-line-breaks' : ''}`}>
              {t('footer.brand.de')}
            </p>
            <div className={`flex ${isRTL ? 'flex-row-reverse space-x-reverse' : ''} space-x-3`}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-teal-600 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-teal-600 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-teal-600 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className={`font-medium text-gray-800 ${isRTL ? 'font-arabic' : ''}`}>
              {t('footer.resources.title')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href={getGoogleSearchUrl(t('footer.resources.links.healthGuides'))} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm text-gray-600 hover:text-teal-600 transition-colors ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('footer.resources.links.healthGuides')}
                </a>
              </li>
              <li>
                <a 
                  href={getGoogleSearchUrl(t('footer.resources.links.nutritionFacts'))} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm text-gray-600 hover:text-teal-600 transition-colors ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('footer.resources.links.nutritionFacts')}
                </a>
              </li>
              <li>
                <a 
                  href={getGoogleSearchUrl(t('footer.resources.links.doctorDirectory'))} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm text-gray-600 hover:text-teal-600 transition-colors ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('footer.resources.links.doctorDirectory')}
                </a>
              </li>
              <li>
                <a 
                  href={getGoogleSearchUrl(t('footer.resources.links.faq'))} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm text-gray-600 hover:text-teal-600 transition-colors ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('footer.resources.links.faq')}
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className={`font-medium text-gray-800 ${isRTL ? 'font-arabic' : ''}`}>
              {t('footer.features.title')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href={getGoogleSearchUrl(t('footer.features.links.labelScanner'))} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm text-gray-600 hover:text-teal-600 transition-colors ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('footer.features.links.labelScanner')}
                </a>
              </li>
              <li>
                <a 
                  href={getGoogleSearchUrl(t('footer.features.links.healthAssessment'))} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm text-gray-600 hover:text-teal-600 transition-colors ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('footer.features.links.healthAssessment')}
                </a>
              </li>
              <li>
                <a 
                  href={getGoogleSearchUrl(t('footer.features.links.educationCenter'))} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm text-gray-600 hover:text-teal-600 transition-colors ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('footer.features.links.educationCenter')}
                </a>
              </li>
              <li>
                <a 
                  href={getGoogleSearchUrl(t('footer.features.links.community'))} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm text-gray-600 hover:text-teal-600 transition-colors ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('footer.features.links.community')}
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className={`font-medium text-gray-800 ${isRTL ? 'font-arabic' : ''}`}>
              {t('footer.company.title')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href={getGoogleSearchUrl(t('footer.company.links.aboutUs'))} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm text-gray-600 hover:text-teal-600 transition-colors ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('footer.company.links.aboutUs')}
                </a>
              </li>
              <li>
                <a 
                  href={getGoogleSearchUrl(t('footer.company.links.contact'))} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm text-gray-600 hover:text-teal-600 transition-colors ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('footer.company.links.contact')}
                </a>
              </li>
              <li>
                <a 
                  href={getGoogleSearchUrl(t('footer.company.links.privacyPolicy'))} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm text-gray-600 hover:text-teal-600 transition-colors ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('footer.company.links.privacyPolicy')}
                </a>
              </li>
              <li>
                <a 
                  href={getGoogleSearchUrl(t('footer.company.links.termsOfService'))} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm text-gray-600 hover:text-teal-600 transition-colors ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('footer.company.links.termsOfService')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;