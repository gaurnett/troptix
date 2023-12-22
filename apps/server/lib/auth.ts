import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import jwt from "jsonwebtoken";

const app = initializeApp({
  credential: admin.credential.applicationDefault()
});

export async function verifyUser(request): Promise<string> {
  let token = "";
  if (request.headers.authorization) {
    const authorization = request.headers.authorization.split(' ');
    token = authorization[1];
  }

  if (!token) {
    console.log("No authorized token");
    return undefined;
  }

  return await getAuth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      return decodedToken.uid;
    })
    .catch((error) => {
      console.log(error);
      return undefined;
    });
}

export async function verifyJwtToken(request): Promise<string> {
  let token = "";
  if (request.headers.authorization) {
    const authorization = request.headers.authorization.split(' ');
    token = authorization[1];
  }

  if (!token) {
    console.log("No authorized token");
    return undefined;
  }

  const jwtSecretKey = process.env.NEXT_PUBLIC_VERCEL_SECRET;

  try {
    return jwt.verify(token, jwtSecretKey) as string;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}