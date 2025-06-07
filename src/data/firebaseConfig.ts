import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics only if in browser
let analytics: any;
if (typeof window !== 'undefined') {
  // Dynamically import analytics to avoid SSR issues
  import('firebase/analytics')
    .then(() => {
      // Import getAnalytics from the dynamically imported module
      import('firebase/analytics').then(({ getAnalytics }) => {
        analytics = getAnalytics(app);
      });
    })
    .catch((error) => {
      console.error('Failed to initialize Analytics:', error);
    });
}

export { app, db, analytics };

