// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getInstallations } from 'firebase/installations'; // <-- Import the Installations SDK!
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

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
// Initialize Analytics and get a reference to the service
getInstallations(app); // <-- Initialize Installations here!

// Now Initialize Analytics
const analytics = getAnalytics(app); // <-- This should now work!

// Get reference to Firestore
const db = getFirestore(app);

// Export the Firestore instance
export { db, analytics };

// Initialize Installations (even if you don't store/use the 'installations' variable directly)
// Importing getInstallations and potentially calling it helps ensure the service is registered.
