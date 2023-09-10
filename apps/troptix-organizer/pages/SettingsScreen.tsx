import * as React from 'react';
import { Text, View } from 'react-native-ui-lib';

export default function SettingsScreen({ route }) {
  const { user } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}