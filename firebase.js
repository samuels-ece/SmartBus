// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOTZqI8Iwp2YcONs_hABfl3qq1OJP4yGs",
  authDomain: "smartbus-523f4.firebaseapp.com",
  projectId: "smartbus-523f4",
  storageBucket: "smartbus-523f4.firebasestorage.app",
  messagingSenderId: "149259994989",
  appId: "1:149259994989:web:e1d97112a11f8b454e7c64"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
