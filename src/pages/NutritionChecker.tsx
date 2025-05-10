import React, { useState, FormEvent, useEffect } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import Tesseract from 'tesseract.js';

interface NutritionData {
  productName: string;
  suitability: string;
  nutritionalValues?: Record<string, string>;
  validationResults?: Record<string, boolean>;
}

interface ProductHistoryItem {
  _id: string;
  productName: string;
  suitability: string;
  productImage: string;
  createdAt: string;
}

interface LoadingState {
  scan: boolean;
  history: boolean;
  delete: boolean;
}

const NutritionChecker: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [disease, setDisease] = useState<string>('anemia');
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [productHistory, setProductHistory] = useState<ProductHistoryItem[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    scan: false,
    history: false,
    delete: false
  });
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const API_BASE_URL = 'https://carelens.up.railway.app/api';
  const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODFhMjY5MGFkMDRkZjRjZWZlYWEyYTUiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NjU0NDQ2M30.kiKVbi6GJxssFgq4v1S-kCkev_SbZ2rrKUGJbH2EEpE';

  const validateImage = async (file: File): Promise<boolean> => {
    try {
      const imageURL = URL.createObjectURL(file);
      
      const isFood = await isFoodImage(imageURL);
      if (!isFood) {
        throw new Error('The uploaded image does not appear to be food. Please upload a clear image of a food product.');
      }

      const hasText = await hasTextInImage(file);
      if (!hasText) {
        throw new Error('No nutritional information detected. Please upload a clear image of the product label with visible nutritional facts.');
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  const isFoodImage = async (imageURL: string): Promise<boolean> => {
    const img = new Image();
    img.src = imageURL;

    return new Promise((resolve) => {
      img.onload = async () => {
        try {
          const model = await mobilenet.load();
          const predictions = await model.classify(img);
          const foodKeywords = ['food', 'dish', 'meal', 'cuisine', 'nutrition', 'ingredient'];
          resolve(predictions.some(p => 
            foodKeywords.some(keyword => p.className.toLowerCase().includes(keyword))
          ));
        } catch {
          resolve(false);
        }
      };
    });
  };

  const hasTextInImage = async (file: File): Promise<boolean> => {
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      const nutritionalKeywords = ['nutrition', 'facts', 'serving', 'calories', 'fat', 'protein'];
      return nutritionalKeywords.some(keyword => text.toLowerCase().includes(keyword));
    } catch {
      return false;
    }
  };

  const scanLabel = async (file: File, disease: string): Promise<NutritionData> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('disease', disease);

      const response = await fetch(`${API_BASE_URL}/scan/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to scan label');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Network error occurred while scanning label');
    }
  };

  const addProductToHistory = async (productData: NutritionData, imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append('productName', productData.productName);
      formData.append('suitability', productData.suitability);
      formData.append('productImage', imageFile);

      const response = await fetch(`${API_BASE_URL}/product-history`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to save product to history');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Network error occurred while saving to history');
    }
  };

  const fetchProductHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/product-history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load product history');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Network error occurred while fetching history');
    }
  };

  const deleteProductFromHistory = async (productId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/product-history/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Network error occurred while deleting product');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading({ ...loading, scan: true });
      setError(null);
      setImagePreview(URL.createObjectURL(file));
      
      await validateImage(file);
      setImage(file);
    } catch (error: any) {
      setError(error.message);
      setImage(null);
      setImagePreview(null);
    } finally {
      setLoading({ ...loading, scan: false });
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!image) {
      setError('Please select a valid food image with nutritional information');
      return;
    }

    try {
      setLoading({ ...loading, scan: true });
      
      const scanResult = await scanLabel(image, disease);
      setNutritionData(scanResult);

      await addProductToHistory(scanResult, image);
      
      const history = await fetchProductHistory();
      setProductHistory(history);
      
      setActiveTab('history');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading({ ...loading, scan: false });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setLoading({ ...loading, delete: true });
      await deleteProductFromHistory(productId);
      const updatedHistory = await fetchProductHistory();
      setProductHistory(updatedHistory);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading({ ...loading, delete: false });
    }
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading({ ...loading, history: true });
        const history = await fetchProductHistory();
        setProductHistory(history);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading({ ...loading, history: false });
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>Nutrition Scanner</h1>
      
      <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        <button
          style={{
            padding: '10px 20px',
            background: activeTab === 'scan' ? '#3498db' : 'transparent',
            color: activeTab === 'scan' ? 'white' : '#2c3e50',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          onClick={() => setActiveTab('scan')}
        >
          Scan Product
        </button>
        <button
          style={{
            padding: '10px 20px',
            background: activeTab === 'history' ? '#3498db' : 'transparent',
            color: activeTab === 'history' ? 'white' : '#2c3e50',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          onClick={() => setActiveTab('history')}
        >
          Product History
        </button>
      </div>

      {error && (
        <div style={{
          padding: '10px',
          background: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {activeTab === 'scan' ? (
        <div>
          <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Upload Food Label Image:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                style={{ display: 'block', width: '100%' }}
                disabled={loading.scan}
              />
              {imagePreview && (
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ maxWidth: '300px', maxHeight: '300px', border: '1px solid #ddd' }}
                  />
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    {image?.name} - {(image ? (image.size / 1024).toFixed(2) : '0')} KB
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Health Condition:
              </label>
              <input
                type="text"
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                placeholder="e.g. diabetes, hypertension, anemia"
              />
            </div>

            <button
              type="submit"
              disabled={loading.scan || !image}
              style={{
                background: '#3498db',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                width: '100%',
                opacity: loading.scan || !image ? 0.7 : 1
              }}
            >
              {loading.scan ? 'Analyzing...' : 'Scan Nutrition Label'}
            </button>
          </form>

          {nutritionData && (
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <h2 style={{ marginTop: 0, color: '#2c3e50' }}>Scan Results</h2>
              
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ marginBottom: '5px' }}>{nutritionData.productName}</h3>
                <p style={{ 
                  color: nutritionData.suitability.toLowerCase() === 'good' ? '#27ae60' : '#e74c3c',
                  fontWeight: 'bold'
                }}>
                  Suitability: {nutritionData.suitability}
                </p>
              </div>

              {nutritionData.nutritionalValues && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Nutritional Values</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {Object.entries(nutritionData.nutritionalValues).map(([key, value]) => (
                        <tr key={key}>
                          <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{key}</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {nutritionData.validationResults && (
                <div>
                  <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Health Validation</h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {Object.entries(nutritionData.validationResults).map(([key, isValid]) => (
                      <li key={key} style={{ marginBottom: '5px' }}>
                        {isValid ? '✅' : '❌'} {key}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 style={{ color: '#2c3e50' }}>Scanned Product History</h2>
          
          {loading.history ? (
            <p>Loading history...</p>
          ) : productHistory.length === 0 ? (
            <p>No products scanned yet. Scan your first product to see it here.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {productHistory.map((product) => (
                <div key={product._id} style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  background: '#fff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <img 
                      src={product.productImage} 
                      alt={product.productName} 
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        objectFit: 'cover',
                        borderRadius: '4px',
                        marginRight: '10px'
                      }}
                    />
                    <div>
                      <h3 style={{ margin: 0 }}>{product.productName}</h3>
                      <p style={{ 
                        margin: 0,
                        color: product.suitability.toLowerCase() === 'good' ? '#27ae60' : '#e74c3c',
                        fontWeight: 'bold'
                      }}>
                        {product.suitability}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    Scanned on: {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    disabled={loading.delete}
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      marginTop: '10px'
                    }}
                  >
                    {loading.delete ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NutritionChecker;