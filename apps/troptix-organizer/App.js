import 'expo-dev-client';
import 'react-native-gesture-handler';

import auth from '@react-native-firebase/auth';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { initializeUser } from './hooks/types/User';
import AppNavigator from './pages/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

const user = {
  id: '',
  jwtToken: ''
};

export const TropTixContext = createContext();
const queryClient = new QueryClient();

export default function App() {
  const [user, setUser] = useState();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const unsubscribeFromAuthStateChange = auth().onAuthStateChanged(async user => {
      if (user) {
        let currentUser = await initializeUser(user);
        setUser(currentUser);
      } else {
        setUser(null);
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
          user: user,
        }}>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </TropTixContext.Provider>
    </QueryClientProvider>
  );
}
