import { useHeaderHeight } from '@react-navigation/elements';
import * as React from 'react';
import { View } from 'react-native';
import { Image } from 'react-native-ui-lib';

export default function SplashScreen() {
  const headerHeight = useHeaderHeight();

  return (
    <View
      style={{
        paddingBottom: headerHeight,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <Image
        resizeMode="cover"
        height={150}
        width={150}
        source={require('../assets/logo/logo_v1.png')}
      />
    </View>
  );
}
