// import { REACT_APP_FIREBASE_API_KEY, REACT_APP_FIREBASE_APP_ID, REACT_APP_FIREBASE_AUTH_DOMAIN, REACT_APP_FIREBASE_MEASUREMENT_ID, REACT_APP_FIREBASE_MESSAGING_SENDER_ID, REACT_APP_FIREBASE_PROJECT_ID, REACT_APP_FIREBASE_STORAGE_BUCKET } from "@env";
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// import * as firebase from "firebase/app";
// import { initializeApp } from "firebase/app";
// import { getReactNativePersistence, initializeAuth } from "firebase/auth";
// import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: REACT_APP_FIREBASE_API_KEY,
//   authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: REACT_APP_FIREBASE_APP_ID,
//   measurementId: REACT_APP_FIREBASE_MEASUREMENT_ID,
// };

// // Initialize Firebase
// const firebaseApp = firebase.getApps().length === 0 ? initializeApp(firebaseConfig) : firebase.getApp();
// const auth = initializeAuth(firebaseApp, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });
// const storage = getStorage(firebaseApp);

// export { auth, firebaseApp, getDownloadURL, ref, storage, uploadBytesResumable };
