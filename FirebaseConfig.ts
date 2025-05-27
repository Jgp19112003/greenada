// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  sendPasswordResetEmail, // Add this import
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3GdqYXcZupNM3rXXQX-HNY3NkCQHd0RY",
  authDomain: "greenada-46a1a.firebaseapp.com",
  projectId: "greenada-46a1a",
  storageBucket: "greenada-46a1a.firebasestorage.app",
  messagingSenderId: "819733023905",
  appId: "1:819733023905:web:8cb51a56d1104c722b74e0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Export sendPasswordResetEmail for use in other files
export { sendPasswordResetEmail };
export const db = getFirestore(app);
