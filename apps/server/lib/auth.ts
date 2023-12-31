import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import jwt from "jsonwebtoken";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export async function verifyUser(request): Promise<any> {
  let token = "";
  let undefinedUser = { userId: undefined, email: undefined };

  if (request.headers.authorization) {
    const authorization = request.headers.authorization.split(' ');
    token = authorization[1];
  }

  if (!token) {
    console.log("No authorized token");
    return undefinedUser;
  }

  return await getAuth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      return { userId: decodedToken.uid, email: decodedToken.email };
    })
    .catch((error) => {
      console.log(error);
      return undefinedUser;
    });
}

export async function verifyJwtToken(request): Promise<any> {
  let token = "";
  if (request.headers.authorization) {
    const authorization = request.headers.authorization.split(' ');
    token = authorization[1];
  }

  if (!token) {
    console.log("No authorized token");
    return undefined;
  }

  const jwtSecretKey = process.env.NEXT_PUBLIC_VERCEL_SECRET as string;

  try {
    return jwt.verify(token, jwtSecretKey) as string;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}