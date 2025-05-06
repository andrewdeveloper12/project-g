import React, { useState, FormEvent } from 'react';
import { uploadImageAndGetData, NutritionData } from './scripts';

const NutritionChecker: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [nutrition, setNutrition] = useState<Record<string, string>>({});
  const [validation, setValidation] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!image) {
      alert('Please select an image!');
      return;
    }

    try {
      const data: NutritionData = await uploadImageAndGetData(image);
      setNutrition(data.nutrition);
      setValidation(data.validation);
      setShowResults(true);
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="container">
      <h1>Nutrition Checker</h1>
      <p>Upload an image of a product label to analyze its nutritional values.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          required
        />
        <button type="submit">Upload & Analyze</button>
      </form>

      {showResults && (
        <div id="results">
          <h2>Results</h2>

          <div id="nutrition">
            <h3>Nutritional Values:</h3>
            {Object.entries(nutrition).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value} g
              </p>
            ))}
          </div>

          <div id="validation">
            <h3>Validation Results:</h3>
            {Object.entries(validation).map(([key, isValid]) => (
              <p key={key}>
                <strong>{key}:</strong> {isValid ? '✅ Acceptable' : '❌ Exceeds limit'}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionChecker;
