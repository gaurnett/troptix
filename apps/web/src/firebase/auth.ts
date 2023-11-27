import { SignUpFields } from "@/pages/auth/signup";
import { auth } from "../config";
import { fetchSignInMethodsForEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { addUser } from 'troptix-api';
import { User } from 'troptix-models';
import { NextRouter } from "next/router";

export async function signUpWithEmail(signUpFields: SignUpFields, router: NextRouter) {
  let result: any, error: any;
  try {
    await createUserWithEmailAndPassword(auth, signUpFields.email, signUpFields.password)
      .then(async result => {
        await sendEmailVerification(result.user);
        await updateProfile(result.user, { displayName: signUpFields.name });

        const userResult = result.user;
        const user = new User();
        user.id = userResult.uid
        user.name = signUpFields.name;
        user.email = userResult.email;
        await addUser(user);

        router.push('/');
        result.user.reload();
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
    result = await signInWithPopup(auth, new GoogleAuthProvider())
      .then(async (result) => {
        const userResult = result.user;
        const userEmail = userResult.email ? userResult.email : "";
        const methods = await fetchSignInMethodsForEmail(auth, userEmail);

        if (methods.length === 0) {
          const user = new User();
          user.id = userResult.uid
          user.name = userResult.displayName;
          user.email = userResult.email;
          await addUser(user);
        }
      });
  } catch (e) {
    error = e;
  }

  return { result, error };
}