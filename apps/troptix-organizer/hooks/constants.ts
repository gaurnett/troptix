import Constants from 'expo-constants';

let url = Constants.expoConfig.extra.apiUrl;

if (__DEV__) {
  // Change to local IP address if you want backend (local build)
  url = "http://192.168.1.214:3001"
  // url = "https://troptix-git-dev-flowersgaurnett-gmailcom.vercel.app"
}

export const prodUrl = url;