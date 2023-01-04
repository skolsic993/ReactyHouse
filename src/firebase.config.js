import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBhhXfZhzYxkl6fpuV_9rX4G2tnECiEqYY',
  authDomain: 'reactyhouse.firebaseapp.com',
  projectId: 'reactyhouse',
  storageBucket: 'reactyhouse.appspot.com',
  messagingSenderId: '229386820017',
  appId: '1:229386820017:web:0bdf4ccd07fb2c3c8b8590',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore();
