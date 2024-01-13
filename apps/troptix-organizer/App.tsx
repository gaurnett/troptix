import 'expo-dev-client';
import 'react-native-gesture-handler';

import auth from '@react-native-firebase/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { User, initializeUser } from './hooks/types/User';
import AppNavigator from './pages/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

const user: User = {
  id: '',
  jwtToken: ''
};

export const TropTixContext = createContext({
  user: user
});
const queryClient = new QueryClient();

export default function App() {
  const [user, setUser] = useState<User>();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const unsubscribeFromAuthStateChange = auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        let currentUser = await initializeUser(firebaseUser);
        setUser(currentUser);
      } else {
        setUser(undefined);
      }

      await SplashScreen.hideAsync();
      setAppIsReady(true);
    });

    return unsubscribeFromAuthStateChange;
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TropTixContext.Provider
        value={{
          user: user as User,
        }}>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </TropTixContext.Provider>
    </QueryClientProvider>
  );
}
