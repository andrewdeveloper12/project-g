import React, { useState, useEffect } from 'react';
import { Wind, Activity, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useResults } from '../components/Context/ResultsContext';
import { useAuth } from '../components/Context/AuthContext';
import { toast } from 'react-toastify';

interface AnemiaRecord {
  _id?: string;
  patientId: string;
  measurements: {
    gender: boolean; // true for male, false for female
    hemoglobin: number;
    mch: number;
    mchc: number;
    mcv: number;
  };
  diagnosis: string;
  type?: string;
  createdAt?: string;
}

const Anemia: React.FC = () => {
  const { t } = useTranslation();
  const { addAnemiaResult } = useResults();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<AnemiaRecord[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [formData, setFormData] = useState({
    hemoglobin: '',
    mch: '',
    mchc: '',
    mcv: '',
  });
  const [formErrors, setFormErrors] = useState({
    gender: false,
    hemoglobin: false,
    mch: false,
    mchc: false,
    mcv: false,
  });
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [anemiaType, setAnemiaType] = useState<string | null>(null);

  // Fetch user history on component mount
  useEffect(() => {
    if (user?.id) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/anemia/${user?.id}`, {
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
      toast.error(t('anemia.fetchError'));
      console.error('Error fetching anemia history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenderSelect = (selected: 'male' | 'female') => {
    setGender(selected);
    setFormErrors(prev => ({ ...prev, gender: false }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: false }));
  };

  const validateForm = () => {
    const errors = {
      gender: !gender,
      hemoglobin: !formData.hemoglobin,
      mch: !formData.mch,
      mchc: !formData.mchc,
      mcv: !formData.mcv,
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const determineAnemia = () => {
    const hb = parseFloat(formData.hemoglobin);
    const mch = parseFloat(formData.mch);
    const mchc = parseFloat(formData.mchc);
    const mcv = parseFloat(formData.mcv);

    let isAnemic = false;
    let severity = '';
    
    if ((gender === 'male' && hb < 13) || (gender === 'female' && hb < 12)) {
      isAnemic = true;
      if (hb < 8) severity = t('anemia.severe');
      else if (hb < 10) severity = t('anemia.moderate');
      else severity = t('anemia.mild');
    }

    let type = '';
    if (mcv < 80 && mch < 27 && mchc < 32) {
      type = t('anemia.microcyticHypochromic');
    } else if (mcv > 100) {
      type = t('anemia.macrocytic');
    } else if (mcv >= 80 && mcv <= 100) {
      type = t('anemia.normocytic');
    }

    return { isAnemic, severity, type };
  };

  const saveRecord = async (recordData: Omit<AnemiaRecord, '_id' | 'createdAt'>) => {
    try {
      setLoading(true);
      const endpoint = isEditing && currentRecordId 
        ? `/api/anemia/${currentRecordId}`
        : '/api/anemia';
      
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
      toast.success(t(isEditing ? 'anemia.updateSuccess' : 'anemia.saveSuccess'));
      
      // Refresh history
      await fetchHistory();
      return data;
    } catch (error) {
      toast.error(t('anemia.saveError'));
      console.error('Error saving anemia record:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!validateForm()) {
      toast.error(t('anemia.allFieldsRequired'));
      return;
    }

    const { isAnemic, severity, type } = determineAnemia();
    
    let diagnosisText = '';
    if (isAnemic) {
      diagnosisText = t('anemia.positiveDiagnosis', { severity, type });
      setAnemiaType(type);
    } else {
      diagnosisText = t('anemia.negativeDiagnosis');
      setAnemiaType(null);
    }
    
    setDiagnosis(diagnosisText);
    setShowDiagnosis(true);
    
    // Prepare record data for API
    const recordData: Omit<AnemiaRecord, '_id' | 'createdAt'> = {
      patientId: user?.id || '',
      measurements: {
        gender: gender === 'male',
        hemoglobin: parseFloat(formData.hemoglobin),
        mch: parseFloat(formData.mch),
        mchc: parseFloat(formData.mchc),
        mcv: parseFloat(formData.mcv)
      },
      diagnosis: diagnosisText,
      type: isAnemic ? type : undefined
    };

    try {
      // Save to API
      await saveRecord(recordData);
      
      // Save to local context
      addAnemiaResult({
        hemoglobin: parseFloat(formData.hemoglobin),
        diagnosis: diagnosisText,
        type: isAnemic ? type : null,
        gender: gender,
        mcv: parseFloat(formData.mcv),
        mch: parseFloat(formData.mch),
        mchc: parseFloat(formData.mchc)
      });
    } catch (error) {
      console.error('Error handling anemia submission:', error);
    }
  };

  const loadRecordForEditing = (record: AnemiaRecord) => {
    setGender(record.measurements.gender ? 'male' : 'female');
    setFormData({
      hemoglobin: record.measurements.hemoglobin.toString(),
      mch: record.measurements.mch.toString(),
      mchc: record.measurements.mchc.toString(),
      mcv: record.measurements.mcv.toString()
    });
    setDiagnosis(record.diagnosis);
    setAnemiaType(record.type || null);
    setShowDiagnosis(true);
    setIsEditing(true);
    setCurrentRecordId(record._id || null);
  };

  const resetForm = () => {
    setGender('');
    setFormData({
      hemoglobin: '',
      mch: '',
      mchc: '',
      mcv: ''
    });
    setFormErrors({
      gender: false,
      hemoglobin: false,
      mch: false,
      mchc: false,
      mcv: false,
    });
    setDiagnosis(null);
    setShowDiagnosis(false);
    setAnemiaType(null);
    setIsEditing(false);
    setCurrentRecordId(null);
  };

  const getRecommendations = () => {
    if (!anemiaType) return [t('anemia.noAnemiaRec')];
    
    const recommendations = [
      t('anemia.generalRec1'),
      t('anemia.generalRec2')
    ];
    
    if (anemiaType.includes(t('anemia.microcyticHypochromic'))) {
      recommendations.push(t('anemia.ironRichDiet'));
      recommendations.push(t('anemia.ironSupplement'));
    } else if (anemiaType.includes(t('anemia.macrocytic'))) {
      recommendations.push(t('anemia.b12RichDiet'));
      recommendations.push(t('anemia.folateSupplement'));
    }
    
    recommendations.push(t('anemia.consultDoctor'));
    return recommendations;
  };

  return (
    <div className="anemia-container px-4 py-7">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="anemia-header mb-12 text-center"
      >
        <Wind className="w-16 h-16 text-blue-500 mx-auto mb-2" />
        <h1 className="text-4xl font-bold text-gray-800">
          {t('anemia.title')}
        </h1>
        <p className="text-gray-600 text-md mt-2">
          {t('anemia.description')}
        </p>
      </motion.div>

      {/* Form */}
      <div className="form-card bg-white p-6 rounded-xl shadow-md max-w-6xl mx-auto mb-12">
        <form onSubmit={handleSubmit}>
          {/* Gender - Required */}
          <div className="form-group mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {t('anemia.gender')} *
            </label>
            <div className="flex space-x-4">
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  gender === 'male' ? 'bg-blue-500 text-white' : formErrors.gender ? 'bg-red-100 border-red-500' : 'bg-gray-100'
                }`}
                onClick={() => handleGenderSelect('male')}
              >
                {t('anemia.male')}
              </div>
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  gender === 'female' ? 'bg-pink-500 text-white' : formErrors.gender ? 'bg-red-100 border-red-500' : 'bg-gray-100'
                }`}
                onClick={() => handleGenderSelect('female')}
              >
                {t('anemia.female')}
              </div>
            </div>
            {formErrors.gender && (
              <p className="text-red-500 text-sm mt-1">{t('anemia.genderRequired')}</p>
            )}
          </div>

          {/* Hemoglobin - Required */}
          <div className="form-group mb-6">
            <label htmlFor="hemoglobin" className="block text-gray-700 mb-1">
              {t('anemia.hemoglobin')} (g/dL) *
            </label>
            <input
              type="number"
              id="hemoglobin"
              name="hemoglobin"
              step="0.1"
              min="0"
              max="30"
              required
              placeholder={t('anemia.hemoglobinPlaceholder')}
              value={formData.hemoglobin}
              onChange={handleChange}
              className={`w-full border p-2 rounded-md ${
                formErrors.hemoglobin ? 'border-red-500 bg-red-50' : ''
              }`}
            />
            {formErrors.hemoglobin && (
              <p className="text-red-500 text-sm mt-1">{t('anemia.hemoglobinRequired')}</p>
            )}
          </div>

          {/* MCH - Required */}
          <div className="form-group mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mch" className="block text-gray-700 mb-1">
                {t('anemia.mch')} (pg) *
              </label>
              <input
                type="number"
                id="mch"
                name="mch"
                step="0.1"
                min="0"
                max="50"
                required
                placeholder={t('anemia.mchPlaceholder')}
                value={formData.mch}
                onChange={handleChange}
                className={`w-full border p-2 rounded-md ${
                  formErrors.mch ? 'border-red-500 bg-red-50' : ''
                }`}
              />
              {formErrors.mch && (
                <p className="text-red-500 text-sm mt-1">{t('anemia.mchRequired')}</p>
              )}
            </div>
            
            {/* MCHC - Required */}
            <div>
              <label htmlFor="mchc" className="block text-gray-700 mb-1">
                {t('anemia.mchc')} (g/dL) *
              </label>
              <input
                type="number"
                id="mchc"
                name="mchc"
                step="0.1"
                min="0"
                max="50"
                required
                placeholder={t('anemia.mchcPlaceholder')}
                value={formData.mchc}
                onChange={handleChange}
                className={`w-full border p-2 rounded-md ${
                  formErrors.mchc ? 'border-red-500 bg-red-50' : ''
                }`}
              />
              {formErrors.mchc && (
                <p className="text-red-500 text-sm mt-1">{t('anemia.mchcRequired')}</p>
              )}
            </div>
          </div>

          {/* MCV - Required */}
          <div className="form-group mb-6">
            <label htmlFor="mcv" className="block text-gray-700 mb-1">
              {t('anemia.mcv')} (fL) *
            </label>
            <input
              type="number"
              id="mcv"
              name="mcv"
              step="0.1"
              min="0"
              max="120"
              required
              placeholder={t('anemia.mcvPlaceholder')}
              value={formData.mcv}
              onChange={handleChange}
              className={`w-full border p-2 rounded-md ${
                formErrors.mcv ? 'border-red-500 bg-red-50' : ''
              }`}
            />
            {formErrors.mcv && (
              <p className="text-red-500 text-sm mt-1">{t('anemia.mcvRequired')}</p>
            )}
          </div>

          {/* Submit & Reset Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t(isEditing ? 'anemia.updating' : 'anemia.submitting')}
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  {t(isEditing ? 'anemia.update' : 'anemia.submit')}
                </>
              )}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
              >
                {t('anemia.cancel')}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Diagnosis Results */}
      {showDiagnosis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="diagnosis-card bg-white p-6 rounded-xl shadow-md max-w-6xl mx-auto mb-12"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className={`flex-shrink-0 p-4 rounded-lg ${
              anemiaType ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            } w-full md:w-1/3 flex flex-col items-center justify-center`}>
              <Activity className="w-12 h-12 mb-3" />
              <h3 className="text-xl font-bold text-center">{t('anemia.diagnosis')}</h3>
              <p className="text-lg font-semibold text-center mt-2">{diagnosis}</p>
            </div>
            
            <div className="flex-grow">
              {anemiaType ? (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {t('anemia.aboutAnemia', { type: anemiaType })}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {anemiaType.includes(t('anemia.microcyticHypochromic')) && t('anemia.microcyticDesc')}
                    {anemiaType.includes(t('anemia.macrocytic')) && t('anemia.macrocyticDesc')}
                    {anemiaType.includes(t('anemia.normocytic')) && t('anemia.normocyticDesc')}
                  </p>
                </>
              ) : (
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {t('anemia.noAnemiaTitle')}
                </h3>
              )}
              
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t('anemia.recommendations')}</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                {getRecommendations().map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <div className="history-card bg-white p-6 rounded-xl shadow-md max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('anemia.historyTitle')}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('anemia.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('anemia.gender')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('anemia.hemoglobin')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('anemia.diagnosis')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('anemia.actions')}
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
                      {record.measurements.gender ? t('anemia.male') : t('anemia.female')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.measurements.hemoglobin} g/dL
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.diagnosis}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => loadRecordForEditing(record)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        {t('anemia.edit')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Media */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8">
        <img
          src="https://st4.depositphotos.com/2824873/20136/v/450/depositphotos_201360208-stock-illustration-anemia-level-of-blood-cells.jpg"
          alt={t('anemia.imageAlt')}
          className="rounded-xl shadow-lg w-full h-auto object-cover"
        />
        <iframe
          width="100%"
          height="377"
          src="https://www.youtube.com/embed/mOrRJBqm744?si=TpS7bfLbyKRWgVHx"
          title={t('anemia.videoTitle')}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          className="rounded-xl shadow-lg w-full h-full"
        />
      </div>
    </div>
  );
};

export default Anemia;