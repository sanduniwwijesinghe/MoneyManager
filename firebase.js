// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe6ZvUsFJJbkgMPXwNHgkClrjvQnpt2Po",
  authDomain: "expense-manager-7c8e4.firebaseapp.com",
  projectId: "expense-manager-7c8e4",
  storageBucket: "expense-manager-7c8e4.appspot.com",
  messagingSenderId: "38489410918",
  appId: "1:38489410918:web:4c3986e56e7a4097458ca7",
  measurementId: "G-VGVYRMB8RT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
