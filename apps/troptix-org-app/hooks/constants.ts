import Constants from 'expo-constants';

const environment = Constants.expoConfig?.extra?.environment;

const extraApiUrl =
  Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL;
let apiUrl = extraApiUrl || 'https://usetroptix.com';

if (environment === 'development') {
  apiUrl = 'http://192.168.1.207:3000';
}

export const prodUrl = apiUrl;
