import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, HeartPulse, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useResults } from '../components/Context/ResultsContext';
import { useAuth } from '../components/Context/AuthContext';
import { toast } from 'react-toastify';

interface DiabetesRecord {
  _id?: string;
  patientId: string;
  measurements: {
    age: number;
    gender: string;
    bmi: number;
    highBloodPressure: boolean;
    fastingBloodSugar: number;
    hba1c: number;
    smoking: boolean;
    familyHistory: boolean;
  };
  diagnosis: string;
  type?: string;
  createdAt?: string;
}

interface NutritionalValues {
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  fiber: string;
  sugar: string;
  sodium: string;
}

interface ValidationResults {
  [key: string]: boolean;
}

interface FormData {
  age: string;
  bmi: string;
  highBP: string;
  fbs: string;
  hba1c: string;
  smoking: string;
  familyHistory: string;
}

const DiabetesAssessment: React.FC = () => {
  const { t } = useTranslation();
  const { addDiabetesResult } = useResults();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<DiabetesRecord[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  
  const [gender, setGender] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    age: '',
    bmi: '',
    highBP: '',
    fbs: '',
    hba1c: '',
    smoking: '',
    familyHistory: ''
  });
  const [formErrors, setFormErrors] = useState({
    gender: false,
    age: false,
    bmi: false,
    highBP: false,
    fbs: false,
    hba1c: false,
    smoking: false,
    familyHistory: false
  });

  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [showDiagnosis, setShowDiagnosis] = useState<boolean>(false);
  const [diabetesType, setDiabetesType] = useState<string | null>(null);
  const [nutrition, setNutrition] = useState<NutritionalValues | null>(null);
  const [validation, setValidation] = useState<ValidationResults | null>(null);

  const recommendedNutrition: NutritionalValues = {
    calories: t('diabetes.nutritionValues.calories'),
    protein: t('diabetes.nutritionValues.protein'),
    carbs: t('diabetes.nutritionValues.carbs'),
    fats: t('diabetes.nutritionValues.fats'),
    fiber: t('diabetes.nutritionValues.fiber'),
    sugar: t('diabetes.nutritionValues.sugar'),
    sodium: t('diabetes.nutritionValues.sodium')
  };

  // Fetch user history on component mount
  useEffect(() => {
    if (user?.id) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/diabetes/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      toast.error(t('diabetes.fetchError'));
      console.error('Error fetching diabetes history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenderSelect = (selected: string): void => {
    setGender(selected);
    setFormErrors(prev => ({ ...prev, gender: false }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleOptionSelect = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: false }));
  };

  const validateForm = (): boolean => {
    const errors = {
      gender: !gender,
      age: !formData.age,
      bmi: !formData.bmi,
      highBP: !formData.highBP,
      fbs: !formData.fbs,
      hba1c: !formData.hba1c,
      smoking: !formData.smoking,
      familyHistory: !formData.familyHistory
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const determineCondition = (): {
    hasCondition: boolean;
    severity: string;
    type: string;
  } => {
    const fbs = parseFloat(formData.fbs);
    const hba1c = parseFloat(formData.hba1c);
    
    let hasCondition = false;
    let severity = '';
    let type = '';
    
    if (fbs >= 126 || hba1c >= 6.5) {
      hasCondition = true;
      type = 'type2';
      
      if (fbs >= 200 || hba1c >= 8.5) {
        severity = 'severe';
      } else if (fbs >= 150 || hba1c >= 7.5) {
        severity = 'moderate';
      } else {
        severity = 'mild';
      }
    } 
    else if ((fbs >= 100 && fbs < 126) || (hba1c >= 5.7 && hba1c < 6.5)) {
      hasCondition = false;
      type = 'prediabetes';
      severity = 'atRisk';
    }
    
    return { hasCondition, severity, type };
  };

  const saveRecord = async (recordData: Omit<DiabetesRecord, '_id' | 'createdAt'>) => {
    try {
      setLoading(true);
      const endpoint = isEditing && currentRecordId 
        ? `/api/diabetes/${currentRecordId}`
        : '/api/diabetes';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(recordData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save record');
      }
      
      const data = await response.json();
      toast.success(t(isEditing ? 'diabetes.updateSuccess' : 'diabetes.saveSuccess'));
      
      // Refresh history
      await fetchHistory();
      return data;
    } catch (error) {
      toast.error(t('diabetes.saveError'));
      console.error('Error saving diabetes record:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!validateForm()) {
      toast.error(t('diabetes.allFieldsRequired'));
      return;
    }

    const { hasCondition, severity, type } = determineCondition();
    
    let diagnosisText = '';
    if (hasCondition) {
      diagnosisText = t('diabetes.diagnosis.positive', { 
        severity: t(`diabetes.severity.${severity}`), 
        type: t(`diabetes.type.${type}`) 
      });
      setDiabetesType(type);
    } else if (type === 'prediabetes') {
      diagnosisText = t('diabetes.diagnosis.prediabetes');
      setDiabetesType(type);
    } else {
      diagnosisText = t('diabetes.diagnosis.negative');
      setDiabetesType(null);
    }
    
    setDiagnosis(diagnosisText);
    setNutrition(recommendedNutrition);
    setValidation({
      [t('diabetes.validation.lowSugar')]: true,
      [t('diabetes.validation.highFiber')]: true,
      [t('diabetes.validation.balancedCarbs')]: true,
      [t('diabetes.validation.controlledSodium')]: true
    });
    setShowDiagnosis(true);
    
    // Prepare record data for API
    const recordData: Omit<DiabetesRecord, '_id' | 'createdAt'> = {
      patientId: user?.id || '',
      measurements: {
        age: parseInt(formData.age),
        gender: gender,
        bmi: parseFloat(formData.bmi),
        highBloodPressure: formData.highBP === 'yes',
        fastingBloodSugar: parseFloat(formData.fbs),
        hba1c: parseFloat(formData.hba1c),
        smoking: formData.smoking === 'yes',
        familyHistory: formData.familyHistory === 'yes'
      },
      diagnosis: diagnosisText,
      type: type
    };

    try {
      // Save to API
      await saveRecord(recordData);
      
      // Save to local context
      addDiabetesResult({
        fbs: parseFloat(formData.fbs),
        hba1c: parseFloat(formData.hba1c),
        diagnosis: diagnosisText,
        type: type,
        age: parseInt(formData.age),
        gender: gender
      });
    } catch (error) {
      console.error('Error handling diabetes submission:', error);
    }
  };

  const loadRecordForEditing = (record: DiabetesRecord) => {
    setGender(record.measurements.gender);
    setFormData({
      age: record.measurements.age.toString(),
      bmi: record.measurements.bmi.toString(),
      highBP: record.measurements.highBloodPressure ? 'yes' : 'no',
      fbs: record.measurements.fastingBloodSugar.toString(),
      hba1c: record.measurements.hba1c.toString(),
      smoking: record.measurements.smoking ? 'yes' : 'no',
      familyHistory: record.measurements.familyHistory ? 'yes' : 'no'
    });
    setDiagnosis(record.diagnosis);
    setDiabetesType(record.type || null);
    setShowDiagnosis(true);
    setIsEditing(true);
    setCurrentRecordId(record._id || null);
  };

  const resetForm = () => {
    setGender('');
    setFormData({
      age: '',
      bmi: '',
      highBP: '',
      fbs: '',
      hba1c: '',
      smoking: '',
      familyHistory: ''
    });
    setFormErrors({
      gender: false,
      age: false,
      bmi: false,
      highBP: false,
      fbs: false,
      hba1c: false,
      smoking: false,
      familyHistory: false
    });
    setDiagnosis(null);
    setShowDiagnosis(false);
    setDiabetesType(null);
    setIsEditing(false);
    setCurrentRecordId(null);
  };

  const getRecommendations = (): string[] => {
    const recommendations: string[] = [];
    
    if (diabetesType === 'type2') {
      recommendations.push(t('diabetes.recommendations.type2.0'));
      recommendations.push(t('diabetes.recommendations.type2.1'));
      recommendations.push(t('diabetes.recommendations.type2.2'));
    } else if (diabetesType === 'prediabetes') {
      recommendations.push(t('diabetes.recommendations.prediabetes.0'));
      recommendations.push(t('diabetes.recommendations.prediabetes.1'));
    } else {
      recommendations.push(t('diabetes.recommendations.general.0'));
      recommendations.push(t('diabetes.recommendations.general.1'));
    }
    
    recommendations.push(t('diabetes.recommendations.general.2'));
    recommendations.push(t('diabetes.recommendations.general.3'));
    recommendations.push(t('diabetes.recommendations.general.4'));
    
    return recommendations;
  };

  return (
    <div className="diabetes-container px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="header mb-12 text-center"
      >
        <Droplets className="w-16 h-16 text-blue-500 mx-auto mb-2" />
        <h1 className="text-4xl font-bold text-gray-800">
          {t('diabetes.formTitle')}
        </h1>
        <p className="text-gray-600 text-md mt-2">
          {t('diabetes.formDescription')}
        </p>
      </motion.div>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-6xl mx-auto mb-12">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-black font-semibold mb-2">
              {t('diabetes.gender')} *
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`cursor-pointer text-black px-4 py-2 border rounded-md ${
                  gender === 'male' ? 'bg-blue-500 text-gray-700' : formErrors.gender ? 'bg-red-100 border-red-500' : 'bg-black-100'
                }`}
                onClick={() => handleGenderSelect('male')}
              >
                {t('diabetes.male')}
              </button>
              <button
                type="button"
                className={`cursor-pointer text-black px-4 py-2 border rounded-md ${
                  gender === 'female' ? 'bg-pink-500 text-white' : formErrors.gender ? 'bg-red-100 border-red-500' : 'bg-gray-100'
                }`}
                onClick={() => handleGenderSelect('female')}
              >
                {t('diabetes.female')}
              </button>
            </div>
            {formErrors.gender && (
              <p className="text-red-500 text-sm mt-1">{t('diabetes.genderRequired')}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="age" className="block text-gray-700 mb-1">
              {t('diabetes.age')} *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              min="0"
              max="120"
              required
              placeholder={t('diabetes.agePlaceholder')}
              value={formData.age}
              onChange={handleChange}
              className={`w-full border p-2 rounded-md ${
                formErrors.age ? 'border-red-500 bg-red-50' : ''
              }`}
            />
            {formErrors.age && (
              <p className="text-red-500 text-sm mt-1">{t('diabetes.ageRequired')}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="bmi" className="block text-gray-700 mb-1">
              {t('diabetes.bmi')} *
            </label>
            <input
              type="number"
              id="bmi"
              name="bmi"
              step="0.1"
              min="0"
              max="50"
              required
              placeholder={t('diabetes.bmiPlaceholder')}
              value={formData.bmi}
              onChange={handleChange}
              className={`w-full border p-2 rounded-md ${
                formErrors.bmi ? 'border-red-500 bg-red-50' : ''
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">{t('diabetes.bmiReference')}</p>
            {formErrors.bmi && (
              <p className="text-red-500 text-sm mt-1">{t('diabetes.bmiRequired')}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="fbs" className="block text-gray-700 mb-1">
              {t('diabetes.fbs')} *
            </label>
            <input
              type="number"
              id="fbs"
              name="fbs"
              step="0.1"
              min="0"
              max="300"
              required
              placeholder={t('diabetes.fbsPlaceholder')}
              value={formData.fbs}
              onChange={handleChange}
              className={`w-full border p-2 rounded-md ${
                formErrors.fbs ? 'border-red-500 bg-red-50' : ''
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">{t('diabetes.fbsReference')}</p>
            {formErrors.fbs && (
              <p className="text-red-500 text-sm mt-1">{t('diabetes.fbsRequired')}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="hba1c" className="block text-gray-700 mb-1">
              {t('diabetes.hba1c')} *
            </label>
            <input
              type="number"
              id="hba1c"
              name="hba1c"
              step="0.1"
              min="0"
              max="15"
              required
              placeholder={t('diabetes.hba1cPlaceholder')}
              value={formData.hba1c}
              onChange={handleChange}
              className={`w-full border p-2 rounded-md ${
                formErrors.hba1c ? 'border-red-500 bg-red-50' : ''
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">{t('diabetes.hba1cReference')}</p>
            {formErrors.hba1c && (
              <p className="text-red-500 text-sm mt-1">{t('diabetes.hba1cRequired')}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {t('diabetes.highBP')} *
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`cursor-pointer text-black px-4 py-2 border rounded-md ${
                  formData.highBP === 'yes' ? 'bg-green-500 text-black' : formErrors.highBP ? 'bg-red-100 border-red-500' : 'bg-gray-100'
                }`}
                onClick={() => handleOptionSelect('highBP', 'yes')}
              >
                {t('diabetes.yes')}
              </button>
              <button
                type="button"
                className={`cursor-pointer text-black px-4 py-2 border rounded-md ${
                  formData.highBP === 'no' ? 'bg-red-500 text-white' : formErrors.highBP ? 'bg-red-100 border-red-500' : 'bg-gray-100'
                }`}
                onClick={() => handleOptionSelect('highBP', 'no')}
              >
                {t('diabetes.no')}
              </button>
            </div>
            {formErrors.highBP && (
              <p className="text-red-500 text-sm mt-1">{t('diabetes.highBPRequired')}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {t('diabetes.smoking')} *
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`cursor-pointer text-black px-4 py-2 border rounded-md ${
                  formData.smoking === 'yes' ? 'bg-green-500 text-white' : formErrors.smoking ? 'bg-red-100 border-red-500' : 'bg-gray-100'
                }`}
                onClick={() => handleOptionSelect('smoking', 'yes')}
              >
                {t('diabetes.yes')}
              </button>
              <button
                type="button"
                className={`cursor-pointer text-black px-4 py-2 border rounded-md ${
                  formData.smoking === 'no' ? 'bg-red-500 text-white' : formErrors.smoking ? 'bg-red-100 border-red-500' : 'bg-gray-100'
                }`}
                onClick={() => handleOptionSelect('smoking', 'no')}
              >
                {t('diabetes.no')}
              </button>
            </div>
            {formErrors.smoking && (
              <p className="text-red-500 text-sm mt-1">{t('diabetes.smokingRequired')}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {t('diabetes.familyHistory')} *
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`cursor-pointer text-black px-4 py-2 border rounded-md ${
                  formData.familyHistory === 'yes' ? 'bg-green-500 text-white' : formErrors.familyHistory ? 'bg-red-100 border-red-500' : 'bg-gray-100'
                }`}
                onClick={() => handleOptionSelect('familyHistory', 'yes')}
              >
                {t('diabetes.yes')}
              </button>
              <button
                type="button"
                className={`cursor-pointer text-black px-4 py-2 border rounded-md ${
                  formData.familyHistory === 'no' ? 'bg-red-500 text-white' : formErrors.familyHistory ? 'bg-red-100 border-red-500' : 'bg-gray-100'
                }`}
                onClick={() => handleOptionSelect('familyHistory', 'no')}
              >
                {t('diabetes.no')}
              </button>
            </div>
            {formErrors.familyHistory && (
              <p className="text-red-500 text-sm mt-1">{t('diabetes.familyHistoryRequired')}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t(isEditing ? 'diabetes.updating' : 'diabetes.submitting')}
                </>
              ) : (
                <>
                  <HeartPulse className="w-5 h-5" />
                  {t(isEditing ? 'diabetes.update' : 'diabetes.submit')}
                </>
              )}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
              >
                {t('diabetes.cancel')}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="history-card bg-white p-6 rounded-xl shadow-md max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('diabetes.historyTitle')}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('diabetes.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('diabetes.gender')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('diabetes.age')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('diabetes.diagnosis')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('diabetes.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((record) => (
                  <tr key={record._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.createdAt || '').toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.measurements.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.measurements.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.diagnosis}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => loadRecordForEditing(record)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        {t('diabetes.edit')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showDiagnosis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="diagnosis-card bg-white p-6 rounded-xl shadow-md max-w-6xl mx-auto mb-12"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className={`flex-shrink-0 p-4 rounded-lg ${
              diabetesType ? (diabetesType === 'type2' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800') : 'bg-green-100 text-green-800'
            } w-full md:w-1/3 flex flex-col items-center justify-center`}>
              <HeartPulse className="w-12 h-12 mb-3" />
              <h3 className="text-xl font-bold text-center">{t('diabetes.results.title')}</h3>
              <p className="text-lg font-semibold text-center mt-2">{diagnosis}</p>
            </div>
            
            <div className="flex-grow">
              {diabetesType ? (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {t('diabetes.results.about', { type: t(`diabetes.type.${diabetesType}`) })}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t(`diabetes.description.${diabetesType}`)}
                  </p>
                </>
              ) : (
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {t('diabetes.results.healthy')}
                </h3>
              )}
              
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t('diabetes.results.recommendations')}</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                {getRecommendations().map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {nutrition && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t('diabetes.nutrition.title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(nutrition).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">{t(`diabetes.nutrition.${key}`)}</h4>
                    <p className="text-gray-600">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {validation && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t('diabetes.validation.title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(validation).map(([key, isValid]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-1">{key}</h4>
                    <span className={isValid ? 'text-green-600' : 'text-red-600'}>
                      {isValid ? t('diabetes.validation.valid') : t('diabetes.validation.invalid')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <img
          src="https://img.freepik.com/free-vector/hand-drawn-set-diabetes-symptoms_23-2147870970.jpg?semt=ais_hybrid&w=740"
          alt={t('diabetes.media.imageAlt')}
          className="rounded-xl shadow-lg w-full h-auto object-cover"
        />
        <iframe
          width="100%"
          height="377"
          src="https://www.youtube.com/embed/wZAjVQWbMlE?si=5-SFoPU7DrGlRp-q"
          title={t('diabetes.media.videoTitle')}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          className="rounded-xl shadow-lg w-full h-full"
        />
      </div>
    </div>
  );
};

export default DiabetesAssessment;