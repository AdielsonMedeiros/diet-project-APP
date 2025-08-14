// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABXSvUEO4_JI1GOtr5nduqK3oJpIeyx20",
  authDomain: "diet-33fcc.firebaseapp.com",
  projectId: "diet-33fcc",
  storageBucket: "diet-33fcc.firebasestorage.app",
  messagingSenderId: "625424604319",
  appId: "1:625424604319:web:024c64bf782c52272816aa"
};

// Inicializa apenas uma vez
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);

export { app, auth, db };
