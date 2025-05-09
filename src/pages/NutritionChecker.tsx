import React, { useState, FormEvent } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import Tesseract from 'tesseract.js';
import { uploadImageAndGetData, NutritionData } from './scripts';

const NutritionChecker: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [nutrition, setNutrition] = useState<Record<string, string>>({});
  const [validation, setValidation] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Check if the image contains food using MobileNet
  const isFoodImage = async (imageURL: string): Promise<boolean> => {
    const img = new Image();
    img.src = imageURL;

    return new Promise((resolve) => {
      img.onload = async () => {
        try {
          const model = await mobilenet.load();
          const predictions = await model.classify(img);
          resolve(predictions.some((p) => p.className.includes('food') || p.className.includes('dish')));
        } catch {
          resolve(false);
        }
      };
    });
  };

  // ✅ Check if the image has text using Tesseract.js
  const hasTextInImage = async (file: File): Promise<boolean> => {
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      return text.length > 30;
    } catch {
      return false;
    }
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setShowResults(false);
    setError(null);

    if (!image) {
      alert('Please select an image!');
      return;
    }

    setLoading(true);
    try {
      const imageURL = URL.createObjectURL(image);

      // Check if image is food
      const isFood = await isFoodImage(imageURL);
      if (!isFood) {
        setError('The image is not recognized as food.');
        setLoading(false);
        return;
      }

      // Check if image has nutritional text
      const hasText = await hasTextInImage(image);
      if (!hasText) {
        setError('No nutritional information detected on the label.');
        setLoading(false);
        return;
      }

      // Send to backend for analysis
      const data: NutritionData = await uploadImageAndGetData(image);
      setNutrition(data.nutrition);
      setValidation(data.validation);
      setShowResults(true);
    } catch (error: any) {
      setError('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render Component
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
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Upload & Analyze'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

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

