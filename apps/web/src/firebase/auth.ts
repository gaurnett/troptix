import { SignUpFields } from "@/pages/auth/signup";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { NextRouter } from "next/router";
import { addUser } from "troptix-api";
import { User } from "troptix-models";
import { auth } from "../config";

export async function signUpWithEmail(
  signUpFields: SignUpFields,
  router: NextRouter
) {
  let result: any, error: any;
  const displayName = signUpFields.firstName + " " + signUpFields.lastName;
  try {
    await createUserWithEmailAndPassword(
      auth,
      signUpFields.email,
      signUpFields.password
    ).then(async (result) => {
      await sendEmailVerification(result.user);
      await updateProfile(result.user, { displayName });

      const userResult = result.user;
      const user = new User();
      user.id = userResult.uid;
      user.name = displayName;
      user.email = userResult.email;
      await addUser(user);

      router.push("/");
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
    result = await signInWithPopup(auth, new GoogleAuthProvider()).then(
      async (result) => {
        const userResult = result.user;
        const userEmail = userResult.email ? userResult.email : "";
        const additionalInfo = getAdditionalUserInfo(result);

        if (additionalInfo?.isNewUser) {
          const user = new User();
          user.id = userResult.uid;
          user.name = userResult.displayName;
          user.email = userResult.email;
          await addUser(user);
        }
      }
    );
  } catch (e) {
    error = e;
  }

  return { result, error };
}
