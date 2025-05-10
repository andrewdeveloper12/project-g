import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Activity, HeartPulse } from 'lucide-react';
import { useResults } from '../components/Context/ResultsContext';
import axios from 'axios';
import { useAuth } from '../components/Context/AuthContext';

// Add these type definitions if they don't exist in your project
type User = {
  id: string;
  token: string;
  // Add other user properties as needed
};

type BloodPressureResult = {
  systolic: number;
  diastolic: number;
  pulse?: number;
  diagnosis: string;
  level: 'normal' | 'elevated' | 'hypertension1' | 'hypertension2' | 'crisis' | null;
  apiData?: any; // Replace 'any' with proper type for your API response if available
  id?: string;
  date?: Date;
};

const BloodPressure: React.FC = () => {
  const { t } = useTranslation();
  const { addBloodPressureResult } = useResults();
  const { user } = useAuth() as { user: User | null }; // Type assertion for user
  
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
    // Additional required fields for API
    hemoglobin: '',
    age: '',
    bmi: '',
    gender: '',
    smoking: '',
    physicalActivity: '',
    saltIntake: '',
    chronicKidneyDisease: false,
    endocrineDisorders: false
  });

  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [diagnosisLevel, setDiagnosisLevel] = useState<'normal' | 'elevated' | 'hypertension1' | 'hypertension2' | 'crisis' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate all required fields
    if (!formData.systolic || !formData.diastolic || !formData.hemoglobin || 
        !formData.age || !formData.bmi || !formData.gender || 
        !formData.smoking || !formData.physicalActivity || !formData.saltIntake) {
      setError(t('bloodPressure.requiredFields'));
      setIsLoading(false);
      return;
    }

    try {
      // First get the local diagnosis for UI display
      const systolic = parseInt(formData.systolic) || 0;
      const diastolic = parseInt(formData.diastolic) || 0;
      const pulse = parseInt(formData.pulse) || 0;
      
      // Determine blood pressure category
      let diagnosisResult = '';
      let level: typeof diagnosisLevel = null;
      
      if (systolic < 90 || diastolic < 60) {
        diagnosisResult = t('bloodPressure.hypotension');
        level = 'normal';
      } else if (systolic < 120 && diastolic < 80) {
        diagnosisResult = t('bloodPressure.normal');
        level = 'normal';
      } else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
        diagnosisResult = t('bloodPressure.elevated');
        level = 'elevated';
      } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
        diagnosisResult = t('bloodPressure.hypertension1');
        level = 'hypertension1';
      } else if (systolic >= 140 && systolic <= 180 || diastolic >= 90 && diastolic <= 120) {
        diagnosisResult = t('bloodPressure.hypertension2');
        level = 'hypertension2';
      } else if (systolic > 180 || diastolic > 120) {
        diagnosisResult = t('bloodPressure.crisis');
        level = 'crisis';
      } else {
        diagnosisResult = t('bloodPressure.unknown');
      }
      
      setDiagnosis(diagnosisResult);
      setDiagnosisLevel(level);
      setShowDiagnosis(true);
      
      // Prepare data for API
      const apiData = {
        patientId: user?.id,
        measurements: {
          hemoglobin: parseFloat(formData.hemoglobin),
          age: parseInt(formData.age),
          bmi: parseFloat(formData.bmi),
          gender: formData.gender === 'male',
          smoking: formData.smoking === 'yes',
          physicalActivity: parseInt(formData.physicalActivity),
          saltIntake: parseInt(formData.saltIntake),
          chronicKidneyDisease: formData.chronicKidneyDisease,
          endocrineDisorders: formData.endocrineDisorders
        }
      };

      // Call the API
      const response = await axios.put('/pressure/:recordId', apiData, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      // Create the result object with proper typing
      const result: BloodPressureResult = {
        systolic,
        diastolic,
        pulse: pulse || undefined,
        diagnosis: diagnosisResult,
        level,
        apiData: response.data // Store API response
      };

      // Save the result to the context
      addBloodPressureResult(result);

    } catch (err) {
      setError(t('bloodPressure.apiError'));
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the component code remains the same ...
  const getDiagnosisColor = () => {
    switch(diagnosisLevel) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'elevated': return 'bg-yellow-100 text-yellow-800';
      case 'hypertension1': return 'bg-orange-100 text-orange-800';
      case 'hypertension2': return 'bg-red-100 text-red-800';
      case 'crisis': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendations = () => {
    switch(diagnosisLevel) {
      case 'normal':
        return [
          t('bloodPressure.recMaintain'),
          t('bloodPressure.recRegularCheck'),
          t('bloodPressure.recHealthyDiet')
        ];
      case 'elevated':
        return [
          t('bloodPressure.recReduceSalt'),
          t('bloodPressure.recExercise'),
          t('bloodPressure.recMonitor')
        ];
      case 'hypertension1':
        return [
          t('bloodPressure.recDoctorVisit'),
          t('bloodPressure.recLifestyleChanges'),
          t('bloodPressure.recStressManagement')
        ];
      case 'hypertension2':
        return [
          t('bloodPressure.recImmediateCare'),
          t('bloodPressure.recMedication'),
          t('bloodPressure.recRegularMonitoring')
        ];
      case 'crisis':
        return [
          t('bloodPressure.recEmergency'),
          t('bloodPressure.recNoDelay'),
          t('bloodPressure.recMedicalAttention')
        ];
      default:
        return [t('bloodPressure.recConsultDoctor')];
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Activity className="w-16 h-16 text-teal-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('bloodPressure.title')}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          {t('bloodPressure.description')}
        </p>
      </motion.div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('bloodPressure.systolic')} (mmHg)*
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 120"
                value={formData.systolic}
                onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                required
                min="40"
                max="300"
              />
              <p className="text-xs text-gray-500">{t('bloodPressure.systolicDesc')}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('bloodPressure.diastolic')} (mmHg)*
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 80"
                value={formData.diastolic}
                onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                required
                min="30"
                max="200"
              />
              <p className="text-xs text-gray-500">{t('bloodPressure.diastolicDesc')}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('bloodPressure.pulse')} (bpm)
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 72"
                value={formData.pulse}
                onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
                min="30"
                max="200"
              />
              <p className="text-xs text-gray-500">{t('bloodPressure.pulseDesc')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('bloodPressure.hemoglobin')} (g/dL)*
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 14.2"
                value={formData.hemoglobin}
                onChange={(e) => setFormData({ ...formData, hemoglobin: e.target.value })}
                required
                min="5"
                max="20"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('bloodPressure.age')}*
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 40"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
                min="18"
                max="120"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('bloodPressure.bmi')}*
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 22.5"
                value={formData.bmi}
                onChange={(e) => setFormData({ ...formData, bmi: e.target.value })}
                required
                min="10"
                max="50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('bloodPressure.gender')}*
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                required
              >
                <option value="">{t('bloodPressure.selectGender')}</option>
                <option value="male">{t('bloodPressure.male')}</option>
                <option value="female">{t('bloodPressure.female')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('bloodPressure.smoking')}*
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                value={formData.smoking}
                onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
                required
              >
                <option value="">{t('bloodPressure.selectOption')}</option>
                <option value="yes">{t('bloodPressure.yes')}</option>
                <option value="no">{t('bloodPressure.no')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('bloodPressure.physicalActivity')} (minutes/week)*
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 150"
                value={formData.physicalActivity}
                onChange={(e) => setFormData({ ...formData, physicalActivity: e.target.value })}
                required
                min="0"
                max="10000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('bloodPressure.saltIntake')} (grams/day)*
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 5"
                value={formData.saltIntake}
                onChange={(e) => setFormData({ ...formData, saltIntake: e.target.value })}
                required
                min="0"
                max="50"
              />
            </div>

            <div className="space-y-2 flex items-center">
              <input
                type="checkbox"
                id="chronicKidneyDisease"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                checked={formData.chronicKidneyDisease}
                onChange={(e) => setFormData({ ...formData, chronicKidneyDisease: e.target.checked })}
              />
              <label htmlFor="chronicKidneyDisease" className="ml-2 block text-sm text-gray-700">
                {t('bloodPressure.chronicKidneyDisease')}
              </label>
            </div>

            <div className="space-y-2 flex items-center">
              <input
                type="checkbox"
                id="endocrineDisorders"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                checked={formData.endocrineDisorders}
                onChange={(e) => setFormData({ ...formData, endocrineDisorders: e.target.checked })}
              />
              <label htmlFor="endocrineDisorders" className="ml-2 block text-sm text-gray-700">
                {t('bloodPressure.endocrineDisorders')}
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-md hover:opacity-90 transition flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>{t('bloodPressure.processing')}...</>
            ) : (
              <>
                <HeartPulse className="w-5 h-5" />
                {t('bloodPressure.submit')}
              </>
            )}
          </button>
        </form>
      </div>

      {showDiagnosis && diagnosis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className={`flex-shrink-0 p-4 rounded-lg ${getDiagnosisColor()} w-full md:w-1/3 flex flex-col items-center justify-center`}>
              <HeartPulse className="w-12 h-12 mb-3" />
              <h3 className="text-xl font-bold text-center">{t('bloodPressure.result')}</h3>
              <p className="text-lg font-semibold text-center mt-2">{diagnosis}</p>
            </div>
            
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t('bloodPressure.whatItMeans')}</h3>
              <p className="text-gray-600 mb-4">
                {diagnosisLevel === 'normal' && t('bloodPressure.normalDesc')}
                {diagnosisLevel === 'elevated' && t('bloodPressure.elevatedDesc')}
                {diagnosisLevel === 'hypertension1' && t('bloodPressure.hypertension1Desc')}
                {diagnosisLevel === 'hypertension2' && t('bloodPressure.hypertension2Desc')}
                {diagnosisLevel === 'crisis' && t('bloodPressure.crisisDesc')}
              </p>
              
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t('bloodPressure.recommendations')}</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                {getRecommendations().map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src="https://images.unsplash.com/photo-1670192117184-d07467e203b3?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt={t('bloodPressure.imageAlt')}
          className="rounded-xl shadow-lg w-full h-auto object-cover"
        />
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/Ab9OZsDECZw?si=nDk4PLxqPjTE0vSL"
            title={t('bloodPressure.videoTitle')}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            className="rounded-xl shadow-lg w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default BloodPressure;