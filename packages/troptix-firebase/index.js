// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2WcAvjMfpbh9EMVkHHAC-GDT8tN-NKPs",
  authDomain: "troptix.firebaseapp.com",
  projectId: "troptix",
  storageBucket: "troptix.appspot.com",
  messagingSenderId: "912947419048",
  appId: "1:912947419048:web:6fd58f0a1f1af5d06c6f9d",
  measurementId: "G-G0LS555QYM"
};

// Initialize Firebase
const firebaseApp = firebase.getApps().length === 0 ? initializeApp(firebaseConfig) : firebase.getApp();
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { firebaseApp, auth };