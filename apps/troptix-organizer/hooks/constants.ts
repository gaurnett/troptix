import Constants from 'expo-constants';

let url = Constants.expoConfig.extra.apiUrl;

if (__DEV__) {
  // Change to local IP address if you want backend (local build)
  url = "http://192.168.100.223:3000"
  // url = "https://troptix-git-dev-flowersgaurnett-gmailcom.vercel.app"
}

export const prodUrl = url;