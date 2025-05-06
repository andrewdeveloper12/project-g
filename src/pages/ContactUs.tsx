import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, User } from 'lucide-react';

const ContactUs: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    alert(t('contact.submissionSuccess'));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 pt-12"
      >
        <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          {t('contact.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('contact.subtitle')}
        </p>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
            <Mail className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t('contact.emailTitle')}
            </h3>
            <a 
              href={`mailto:${t('contact.email')}`}
              className="text-blue-500 hover:text-blue-600 transition"
            >
              {t('contact.email')}
            </a>
          </div>
          {/* Phone */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
            <Phone className="w-12 h-12 text-teal-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t('contact.phoneTitle')}
            </h3>
            <a 
              href={`tel:${t('contact.phone')}`}
              className="text-blue-500 hover:text-blue-600 transition"
            >
              {t('contact.phone')}
            </a>
          </div>

          {/* Address */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
            <MapPin className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t('contact.addressTitle')}
            </h3>
            <p className="text-gray-600">
              {t('contact.address')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white p-8 rounded-xl shadow-md mb-16"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {t('contact.formTitle')}
        </h2>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('contact.nameLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="name"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('contact.namePlaceholder')}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('contact.emailLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('contact.emailPlaceholder')}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              {t('contact.subjectLabel')}
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('contact.subjectPlaceholder')}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              {t('contact.messageLabel')}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('contact.messagePlaceholder')}
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center justify-center mx-auto shadow-md"
            >
              <Send className="w-5 h-5 mr-2" />
              {t('contact.submitButton')}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Business Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gray-50 p-8 rounded-xl border border-gray-200 mb-16"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {t('contact.hoursTitle')}
        </h2>
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-700">{t('contact.weekdaysLabel')}</span>
            </div>
            <span className="text-gray-600">{t('contact.weekdaysHours')}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-700">{t('contact.weekendsLabel')}</span>
            </div>
            <span className="text-gray-600">{t('contact.weekendsHours')}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUs;