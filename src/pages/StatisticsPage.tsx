import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Activity, Heart, Droplets, Wind, ChevronDown, ChevronUp } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
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

  // Update document direction when language changes
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

  const weeklyData = {
    labels: isRTL 
      ? ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [2.25, 1.5, 2.5, 1.75, 1.75, 1.5, 2.25],
      backgroundColor: '#4F46E5',
      borderRadius: 8,
    }]
  };

  const monthlyData = {
    labels: Array.from({ length: 30 }, (_, i) => (i + 1).toString()),
    datasets: [{
      data: Array.from({ length: 30 }, () => Math.random() * 200 + 100),
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4,
    }]
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <Activity className="w-5 h-5 text-green-500" />
            <span>{t('labels.exerciseDuration')}</span>
          </label>
          <input
            type="range"
            value={formData.diabetes.exerciseDuration}
            onChange={(e) => handleInputChange('diabetes', 'exerciseDuration', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            min="0"
            max="4"
            step="0.25"
          />
          <div className="text-sm text-gray-500 mt-1">
            {t('status.currentHours', { hours: formData.diabetes.exerciseDuration || '0' })}
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <Droplets className="w-5 h-5 text-green-500" />
            <span>{t('labels.bloodSugar')}</span>
          </label>
          <input
            type="number"
            value={formData.diabetes.bloodSugar}
            onChange={(e) => handleInputChange('diabetes', 'bloodSugar', e.target.value)}
            placeholder={t('placeholders.enterValue')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <span>{t('labels.weight')}</span>
          </label>
          <input
            type="number"
            value={formData.diabetes.weight}
            onChange={(e) => handleInputChange('diabetes', 'weight', e.target.value)}
            placeholder={t('placeholders.enterWeight')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <span>{t('labels.height')}</span>
          </label>
          <input
            type="number"
            value={formData.diabetes.height}
            onChange={(e) => handleInputChange('diabetes', 'height', e.target.value)}
            placeholder={t('placeholders.enterHeight')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-4">{t('status.bmi')}</h3>
          <div className="relative h-4 bg-gray-200 rounded-full mb-2">
            <div 
              className="absolute h-full bg-green-500 rounded-full"
              style={{ width: '60%' }}
            ></div>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold">
              {calculateBMI(formData.diabetes.weight, formData.diabetes.height)}
            </span>
            <p className="text-green-600 text-sm">{t('status.healthy')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">{t('status.bloodSugarStatus')}</h3>
          <div className="text-center">
            <span className="text-3xl font-bold text-green-500">
              {formData.diabetes.bloodSugar || '--'} mg/dl
            </span>
            <p className="text-sm mt-1">
              {formData.diabetes.bloodSugar ? 
                getConditionStatus('diabetes', parseFloat(formData.diabetes.bloodSugar)) : 
                t('status.enterData')}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">{t('status.dailyActivity')}</h3>
          <div className="text-center">
            <span className="text-3xl font-bold text-green-500">
              {formData.diabetes.exerciseDuration || '0'} {isRTL ? 'ساعات' : 'hours'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHeartSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <Activity className="w-5 h-5 text-red-500" />
            <span>{t('labels.cholesterol')}</span>
          </label>
          <input
            type="number"
            value={formData.heart.cholesterol}
            onChange={(e) => handleInputChange('heart', 'cholesterol', e.target.value)}
            placeholder={t('placeholders.enterCholesterol')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span>{t('labels.bloodPressure')}</span>
          </label>
          <input
            type="text"
            value={formData.heart.bloodPressure}
            onChange={(e) => handleInputChange('heart', 'bloodPressure', e.target.value)}
            placeholder={t('placeholders.bloodPressureFormat')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <span>{t('labels.weight')}</span>
          </label>
          <input
            type="number"
            value={formData.heart.weight}
            onChange={(e) => handleInputChange('heart', 'weight', e.target.value)}
            placeholder={t('placeholders.enterWeight')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <span>{t('labels.height')}</span>
          </label>
          <input
            type="number"
            value={formData.heart.height}
            onChange={(e) => handleInputChange('heart', 'height', e.target.value)}
            placeholder={t('placeholders.enterHeight')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-4">{t('status.bmi')}</h3>
          <div className="relative h-4 bg-gray-200 rounded-full mb-2">
            <div 
              className="absolute h-full bg-red-500 rounded-full"
              style={{ width: '40%' }}
            ></div>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold">
              {calculateBMI(formData.heart.weight, formData.heart.height)}
            </span>
            <p className="text-red-600 text-sm">{t('status.monitorWeight')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">{t('status.cholesterolStatus')}</h3>
          <div className="text-center">
            <span className="text-3xl font-bold text-red-500">
              {formData.heart.cholesterol || '--'} mg/dl
            </span>
            <p className="text-sm mt-1">
              {formData.heart.cholesterol ? 
                getConditionStatus('heart', parseFloat(formData.heart.cholesterol)) : 
                t('status.enterData')}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">{t('status.bloodPressure')}</h3>
          <div className="text-center">
            <span className="text-3xl font-bold text-red-500">
              {formData.heart.bloodPressure || '--/--'}
            </span>
            <p className="text-sm mt-1">
              {formData.heart.bloodPressure ? 
                t('status.monitorRegularly') : 
                t('status.enterData')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPressureSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span>{t('labels.systolic')}</span>
          </label>
          <input
            type="number"
            value={formData.pressure.systolic}
            onChange={(e) => handleInputChange('pressure', 'systolic', e.target.value)}
            placeholder={t('placeholders.upperNumber')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span>{t('labels.diastolic')}</span>
          </label>
          <input
            type="number"
            value={formData.pressure.diastolic}
            onChange={(e) => handleInputChange('pressure', 'diastolic', e.target.value)}
            placeholder={t('placeholders.lowerNumber')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <span>{t('labels.weight')}</span>
          </label>
          <input
            type="number"
            value={formData.pressure.weight}
            onChange={(e) => handleInputChange('pressure', 'weight', e.target.value)}
            placeholder={t('placeholders.enterWeight')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <span>{t('labels.height')}</span>
          </label>
          <input
            type="number"
            value={formData.pressure.height}
            onChange={(e) => handleInputChange('pressure', 'height', e.target.value)}
            placeholder={t('placeholders.enterHeight')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-4">{t('status.bmi')}</h3>
          <div className="relative h-4 bg-gray-200 rounded-full mb-2">
            <div 
              className="absolute h-full bg-blue-500 rounded-full"
              style={{ width: '50%' }}
            ></div>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold">
              {calculateBMI(formData.pressure.weight, formData.pressure.height)}
            </span>
            <p className="text-blue-600 text-sm">{t('status.keepMonitoring')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">{t('status.bloodPressure')}</h3>
          <div className="text-center">
            <span className="text-3xl font-bold text-blue-500">
              {formData.pressure.systolic || '--'}/{formData.pressure.diastolic || '--'} mmHg
            </span>
            <p className="text-sm mt-1">
              {formData.pressure.systolic && formData.pressure.diastolic ? 
                getConditionStatus('pressure', parseFloat(formData.pressure.systolic)) : 
                t('status.enterData')}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">{t('status.recommendations')}</h3>
          <div className="text-center">
            <span className="text-lg text-blue-500">
              {t('status.reduceSodium')}
            </span>
            <p className="text-sm mt-1">{t('status.exerciseRegularly')}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnemiaSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <Wind className="w-5 h-5 text-purple-500" />
            <span>{t('labels.hemoglobin')}</span>
          </label>
          <input
            type="number"
            value={formData.anemia.hemoglobin}
            onChange={(e) => handleInputChange('anemia', 'hemoglobin', e.target.value)}
            placeholder={t('placeholders.enterHemoglobin')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <Wind className="w-5 h-5 text-purple-500" />
            <span>{t('labels.ironLevel')}</span>
          </label>
          <input
            type="number"
            value={formData.anemia.ironLevel}
            onChange={(e) => handleInputChange('anemia', 'ironLevel', e.target.value)}
            placeholder={t('placeholders.enterIronLevel')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <span>{t('labels.weight')}</span>
          </label>
          <input
            type="number"
            value={formData.anemia.weight}
            onChange={(e) => handleInputChange('anemia', 'weight', e.target.value)}
            placeholder={t('placeholders.enterWeight')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <span>{t('labels.height')}</span>
          </label>
          <input
            type="number"
            value={formData.anemia.height}
            onChange={(e) => handleInputChange('anemia', 'height', e.target.value)}
            placeholder={t('placeholders.enterHeight')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-4">{t('status.bmi')}</h3>
          <div className="relative h-4 bg-gray-200 rounded-full mb-2">
            <div 
              className="absolute h-full bg-purple-500 rounded-full"
              style={{ width: '55%' }}
            ></div>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold">
              {calculateBMI(formData.anemia.weight, formData.anemia.height)}
            </span>
            <p className="text-purple-600 text-sm">{t('status.healthyRange')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">{t('status.hemoglobinStatus')}</h3>
          <div className="text-center">
            <span className="text-3xl font-bold text-purple-500">
              {formData.anemia.hemoglobin || '--'} g/dL
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
              {formData.anemia.ironLevel || '--'} μg/dL
            </span>
            <p className="text-sm mt-1">
              {formData.anemia.ironLevel ? 
                (parseFloat(formData.anemia.ironLevel) < 60 ? t('status.low') : t('status.normal')) : 
                t('status.enterData')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
          <LanguageSwitcher />
        </div>
        
        <div className="space-y-6">
          {conditions.map((condition) => (
            <div key={condition.id} className="bg-white rounded-2xl shadow overflow-hidden">
              <button
                onClick={() => toggleSection(condition.id)}
                className={`w-full flex justify-between items-center p-6 text-left ${
                  expandedSections[condition.id] ? 'bg-indigo-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    condition.id === 'diabetes' ? 'bg-green-100 text-green-600' :
                    condition.id === 'heart' ? 'bg-red-100 text-red-600' :
                    condition.id === 'pressure' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {condition.icon}
                  </div>
                  <h2 className="text-xl font-semibold">{condition.name}</h2>
                </div>
                {expandedSections[condition.id] ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {expandedSections[condition.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 pt-0"
                >
                  {condition.id === 'diabetes' && renderDiabetesSection()}
                  {condition.id === 'heart' && renderHeartSection()}
                  {condition.id === 'pressure' && renderPressureSection()}
                  {condition.id === 'anemia' && renderAnemiaSection()}

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">{t('healthTrends')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-xl shadow p-4">
                        <h4 className="text-md font-medium mb-4">{t('monthlyTrend')}</h4>
                        <div className="h-64">
                          <Line 
                            data={monthlyData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: { legend: { display: false } },
                              scales: {
                                x: { display: true },
                                y: { display: true }
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="bg-white rounded-xl shadow p-4">
                        <h4 className="text-md font-medium mb-4">{t('weeklyActivity')}</h4>
                        <div className="h-64">
                          <Bar 
                            data={weeklyData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: { legend: { display: false } },
                              scales: {
                                x: { grid: { display: false } },
                                y: { grid: { display: false } }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;