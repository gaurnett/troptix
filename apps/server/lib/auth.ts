import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import jwt from "jsonwebtoken";

const jwtSecretKey = process.env.NEXT_PUBLIC_VERCEL_SECRET;
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

export async function verifyJwt(request): Promise<boolean> {
  let token = "";
  if (request.headers.authorization) {
    const authorization = request.headers.authorization.split(' ');
    token = authorization[1];
  }

  if (!token) {
    console.log("No token");
    return undefined;
  }

  console.log(token);

  try {
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      console.log("Verified");
      return true;
    } else {
      console.log("Access denied");
      return undefined;
    }
  } catch (error) {
    return undefined;
  }

}