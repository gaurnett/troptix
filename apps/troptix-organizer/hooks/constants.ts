import Constants from 'expo-constants';

let url = Constants.expoConfig.extra.apiUrl;

if (__DEV__) {
  // Change to local IP address if you want backend (local build)
  // url = "http://192.168.100.138:3001"
}

export const prodUrl = url;