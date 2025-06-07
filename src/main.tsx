import { StrictMode} from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import the firebaseconfig.ts file to initialize Firebase services
// The import statement itself executes the code inside firebaseconfig.ts
import './data/firebaseConfig.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
  </StrictMode>
);
