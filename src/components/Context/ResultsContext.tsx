import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Define types for different assessment results
export interface BloodPressureResult {
  id: string;
  date: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  diagnosis: string;
  level: 'normal' | 'elevated' | 'hypertension1' | 'hypertension2' | 'crisis' | null;
}

export interface HeartResult {
  id: string;
  date: string;
  riskScore: number;
  riskLevel: string;
  age: number;
  gender: string;
  factors: {
    bloodPressure?: number;
    cholesterol?: number;
    bloodSugar?: string;
    maxHeartRate?: number;
  };
}

export interface DiabetesResult {
  id: string;
  date: string;
  fbs: number;
  hba1c: number;
  diagnosis: string;
  type: string | null;
  age: number;
  gender: string;
}

export interface AnemiaResult {
  id: string;
  date: string;
  hemoglobin: number;
  diagnosis: string;
  type: string | null;
  gender: string;
  mcv?: number;
  mch?: number;
  mchc?: number;
}

// Combine all result types
export interface UserResults {
  bloodPressure: BloodPressureResult[];
  heart: HeartResult[];
  diabetes: DiabetesResult[];
  anemia: AnemiaResult[];
}

// Context interface
interface ResultsContextType {
  results: UserResults;
  addBloodPressureResult: (result: Omit<BloodPressureResult, 'id' | 'date'>) => void;
  addHeartResult: (result: Omit<HeartResult, 'id' | 'date'>) => void;
  addDiabetesResult: (result: Omit<DiabetesResult, 'id' | 'date'>) => void;
  addAnemiaResult: (result: Omit<AnemiaResult, 'id' | 'date'>) => void;
  clearResults: () => void;
  getAggregatedStatistics: () => any;
  deleteResult: (type: keyof UserResults, id: string) => void;
  getResultsByDateRange: (type: keyof UserResults, startDate: Date, endDate: Date) => any[];
  exportResults: () => string;
  importResults: (jsonData: string) => void;
}

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

export const ResultsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [results, setResults] = useState<UserResults>({
    bloodPressure: [],
    heart: [],
    diabetes: [],
    anemia: []
  });

  // Load results from localStorage when component mounts or user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const storedResults = localStorage.getItem(`health_results_${user.id}`);
      if (storedResults) {
        try {
          setResults(JSON.parse(storedResults));
        } catch (error) {
          console.error('Failed to parse stored results:', error);
        }
      }
    } else {
      setResults({
        bloodPressure: [],
        heart: [],
        diabetes: [],
        anemia: []
      });
    }
  }, [isAuthenticated, user]);

  // Save results to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`health_results_${user.id}`, JSON.stringify(results));
    }
  }, [results, isAuthenticated, user]);

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

  const addBloodPressureResult = (result: Omit<BloodPressureResult, 'id' | 'date'>) => {
    if (!isAuthenticated) return;
    setResults(prev => ({
      ...prev,
      bloodPressure: [
        ...prev.bloodPressure,
        {
          ...result,
          id: generateId(),
          date: new Date().toISOString()
        }
      ]
    }));
  };

  const addHeartResult = (result: Omit<HeartResult, 'id' | 'date'>) => {
    if (!isAuthenticated) return;
    setResults(prev => ({
      ...prev,
      heart: [
        ...prev.heart,
        {
          ...result,
          id: generateId(),
          date: new Date().toISOString()
        }
      ]
    }));
  };

  const addDiabetesResult = (result: Omit<DiabetesResult, 'id' | 'date'>) => {
    if (!isAuthenticated) return;
    setResults(prev => ({
      ...prev,
      diabetes: [
        ...prev.diabetes,
        {
          ...result,
          id: generateId(),
          date: new Date().toISOString()
        }
      ]
    }));
  };

  const addAnemiaResult = (result: Omit<AnemiaResult, 'id' | 'date'>) => {
    if (!isAuthenticated) return;
    setResults(prev => ({
      ...prev,
      anemia: [
        ...prev.anemia,
        {
          ...result,
          id: generateId(),
          date: new Date().toISOString()
        }
      ]
    }));
  };

  const deleteResult = (type: keyof UserResults, id: string) => {
    if (!isAuthenticated) return;
    setResults(prev => ({
      ...prev,
      [type]: prev[type].filter(result => result.id !== id)
    }));
  };

  const clearResults = () => {
    if (!isAuthenticated || !user) return;
    const confirmed = window.confirm('Are you sure you want to clear all your health records? This action cannot be undone.');
    if (confirmed) {
      setResults({
        bloodPressure: [],
        heart: [],
        diabetes: [],
        anemia: []
      });
      localStorage.removeItem(`health_results_${user.id}`);
    }
  };

  const getResultsByDateRange = (type: keyof UserResults, startDate: Date, endDate: Date) => {
    return results[type].filter(result => {
      const resultDate = new Date(result.date);
      return resultDate >= startDate && resultDate <= endDate;
    });
  };

  const exportResults = () => {
    return JSON.stringify(results, null, 2);
  };

  const importResults = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData);
      setResults(parsedData);
      if (isAuthenticated && user) {
        localStorage.setItem(`health_results_${user.id}`, jsonData);
      }
    } catch (error) {
      console.error('Failed to import results:', error);
      throw new Error('Invalid data format');
    }
  };

  const getAggregatedStatistics = () => {
    const totalAssessments = 
      results.bloodPressure.length + 
      results.heart.length + 
      results.diabetes.length + 
      results.anemia.length;

    const latestAssessments = {
      bloodPressure: results.bloodPressure[results.bloodPressure.length - 1] || null,
      heart: results.heart[results.heart.length - 1] || null,
      diabetes: results.diabetes[results.diabetes.length - 1] || null,
      anemia: results.anemia[results.anemia.length - 1] || null
    };

    const healthConcerns = {
      hypertension: results.bloodPressure.some(
        r => r.level === 'hypertension1' || r.level === 'hypertension2' || r.level === 'crisis'
      ),
      heartRisk: results.heart.some(r => r.riskLevel.includes('high') || r.riskLevel.includes('moderate')),
      diabetes: results.diabetes.some(r => r.type === 'type2'),
      anemia: results.anemia.some(r => r.type !== null)
    };

    return {
      totalAssessments,
      assessmentCounts: {
        bloodPressure: results.bloodPressure.length,
        heart: results.heart.length,
        diabetes: results.diabetes.length,
        anemia: results.anemia.length
      },
      latestAssessments,
      healthConcerns
    };
  };

  return (
    <ResultsContext.Provider
      value={{
        results,
        addBloodPressureResult,
        addHeartResult,
        addDiabetesResult,
        addAnemiaResult,
        clearResults,
        getAggregatedStatistics,
        deleteResult,
        getResultsByDateRange,
        exportResults,
        importResults
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};

export const useResults = () => {
  const context = useContext(ResultsContext);
  if (context === undefined) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
};

export default useResults;