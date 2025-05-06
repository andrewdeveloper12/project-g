import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Heart, 
  Activity, 
  Droplets, 
  Shield, 
  User, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../components/Context/AuthContext';

const Layout: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
user
  const menuItems = [
    { path: '/', icon: <Home className="w-5 h-5" />, label: t('nav.dashboard') },
    { path: '/blood-pressure', icon: <Activity className="w-5 h-5" />, label: t('nav.bloodPressure') },
    { path: '/diabetes', icon: <Droplets className="w-5 h-5" />, label: t('nav.diabetes') },
    { path: '/heart-health', icon: <Heart className="w-5 h-5" />, label: t('nav.heartHealth') },
    { path: '/nutrition', icon: <Shield className="w-5 h-5" />, label: t('nav.nutrition') },
    { path: '/profile', icon: <User className="w-5 h-5" />, label: t('nav.profile') },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-teal-500" />
            <h1 className="ml-2 text-xl font-bold text-gray-800">{t('app.title')}</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                <div className="flex items-center mr-6">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <User className="w-4 h-4 text-teal-500" />
                    )}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 hover:text-teal-500 hover:bg-gray-100"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600"
              >
                {t('nav.login')}
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      <div className="flex-grow flex">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:flex md:flex-col md:w-64 bg-white shadow-md">
          <nav className="mt-5 px-2 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  location.pathname === item.path
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className={`mr-3 ${
                  location.pathname === item.path
                    ? 'text-teal-500'
                    : 'text-gray-400 group-hover:text-gray-500'
                }`}>
                  {item.icon}
                </div>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={closeMobileMenu}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
              <nav className="mt-5 px-2 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-4 py-3 text-base font-medium rounded-md ${
                      location.pathname === item.path
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <div className={`mr-4 ${
                      location.pathname === item.path
                        ? 'text-teal-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}>
                      {item.icon}
                    </div>
                    {item.label}
                  </Link>
                ))}

                {user && (
                  <button 
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="w-full group flex items-center px-4 py-3 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <LogOut className="mr-4 text-gray-400 group-hover:text-gray-500 h-5 w-5" />
                    {t('nav.logout')}
                  </button>
                )}
              </nav>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <Heart className="h-5 w-5 text-teal-500" />
            <span className="ml-2 text-sm text-gray-500">© 2025 HealthMonitor</span>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-center text-sm text-gray-500">
              {t('app.disclaimer')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;