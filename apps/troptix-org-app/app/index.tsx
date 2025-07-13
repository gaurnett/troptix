import { Redirect } from 'expo-router';
import { useAuth } from './_layout';

export default function App() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)" />;
  }
}
