import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDQ6nLMn4H_YHYMo0m5w-IQKFY_FwYRMG8",
  authDomain: "globalbanquetes-52807.firebaseapp.com",
  projectId: "globalbanquetes-52807",
  storageBucket: "globalbanquetes-52807.firebasestorage.app",
  messagingSenderId: "298809531428",
  appId: "1:298809531428:web:12c0c82832e4110f344cb1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);