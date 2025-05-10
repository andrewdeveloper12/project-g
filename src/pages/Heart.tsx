import React, { useState, useEffect } from 'react';
import { Heart, HeartPulse, Loader2 } from 'lucide-react';
import { useAuth } from '../components/Context/AuthContext';
import { useResults } from '../components/Context/ResultsContext';
import { toast } from 'react-toastify';

interface HeartRecord {
  _id?: string;
  patientId: string;
  measurements: {
    chestPainType: string;
    age: number;
    gender: string;
    restingBP: number;
    cholesterol: number;
    fastingBloodSugar: boolean;
    restingECG: string;
    maxHeartRate: number;
    exerciseAngina: boolean;
    oldpeak: number;
    stSlope: string;
  };
  riskScore: number;
  riskLevel: string;
  createdAt?: string;
}

const HeartHealthForm: React.FC = () => {
  const { user } = useAuth();
  const { addHeartResult } = useResults();
  
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HeartRecord[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  
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
  
  const [formErrors, setFormErrors] = useState({
    age: false,
    gender: false,
    chestPainType: false,
    bloodPressure: false,
    cholesterol: false,
    bloodSugar: false,
    ecgResults: false,
    maxHeartRate: false,
    exerciseAngina: false,
    oldpeak: false,
    stSlope: false
  });

  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState<number>(0);

  // Fetch user history on component mount
  useEffect(() => {
    if (user?.id) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/heart/${user?.id}`, {
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
      toast.error('Failed to load your heart health history');
      console.error('Error fetching heart history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleGenderSelect = (selected: string) => {
    setFormData(prev => ({ ...prev, gender: selected }));
    setFormErrors(prev => ({ ...prev, gender: false }));
  };

  const handleOptionSelect = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: false }));
  };

  const validateForm = (): boolean => {
    const errors = {
      age: !formData.age,
      gender: !formData.gender,
      chestPainType: !formData.chestPainType,
      bloodPressure: !formData.bloodPressure,
      cholesterol: !formData.cholesterol,
      bloodSugar: !formData.bloodSugar,
      ecgResults: !formData.ecgResults,
      maxHeartRate: !formData.maxHeartRate,
      exerciseAngina: !formData.exerciseAngina,
      oldpeak: !formData.oldpeak,
      stSlope: !formData.stSlope
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const assessHeartHealth = () => {
    const age = parseInt(formData.age);
    const bp = parseInt(formData.bloodPressure);
    const cholesterol = parseInt(formData.cholesterol);
    const maxHeartRate = parseInt(formData.maxHeartRate);
    const oldpeak = parseFloat(formData.oldpeak);
    
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

  const saveRecord = async (recordData: Omit<HeartRecord, '_id' | 'createdAt'>) => {
    try {
      setLoading(true);
      const endpoint = isEditing && currentRecordId 
        ? `/api/heart/${currentRecordId}`
        : '/api/heart';
      
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
      toast.success(isEditing ? 'Record updated successfully' : 'Assessment saved successfully');
      
      // Refresh history
      await fetchHistory();
      return data;
    } catch (error) {
      toast.error('Failed to save your assessment');
      console.error('Error saving heart record:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const { riskScore: calculatedRiskScore, riskLevel: determinedRiskLevel } = assessHeartHealth();
    
    setRiskScore(calculatedRiskScore);
    setDiagnosis(`Based on your inputs, your heart health risk level is: ${determinedRiskLevel} (Score: ${calculatedRiskScore}/15)`);
    setRiskLevel(determinedRiskLevel);
    setShowDiagnosis(true);
    
    // Prepare record data for API
    const recordData: Omit<HeartRecord, '_id' | 'createdAt'> = {
      patientId: user?.id || '',
      measurements: {
        chestPainType: formData.chestPainType === 'typical-angina' ? 'TA' :
                      formData.chestPainType === 'atypical-angina' ? 'ATA' :
                      formData.chestPainType === 'non-anginal' ? 'NAP' : 'ASY',
        age: parseInt(formData.age),
        gender: formData.gender === 'male' ? 'M' : 'F',
        restingBP: parseInt(formData.bloodPressure),
        cholesterol: parseInt(formData.cholesterol),
        fastingBloodSugar: formData.bloodSugar === 'yes',
        restingECG: formData.ecgResults === 'normal' ? 'Normal' :
                   formData.ecgResults === 'st-t-abnormality' ? 'ST' : 'LVH',
        maxHeartRate: parseInt(formData.maxHeartRate),
        exerciseAngina: formData.exerciseAngina === 'yes',
        oldpeak: parseFloat(formData.oldpeak),
        stSlope: formData.stSlope === 'upsloping' ? 'Up' :
                 formData.stSlope === 'flat' ? 'Flat' : 'Down'
      },
      riskScore: calculatedRiskScore,
      riskLevel: determinedRiskLevel
    };

    try {
      // Save to API
      await saveRecord(recordData);
      
      // Save to local context
      addHeartResult({
        riskScore: calculatedRiskScore,
        riskLevel: determinedRiskLevel,
        age: parseInt(formData.age),
        gender: formData.gender,
        factors: {
          bloodPressure: parseInt(formData.bloodPressure),
          cholesterol: parseInt(formData.cholesterol),
          bloodSugar: formData.bloodSugar,
          maxHeartRate: parseInt(formData.maxHeartRate)
        }
      });
    } catch (error) {
      console.error('Error handling heart assessment submission:', error);
    }
  };

  const loadRecordForEditing = (record: HeartRecord) => {
    setFormData({
      age: record.measurements.age.toString(),
      gender: record.measurements.gender === 'M' ? 'male' : 'female',
      chestPainType: record.measurements.chestPainType === 'TA' ? 'typical-angina' :
                    record.measurements.chestPainType === 'ATA' ? 'atypical-angina' :
                    record.measurements.chestPainType === 'NAP' ? 'non-anginal' : 'asymptomatic',
      bloodPressure: record.measurements.restingBP.toString(),
      cholesterol: record.measurements.cholesterol.toString(),
      bloodSugar: record.measurements.fastingBloodSugar ? 'yes' : 'no',
      ecgResults: record.measurements.restingECG === 'Normal' ? 'normal' :
                 record.measurements.restingECG === 'ST' ? 'st-t-abnormality' : 'abnormal',
      maxHeartRate: record.measurements.maxHeartRate.toString(),
      exerciseAngina: record.measurements.exerciseAngina ? 'yes' : 'no',
      oldpeak: record.measurements.oldpeak.toString(),
      stSlope: record.measurements.stSlope === 'Up' ? 'upsloping' :
               record.measurements.stSlope === 'Flat' ? 'flat' : 'downsloping'
    });
    setDiagnosis(`Based on your inputs, your heart health risk level is: ${record.riskLevel} (Score: ${record.riskScore}/15)`);
    setRiskLevel(record.riskLevel);
    setRiskScore(record.riskScore);
    setShowDiagnosis(true);
    setIsEditing(true);
    setCurrentRecordId(record._id || null);
  };

  const resetForm = () => {
    setFormData({
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
    setFormErrors({
      age: false,
      gender: false,
      chestPainType: false,
      bloodPressure: false,
      cholesterol: false,
      bloodSugar: false,
      ecgResults: false,
      maxHeartRate: false,
      exerciseAngina: false,
      oldpeak: false,
      stSlope: false
    });
    setDiagnosis(null);
    setShowDiagnosis(false);
    setRiskLevel(null);
    setRiskScore(0);
    setIsEditing(false);
    setCurrentRecordId(null);
  };

  const getRecommendations = () => {
    if (!riskLevel) return ['Maintain a balanced lifestyle with regular check-ups'];
    
    const recommendations = [
      'Maintain a balanced diet rich in fruits, vegetables, and whole grains',
      'Engage in regular physical activity (at least 150 minutes per week)'
    ];
    
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
      <div className="heart-header mb-12 text-center">
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
          {/* Age - Required */}
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
              className={`w-full border p-2 rounded-md ${
                formErrors.age ? 'border-red-500 bg-red-50' : ''
              }`}
            />
            {formErrors.age && (
              <p className="text-red-500 text-sm mt-1">Age is required</p>
            )}
          </div>

          {/* Gender - Required */}
          <div className="form-group mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Gender *
            </label>
            <div className="flex space-x-4">
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.gender === 'male' ? 'bg-blue-500 text-white' : formErrors.gender ? 'bg-red-100 border-red-500' : 'bg-gray-100'
                }`}
                onClick={() => handleGenderSelect('male')}
              >
                Male
              </div>
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.gender === 'female' ? 'bg-pink-500 text-white' : formErrors.gender ? 'bg-red-100 border-red-500' : 'bg-gray-100'
                }`}
                onClick={() => handleGenderSelect('female')}
              >
                Female
              </div>
            </div>
            {formErrors.gender && (
              <p className="text-red-500 text-sm mt-1">Gender is required</p>
            )}
          </div>

          {/* Chest Pain Type - Required */}
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
              className={`w-full border p-2 rounded-md ${
                formErrors.chestPainType ? 'border-red-500 bg-red-50' : ''
              }`}
            >
              <option value="">Select chest pain type</option>
              <option value="typical-angina">Typical Angina</option>
              <option value="atypical-angina">Atypical Angina</option>
              <option value="non-anginal">Non-Anginal Pain</option>
              <option value="asymptomatic">Asymptomatic</option>
            </select>
            {formErrors.chestPainType && (
              <p className="text-red-500 text-sm mt-1">Chest pain type is required</p>
            )}
          </div>

          {/* Blood Pressure - Required */}
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
              className={`w-full border p-2 rounded-md ${
                formErrors.bloodPressure ? 'border-red-500 bg-red-50' : ''
              }`}
            />
            {formErrors.bloodPressure && (
              <p className="text-red-500 text-sm mt-1">Blood pressure is required</p>
            )}
          </div>

          {/* Cholesterol - Required */}
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
              className={`w-full border p-2 rounded-md ${
                formErrors.cholesterol ? 'border-red-500 bg-red-50' : ''
              }`}
            />
            {formErrors.cholesterol && (
              <p className="text-red-500 text-sm mt-1">Cholesterol is required</p>
            )}
          </div>

          {/* Blood Sugar - Required */}
          <div className="form-group mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Fasting Blood Sugar &gt; 120 mg/dl? *
            </label>
            <div className="flex space-x-4">
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.bloodSugar === 'yes' ? 'bg-green-500 text-white' : formErrors.bloodSugar ? 'bg-red-100 border-red-500' : 'bg-gray-100'
                }`}
                onClick={() => handleOptionSelect('bloodSugar', 'yes')}
              >
                Yes
              </div>
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.bloodSugar === 'no' ? 'bg-red-500 text-white' : formErrors.bloodSugar ? 'bg-red-100 border-red-500' : 'bg-gray-100'
                }`}
                onClick={() => handleOptionSelect('bloodSugar', 'no')}
              >
                No
              </div>
            </div>
            {formErrors.bloodSugar && (
              <p className="text-red-500 text-sm mt-1">Blood sugar status is required</p>
            )}
          </div>

          {/* ECG Results - Required */}
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
              className={`w-full border p-2 rounded-md ${
                formErrors.ecgResults ? 'border-red-500 bg-red-50' : ''
              }`}
            >
              <option value="">Select ECG result</option>
              <option value="normal">Normal</option>
              <option value="st-t-abnormality">ST-T Wave Abnormality</option>
              <option value="abnormal">Left Ventricular Hypertrophy</option>
            </select>
            {formErrors.ecgResults && (
              <p className="text-red-500 text-sm mt-1">ECG results are required</p>
            )}
          </div>

          {/* Max Heart Rate - Required */}
          <div className="form-group mb-6">
            <label htmlFor="maxHeartRate" className="block text-gray-700 mb-1">
              Max Heart Rate (bpm) *
              <span className="text-sm text-gray-500 ml-2">Average max: 220 - {formData.age || 'age'}</span>
            </label>
            <input
              type="number"
              id="maxHeartRate"
              name="maxHeartRate"
              min="60"
              max="220"
              required
              placeholder="Enter your maximum heart rate"
              value={formData.maxHeartRate}
              onChange={handleChange}
              className={`w-full border p-2 rounded-md ${
                formErrors.maxHeartRate ? 'border-red-500 bg-red-50' : ''
              }`}
            />
            {formErrors.maxHeartRate && (
              <p className="text-red-500 text-sm mt-1">Max heart rate is required</p>
            )}
          </div>

          {/* Exercise Angina - Required */}
          <div className="form-group mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Exercise-Induced Angina? *
            </label>
            <div className="flex space-x-4">
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.exerciseAngina === 'yes' ? 'bg-green-500 text-white' : formErrors.exerciseAngina ? 'bg-red-100 border-red-500' : 'bg-gray-100'
                }`}
                onClick={() => handleOptionSelect('exerciseAngina', 'yes')}
              >
                Yes
              </div>
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  formData.exerciseAngina === 'no' ? 'bg-red-500 text-white' : formErrors.exerciseAngina ? 'bg-red-100 border-red-500' : 'bg-gray-100'
                }`}
                onClick={() => handleOptionSelect('exerciseAngina', 'no')}
              >
                No
              </div>
            </div>
            {formErrors.exerciseAngina && (
              <p className="text-red-500 text-sm mt-1">Exercise angina status is required</p>
            )}
          </div>

          {/* Oldpeak (ST Depression) - Required */}
          <div className="form-group mb-6">
            <label htmlFor="oldpeak" className="block text-gray-700 mb-1">
              ST Depression (Oldpeak) *
            </label>
            <input
              type="number"
              id="oldpeak"
              name="oldpeak"
              step="0.1"
              min="0"
              max="10"
              required
              placeholder="Enter ST depression value"
              value={formData.oldpeak}
              onChange={handleChange}
              className={`w-full border p-2 rounded-md ${
                formErrors.oldpeak ? 'border-red-500 bg-red-50' : ''
              }`}
            />
            {formErrors.oldpeak && (
              <p className="text-red-500 text-sm mt-1">ST depression value is required</p>
            )}
          </div>

          {/* ST Slope - Required */}
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
              className={`w-full border p-2 rounded-md ${
                formErrors.stSlope ? 'border-red-500 bg-red-50' : ''
              }`}
            >
              <option value="">Select ST slope</option>
              <option value="upsloping">Upsloping</option>
              <option value="flat">Flat</option>
              <option value="downsloping">Downsloping</option>
            </select>
            {formErrors.stSlope && (
              <p className="text-red-500 text-sm mt-1">ST slope is required</p>
            )}
          </div>

          {/* Submit & Reset Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isEditing ? 'Updating...' : 'Assessing...'}
                </>
              ) : (
                <>
                  <HeartPulse className="w-5 h-5" />
                  {isEditing ? 'Update Assessment' : 'Assess Heart Health'}
                </>
              )}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="history-card bg-white p-6 rounded-xl shadow-md max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Assessment History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                      {record.measurements.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.measurements.gender === 'M' ? 'Male' : 'Female'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.riskLevel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.riskScore}/15
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => loadRecordForEditing(record)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results Section */}
      {showDiagnosis && diagnosis && (
        <div className="results-card bg-white p-6 rounded-xl shadow-md max-w-6xl mx-auto mb-12">
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
        </div>
      )}
    </div>
  );
};

export default HeartHealthForm;