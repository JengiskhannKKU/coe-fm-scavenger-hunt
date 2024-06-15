// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA07nWInzHy8AWPzvewtPQNlF7omeoOeVw",
  authDomain: "coe-fm---scavenger-hunt.firebaseapp.com",
  projectId: "coe-fm---scavenger-hunt",
  storageBucket: "coe-fm---scavenger-hunt.appspot.com",
  messagingSenderId: "696090947554",
  appId: "1:696090947554:web:b21e1110cbb560523113bb",
  measurementId: "G-3HC8XZQGT7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export default db;