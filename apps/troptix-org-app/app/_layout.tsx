import { isSignedIn } from '@/lib/auth';
import { Slot } from 'expo-router';

export default function RootLayout() {
  const signed = isSignedIn();
  return (
    <Slot
      screenOptions={{ headerShown: false }}
      initialRouteName={signed ? '(tabs)' : '(auth)'}
    />
  );
}
