import { getAuth } from 'firebase/auth';
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
          getAuth().signOut();
        }}
      />
    </View>
  );
}
