import 'react-native-gesture-handler';

import { createContext, useEffect, useState } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { auth } from 'troptix-firebase';
import { getUser, TropTixResponse } from 'troptix-api';
import { User, setUserFromResponse } from 'troptix-models';
import AppNavigator from './pages/navigation/AppNavigator';

export const TropTixContext = createContext();

export default function App() {
  const [user, setUser] = useState(new User());
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    async function fetchUser(id) {
      const response = await getUser(id);
      let currentUser = setUserFromResponse(response.response);

      setUser(prevUser => ({ ...prevUser, currentUser }));
      setIsLoadingUser(false);
    }

    const unsubscribeFromAuthStateChange = auth.onAuthStateChanged(user => {
      if (user) {
        fetchUser(user.uid);
      } else {
        setUser(undefined);
        setIsLoadingUser(false);
      }
    });

    return unsubscribeFromAuthStateChange;
  }, []);

  return (
    <TropTixContext.Provider value={user === undefined ? [] : [user.currentUser, setUser]}>
      <SafeAreaProvider>
        <AppNavigator isLoadingUser={isLoadingUser} user={user} />
      </SafeAreaProvider>
    </TropTixContext.Provider>

  );
}
