import { initializeApp } from "firebase/app";

// Copy this file in environments.ts
// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
