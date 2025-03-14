import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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
// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export { collection, addDoc, query, where, getDocs, updateDoc, doc };