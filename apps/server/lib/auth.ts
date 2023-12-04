import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const app = initializeApp({
  credential: admin.credential.applicationDefault()
});

export async function verifyUser(token: string): Promise<string> {
  return await getAuth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      console.log(decodedToken);
      return decodedToken;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}