import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Droplets, Heart, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import SubmitButton from '../components/SubmitButton';
import BMIStatusCard from '../components/BMIStatusCard';
import HealthTrendsSection from '../components/HealthTrendsSection';
import LanguageSwitcher from './LanguageSwitcher';

// Updated API token
const API_URL = 'https://your-api-url/api';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODFhMjY5MGFkMDRkZjRjZWZlYWEyYTUiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NjU0NDQ2M30.kiKVbi6GJxssFgq4v1S-kCkev_SbZ2rrKUGJbH2EEpE';

const StatisticsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [conditionId, setConditionId] = useState<string>('diabetes');
  const [formData, setFormData] = useState<Record<string, string>>({
    // Common fields
    weight: '',
    height: '',
    // Diabetes fields
    exerciseDuration: '0',
    bloodSugar: '',
    // Heart fields
    cholesterol: '',
    bloodPressure: '',
    // Blood pressure fields
    systolic: '',
    diastolic: '',
    // Anemia fields
    hemoglobin: '',
    ironLevel: '',
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showCharts, setShowCharts] = useState<boolean>(false);
  const [chartData, setChartData] = useState<{
    monthly: number[];
    weekly: number[];
  } | undefined>(undefined);
  
  // Set the document direction based on language
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Reset showCharts when changing condition
  useEffect(() => {
    setShowCharts(false);
  }, [conditionId]);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when field is edited
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Common validations - always required
    if (!formData.weight || isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
      errors.weight = t('Weight is required');
    }
    
    if (!formData.height || isNaN(Number(formData.height)) || Number(formData.height) <= 0) {
      errors.height = t('Height is required');
    }
    
    // Condition-specific validations
    if (conditionId === 'diabetes') {
      if (!formData.bloodSugar || isNaN(Number(formData.bloodSugar)) || Number(formData.bloodSugar) < 0) {
        errors.bloodSugar = t('Blood sugar level is required');
      }
      if (!formData.exerciseDuration || isNaN(Number(formData.exerciseDuration))) {
        errors.exerciseDuration = t('Exercise duration is required');
      }
    } else if (conditionId === 'heart') {
      if (!formData.cholesterol || isNaN(Number(formData.cholesterol)) || Number(formData.cholesterol) < 0) {
        errors.cholesterol = t('Cholesterol level is required');
      }
      if (!formData.bloodPressure) {
        errors.bloodPressure = t('Blood pressure is required');
      }
    } else if (conditionId === 'pressure') {
      if (!formData.systolic || isNaN(Number(formData.systolic)) || Number(formData.systolic) < 0) {
        errors.systolic = t('Systolic pressure is required');
      }
      if (!formData.diastolic || isNaN(Number(formData.diastolic)) || Number(formData.diastolic) < 0) {
        errors.diastolic = t('Diastolic pressure is required');
      }
    } else if (conditionId === 'anemia') {
      if (!formData.hemoglobin || isNaN(Number(formData.hemoglobin)) || Number(formData.hemoglobin) < 0) {
        errors.hemoglobin = t('Hemoglobin level is required');
      }
      if (!formData.ironLevel || isNaN(Number(formData.ironLevel)) || Number(formData.ironLevel) < 0) {
        errors.ironLevel = t('Iron level is required');
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate realistic chart data based on form inputs
  const generateChartData = () => {
    let monthlyBase = 100;
    let monthlyVariation = 30;
    
    // Adjust base values based on condition and form data
    switch (conditionId) {
      case 'diabetes': {
        const bloodSugar = parseFloat(formData.bloodSugar);
        if (!isNaN(bloodSugar)) {
          monthlyBase = bloodSugar;
          monthlyVariation = bloodSugar * 0.3;
        }
        break;
      }
      case 'heart': {
        const cholesterol = parseFloat(formData.cholesterol);
        if (!isNaN(cholesterol)) {
          monthlyBase = cholesterol;
          monthlyVariation = cholesterol * 0.2;
        }
        break;
      }
      case 'pressure': {
        const systolic = parseFloat(formData.systolic);
        if (!isNaN(systolic)) {
          monthlyBase = systolic;
          monthlyVariation = systolic * 0.15;
        }
        break;
      }
      case 'anemia': {
        const hemoglobin = parseFloat(formData.hemoglobin);
        if (!isNaN(hemoglobin)) {
          monthlyBase = hemoglobin * 10; // Scale up for visibility
          monthlyVariation = hemoglobin * 2;
        }
        break;
      }
    }
    
    // Generate monthly data with a pattern
    const monthlyData = Array.from({ length: 30 }, (_, i) => {
      const trend = Math.sin(i / 5) * (monthlyVariation / 2);
      const random = Math.random() * monthlyVariation - (monthlyVariation / 2);
      return Math.max(40, Math.min(450, monthlyBase + trend + random));
    });
    
    // Weekly data based on exercise duration
    let weeklyBase = 1.5; // Default
    if (conditionId === 'diabetes') {
      const exercise = parseFloat(formData.exerciseDuration);
      if (!isNaN(exercise)) {
        weeklyBase = exercise / 2;
      }
    }
    
    const weeklyData = [
      weeklyBase + 0.5, // Monday
      weeklyBase - 0.2, // Tuesday
      weeklyBase + 0.7, // Wednesday
      weeklyBase + 0.1, // Thursday
      weeklyBase + 0.3, // Friday
      weeklyBase - 0.1, // Saturday
      weeklyBase + 0.4, // Sunday
    ];
    
    return {
      monthly: monthlyData,
      weekly: weeklyData
    };
  };

  // Handle form submission with API integration
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const response = await fetch(`${API_URL}/statistics/${conditionId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
          },
          body: JSON.stringify({
            ...formData,
            timestamp: new Date().toISOString()
          })
        });

        if (!response.ok) {
          throw new Error('Failed to submit data');
        }

        // Generate chart data based on form input
        const newChartData = generateChartData();
        setChartData(newChartData);
        
        // Show charts after successful submission
        setShowCharts(true);
        
        console.log('API Response:', response);
      } catch (error) {
        console.error('Error submitting data:', error);
        setFormErrors(prev => ({
          ...prev,
          submit: 'Failed to submit data. Please try again.'
        }));
        
        // Still show charts in case of API error (for demo purposes)
        const newChartData = generateChartData();
        setChartData(newChartData);
        setShowCharts(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Render error message
  const renderError = (field: string) => {
    if (formErrors[field]) {
      return <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>;
    }
    return null;
  };

  // Get relevant status values based on condition
  const getConditionStatus = (condition: string, value: string) => {
    if (!value) return t('status.enterData');
    
    const numValue = parseFloat(value);
    
    switch (condition) {
      case 'diabetes':
        return numValue > 180 ? t('status.high') : numValue > 70 ? t('status.normal') : t('status.low');
      case 'heart':
        return numValue > 200 ? t('status.highRisk') : numValue > 150 ? t('status.moderate') : t('status.normal');
      case 'pressure':
        return numValue > 140 ? t('status.high') : numValue > 90 ? t('status.elevated') : t('status.normal');
      case 'anemia':
        return numValue < 12 ? t('status.low') : t('status.normal');
      default:
        return t('status.enterData');
    }
  };

  // Condition selector component
  const ConditionSelector = () => {
    return (
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-0">
          <h2 className="text-4xl font-extrabold text-gray-800">{t('title')}</h2>
        </div>
        <LanguageSwitcher />

        <div className="flex flex-wrap gap-3 justify-center mt-4">
          {[
            { id: 'diabetes', color: 'bg-gray-600', icon: <Droplets className="mr-2" /> },
            { id: 'heart', color: 'bg-gray-600', icon: <Heart className="mr-2" /> },
            { id: 'pressure', color: 'bg-gray-600', icon: <Wind className="mr-2" /> },
            { id: 'anemia', color: 'bg-gray-600', icon: <Activity className="mr-2" /> }
          ].map((condition) => (
            <motion.button 
              key={condition.id}
              onClick={() => setConditionId(condition.id)}
              className={`px-5 py-2 rounded-lg text-white ${condition.color} ${
                conditionId === condition.id ? 'ring-2 ring-offset-2 ring-gray-400' : ''
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center">
                {condition.icon}
                {t(`conditions.${condition.id}`)}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderDiabetesForm = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <Activity className="w-5 h-5 text-green-500" />
            <span>{t('labels.exerciseDuration')}</span>
          </label>
          <input
            type="range"
            value={formData.exerciseDuration}
            onChange={(e) => handleInputChange('exerciseDuration', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            min="0"
            max="4"
            step="0.25"
          />
          <div className="text-sm text-gray-500 mt-1">
            {t('status.currentHours', { hours: formData.exerciseDuration || '0' })}
          </div>
          {renderError('exerciseDuration')}
        </motion.div>

        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <Droplets className="w-5 h-5 text-green-500" />
            <span>{t('labels.bloodSugar')}</span>
          </label>
          <input
            type="number"
            value={formData.bloodSugar}
            onChange={(e) => handleInputChange('bloodSugar', e.target.value)}
            placeholder={t('placeholders.enterValue')}
            className={`w-full p-2 border ${
              formErrors.bloodSugar ? 'border-red-500' : 'border-gray-300'
            } rounded-lg`}
          />
          {renderError('bloodSugar')}
        </motion.div>

        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <span>{t('labels.weight')}</span>
          </label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder={t('placeholders.enterWeight')}
            className={`w-full p-2 border ${
              formErrors.weight ? 'border-red-500' : 'border-gray-300'
            } rounded-lg`}
          />
          {renderError('weight')}
        </motion.div>

        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <span>{t('labels.height')}</span>
          </label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            placeholder={t('placeholders.enterHeight')}
            className={`w-full p-2 border ${
              formErrors.height ? 'border-red-500' : 'border-gray-300'
            } rounded-lg`}
          />
          {renderError('height')}
        </motion.div>
      </div>

      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <BMIStatusCard 
            weight={formData.weight}
            height={formData.height}
            color="green"
            status={t('status.healthy')}
          />

          <motion.div 
            className="bg-white rounded-xl shadow p-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-2">{t('status.bloodSugarStatus')}</h3>
            <div className="text-center">
              <span className="text-3xl font-bold text-green-500">
                {formData.bloodSugar || '--'} mg/dl
              </span>
              <p className="text-sm mt-1">
                {getConditionStatus('diabetes', formData.bloodSugar)}
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl shadow p-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-lg font-semibold mb-2">{t('status.dailyActivity')}</h3>
            <div className="text-center">
              <span className="text-3xl font-bold text-green-500">
                {formData.exerciseDuration || '0'} {t('hours')}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <HealthTrendsSection 
        conditionId="diabetes" 
        chartData={chartData}
        showCharts={showCharts}
      />

      <motion.div 
        className="flex justify-end mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <SubmitButton 
          onClick={handleSubmit}
          isLoading={isSubmitting}
          color="green"
          label={isSubmitting ? t('submitting') : t('submit')}
        />
      </motion.div>
    </motion.div>
  );

  const renderHeartForm = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <Activity className="w-5 h-5 text-red-500" />
            <span>{t('labels.cholesterol')}</span>
          </label>
          <input
            type="number"
            value={formData.cholesterol}
            onChange={(e) => handleInputChange('cholesterol', e.target.value)}
            placeholder={t('placeholders.enterCholesterol')}
            className={`w-full p-2 border ${
              formErrors.cholesterol ? 'border-red-500' : 'border-gray-300'
            } rounded-lg`}
          />
          {renderError('cholesterol')}
        </motion.div>

        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span>{t('labels.bloodPressure')}</span>
          </label>
          <input
            type="text"
            value={formData.bloodPressure}
            onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
            placeholder={t('placeholders.bloodPressureFormat')}
            className={`w-full p-2 border ${
              formErrors.bloodPressure ? 'border-red-500' : 'border-gray-300'
            } rounded-lg`}
          />
          {renderError('bloodPressure')}
        </motion.div>

        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <span>{t('labels.weight')}</span>
          </label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder={t('placeholders.enterWeight')}
            className={`w-full p-2 border ${
              formErrors.weight ? 'border-red-500' : 'border-gray-300'
            } rounded-lg`}
          />
          {renderError('weight')}
        </motion.div>

        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <span>{t('labels.height')}</span>
          </label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            placeholder={t('placeholders.enterHeight')}
            className={`w-full p-2 border ${
              formErrors.height ? 'border-red-500' : 'border-gray-300'
            } rounded-lg`}
          />
          {renderError('height')}
        </motion.div>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <BMIStatusCard 
          weight={formData.weight}
          height={formData.height}
          color="red"
          status={t('status.monitorWeight')}
        />

        <motion.div 
          className="bg-white rounded-xl shadow p-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-2">{t('status.cholesterolStatus')}</h3>
          <div className="text-center">
            <span className="text-3xl font-bold text-red-500">
              {formData.cholesterol || '--'} mg/dl
            </span>
            <p className="text-sm mt-1">
              {getConditionStatus('heart', formData.cholesterol)}
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow p-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold mb-2">{t('status.bloodPressure')}</h3>
          <div className="text-center">
            <span className="text-3xl font-bold text-red-500">
              {formData.bloodPressure || '--/--'}
            </span>
            <p className="text-sm mt-1">
              {formData.bloodPressure ? 
                t('status.monitorRegularly') : 
                t('status.enterData')}
            </p>
          </div>
        </motion.div>
      </motion.div>

      <HealthTrendsSection 
        conditionId="heart" 
        chartData={chartData}
        showCharts={showCharts}
      />

      <motion.div 
        className="flex justify-end mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <SubmitButton 
          onClick={handleSubmit}
          isLoading={isSubmitting}
          color="red"
          label={isSubmitting ? t('submitting') : t('submit')}
        />
      </motion.div>
    </motion.div>
  );

  const renderPressureForm = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span>{t('labels.systolic')}</span>
          </label>
          <input
            type="number"
            value={formData.systolic}
            onChange={(e) => handleInputChange('systolic', e.target.value)}
            placeholder={t('placeholders.upperNumber')}
            className={`w-full p-2 border ${
              formErrors.systolic ? 'border-red-500' : 'border-gray-300'
            } rounded-lg`}
          />
          {renderError('systolic')}
        </motion.div>

        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span>{t('labels.diastolic')}</span>
          </label>
          <input
            type="number"
            value={formData.diastolic}
            onChange={(e) => handleInputChange('diastolic', e.target.value)}
            placeholder={t('placeholders.lowerNumber')}
            className={`w-full p-2 border ${
              formErrors.diastolic ? 'border-red-500' : 'border-gray-300'
            } rounded-lg`}
          />
          {renderError('diastolic')}
        </motion.div>

        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <span>{t('labels.weight')}</span>
          </label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder={t('placeholders.enterWeight')}
            className={`w-full p-2 border ${
              formErrors.weight ? 'border-red-500' : 'border-gray-300'
            } rounded-lg`}
          />
          {renderError('weight')}
        </motion.div>

        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <span>{t('labels.height')}</span>
          </label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            placeholder={t('placeholders.enterHeight')}
            className={`w-full p-2 border ${
              formErrors.height ? 'border-red-500' : 'border-gray-300'
            } rounded-lg`}
          />
          {renderError('height')}
        </motion.div>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <BMIStatusCard 
          weight={formData.weight}
          height={formData.height}
          color="blue"
          status={t('status.keepMonitoring')}
        />

        <motion.div 
          className="bg-white rounded-xl shadow p-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-2">{t('status.bloodPressure')}</h3>
          <div className="text-center">
            <span className="text-3xl font-bold text-blue-500">
              {formData.systolic || '--'}/{formData.diastolic || '--'} mmHg
            </span>
            <p className="text-sm mt-1">
              {formData.systolic && formData.diastolic ? 
                getConditionStatus('pressure', formData.systolic) : 
                t('status.enterData')}
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow p-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold mb-2">{t('status.recommendations')}</h3>
          <div className="text-center">
            <span className="text-lg text-blue-500">
              {t('status.reduceSodium')}
            </span>
            <p className="text-sm mt-1">{t('status.exerciseRegularly')}</p>
          </div>
        </motion.div>
      </motion.div>

      <HealthTrendsSection 
        conditionId="pressure" 
        chartData={chartData}
        showCharts={showCharts}
      />

      <motion.div 
        className="flex justify-end mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <SubmitButton 
          onClick={handleSubmit}
          isLoading={isSubmitting}
          color="blue"
          label={isSubmitting ? t('submitting') : t('submit')}
        />
      </motion.div>
    </motion.div>
  );

  const renderAnemiaForm = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <Wind className="w-5 h-5 text-purple-500" />
            <span>{t('labels.hemoglobin')}</span>
          </label>
          <input
            type="number"
            value={formData.hemoglobin}
            onChange={(e) => handleInputChange('hemoglobin', e.target.value)}
            placeholder={t('placeholders.enterHemoglobin')}
            className={`w-full p-2 border ${
              formErrors.hemoglobin ? 'border-red-500' : 'border-gray-300'
            } rounded-lg`}
          />
          {renderError('hemoglobin')}
        </motion.div>

        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <Wind className="w-5 h-5 text-purple-500" />
            <span>{t('labels.ironLevel')}</span>
          </label>
          <input
            type="number"
            value={formData.ironLevel}
            onChange={(e) => handleInputChange('ironLevel', e.target.value)}
            placeholder={t('placeholders.enterIronLevel')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </motion.div>

        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <span>{t('labels.weight')}</span>
          </label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder={t('placeholders.enterWeight')}
            className={`w-full p-2 border ${
              formErrors.weight ? 'border-red-500' : 'border-gray-300'
            } rounded-lg`}
          />
          {renderError('weight')}
        </motion.div>

        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label className="flex items-center space-x-2 text-gray-700 mb-2">
            <span>{t('labels.height')}</span>
          </label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            placeholder={t('placeholders.enterHeight')}
            className={`w-full p-2 border ${
              formErrors.height ? 'border-red-500' : 'border-gray-300'
            } rounded-lg`}
          />
          {renderError('height')}
        </motion.div>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <BMIStatusCard 
          weight={formData.weight}
          height={formData.height}
          color="purple"
          status={t('status.healthyRange')}
        />

        <motion.div 
          className="bg-white rounded-xl shadow p-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-2">{t('status.hemoglobinStatus')}</h3>
          <div className="text-center">
            <span className="text-3xl font-bold text-purple-500">
              {formData.hemoglobin || '--'} g/dL
            </span>
            <p className="text-sm mt-1">
              {getConditionStatus('anemia', formData.hemoglobin)}
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow p-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold mb-2">{t('status.ironLevel')}</h3>
          <div className="text-center">
            <span className="text-3xl font-bold text-purple-500">
              {formData.ironLevel || '--'} μg/dL
            </span>
            <p className="text-sm mt-1">
              {formData.ironLevel ? 
                (parseFloat(formData.ironLevel) < 60 ? t('status.low') : t('status.normal')) : 
                t('status.enterData')}
            </p>
          </div>
        </motion.div>
      </motion.div>

      <HealthTrendsSection 
        conditionId="anemia" 
        chartData={chartData}
        showCharts={showCharts}
      />

      <motion.div 
        className="flex justify-end mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <SubmitButton 
          onClick={handleSubmit}
          isLoading={isSubmitting}
          color="purple"
          label={isSubmitting ? t('submitting') : t('submit')}
        />
      </motion.div>
    </motion.div>
  );

  const renderFormSections = () => {
    switch (conditionId) {
      case 'diabetes':
        return renderDiabetesForm();
      case 'heart':
        return renderHeartForm();
      case 'pressure':
        return renderPressureForm();
      case 'anemia':
        return renderAnemiaForm();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <ConditionSelector />
        
        <motion.div 
          className="bg-white shadow rounded-lg p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {renderFormSections()}
        </motion.div>
      </div>
    </div>
  );
};

export default StatisticsPage;