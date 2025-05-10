import axios, { AxiosRequestConfig, AxiosError } from 'axios';

// First version of the API service
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
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');

    // Ensure headers are defined
    if (!config.headers) {
      config.headers = {};
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Unified Error Handler
const handleError = (error: AxiosError) => {
  console.error('API Error:', error.response?.data || error.message);
  throw error.response?.data || error.message;
};

// Unified Request Handler
const request = async (method: 'get' | 'post' | 'put', url: string, data?: any) => {
  try {
    const response = await api[method](url, data);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

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
  getDiabetesStatistics: (userId: string) => request('get', `/diabetes-statistics/user/${userId}`),
  addDiabetesStatistics: (data: DiabetesStatistics) => request('post', '/diabetes-statistics', data),
  updateDiabetesStatistics: (statId: string, data: DiabetesStatistics) =>
    request('put', `/diabetes-statistics/${statId}`, data),

  // Heart Statistics
  getHeartStatistics: (userId: string) => request('get', `/heart-statistics/user/${userId}`),
  addHeartStatistics: (data: HeartStatistics) => request('post', '/heart-statistics', data),
  updateHeartStatistics: (statId: string, data: HeartStatistics) =>
    request('put', `/heart-statistics/${statId}`, data),

  // Pressure Statistics
  getPressureStatistics: (userId: string) => request('get', `/pressure-statistics/user/${userId}`),
  addPressureStatistics: (data: PressureStatistics) => request('post', '/pressure-statistics', data),
  updatePressureStatistics: (statId: string, data: PressureStatistics) =>
    request('put', `/pressure-statistics/${statId}`, data),

  // Anemia Statistics
  getAnemiaStatistics: (userId: string) => request('get', `/anemia-statistics/user/${userId}`),
  addAnemiaStatistics: (data: AnemiaStatistics) => request('post', '/anemia-statistics', data),
  updateAnemiaStatistics: (statId: string, data: AnemiaStatistics) =>
    request('put', `/anemia-statistics/${statId}`, data),
};

// Second version of the API service (duplicate with different variable names)
const API_BASE_URL_V2 = 'https://your-api-url.com/api';

const apiV2 = axios.create({
  baseURL: API_BASE_URL_V2,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiV2.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');

    if (!config.headers) {
      config.headers = {};
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const handleErrorV2 = (error: AxiosError) => {
  console.error('API Error:', error.response?.data || error.message);
  throw error.response?.data || error.message;
};

const requestV2 = async (method: 'get' | 'post' | 'put', url: string, data?: any) => {
  try {
    const response = await apiV2[method](url, data);
    return response.data;
  } catch (error) {
    handleErrorV2(error as AxiosError);
  }
};

export interface DiabetesStatisticsV2 {
  userId: string;
  exerciseHours: number;
  bloodSugarLevel: number;
  weight: number;
  height: number;
}

export interface HeartStatisticsV2 {
  userId: string;
  exerciseHours: number;
  heartRate: number;
  cholesterol: number;
  weight: number;
  height: number;
}

export interface PressureStatisticsV2 {
  userId: string;
  exerciseHours: number;
  bloodPressureLevel: string;
  weight: number;
  height: number;
}

export interface AnemiaStatisticsV2 {
  userId: string;
  exerciseHours: number;
  tookMedication: string;
  hemoglobin?: number;
  ironLevel?: number;
  weight: number;
  height: number;
}

export const statisticsServiceV2 = {
  getDiabetesStatistics: (userId: string) => requestV2('get', `/diabetes-statistics/user/${userId}`),
  addDiabetesStatistics: (data: DiabetesStatisticsV2) => requestV2('post', '/diabetes-statistics', data),
  updateDiabetesStatistics: (statId: string, data: DiabetesStatisticsV2) =>
    requestV2('put', `/diabetes-statistics/${statId}`, data),

  getHeartStatistics: (userId: string) => requestV2('get', `/heart-statistics/user/${userId}`),
  addHeartStatistics: (data: HeartStatisticsV2) => requestV2('post', '/heart-statistics', data),
  updateHeartStatistics: (statId: string, data: HeartStatisticsV2) =>
    requestV2('put', `/heart-statistics/${statId}`, data),

  getPressureStatistics: (userId: string) => requestV2('get', `/pressure-statistics/user/${userId}`),
  addPressureStatistics: (data: PressureStatisticsV2) => requestV2('post', '/pressure-statistics', data),
  updatePressureStatistics: (statId: string, data: PressureStatisticsV2) =>
    requestV2('put', `/pressure-statistics/${statId}`, data),

  getAnemiaStatistics: (userId: string) => requestV2('get', `/anemia-statistics/user/${userId}`),
  addAnemiaStatistics: (data: AnemiaStatisticsV2) => requestV2('post', '/anemia-statistics', data),
  updateAnemiaStatistics: (statId: string, data: AnemiaStatisticsV2) =>
    requestV2('put', `/anemia-statistics/${statId}`, data),
};

export default statisticsService;