import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBSUkof0DXLkahOBQ8DBmb5hL7Gw2zszEY',
  authDomain: 'troptix.firebaseapp.com',
  projectId: 'troptix',
  storageBucket: 'troptix.appspot.com',
  messagingSenderId: '912947419048',
  appId: '1:912947419048:web:d68102e2979581fc6c6f9d',
  measurementId: 'G-21GRJK36QN',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
