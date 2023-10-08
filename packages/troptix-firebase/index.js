// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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
const storage = getStorage(firebaseApp);

export { firebaseApp, auth, storage, ref, uploadBytesResumable, getDownloadURL };