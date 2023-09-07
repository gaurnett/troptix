import * as React from 'react';
import { Keyboard, SafeAreaView, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Button, Colors, Image, Text, TextField, View } from 'react-native-ui-lib';
import { greeting } from 'cool-package';

export default function SignInScreen({ navigation }) {
  function navigateToMainScreen() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainAppScreen' }],
    });
  }

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}>
      <View paddingR-32 paddingL-32 style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
        <Image
          resizeMode='cover'
          height={150}
          width={150}
          source={require('../assets/logo/logo_v1.png')} />
        <Text marginT-16 marginB-16 text50 $textDefault>
          Welcome to TropTix Organizer {greeting}
        </Text>
        <View marginT-16 paddingT-6 paddingL-8 style={{ height: 50, width: '100%', borderWidth: 0.5, borderColor: '#D3D3D3' }}>
          <TextField
            label='Full name'
            labelColor={Colors.black}
            enableErrors
            validate={['required', 'email', (value) => value.length > 6]}
            validationMessage={['Field is required', 'Email is invalid', 'Password is too short']}
          />
        </View>

        <View marginT-16 paddingT-6 paddingL-8 style={{ height: 50, width: '100%', borderWidth: 0.5, borderColor: '#D3D3D3' }}>
          <TextField
            label='Email address'
            labelColor={Colors.black}
            enableErrors
            validate={['required', 'email', (value) => value.length > 6]}
            validationMessage={['Field is required', 'Email is invalid', 'Password is too short']}
          />
        </View>

        <View marginT-16 paddingT-6 paddingL-8 style={{ height: 50, width: '100%', borderWidth: 0.5, borderColor: '#D3D3D3' }}>
          <TextField
            label='Password'
            labelColor={Colors.black}
            secureTextEntry={true}
            enableErrors
            validate={['required', 'email', (value) => value.length > 6]}
            validationMessage={['Field is required', 'Email is invalid', 'Password is too short']}
          />
        </View>

        <Button
          onPress={() => navigateToMainScreen()}
          marginT-16
          borderRadius={25}
          color={Colors.white}
          style={{ backgroundColor: '#FF7043', height: 50, width: '100%' }}>
          <Text style={{ color: '#ffffff', fontSize: 16 }} marginL-10>Sign Up</Text>
        </Button>

        <View marginT-24 marginB-24 style={{ flexDirection: 'row', alignItems: 'center', width: 300 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
          <View>
            <Text style={{ width: 50, textAlign: 'center' }}>OR</Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
        </View>

        <Button
          backgroundColor={Colors.orange30}
          borderRadius={25}
          style={{ backgroundColor: '#2196F3', height: 50, width: '100%' }}>
          <Image source={require('../assets/logo/email.png')} tintColor={Colors.white} width={24} height={24} />
          <Text style={{ color: '#ffffff', fontSize: 16 }} marginL-10>Sign In with Email</Text>
        </Button>

        <Button marginT-16 outline borderRadius={25} outlineColor={Colors.grey30} style={{ height: 50, width: '100%' }}>
          <Image source={require('../assets/logo/google.png')} width={24} height={24} />
          <Text style={{ fontSize: 16 }} marginL-10>Sign In with Google</Text>
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
}