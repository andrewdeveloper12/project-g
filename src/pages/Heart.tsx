import React, { useState } from 'react';
import { Heart, HeartPulse } from 'lucide-react';
import { useResults } from '../components/Context/ResultsContext';

const HeartHealthForm: React.FC = () => {
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
      determinedRiskLevel = 'High Risk';
    } else if (calculatedRiskScore >= 6) {
      determinedRiskLevel = 'Moderate Risk';
    } else if (calculatedRiskScore >= 3) {
      determinedRiskLevel = 'Low Risk';
    } else {
      determinedRiskLevel = 'Very Low Risk';
    }

    return {
      riskScore: calculatedRiskScore,
      riskLevel: determinedRiskLevel
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.age || !formData.gender || !formData.bloodPressure || !formData.cholesterol) {
      alert('Please fill in all required fields marked with *');
      return;
    }

    const { riskScore: calculatedRiskScore, riskLevel: determinedRiskLevel } = assessHeartHealth();
    
    setRiskScore(calculatedRiskScore);
    setDiagnosis(`Based on your inputs, your heart health risk level is: ${determinedRiskLevel} (Score: ${calculatedRiskScore}/15)`);
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
    if (!riskLevel) return ['Maintain a balanced lifestyle with regular check-ups'];
    
    const recommendations = ['Maintain a balanced diet rich in fruits, vegetables, and whole grains', 'Engage in regular physical activity (at least 150 minutes per week)'];
    
    if (riskLevel.includes('High Risk')) {
      recommendations.push('Consult with a cardiologist promptly');
      recommendations.push('Consider medication as recommended by your healthcare provider');
      recommendations.push('Undergo a comprehensive heart health screening');
    } else if (riskLevel.includes('Moderate Risk')) {
      recommendations.push('Monitor your blood pressure regularly');
      recommendations.push('Reduce sodium intake in your diet');
      recommendations.push('Schedule a cholesterol check within 3 months');
    }
    
    recommendations.push('Avoid smoking and limit alcohol consumption');
    recommendations.push('Practice stress management techniques like meditation or yoga');
    return recommendations;
  };

  return (
    <div className="heart-container px-4 py-7">
      <div
        className="heart-header mb-12 text-center"
      >
        <Heart className="w-16 h-16 text-red-500 mx-auto mb-2" />
        <h1 className="text-4xl font-bold text-gray-800">
          Heart Health Assessment
        </h1>
        <p className="text-gray-600 text-md mt-2">
          Complete the form below to evaluate your heart health risk
        </p>
      </div>

      <div className="form-card bg-white p-6 rounded-xl shadow-md max-w-6xl mx-auto mb-12">
        <form onSubmit={handleSubmit}>
          {/* Age */}
          <div className="form-group mb-6">
            <label htmlFor="age" className="block text-gray-700 mb-1">
              Age *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              min="18"
              max="120"
              required
              placeholder="Enter your age (18-120)"
              value={formData.age}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* Gender */}
          <div className="form-group mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Gender *
            </label>
            <div className="flex space-x-4">
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.gender === 'male' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => handleGenderSelect('male')}
              >
                Male
              </div>
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.gender === 'female' ? 'bg-pink-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => handleGenderSelect('female')}
              >
                Female
              </div>
            </div>
          </div>

          {/* Chest Pain Type */}
          <div className="form-group mb-6">
            <label htmlFor="chestPainType" className="block text-gray-700 mb-1">
              Chest Pain Type *
            </label>
            <select
              id="chestPainType"
              name="chestPainType"
              required
              value={formData.chestPainType}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Select chest pain type</option>
              <option value="typical-angina">Typical Angina</option>
              <option value="atypical-angina">Atypical Angina</option>
              <option value="non-anginal">Non-Anginal Pain</option>
              <option value="asymptomatic">Asymptomatic</option>
            </select>
          </div>

          {/* Blood Pressure */}
          <div className="form-group mb-6">
            <label htmlFor="bloodPressure" className="block text-gray-700 mb-1">
              Blood Pressure (mm Hg) *
              <span className="text-sm text-gray-500 ml-2">Normal range: 90-120</span>
            </label>
            <input
              type="number"
              id="bloodPressure"
              name="bloodPressure"
              min="50"
              max="250"
              required
              placeholder="Enter your systolic blood pressure"
              value={formData.bloodPressure}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* Cholesterol */}
          <div className="form-group mb-6">
            <label htmlFor="cholesterol" className="block text-gray-700 mb-1">
              Cholesterol (mg/dL) *
              <span className="text-sm text-gray-500 ml-2">Desirable: &lt;200</span>
            </label>
            <input
              type="number"
              id="cholesterol"
              name="cholesterol"
              min="100"
              max="400"
              required
              placeholder="Enter your cholesterol level"
              value={formData.cholesterol}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* Blood Sugar */}
          <div className="form-group mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Fasting Blood Sugar &gt; 120 mg/dl? *
            </label>
            <div className="flex space-x-4">
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.bloodSugar === 'yes' ? 'bg-green-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, bloodSugar: 'yes' }))}
              >
                Yes
              </div>
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.bloodSugar === 'no' ? 'bg-red-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, bloodSugar: 'no' }))}
              >
                No
              </div>
            </div>
          </div>

          {/* ECG Results */}
          <div className="form-group mb-6">
            <label htmlFor="ecgResults" className="block text-gray-700 mb-1">
              ECG Results *
            </label>
            <select
              id="ecgResults"
              name="ecgResults"
              required
              value={formData.ecgResults}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Select ECG result</option>
              <option value="normal">Normal</option>
              <option value="st-t-abnormality">ST-T Wave Abnormality</option>
              <option value="abnormal">Left Ventricular Hypertrophy</option>
            </select>
          </div>

          {/* Max Heart Rate */}
          <div className="form-group mb-6">
            <label htmlFor="maxHeartRate" className="block text-gray-700 mb-1">
              Max Heart Rate (bpm)
              <span className="text-sm text-gray-500 ml-2">Average max: 220 - {formData.age || 'age'}</span>
            </label>
            <input
              type="number"
              id="maxHeartRate"
              name="maxHeartRate"
              min="60"
              max="220"
              placeholder="Enter your maximum heart rate"
              value={formData.maxHeartRate}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* Exercise Angina */}
          <div className="form-group mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Exercise-Induced Angina? *
            </label>
            <div className="flex space-x-4">
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.exerciseAngina === 'yes' ? 'bg-green-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, exerciseAngina: 'yes' }))}
              >
                Yes
              </div>
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.exerciseAngina === 'no' ? 'bg-red-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, exerciseAngina: 'no' }))}
              >
                No
              </div>
            </div>
          </div>

          {/* Oldpeak (ST Depression) */}
          <div className="form-group mb-6">
            <label htmlFor="oldpeak" className="block text-gray-700 mb-1">
              ST Depression (Oldpeak)
            </label>
            <input
              type="number"
              id="oldpeak"
              name="oldpeak"
              step="0.1"
              min="0"
              max="10"
              placeholder="Enter ST depression value"
              value={formData.oldpeak}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* ST Slope */}
          <div className="form-group mb-6">
            <label htmlFor="stSlope" className="block text-gray-700 mb-1">
              ST Slope *
            </label>
            <select
              id="stSlope"
              name="stSlope"
              required
              value={formData.stSlope}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Select ST slope</option>
              <option value="upsloping">Upsloping</option>
              <option value="flat">Flat</option>
              <option value="downsloping">Downsloping</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="form-group mt-8">
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              <HeartPulse className="inline-block mr-2" />
              Assess Heart Health
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {showDiagnosis && diagnosis && (
        <div
          className="results-card bg-white p-6 rounded-xl shadow-md max-w-6xl mx-auto mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Assessment Results
          </h2>
          
          {/* Risk Score Display */}
          <div className="risk-score-display mb-4">
            <p className="text-gray-700">
              Risk Score: <strong>{riskScore}</strong>
            </p>
          </div>
          
          {/* Risk Level */}
          <div className={`p-4 rounded-lg mb-6 ${
            riskLevel?.includes('High Risk') ? 'bg-red-100 border-l-4 border-red-500' :
            riskLevel?.includes('Moderate Risk') ? 'bg-yellow-100 border-l-4 border-yellow-500' :
            riskLevel?.includes('Low Risk') ? 'bg-green-100 border-l-4 border-green-500' :
            'bg-blue-100 border-l-4 border-blue-500'
          }`}>
            <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
            <p className="text-gray-800">{diagnosis}</p>
          </div>

          {/* Recommendations */}
          <div className="recommendations">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Recommendations
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
              Next Steps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskLevel?.includes('High Risk') && (
                <>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-2">
                      Urgent Care
                    </h4>
                    <p className="text-gray-700">
                      Schedule an appointment with a cardiologist within the next 1-2 weeks.
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-2">
                      Warning Signs
                    </h4>
                    <p className="text-gray-700">
                      Seek immediate medical attention if you experience chest pain, shortness of breath, or dizziness.
                    </p>
                  </div>
                </>
              )}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">
                  Follow-Up
                </h4>
                <p className="text-gray-700">
                  Schedule a follow-up assessment in 3-6 months to track your progress.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">
                  Lifestyle Changes
                </h4>
                <p className="text-gray-700">
                  Implement dietary changes and increase physical activity gradually.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeartHealthForm;