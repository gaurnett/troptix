import { SignUpFields } from "@/pages/auth/signup";
import { auth } from "../config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
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
    console.log("Sign Up Error: " + e);
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