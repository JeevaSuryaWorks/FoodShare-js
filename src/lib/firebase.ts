import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCI3Tx5_3m5frFZtMy-fu0f7zyzJUc2v-c",
  authDomain: "foodshare-js.firebaseapp.com",
  projectId: "foodshare-js",
  storageBucket: "foodshare-js.firebasestorage.app",
  messagingSenderId: "774953160212",
  appId: "1:774953160212:web:7d3ccbc38db06cff922101",
  measurementId: "G-1ZVMG58VS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
