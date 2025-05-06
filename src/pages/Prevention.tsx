import React, { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

interface NutritionData {
  nutrition: Record<string, string>;
  validation: Record<string, boolean>;
}

const uploadImageAndGetData = async (): Promise<NutritionData> => {
  // Generate random nutrition values
  const generateRandomValue = (min: number, max: number) => {
    return (Math.random() * (max - min) + min).toFixed(2);
  };

  // Always return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        nutrition: {
          Calories: generateRandomValue(150, 500),
          Protein: generateRandomValue(5, 30),
          Carbohydrates: generateRandomValue(10, 60),
          Fat: generateRandomValue(2, 25),
          Fiber: generateRandomValue(1, 10),
          Sugar: generateRandomValue(0, 20),
          Sodium: generateRandomValue(50, 800),
        },
        validation: {
          "Low Sugar": Math.random() > 0.5,
          "High Protein": Math.random() > 0.5,
          "Low Sodium": Math.random() > 0.5,
          "Balanced Meal": Math.random() > 0.5,
        }
      });
    }, 1500); // Simulate network delay
  });
};

const NutritionChecker: React.FC = () => {
  const { t } = useTranslation();
  const [image, setImage] = useState<File | null>(null);
  const [nutrition, setNutrition] = useState<Record<string, string>>({});
  const [validation, setValidation] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!image) {
      alert(t('nutrition.uploadAlert'));  // رسالة تنبيه إذا لم يتم اختيار صورة
      return;
    }

    setIsLoading(true);
    try {
      const data = await uploadImageAndGetData();
      setNutrition(data.nutrition);
      setValidation(data.validation);
      setShowResults(true);  // عرض النتائج بعد التحليل
    } catch (error: any) {
      alert(t('nutrition.error') + error.message);  // عرض رسالة الخطأ إذا حدثت مشكلة في الاتصال أو التحليل
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {t('nutrition.title')}
        </h1>
        <p className="text-xl text-gray-600">
          {t('nutrition.description')}
        </p>
      </motion.div>

      {/* Form section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-8 mb-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-4">
            <label htmlFor="imageUpload" className="text-lg font-medium text-gray-700">
              {t('nutrition.selectImage')}
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="block w-full text-lg text-gray-500
                file:mr-4 file:py-3 file:px-4
                file:rounded-md file:border-0
                file:text-lg file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-md text-lg font-semibold hover:opacity-90 transition duration-200 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? t('nutrition.loading') : t('nutrition.uploadButton')}
          </button>
        </form>
      </motion.div>

      {/* Results section */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t('nutrition.resultsTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div id="nutrition" className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                {t('nutrition.nutritionalValues')}
              </h3>
              {Object.entries(nutrition).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium text-gray-700">{key}:</span>
                  <span className="text-gray-600">{value} g</span>
                </div>
              ))}
            </div>

            <div id="validation" className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                {t('nutrition.validationResults')}
              </h3>
              {Object.entries(validation).map(([key, isValid]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{key}:</span>
                  <span className={isValid ? 'text-green-500' : 'text-red-500'}>
                    {isValid ? t('nutrition.valid') : t('nutrition.invalid')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-700 text-sm">
              {t('nutrition.disclaimer') || "Note: These are randomly generated results for demonstration purposes only."}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NutritionChecker;