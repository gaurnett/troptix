import { getAuth } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { Button, View } from 'react-native';

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
      <Button
        title="Sign Out"
        onPress={async () => {
          await getAuth().signOut();
          router.replace('/(auth)');
        }}
      />
    </View>
  );
}
