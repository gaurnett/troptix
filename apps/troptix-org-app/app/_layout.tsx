import { auth } from '@/firebaseConfig';
import { Slot, useRouter } from 'expo-router';
import { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<{
  user: User | null;
}>({
  user: null,
});
export const useAuth = () => useContext(AuthContext);

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
    return null; // Or return a <View><Text>Loading...</Text></View> with no Stack
  }

  return (
    <AuthContext.Provider value={{ user }}>
      <Slot />
    </AuthContext.Provider>
  );
}
