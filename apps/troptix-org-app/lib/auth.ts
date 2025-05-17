let signedIn = false;

export function isSignedIn() {
  return signedIn;
}

export function signIn() {
  signedIn = true;
}

export function signOut() {
  signedIn = false;
}
