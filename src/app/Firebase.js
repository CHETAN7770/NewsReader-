// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAB8aZ6OOAZcDROgr1bAdiastCBMJ5sh6U",
  authDomain: "news-project-214dc.firebaseapp.com",
  projectId: "news-project-214dc",
  storageBucket: "news-project-214dc.appspot.com",
  messagingSenderId: "94661208551",
  appId: "1:94661208551:web:cefa1577ede0e2886d3542",
  measurementId: "G-WNM6LYF3E0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app)
export const db = getFirestore(app);