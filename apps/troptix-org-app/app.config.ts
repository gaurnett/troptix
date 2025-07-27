import { ConfigContext, ExpoConfig } from 'expo/config';

// const APP_ENVIRONMENT = process.env.APP_VARIANT;
// let googleServicesPlist: string | undefined = './GoogleService-Info.plist';

// if (APP_ENVIRONMENT === 'development') {
//   googleServicesPlist = process.env.GOOGLE_SERVICE_INFO_IOS_DEV;
// } else if (APP_ENVIRONMENT === 'production') {
//   googleServicesPlist = process.env.GOOGLE_SERVICE_INFO_IOS_PROD;
// }

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  owner: 'troptix',
  name: process.env.EXPO_PUBLIC_APP_NAME || 'TropTix Organizer',
  slug: 'troptix-organizer',
  version: '1.1.6',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'troptix',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: false,
    usesAppleSignIn: true,
    googleServicesFile: './GoogleService-Info-Prod.plist',
    bundleIdentifier:
      process.env.EXPO_PUBLIC_APP_BUNDLE || 'com.usetroptix.organizerapp',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    environment: process.env.EXPO_PUBLIC_APP_VARIANT,
    eas: {
      projectId: '5831737d-5d6e-4d8a-84fb-a3e926c92b23',
    },
  },
  plugins: [
    'expo-router',
    'expo-font',
    '@react-native-google-signin/google-signin',
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    'expo-web-browser',
    'expo-apple-authentication',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission:
          'Allow TropTix to access your camera to scan event tickets. This will allow you to validate tickets purchased on our platform for your events.',
      },
    ],
    [
      'expo-build-properties',
      {
        ios: {
          usesAppleSignIn: true,
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
  ],
  experiments: {
    typedRoutes: true,
  },
  updates: {
    url: 'https://u.expo.dev/5831737d-5d6e-4d8a-84fb-a3e926c92b23',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
});
