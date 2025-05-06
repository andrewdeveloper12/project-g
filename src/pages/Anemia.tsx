import React, { useState } from 'react';
import { Wind, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useResults } from '../components/Context/ResultsContext';

const Anemia: React.FC = () => {
  const { t } = useTranslation();
  const { addAnemiaResult } = useResults();
  
  const [gender, setGender] = useState('');
  const [formData, setFormData] = useState({
    hemoglobin: '',
    mch: '',
    mchc: '',
    mcv: '',
  });
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [anemiaType, setAnemiaType] = useState<string | null>(null);

  const handleGenderSelect = (selected: string) => setGender(selected);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const determineAnemia = () => {
    const hb = parseFloat(formData.hemoglobin) || 0;
    const mch = parseFloat(formData.mch) || 0;
    const mchc = parseFloat(formData.mchc) || 0;
    const mcv = parseFloat(formData.mcv) || 0;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gender || !formData.hemoglobin) {
      alert(t('anemia.requiredFields'));
      return;
    }

    const { isAnemic, severity, type } = determineAnemia();
    
    if (isAnemic) {
      setDiagnosis(t('anemia.positiveDiagnosis', { severity, type }));
      setAnemiaType(type);
    } else {
      setDiagnosis(t('anemia.negativeDiagnosis'));
      setAnemiaType(null);
    }
    
    setShowDiagnosis(true);
    
    // Save to results context
    addAnemiaResult({
      hemoglobin: parseFloat(formData.hemoglobin) || 0,
      diagnosis: isAnemic ? t('anemia.positiveDiagnosis', { severity, type }) : t('anemia.negativeDiagnosis'),
      type: isAnemic ? type : null,
      gender: gender,
      mcv: parseFloat(formData.mcv) || undefined,
      mch: parseFloat(formData.mch) || undefined,
      mchc: parseFloat(formData.mchc) || undefined
    });
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
          {/* Gender */}
          <div className="form-group mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {t('anemia.gender')} *
            </label>
            <div className="flex space-x-4">
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  gender === 'male' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => handleGenderSelect('male')}
              >
                {t('anemia.male')}
              </div>
              <div
                className={`cursor-pointer px-4 py-2 border rounded-md ${
                  gender === 'female' ? 'bg-pink-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => handleGenderSelect('female')}
              >
                {t('anemia.female')}
              </div>
            </div>
          </div>

          {/* Hemoglobin */}
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
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* MCH & MCHC */}
          <div className="form-group mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mch" className="block text-gray-700 mb-1">
                {t('anemia.mch')} (pg)
              </label>
              <input
                type="number"
                id="mch"
                name="mch"
                step="0.1"
                min="0"
                max="50"
                placeholder={t('anemia.mchPlaceholder')}
                value={formData.mch}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="mchc" className="block text-gray-700 mb-1">
                {t('anemia.mchc')} (g/dL)
              </label>
              <input
                type="number"
                id="mchc"
                name="mchc"
                step="0.1"
                min="0"
                max="50"
                placeholder={t('anemia.mchcPlaceholder')}
                value={formData.mchc}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
              />
            </div>
          </div>

          {/* MCV */}
          <div className="form-group mb-6">
            <label htmlFor="mcv" className="block text-gray-700 mb-1">
              {t('anemia.mcv')} (fL)
            </label>
            <input
              type="number"
              id="mcv"
              name="mcv"
              step="0.1"
              min="0"
              max="120"
              placeholder={t('anemia.mcvPlaceholder')}
              value={formData.mcv}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center gap-2"
          >
            <Activity className="w-5 h-5" />
            {t('anemia.submit')}
          </button>
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