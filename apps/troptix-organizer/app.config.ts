import { ConfigContext, ExpoConfig } from 'expo/config';

// first get variabele
const APP_ENVIRONMENT = process.env.APP_VARIANT;// let's declare variable to store the Google service file.
let googleServicesPlist = "./GoogleService-Info.plist"; // while developing this file will be the default.
let apiUrl = "Hello World";

// then checking which env we are, and based on that choosing
// the right Google services file to add
if (APP_ENVIRONMENT === "development") {
  googleServicesPlist = process.env.GOOGLE_SERVICE_INFO_IOS_DEV;
  apiUrl = "https://troptix-git-dev-flowersgaurnett-gmailcom.vercel.app";
} else if (APP_ENVIRONMENT === "preview") {
  googleServicesPlist = process.env.GOOGLE_SERVICE_INFO_IOS_DEV;
  apiUrl = "https://troptix-git-dev-flowersgaurnett-gmailcom.vercel.app";
} else if (APP_ENVIRONMENT === "preprod") {
  googleServicesPlist = process.env.GOOGLE_SERVICE_INFO_IOS_DEV;
  apiUrl = "https://troptix-git-dev-flowersgaurnett-gmailcom.vercel.app";
} else if (APP_ENVIRONMENT === "prod") {
  googleServicesPlist = process.env.GOOGLE_SERVICE_INFO_IOS_DEV;
  apiUrl = "https://troptix-git-dev-flowersgaurnett-gmailcom.vercel.app";
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  version: '1.0.4',
  slug: 'troptix-organizer',
  icon: './assets/icon.png',
  name: process.env.APP_NAME || 'TropTix Organizer',
  ios: {
    supportsTablet: true,
    usesAppleSignIn: true,
    googleServicesFile: googleServicesPlist,
    bundleIdentifier: process.env.APP_BUNDLE || "com.usetroptix.organizerapp",
  },
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  extra: {
    apiUrl: apiUrl,
    environment: process.env.APP_VARIANT,
    test: "test",
    eas: {
      projectId: "5831737d-5d6e-4d8a-84fb-a3e926c92b23"
    }
  },
  plugins: [
    [
      "@react-native-firebase/app",
      "@react-native-firebase/auth"
    ],
    [
      "expo-image-picker",
      {
        "photosPermission": "The app accesses your photos to let you share photos with users."
      }
    ],
    [
      "expo-barcode-scanner",
      {
        "cameraPermission": "Allow TropTix to access your camera to scan event tickets. This will allow you to validate tickets purchased on our platform for your events."
      }
    ],
    [
      "@react-native-google-signin/google-signin"
    ],
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 31,
          targetSdkVersion: 31,
          buildToolsVersion: '31.0.0',
        },
        ios: {
          deploymentTarget: '13.4',
          useFrameworks: "static"
        },
      },
    ],
    ["expo-apple-authentication"],
  ],
});
