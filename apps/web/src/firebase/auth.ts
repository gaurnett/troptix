import { User } from '@/hooks/types/User';
import { SignUpFields } from '@/types/auth';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { addUser } from 'troptix-api';
import { auth } from '../config';

export async function signUpWithEmail(signUpFields: SignUpFields) {
  let result: any, error: any;
  const displayName = signUpFields.firstName + ' ' + signUpFields.lastName;
  try {
    await createUserWithEmailAndPassword(
      auth,
      signUpFields.email,
      signUpFields.password
    ).then(async (result) => {
      await updateProfile(result.user, { displayName });

      const userResult = result.user;
      const user: User = {
        id: userResult.uid,
        firstName: signUpFields.firstName,
        lastName: signUpFields.lastName,
        email: signUpFields.email,
      };

      await addUser(user);
    });
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function resetPassword(email: string) {
  let result: any;
  let error: any;
  try {
    result = await sendPasswordResetEmail(auth, email);
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function signInWithEmail(email: string, password: string) {
  let result: any;
  let error: any;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function signInWithGoogle() {
  let result: any;
  let error: any;
  try {
    result = await signInWithPopup(auth, new GoogleAuthProvider()).then(
      async (result) => {
        const userResult = result.user;
        const userEmail = userResult.email ? userResult.email : '';
        const additionalInfo = getAdditionalUserInfo(result);

        if (additionalInfo?.isNewUser) {
          const user: User = {
            id: userResult.uid,
            email: userResult.email as string,
          };

          await addUser(user);
        }
      }
    );
  } catch (e) {
    error = e;
  }

  return { result, error };
}
