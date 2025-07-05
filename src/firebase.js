// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIcspFi9KVFf0M54r0jjuv517vRQ9lP-4",
  authDomain: "location-sharing-app-16cac.firebaseapp.com",
  databaseURL:
    "https://location-sharing-app-16cac-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "location-sharing-app-16cac",
  storageBucket: "location-sharing-app-16cac.firebasestorage.app",
  messagingSenderId: "641112495972",
  appId: "1:641112495972:web:cc03e56a5e33f29736cc71",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
