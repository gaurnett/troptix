import { User } from '@/hooks/types/User';
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../config';

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

interface CreateUserProps {
  user: User;
  onSuccess?: () => void;
  onFailed?: () => void;
}

export async function createUser({
  user,
  onSuccess,
  onFailed,
}: CreateUserProps) {
  try {
    const response = await fetch(`/api/user/create/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (!response.ok) {
      onFailed?.();
      return;
    }

    onSuccess?.();
  } catch (err) {
    onFailed?.();
  }
}
