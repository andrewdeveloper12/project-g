import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, Info, Activity, Droplets, Wind, Shield, BookOpen, 
  HeartPulse, MessageCircle, BarChart2 
} from 'lucide-react';

const Navigation: React.FC = () => {
  const { t } = useTranslation();

  const navItems = [
    { path: '/', icon: <Home className="w-5 h-5" />, label: t('nav.home') },
    { path: '/resources', icon: <BookOpen className="w-5 h-5" />, label: t('nav.resources') },
    { path: '/chat', icon: <MessageCircle className="w-5 h-5" />, label: t('nav.chat') },
    { path: '/statistics', icon: <BarChart2 className="w-5 h-5" />, label: t('nav.statistics') },
    { path: '/about', icon: <Info className="w-5 h-5" />, label: t('nav.about') },

  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10 overflow-x-hidden">
      <div className="container mx-auto px-5">
        <div className="flex justify-center"> {/* ← هنا التعديل */}
          <div className="flex py-5 space-x-1 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-5 py-1 rounded-full transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-md'
                      : 'hover:bg-green-100 text-green-700 hover:text-green-600'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;