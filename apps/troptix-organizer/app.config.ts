import { ConfigContext, ExpoConfig } from 'expo/config';

// first get variabele
const APP_ENVIRONMENT = process.env.APP_VARIANT; // let's declare variable to store the Google service file.
let googleServicesPlist: string | undefined = './GoogleService-Info.plist'; // while developing this file will be the default.
let webClientId: string | undefined =
  '912947419048-sark3aqudtojmsci3tk9c6p5ud9o7aes.apps.googleusercontent.com';
let apiUrl = 'http://192.168.100.123:3000';

// PROD PUSH
googleServicesPlist = './GoogleService-Info-Prod.plist';
webClientId =
  '801810211842-jh1pm61f0lq9fvuhvrug0pnir9g2kill.apps.googleusercontent.com';
apiUrl = 'https://usetroptix.com';

// then checking which env we are, and based on that choosing
// the right Google services file to add
if (APP_ENVIRONMENT === 'development') {
  googleServicesPlist = process.env.GOOGLE_SERVICE_INFO_IOS_DEV;
  webClientId = process.env.WEB_CLIENT_ID;
  apiUrl = 'https://troptix-web-s5n5-git-main-troptix.vercel.app';
} else if (APP_ENVIRONMENT === 'preview') {
  googleServicesPlist = process.env.GOOGLE_SERVICE_INFO_IOS_DEV;
  webClientId = process.env.WEB_CLIENT_ID;
  apiUrl = 'https://troptix-web-s5n5-git-main-troptix.vercel.app';
} else if (APP_ENVIRONMENT === 'preprod') {
  googleServicesPlist = process.env.GOOGLE_SERVICE_INFO_IOS_DEV;
  webClientId = process.env.WEB_CLIENT_ID;
  apiUrl = 'https://troptix-web-s5n5-git-main-troptix.vercel.app';
} else if (APP_ENVIRONMENT === 'prod') {
  googleServicesPlist = process.env.GOOGLE_SERVICE_INFO_IOS_PROD;
  webClientId = process.env.WEB_CLIENT_ID;
  apiUrl = 'https://usetroptix.com';
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  version: '1.1.3',
  slug: 'troptix-organizer',
  icon: './assets/icon.png',
  name: process.env.APP_NAME || 'TropTix Organizer',
  ios: {
    supportsTablet: false,
    usesAppleSignIn: true,
    googleServicesFile: googleServicesPlist,
    bundleIdentifier: process.env.APP_BUNDLE || 'com.usetroptix.organizerapp',
  },
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  extra: {
    apiUrl: apiUrl,
    webClientId: webClientId,
    environment: process.env.APP_VARIANT,
    test: 'test',
    eas: {
      projectId: '5831737d-5d6e-4d8a-84fb-a3e926c92b23',
    },
  },
  plugins: [
    ['@react-native-firebase/app', '@react-native-firebase/auth'],
    [
      'expo-image-picker',
      {
        photosPermission:
          'The app accesses your photos to let you share photos with users.',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission:
          'Allow TropTix to access your camera to scan event tickets. This will allow you to validate tickets purchased on our platform for your events.',
      },
    ],
    ['@react-native-google-signin/google-signin'],
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 31,
          targetSdkVersion: 31,
          buildToolsVersion: '31.0.0',
        },
        ios: {
          deploymentTarget: '15.1',
          useFrameworks: 'static',
          infoPlist: {
            ITSAppUsesNonExemptEncryption: false,
          },
          entitlements: {
            'aps-environment': 'production',
          },
        },
      },
    ],
    ['expo-apple-authentication'],
  ],
});
