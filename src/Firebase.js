// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBqdbvkTSZottfxqYLZ7toBmj7sM0ukK_8',
  authDomain: 'gaiax-ssi.firebaseapp.com',
  projectId: 'gaiax-ssi',
  storageBucket: 'gaiax-ssi.appspot.com',
  messagingSenderId: '28990700821',
  appId: '1:28990700821:web:73ef78443717611140bd1c',
  measurementId: 'G-2MCTYRRJV5',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
