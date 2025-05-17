import { signIn } from '@/lib/auth';
import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function Login() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login</Text>
      <Button
        title="Login"
        onPress={() => {
          signIn();
          router.replace('/(tabs)');
        }}
      />
    </View>
  );
}
