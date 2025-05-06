
  // src/config.ts
interface DeepInfraConfig {
    API_KEY: string;
    API_URL: string;
    DEFAULT_MODEL: string;
  }
  
  export const DEEPINFRA_CONFIG: DeepInfraConfig = {
    API_KEY: import.meta.env.VITE_DEEPINFRA_API_KEY || '',
    API_URL: import.meta.env.VITE_DEEPINFRA_API_URL || 'https://api.deepinfra.com/v1/inference',
    DEFAULT_MODEL: 'meta-llama/Meta-Llama-3-70B-Instruct'
  };