// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3WSk7xSn2A9rFZpJ3BX9ppmP5NXiTT4U",
  authDomain: "eventplanner-d484a.firebaseapp.com",
  projectId: "eventplanner-d484a",
  storageBucket: "eventplanner-d484a.appspot.com",
  messagingSenderId: "462142306445",
  appId: "1:462142306445:web:a75f7ded3757cb824e8ac4",
  measurementId: "G-E14V655FN7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
