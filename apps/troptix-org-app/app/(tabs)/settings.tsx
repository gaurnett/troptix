import { signOut } from '@/lib/auth';
import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function Settings() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <Text>Settings</Text>
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
          router.replace('/(auth)/login');
        }}
      />
    </View>
  );
}
