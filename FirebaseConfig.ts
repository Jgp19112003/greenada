import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  sendPasswordResetEmail,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3GdqYXcZupNM3rXXQX-HNY3NkCQHd0RY",
  authDomain: "greenada-46a1a.firebaseapp.com",
  projectId: "greenada-46a1a",
  storageBucket: "greenada-46a1a.firebasestorage.app",
  messagingSenderId: "819733023905",
  appId: "1:819733023905:web:8cb51a56d1104c722b74e0",
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { sendPasswordResetEmail };
export const db = getFirestore(app);
