import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const app = initializeApp({
  credential: admin.credential.applicationDefault()
});

export async function verifyUser(request): Promise<string> {
  let userId = "";
  if (request.headers.authorization) {
    const authorization = request.headers.authorization.split(' ');
    userId = authorization[1];
  }

  if (!userId) {
    console.log("No user");
    return undefined;
  }

  console.log(userId);

  return await getAuth()
    .verifyIdToken(userId)
    .then((decodedToken) => {
      return decodedToken.uid;
    })
    .catch((error) => {
      console.log(error);
      return undefined;
    });
}
