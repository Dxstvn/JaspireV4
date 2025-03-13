import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAEnTHpQpcgzWvDfiusF90-beSGCz5pva8",
    authDomain: "jaspirev4-2f12a.firebaseapp.com",
    projectId: "jaspirev4-2f12a",
    storageBucket: "jaspirev4-2f12a.firebasestorage.app",
    messagingSenderId: "960491714548",
    appId: "1:960491714548:web:f1b418ffaddd0ba2cc2ba1",
    measurementId: "G-07NYQBYP9N"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);