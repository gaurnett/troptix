import 'react-native-gesture-handler';

import { createContext, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { auth } from 'troptix-firebase';
import { initializeUser } from './hooks/types/User';
import AppNavigator from './pages/navigation/AppNavigator';

const user = {
  id: '',
  jwtToken: ''
};

export const TropTixContext = createContext();
const queryClient = new QueryClient();

export default function App() {
  const [user, setUser] = useState();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribeFromAuthStateChange = auth.onAuthStateChanged(async user => {
      if (user) {
        let currentUser = await initializeUser(user);
        setUser(currentUser);
        setIsLoadingUser(false);
      } else {
        setUser(null);
        setIsLoadingUser(false);
      }
    });

    return unsubscribeFromAuthStateChange;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TropTixContext.Provider
        value={{
          user: user,
        }}>
        <SafeAreaProvider>
          <AppNavigator isLoadingUser={isLoadingUser} user={user} />
        </SafeAreaProvider>
      </TropTixContext.Provider>
    </QueryClientProvider>
  );
}
