import { getFirebaseAdmin } from './lib/firebaseAdmin';
import { cookies } from 'next/headers';

export async function getUserFromIdTokenCookie() {
  const cookieStore = cookies();
  const idToken = cookieStore.get('fb-token')?.value; // Get the ID Token from cookie

  if (!idToken) {
    console.log('No ID token cookie found.');
    return null;
  }

  try {
    const admin = getFirebaseAdmin();
    const decodedToken = await admin
      .auth()
      .verifyIdToken(idToken /*, checkRevoked = false */);
    return decodedToken;
  } catch (error: any) {
    if (error.code === 'auth/id-token-expired') {
      console.error('ID token has expired');
    } else {
      console.error(
        'Error verifying ID token cookie:',
        error.code,
        error.message
      );
    }
    return null;
  }
}
