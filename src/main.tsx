import { StrictMode} from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './data/firebaseConfig.ts';
import './config/i18n.ts';
import { LanguageProvider } from './context/languageContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);
