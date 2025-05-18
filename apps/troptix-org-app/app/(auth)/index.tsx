import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from '../../firebaseConfig';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
    marginTop: 12,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    marginRight: 12,
  },
});

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function signInWithEmail() {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.replace('/(tabs)');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Error signing in:', errorCode, errorMessage);
      });
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          marginBottom: 48,
        }}
      >
        <Image
          resizeMode="cover"
          style={{
            width: 150,
            height: 150,
            justifyContent: 'center',
            alignContent: 'center',
          }}
          source={require('../../assets/logo/logo_v1.png')}
        />
      </View>
      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#999"
        onChangeText={setEmail}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="***********"
        placeholderTextColor="#999"
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={{
          ...styles.button,
          backgroundColor: '#DB4437',
          marginTop: 24,
        }}
        onPress={signInWithEmail}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <AntDesign name="mail" size={20} color="white" />
        </View>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          Sign in with email
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          ...styles.button,
          backgroundColor: '#4285F4',
        }}
        onPress={() => {}}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <AntDesign name="google" size={20} color="white" />
        </View>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          Sign in with Google
        </Text>
      </TouchableOpacity>
      {Platform.OS === 'ios' && (
        <TouchableOpacity
          style={{
            ...styles.button,
            backgroundColor: 'black',
          }}
          onPress={() => {}}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <AntDesign name="apple1" size={20} color="white" />
          </View>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            Sign in with Apple
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
