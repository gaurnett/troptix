import { useRef, useState } from 'react';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Button,
  Colors,
  Image,
  Text,
  TextField,
  View,
} from 'react-native-ui-lib';
import { auth } from 'troptix-firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import * as authentication from 'firebase/auth';
import CustomTextField from '../../components/CustomTextField';
import { TropTixResponse, addUser } from 'troptix-api';
import { User } from 'troptix-models';

export default function SignUpWithEmailScreen({ route, navigation }) {
  const { userEmail } = route.params;
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [name, setName] = useState();
  const [email, setEmail] = useState(userEmail);
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  function updateName(name, value) {
    setName(value);
  }

  function updateEmail(name, value) {
    setEmail(value);
  }

  function updatePassword(name, value) {
    setPassword(value);
  }

  function updateConfirmPassword(name, value) {
    setConfirmPassword(value);
  }

  async function signUp() {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (result) => {
        const userResult = result.user;
        const user = new User();
        user.id = userResult.uid;
        user.name = name;
        user.email = userResult.email;
        const response = await addUser(user);
        console.log('[createUserWithEmailAndPassword] response: ', response);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(
          '[createUserWithEmailAndPassword] ',
          errorCode,
          ' ',
          errorMessage
        );
      });
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        paddingR-32
        paddingL-32
        style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}
      >
        <Image
          resizeMode="cover"
          height={150}
          width={150}
          source={require('../../assets/logo/logo_v1.png')}
        />

        <View width={'100%'}>
          <CustomTextField
            name="name"
            label="Name"
            placeholder="John"
            value={name}
            reference={nameRef}
            handleChange={updateName}
          />
        </View>

        <View width={'100%'}>
          <CustomTextField
            name="email"
            label="Email Address"
            placeholder="johndoe@troptix.com"
            value={email}
            reference={emailRef}
            handleChange={updateEmail}
          />
        </View>

        <View width={'100%'}>
          <CustomTextField
            name="password"
            label="Password"
            placeholder="**************"
            value={password}
            secureTextEntry={true}
            reference={passwordRef}
            handleChange={updatePassword}
          />
        </View>

        <View width={'100%'}>
          <CustomTextField
            name="confirmPassword"
            label="Confirm Password"
            placeholder="**************"
            value={confirmPassword}
            secureTextEntry={true}
            reference={confirmPasswordRef}
            handleChange={updateConfirmPassword}
          />
        </View>

        <Button
          onPress={() => signUp()}
          marginT-16
          borderRadius={25}
          color={Colors.white}
          style={{ backgroundColor: '#FF7043', height: 50, width: '100%' }}
        >
          <Text style={{ color: '#ffffff', fontSize: 16 }} marginL-10>
            Sign up
          </Text>
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
}
