// import { REACT_APP_FIREBASE_API_KEY, REACT_APP_FIREBASE_APP_ID, REACT_APP_FIREBASE_AUTH_DOMAIN, REACT_APP_FIREBASE_MEASUREMENT_ID, REACT_APP_FIREBASE_MESSAGING_SENDER_ID, REACT_APP_FIREBASE_PROJECT_ID, REACT_APP_FIREBASE_STORAGE_BUCKET } from "@env";
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: REACT_APP_FIREBASE_API_KEY,
//   authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: REACT_APP_FIREBASE_APP_ID,
//   measurementId: REACT_APP_FIREBASE_MEASUREMENT_ID,
// };

// let fApp, fAuth;
// if (!getApps().length) {
//   try {
//     fApp = initializeApp(firebaseConfig);
//     fAuth = initializeAuth(fApp, {
//       persistence: getReactNativePersistence(ReactNativeAsyncStorage),
//     });
//   } catch (error) {
//     console.log("Error initializing app: " + error);
//   }
// } else {
//   fApp = getApp();
//   fAuth = getAuth(fApp);
// }

// let firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// export const app = fApp;
// export const auth = fAuth;
// export const storage = getStorage(firebaseApp);

// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import * as firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

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

export { auth, firebaseApp, getDownloadURL, ref, storage, uploadBytesResumable };
