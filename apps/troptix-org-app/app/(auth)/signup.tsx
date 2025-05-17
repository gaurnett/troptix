import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function Signup() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Signup</Text>
      <Button
        title="Go to Login"
        onPress={() => router.push('/(auth)/login')}
      />
    </View>
  );
}
