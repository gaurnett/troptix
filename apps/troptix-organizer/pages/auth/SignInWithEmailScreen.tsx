import { useRef, useState } from 'react';
import { Keyboard, SafeAreaView, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Button, Colors, Image, Text, TextField, View } from 'react-native-ui-lib';
import { auth } from 'troptix-firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import * as authentication from "firebase/auth";
import CustomTextField from '../../components/CustomTextField';
import { User } from 'troptix-models';

export default function SignInWithEmailScreen({ navigation }) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [user, setUser] = useState<User>(new User());
  const [password, setPassword] = useState();

  function updateEmail(name, value) {
    setUser(prevUser => ({ ...prevUser, ["email"]: value }))
  }

  function updatePassword(name, value) {
    setPassword(value);
  }

  function signIn() {
    signInWithEmailAndPassword(auth, user.email, password)
      .then((result) => {
        console.log("[signInWithEmailAndPassword] User signed in")
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("[signInWithEmailAndPassword] ", errorCode, " ", errorMessage)
      })
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
          source={require('../../assets/logo/logo_v1.png')} />

        <View width={"100%"}>
          <CustomTextField
            name="email"
            label="Email address"
            placeholder="johndoe@troptix.com"
            value={user.email}
            reference={emailRef}
            handleChange={updateEmail}
          />
        </View>

        <View width={"100%"}>
          <CustomTextField
            name="password"
            label="Password"
            placeholder="**************"
            value={password}
            reference={passwordRef}
            secureTextEntry={true}
            handleChange={updatePassword}
          />
        </View>

        <Button
          onPress={() => signIn()}
          marginT-16
          backgroundColor={Colors.orange30}
          borderRadius={25}
          style={{ backgroundColor: '#2196F3', height: 50, width: '100%' }}>
          <Image source={require('../../assets/logo/email.png')} tintColor={Colors.white} width={24} height={24} />
          <Text style={{ color: '#ffffff', fontSize: 16 }} marginL-10>Sign in</Text>
        </Button>

      </View>
    </TouchableWithoutFeedback>
  );
}