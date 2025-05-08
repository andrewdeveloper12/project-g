import axios, { AxiosRequestConfig } from 'axios';

// Replace with your actual API base URL
const API_BASE_URL = 'https://your-api-url.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Type definitions
export interface DiabetesStatistics {
  userId: string;
  exerciseHours: number;
  bloodSugarLevel: number;
  weight: number;
  height: number;
}

export interface HeartStatistics {
  userId: string;
  exerciseHours: number;
  heartRate: number;
  cholesterol: number;
  weight: number;
  height: number;
}

export interface PressureStatistics {
  userId: string;
  exerciseHours: number;
  bloodPressureLevel: string;
  weight: number;
  height: number;
}

export interface AnemiaStatistics {
  userId: string;
  exerciseHours: number;
  tookMedication: string;
  hemoglobin?: number;
  ironLevel?: number;
  weight: number;
  height: number;
}

// API service functions
export const statisticsService = {
  // Diabetes Statistics
  getDiabetesStatistics: async (userId: string) => {
    try {
      const response = await api.get(`/diabetes-statistics/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  addDiabetesStatistics: async (data: DiabetesStatistics) => {
    try {
      const response = await api.post('/diabetes-statistics', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateDiabetesStatistics: async (statId: string, data: DiabetesStatistics) => {
    try {
      const response = await api.put(`/diabetes-statistics/${statId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Heart Statistics
  getHeartStatistics: async (userId: string) => {
    try {
      const response = await api.get(`/heart-statistics/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  addHeartStatistics: async (data: HeartStatistics) => {
    try {
      const response = await api.post('/heart-statistics', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateHeartStatistics: async (statId: string, data: HeartStatistics) => {
    try {
      const response = await api.put(`/heart-statistics/${statId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Pressure Statistics
  getPressureStatistics: async (userId: string) => {
    try {
      const response = await api.get(`/pressure-statistics/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  addPressureStatistics: async (data: PressureStatistics) => {
    try {
      const response = await api.post('/pressure-statistics', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updatePressureStatistics: async (statId: string, data: PressureStatistics) => {
    try {
      const response = await api.put(`/pressure-statistics/${statId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Anemia Statistics
  getAnemiaStatistics: async (userId: string) => {
    try {
      const response = await api.get(`/anemia-statistics/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  addAnemiaStatistics: async (data: AnemiaStatistics) => {
    try {
      const response = await api.post('/anemia-statistics', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateAnemiaStatistics: async (statId: string, data: AnemiaStatistics) => {
    try {
      const response = await api.put(`/anemia-statistics/${statId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default statisticsService;
