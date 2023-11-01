import { auth } from "../config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from "firebase/auth";

export async function signUpWithEmail(email, password) {
  let result = null,
    error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function signInWithEmail(email, password) {
  let result = null;
  let error = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}