// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFY6HRDSpprEHbuCQF9vj3-oKGEdDjVAA",
  authDomain: "mern-auth-e3afd.firebaseapp.com",
  projectId: "mern-auth-e3afd",
  storageBucket: "mern-auth-e3afd.appspot.com",
  messagingSenderId: "356072878168",
  appId: "1:356072878168:web:6057679c50e0eb88ae1a2d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const  auth = getAuth(app);