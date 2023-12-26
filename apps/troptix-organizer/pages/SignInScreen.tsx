import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useHeaderHeight } from '@react-navigation/elements';
import * as React from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Button, Colors, Image, Text, View } from 'react-native-ui-lib';

export default function SignInScreen({ navigation }) {
  GoogleSignin.configure({
    webClientId: '912947419048-sark3aqudtojmsci3tk9c6p5ud9o7aes.apps.googleusercontent.com',
  });

  const headerHeight = useHeaderHeight();

  console.log("URL: " + process.env.APP_VARIANT);

  function signInWithEmail() {
    navigation.navigate("SignInWithEmailScreen");
  }

  async function handleGoogleSignIn() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);

    // signInWithEmailAndPassword(auth, "flowersgaurnett@gmail.com", "Password15")
    //   .then((result) => {
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     // const credential = GoogleAuthProvider.credentialFromResult(result);
    //     // const token = credential.accessToken;
    //     // const user = result.user;
    //   }).catch((error) => {
    //     // Handle Errors here.
    //     // const errorCode = error.code;
    //     // const errorMessage = error.message;
    //     // const email = error.customData.email;
    //     // const credential = GoogleAuthProvider.credentialFromError(error);
    //   })
  }

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}>
      <View flex paddingR-32 paddingL-32 style={{ paddingBottom: headerHeight, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
        <Image
          resizeMode='cover'
          height={150}
          width={150}
          source={require('../assets/logo/logo_v1.png')} />
        <Text marginT-16 marginB-16 text50 $textDefault>
          TropTix Organizer
        </Text>

        <Button
          onPress={() => signInWithEmail()}
          backgroundColor={Colors.orange30}
          borderRadius={25}
          style={{ backgroundColor: '#2196F3', height: 50, width: '100%' }}>
          <Image source={require('../assets/logo/email.png')} tintColor={Colors.white} width={24} height={24} />
          <Text style={{ color: '#ffffff', fontSize: 16 }} marginL-10>Sign In with Email</Text>
        </Button>

        <Button onPress={() => handleGoogleSignIn()} marginT-16 outline borderRadius={25} outlineColor={Colors.grey30} style={{ height: 50, width: '100%' }}>
          <Image source={require('../assets/logo/google.png')} width={24} height={24} />
          <Text style={{ fontSize: 16 }} marginL-10>Sign In with Google</Text>
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
}