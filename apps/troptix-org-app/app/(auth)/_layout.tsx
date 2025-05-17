import { Stack } from 'expo-router';

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
  // return (
  //   <Stack>
  //     <Stack.Screen name="auth" options={{ headerShown: false }} />
  //   </Stack>
  // );
}
