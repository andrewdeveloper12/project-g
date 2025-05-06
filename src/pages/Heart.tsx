import React, { useState } from 'react';
import { Heart, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useResults } from '../components/Context/ResultsContext';

const HeartHealthForm: React.FC = () => {
  const { t } = useTranslation();
  const { addHeartResult } = useResults();
  
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    chestPainType: '',
    bloodPressure: '',
    cholesterol: '',
    bloodSugar: '',
    ecgResults: '',
    maxHeartRate: '',
    exerciseAngina: '',
    oldpeak: '',
    stSlope: ''
  });
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderSelect = (selected: string) => {
    setFormData(prev => ({ ...prev, gender: selected }));
  };

  const assessHeartHealth = () => {
    const age = parseInt(formData.age) || 0;
    const bp = parseInt(formData.bloodPressure) || 0;
    const cholesterol = parseInt(formData.cholesterol) || 0;
    const maxHeartRate = parseInt(formData.maxHeartRate) || 0;
    const oldpeak = parseFloat(formData.oldpeak) || 0;
    
    let calculatedRiskScore = 0;
    
    // Age factor
    if (age > 55) calculatedRiskScore += 2;
    else if (age > 45) calculatedRiskScore += 1;
    
    // Blood pressure
    if (bp >= 140) calculatedRiskScore += 2;
    else if (bp >= 130) calculatedRiskScore += 1;
    
    // Cholesterol
    if (cholesterol >= 240) calculatedRiskScore += 2;
    else if (cholesterol >= 200) calculatedRiskScore += 1;
    
    // Blood sugar
    if (formData.bloodSugar === 'yes') calculatedRiskScore += 1;
    
    // ECG results
    if (formData.ecgResults === 'abnormal') calculatedRiskScore += 2;
    else if (formData.ecgResults === 'st-t-abnormality') calculatedRiskScore += 1;
    
    // Max heart rate
    const expectedMax = 220 - age;
    if (maxHeartRate < 0.85 * expectedMax) calculatedRiskScore += 1;
    
    // Exercise angina
    if (formData.exerciseAngina === 'yes') calculatedRiskScore += 2;
    
    // ST depression
    if (oldpeak > 2) calculatedRiskScore += 2;
    else if (oldpeak > 1) calculatedRiskScore += 1;
    
    // ST slope
    if (formData.stSlope === 'downsloping') calculatedRiskScore += 2;
    else if (formData.stSlope === 'flat') calculatedRiskScore += 1;
    
    // Chest pain type
    if (formData.chestPainType === 'atypical-angina') calculatedRiskScore += 1;
    else if (formData.chestPainType === 'non-anginal') calculatedRiskScore += 2;
    else if (formData.chestPainType === 'asymptomatic') calculatedRiskScore += 3;

    // Determine risk level
    let determinedRiskLevel = '';
    if (calculatedRiskScore >= 10) {
      determinedRiskLevel = t('heart.highRisk');
    } else if (calculatedRiskScore >= 6) {
      determinedRiskLevel = t('heart.moderateRisk');
    } else if (calculatedRiskScore >= 3) {
      determinedRiskLevel = t('heart.lowRisk');
    } else {
      determinedRiskLevel = t('heart.veryLowRisk');
    }

    return {
      riskScore: calculatedRiskScore,
      riskLevel: determinedRiskLevel
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.age || !formData.gender || !formData.bloodPressure || !formData.cholesterol) {
      alert(t('heart.requiredFields'));
      return;
    }

    const { riskScore: calculatedRiskScore, riskLevel: determinedRiskLevel } = assessHeartHealth();
    
    setRiskScore(calculatedRiskScore);
    setDiagnosis(t('heart.riskAssessment', { 
      riskLevel: determinedRiskLevel, 
      riskScore: calculatedRiskScore 
    }));
    setRiskLevel(determinedRiskLevel);
    setShowDiagnosis(true);
    
    addHeartResult({
      riskScore: calculatedRiskScore,
      riskLevel: determinedRiskLevel,
      age: parseInt(formData.age) || 0,
      gender: formData.gender,
      factors: {
        bloodPressure: parseInt(formData.bloodPressure) || undefined,
        cholesterol: parseInt(formData.cholesterol) || undefined,
        bloodSugar: formData.bloodSugar || undefined,
        maxHeartRate: parseInt(formData.maxHeartRate) || undefined
      }
    });
  };

  const getRecommendations = () => {
    if (!riskLevel) return [t('heart.generalRec')];
    
    const recommendations = [t('heart.healthyDiet'), t('heart.regularExercise')];
    
    if (riskLevel.includes(t('heart.highRisk'))) {
      recommendations.push(t('heart.consultCardiologist'));
      recommendations.push(t('heart.medicationConsideration'));
      recommendations.push(t('heart.stressTestRecommended'));
    } else if (riskLevel.includes(t('heart.moderateRisk'))) {
      recommendations.push(t('heart.monitorRegularly'));
      recommendations.push(t('heart.reduceSodium'));
      recommendations.push(t('heart.cholesterolCheck'));
    }
    
    recommendations.push(t('heart.noSmoking'));
    recommendations.push(t('heart.stressManagement'));
    return recommendations;
  };

  return (
    <div className="heart-container px-4 py-7">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="heart-header mb-12 text-center"
      >
        <Heart className="w-16 h-16 text-red-500 mx-auto mb-2" />
        <h1 className="text-4xl font-bold text-gray-800">
          {t('heart.title')}
        </h1>
        <p className="text-gray-600 text-md mt-2">
          {t('heart.description')}
        </p>
      </motion.div>

      <div className="form-card bg-white p-6 rounded-xl shadow-md max-w-6xl mx-auto mb-12">
        <form onSubmit={handleSubmit}>
          {/* Age */}
          <div className="form-group mb-6">
            <label htmlFor="age" className="block text-gray-700 mb-1">
              {t('heart.age')} *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              min="18"
              max="120"
              required
              placeholder={t('heart.agePlaceholder')}
              value={formData.age}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* Gender */}
          <div className="form-group mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {t('heart.gender')} *
            </label>
            <div className="flex space-x-4">
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.gender === 'male' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => handleGenderSelect('male')}
              >
                {t('heart.male')}
              </div>
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.gender === 'female' ? 'bg-pink-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => handleGenderSelect('female')}
              >
                {t('heart.female')}
              </div>
            </div>
          </div>

          {/* Chest Pain Type */}
          <div className="form-group mb-6">
            <label htmlFor="chestPainType" className="block text-gray-700 mb-1">
              {t('heart.chestPainType')} *
            </label>
            <select
              id="chestPainType"
              name="chestPainType"
              required
              value={formData.chestPainType}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="">{t('heart.selectChestPainType')}</option>
              <option value="typical-angina">{t('heart.typicalAngina')}</option>
              <option value="atypical-angina">{t('heart.atypicalAngina')}</option>
              <option value="non-anginal">{t('heart.nonAnginal')}</option>
              <option value="asymptomatic">{t('heart.asymptomatic')}</option>
            </select>
          </div>

          {/* Blood Pressure */}
          <div className="form-group mb-6">
            <label htmlFor="bloodPressure" className="block text-gray-700 mb-1">
              {t('heart.bloodPressure')} (mm Hg) *
              <span className="text-sm text-gray-500 ml-2">{t('heart.normalRange')}: 90-120</span>
            </label>
            <input
              type="number"
              id="bloodPressure"
              name="bloodPressure"
              min="50"
              max="250"
              required
              placeholder={t('heart.bloodPressurePlaceholder')}
              value={formData.bloodPressure}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* Cholesterol */}
          <div className="form-group mb-6">
            <label htmlFor="cholesterol" className="block text-gray-700 mb-1">
              {t('heart.cholesterol')} (mg/dL) *
              <span className="text-sm text-gray-500 ml-2">{t('heart.desirable')}: &lt;200</span>
            </label>
            <input
              type="number"
              id="cholesterol"
              name="cholesterol"
              min="100"
              max="400"
              required
              placeholder={t('heart.cholesterolPlaceholder')}
              value={formData.cholesterol}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* Blood Sugar */}
          <div className="form-group mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {t('heart.bloodSugarQuestion')} *
            </label>
            <div className="flex space-x-4">
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.bloodSugar === 'yes' ? 'bg-green-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, bloodSugar: 'yes' }))}
              >
                {t('heart.yes')}
              </div>
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.bloodSugar === 'no' ? 'bg-red-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, bloodSugar: 'no' }))}
              >
                {t('heart.no')}
              </div>
            </div>
          </div>

          {/* ECG Results */}
          <div className="form-group mb-6">
            <label htmlFor="ecgResults" className="block text-gray-700 mb-1">
              {t('heart.ecgResults')} *
            </label>
            <select
              id="ecgResults"
              name="ecgResults"
              required
              value={formData.ecgResults}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="">{t('heart.selectEcgResult')}</option>
              <option value="normal">{t('heart.normal')}</option>
              <option value="st-t-abnormality">{t('heart.sttAbnormality')}</option>
              <option value="abnormal">{t('heart.abnormal')}</option>
            </select>
          </div>

          {/* Max Heart Rate */}
          <div className="form-group mb-6">
            <label htmlFor="maxHeartRate" className="block text-gray-700 mb-1">
              {t('heart.maxHeartRate')} (bpm)
              <span className="text-sm text-gray-500 ml-2">{t('heart.averageMax')}: 220 - {formData.age || 'age'}</span>
            </label>
            <input
              type="number"
              id="maxHeartRate"
              name="maxHeartRate"
              min="60"
              max="220"
              placeholder={t('heart.maxHeartRatePlaceholder')}
              value={formData.maxHeartRate}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* Exercise Angina */}
          <div className="form-group mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {t('heart.exerciseAngina')} *
            </label>
            <div className="flex space-x-4">
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.exerciseAngina === 'yes' ? 'bg-green-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, exerciseAngina: 'yes' }))}
              >
                {t('heart.yes')}
              </div>
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.exerciseAngina === 'no' ? 'bg-red-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, exerciseAngina: 'no' }))}
              >
                {t('heart.no')}
              </div>
            </div>
          </div>

          {/* Oldpeak (ST Depression) */}
          <div className="form-group mb-6">
            <label htmlFor="oldpeak" className="block text-gray-700 mb-1">
              {t('heart.oldpeak')} (ST Depression)
            </label>
            <input
              type="number"
              id="oldpeak"
              name="oldpeak"
              step="0.1"
              min="0"
              max="10"
              placeholder={t('heart.oldpeakPlaceholder')}
              value={formData.oldpeak}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* ST Slope */}
          <div className="form-group mb-6">
            <label htmlFor="stSlope" className="block text-gray-700 mb-1">
              {t('heart.stSlope')} *
            </label>
            <select
              id="stSlope"
              name="stSlope"
              required
              value={formData.stSlope}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="">{t('heart.selectStSlope')}</option>
              <option value="upsloping">{t('heart.upsloping')}</option>
              <option value="flat">{t('heart.flat')}</option>
              <option value="downsloping">{t('heart.downsloping')}</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="form-group mt-8">
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              <HeartPulse className="inline-block mr-2" />
              {t('heart.assessButton')}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {showDiagnosis && diagnosis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="results-card bg-white p-6 rounded-xl shadow-md max-w-6xl mx-auto mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t('heart.resultsTitle')}
          </h2>
          
          {/* Risk Score Display */}
          <div className="risk-score-display mb-4">
            <p className="text-gray-700">
              {t('heart.riskScore')}: <strong>{riskScore}</strong>
            </p>
          </div>
          
          {/* Risk Level */}
          <div className={`p-4 rounded-lg mb-6 ${
            riskLevel?.includes(t('heart.highRisk')) ? 'bg-red-100 border-l-4 border-red-500' :
            riskLevel?.includes(t('heart.moderateRisk')) ? 'bg-yellow-100 border-l-4 border-yellow-500' :
            riskLevel?.includes(t('heart.lowRisk')) ? 'bg-green-100 border-l-4 border-green-500' :
            'bg-blue-100 border-l-4 border-blue-500'
          }`}>
            <h3 className="text-lg font-semibold mb-2">{t('heart.riskAssessmentTitle')}</h3>
            <p className="text-gray-800">{diagnosis}</p>
          </div>

          {/* Recommendations */}
          <div className="recommendations">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {t('heart.recommendationsTitle')}
            </h3>
            <ul className="space-y-3">
              {getRecommendations().map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Next Steps */}
          <div className="next-steps mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {t('heart.nextStepsTitle')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskLevel?.includes(t('heart.highRisk')) && (
                <>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-2">
                      {t('heart.urgentCare')}
                    </h4>
                    <p className="text-gray-700">
                      {t('heart.urgentCareText')}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-2">
                      {t('heart.emergencySigns')}
                    </h4>
                    <p className="text-gray-700">
                      {t('heart.emergencySignsText')}
                    </p>
                  </div>
                </>
              )}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">
                  {t('heart.followUp')}
                </h4>
                <p className="text-gray-700">
                  {t('heart.followUpText')}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">
                  {t('heart.lifestyleChanges')}
                </h4>
                <p className="text-gray-700">
                  {t('heart.lifestyleChangesText')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HeartHealthForm;