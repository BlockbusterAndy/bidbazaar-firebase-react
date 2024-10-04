add your firebase config in a file named firebase.js in this folder

Example - 

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "your_key",
  authDomain: "your_key",
  projectId: "your_key",
  storageBucket: "your_key",
  messagingSenderId: "your_key",
  appId: "your_key",
  measurementId: "your_key"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, db, storage };