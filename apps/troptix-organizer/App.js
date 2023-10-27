import 'react-native-gesture-handler';

import { useState, useEffect, createContext } from 'react';
import { auth } from 'troptix-firebase';
import AppNavigator from './pages/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getUsers, GetUsersType } from 'troptix-api';
import { User, setUserFromResponse } from 'troptix-models';

export const TropTixContext = createContext();

export default function App() {
  const [user, setUser] = useState(new User());
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    async function fetchUser(user) {
      try {
        const getUsersRequest = {
          getUsersType: GetUsersType.GET_USERS_BY_ID,
          userId: user.uid
        };

        const response = await getUsers(getUsersRequest);
        let currentUser = setUserFromResponse(response.response, user);

        setUser(prevUser => ({ ...prevUser, currentUser }));
        setIsLoadingUser(false);
      } catch (error) {
        let currentUser = setUserFromResponse(null, user);

        setUser(prevUser => ({ ...prevUser, currentUser }));
        setIsLoadingUser(false);
        console.log("TropTix Organizer: " + error);
      }
    }

    const unsubscribeFromAuthStateChange = auth.onAuthStateChanged(user => {
      if (user) {
        fetchUser(user);
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
