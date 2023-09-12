import * as React from 'react';
import { Text, View } from 'react-native';
import { Image } from 'react-native-ui-lib';

export default function SplashScreen() {
  return (
    <View style={{ height: "100%", width: "100%", flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <Image
        resizeMode='cover'
        height={150}
        width={150}
        source={require('../../assets/logo/logo_v1.png')} />
    </View>
  );
}