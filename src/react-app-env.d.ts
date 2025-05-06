/// <reference types="react-scripts" />

interface ImportMetaEnv {
    readonly REACT_APP_OPENAI_API_KEY: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
