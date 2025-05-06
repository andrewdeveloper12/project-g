import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, HeartPulse } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useResults } from '../components/Context/ResultsContext';

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

  const handleGenderSelect = (selected: string): void => {
    setGender(selected);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const determineCondition = (): {
    hasCondition: boolean;
    severity: string;
    type: string;
  } => {
    const fbs = parseFloat(formData.fbs) || 0;
    const hba1c = parseFloat(formData.hba1c) || 0;
    
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

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (!gender || !formData.age || !formData.fbs || !formData.hba1c) {
      alert(t('diabetes.requiredFields'));
      return;
    }

    const { hasCondition, severity, type } = determineCondition();
    
    if (hasCondition) {
      setDiagnosis(t('diabetes.diagnosis.positive', { 
        severity: t(`diabetes.severity.${severity}`), 
        type: t(`diabetes.type.${type}`) 
      }));
      setDiabetesType(type);
    } else if (type === 'prediabetes') {
      setDiagnosis(t('diabetes.diagnosis.prediabetes'));
      setDiabetesType(type);
    } else {
      setDiagnosis(t('diabetes.diagnosis.negative'));
      setDiabetesType(null);
    }
    
    setNutrition(recommendedNutrition);
    setValidation({
      [t('diabetes.validation.lowSugar')]: true,
      [t('diabetes.validation.highFiber')]: true,
      [t('diabetes.validation.balancedCarbs')]: true,
      [t('diabetes.validation.controlledSodium')]: true
    });
    setShowDiagnosis(true);
    
    // Save to the results context
    addDiabetesResult({
      fbs: parseFloat(formData.fbs) || 0,
      hba1c: parseFloat(formData.hba1c) || 0,
      diagnosis: hasCondition 
        ? t('diabetes.diagnosis.positive', { 
            severity: t(`diabetes.severity.${severity}`), 
            type: t(`diabetes.type.${type}`) 
          })
        : type === 'prediabetes'
          ? t('diabetes.diagnosis.prediabetes')
          : t('diabetes.diagnosis.negative'),
      type: type,
      age: parseInt(formData.age) || 0,
      gender: gender
    });
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
            <label className="block text-gray-700 font-semibold mb-2">
              {t('diabetes.gender')} *
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`cursor-pointer px-4 py-2 border rounded-md text-black ${
                  gender === 'male' ? 'bg-blue-500 text-black ' : 'bg-gray-100'
                }`}
                onClick={() => handleGenderSelect('male')}
              >
                {t('diabetes.male')}
              </button>
              <button
                type="button"
                className={`cursor-pointer px-4 py-2 border rounded-md text-black ${
                  gender === 'female' ? 'bg-pink-500 text-black' : 'bg-gray-100'
                }`}
                onClick={() => handleGenderSelect('female')}
              >
                {t('diabetes.female')}
              </button>
            </div>
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
              className="w-full border p-2 rounded-md"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="bmi" className="block text-gray-700 mb-1">
              {t('diabetes.bmi')}
            </label>
            <input
              type="number"
              id="bmi"
              name="bmi"
              step="0.1"
              min="0"
              max="50"
              placeholder={t('diabetes.bmiPlaceholder')}
              value={formData.bmi}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">{t('diabetes.bmiReference')}</p>
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
              className="w-full border p-2 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">{t('diabetes.fbsReference')}</p>
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
              className="w-full border p-2 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">{t('diabetes.hba1cReference')}</p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {t('diabetes.highBP')}
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`cursor-pointer px-4 py-2 border rounded-md text-black ${
                  formData.highBP === 'yes' ? 'bg-green-500 text-black' : 'bg-gray-100'
                }`}
                onClick={() => setFormData({...formData, highBP: 'yes'})}
              >
                {t('diabetes.yes')}
              </button>
              <button
                type="button"
                className={`cursor-pointer px-4 py-2 border rounded-md text-black ${
                  formData.highBP === 'no' ? 'bg-red-500 text-black' : 'bg-gray-100'
                }`}
                onClick={() => setFormData({...formData, highBP: 'no'})}
              >
                {t('diabetes.no')}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {t('diabetes.smoking')}
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`cursor-pointer px-4 py-2 border rounded-md text-black ${
                  formData.smoking === 'yes' ? 'bg-green-500 text-black' : 'bg-gray-100'
                }`}
                onClick={() => setFormData({...formData, smoking: 'yes'})}
              >
                {t('diabetes.yes')}
              </button>
              <button
                type="button"
                className={`cursor-pointer px-4 py-2 border rounded-md text-black ${
                  formData.smoking === 'no' ? 'bg-red-500 text-black' : 'bg-gray-100'
                }`}
                onClick={() => setFormData({...formData, smoking: 'no'})}
              >
                {t('diabetes.no')}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {t('diabetes.familyHistory')}
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`cursor-pointer px-4 py-2 border rounded-md text-black ${
                  formData.familyHistory === 'yes' ? 'bg-green-500 text-black' : 'bg-gray-100'
                }`}
                onClick={() => setFormData({...formData, familyHistory: 'yes'})}
              >
                {t('diabetes.yes')}
              </button>
              <button
                type="button"
                className={`cursor-pointer px-4 py-2 border rounded-md text-black ${
                  formData.familyHistory === 'no' ? 'bg-red-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setFormData({...formData, familyHistory: 'no'})}
              >
                {t('diabetes.no')}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center gap-2"
          >
            <HeartPulse className="w-5 h-5" />
            {t('diabetes.submit')}
          </button>
        </form>
      </div>

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