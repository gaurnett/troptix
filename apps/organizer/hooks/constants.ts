import Constants from 'expo-constants';

const environment = Constants.expoConfig?.extra?.environment;

const extraApiUrl =
  Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL;
let apiUrl = extraApiUrl || 'https://www.usetroptix.com';

if (environment === 'development' || __DEV__) {
  apiUrl = `http://${window.location.hostname}:3000`;
}

export const prodUrl = apiUrl;
