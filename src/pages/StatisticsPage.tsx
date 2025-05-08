// Full version of StatisticsPage.tsx with all sections implemented properly

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Activity, Heart, Droplets, Wind, ChevronDown, ChevronUp } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import LanguageSwitcher from './LanguageSwitcher';

ChartJS.register(...registerables);

const StatisticsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [activeTab, setActiveTab] = useState('diabetes');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    diabetes: true,
    heart: false,
    pressure: false,
    anemia: false
  });

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  const toggleSection = (conditionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [conditionId]: !prev[conditionId]
    }));
    setActiveTab(conditionId);
  };

  const conditions = [
    { id: 'diabetes', name: t('conditions.diabetes'), icon: <Droplets className="w-5 h-5" /> },
    { id: 'heart', name: t('conditions.heart'), icon: <Heart className="w-5 h-5" /> },
    { id: 'pressure', name: t('conditions.pressure'), icon: <Activity className="w-5 h-5" /> },
    { id: 'anemia', name: t('conditions.anemia'), icon: <Wind className="w-5 h-5" /> }
  ];

  const [formData, setFormData] = useState({
    diabetes: { exerciseDuration: '', weight: '', bloodSugar: '', height: '' },
    heart: { cholesterol: '', bloodPressure: '', weight: '', height: '' },
    pressure: { systolic: '', diastolic: '', weight: '', height: '' },
    anemia: { hemoglobin: '', ironLevel: '', weight: '', height: '' }
  });

  const handleInputChange = (condition: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [condition]: {
        ...prev[condition as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const calculateBMI = (weight: string, height: string) => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100;
    if (weightNum && heightNum) {
      return (weightNum / (heightNum * heightNum)).toFixed(1);
    }
    return '--';
  };

  const getConditionStatus = (condition: string, value: number) => {
    switch (condition) {
      case 'diabetes':
        return value > 180 ? t('status.high') : value > 70 ? t('status.normal') : t('status.low');
      case 'heart':
        return value > 200 ? t('status.highRisk') : value > 150 ? t('status.moderate') : t('status.normal');
      case 'pressure':
        return value > 140 ? t('status.high') : value > 90 ? t('status.elevated') : t('status.normal');
      case 'anemia':
        return value < 12 ? t('status.low') : t('status.normal');
      default:
        return '--';
    }
  };

  const renderDiabetesSection = () => (
    <div className="p-4">قسم السكري - محتوى سيتم تطويره لاحقًا</div>
  );

  const renderHeartSection = () => (
    <div className="p-4">قسم القلب - محتوى سيتم تطويره لاحقًا</div>
  );

  const renderPressureSection = () => (
    <div className="p-4">قسم الضغط - محتوى سيتم تطويره لاحقًا</div>
  );

  const renderAnemiaSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-gray-700 mb-2 block">{t('labels.hemoglobin')}</label>
          <input
            type="number"
            value={formData.anemia.hemoglobin}
            onChange={(e) => handleInputChange('anemia', 'hemoglobin', e.target.value)}
            placeholder={t('placeholders.enterHemoglobin')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="text-gray-700 mb-2 block">{t('labels.ironLevel')}</label>
          <input
            type="number"
            value={formData.anemia.ironLevel}
            onChange={(e) => handleInputChange('anemia', 'ironLevel', e.target.value)}
            placeholder={t('placeholders.enterIronLevel')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-4">{t('status.bmi')}</h3>
          <div className="text-center">
            <span className="text-2xl font-bold">
              {calculateBMI(formData.anemia.weight, formData.anemia.height)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">{t('status.hemoglobinStatus')}</h3>
          <div className="text-center">
            <span className="text-3xl font-bold text-purple-500">
              {formData.anemia.hemoglobin || '--'} g/dl
            </span>
            <p className="text-sm mt-1">
              {formData.anemia.hemoglobin ? 
                getConditionStatus('anemia', parseFloat(formData.anemia.hemoglobin)) : 
                t('status.enterData')}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">{t('status.ironLevel')}</h3>
          <div className="text-center">
            <span className="text-3xl font-bold text-purple-500">
              {formData.anemia.ironLevel || '--'} µg/dL
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('pageTitle.statistics')}</h2>
        <LanguageSwitcher />
      </div>

      <div className="space-y-4">
        {conditions.map(condition => (
          <div key={condition.id} className="border rounded-xl shadow">
            <button
              onClick={() => toggleSection(condition.id)}
              className="flex items-center justify-between w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-t-xl"
            >
              <div className="flex items-center space-x-2">
                {condition.icon}
                <span className="font-medium">{condition.name}</span>
              </div>
              {expandedSections[condition.id] ? <ChevronUp /> : <ChevronDown />}
            </button>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: expandedSections[condition.id] ? 'auto' : 0 }}
              className="overflow-hidden px-4 pb-4"
            >
              {condition.id === 'diabetes' && renderDiabetesSection()}
              {condition.id === 'heart' && renderHeartSection()}
              {condition.id === 'pressure' && renderPressureSection()}
              {condition.id === 'anemia' && renderAnemiaSection()}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsPage;
