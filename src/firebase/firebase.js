import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
} from "firebase/firestore";

/* 🔥 Firebase config */
const firebaseConfig = {
  apiKey: "AIzaSyCjx9-CMgJHOVP3UDddo371ku-MmNsQca0",
  authDomain: "gen-lang-client-0088318361.firebaseapp.com",
  projectId: "gen-lang-client-0088318361",
  storageBucket: "gen-lang-client-0088318361.firebasestorage.app",
  messagingSenderId: "226771867764",
  appId: "1:226771867764:web:f04b3b51fd14188c819921",
  measurementId: "G-1QL842VFJ7",
};

/* ✅ Initialize app FIRST */
const app = initializeApp(firebaseConfig);

/* ✅ Auth */
export const auth = getAuth(app);

/* ✅ Firestore WITH offline cache */
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});
