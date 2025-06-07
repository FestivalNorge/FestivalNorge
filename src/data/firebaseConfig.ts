// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics"; // Keep isSupported if you like, but it's not needed for the core error
import { getInstallations } from 'firebase/installations';

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

// Initialize Installations FIRST (Analytics needs it)
// No need for window check for standard web app on GH Pages
const installations = getInstallations(app);

// Initialize Analytics AFTER Installations
// You can keep the isSupported check if desired, but it won't fix the core issue
let analytics: any;
isSupported().then(yes => {
   if (yes) {
     analytics = getAnalytics(app);
   }
});


// Get reference to Firestore
const db = getFirestore(app);


export { app, db, analytics, installations };

