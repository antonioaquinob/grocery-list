import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCLOEmeRHUqwDvbMT00suHpYKsTZro-K8g",
  authDomain: "grocerylistapp-9ac73.firebaseapp.com",
  projectId: "grocerylistapp-9ac73",
  storageBucket: "grocerylistapp-9ac73.appspot.com",
  messagingSenderId: "126909212415",
  appId: "1:126909212415:web:629fd62c2b0a55a8300eca",
  measurementId: "G-6C1QR0RCDV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export the Firestore database instance
export { db };
