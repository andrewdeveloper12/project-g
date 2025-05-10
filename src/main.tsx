import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import App from '../src/App';
import './index.css';
import { translations } from './i18n/translations';

i18next.init({
  resources: {
    en: { translation: translations.en },
    ar: { translation: translations.ar }
  },
  lng: 'en',
  fallbackLng: 'en',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </StrictMode>
);