import { appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useHeaderHeight } from '@react-navigation/elements';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as React from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Button, Colors, Image, Text, View } from 'react-native-ui-lib';

export default function SignInScreen({ navigation }) {
  const [isAppleLoginAvailable, setIsAppleLoginAvailable] = React.useState(false);

  React.useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setIsAppleLoginAvailable);
  }, []);

  GoogleSignin.configure({
    webClientId: '912947419048-sark3aqudtojmsci3tk9c6p5ud9o7aes.apps.googleusercontent.com',
  });

  const headerHeight = useHeaderHeight();

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
  }

  async function handleAppleSignIn() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
      // See: https://github.com/invertase/react-native-apple-authentication#faqs
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;

    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
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
          <Image source={require('../assets/logo/email.png')} tintColor={Colors.white} width={20} height={20} />
          <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '600' }} marginL-8>Sign in with Email</Text>
        </Button>

        <Button
          onPress={() => handleGoogleSignIn()}
          marginT-16 outline borderRadius={25}
          outlineColor={Colors.grey30}
          style={{ height: 50, width: '100%', backgroundColor: 'white' }}>
          <Image source={require('../assets/logo/google.png')} width={16} height={16} />
          <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }} marginL-8>Sign in with Google</Text>
        </Button>

        {isAppleLoginAvailable && (
          <View marginT-16 style={{ alignItems: 'center', width: '100%' }}>
            <AppleAuthentication.AppleAuthenticationButton
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              cornerRadius={25}
              onPress={handleAppleSignIn}
              style={{ width: '100%', height: 50 }}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}