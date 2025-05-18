import { auth } from '@/firebaseConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const AuthContext = createContext<{
  user: User | null;
}>({
  user: null,
});
export const useAuth = () => useContext(AuthContext);
const queryClient = new QueryClient();

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="event/details"
            options={{
              headerTitle: 'Event Details',
              headerShown: true,
              headerBackButtonDisplayMode: 'generic',
            }}
          />
        </Stack>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
