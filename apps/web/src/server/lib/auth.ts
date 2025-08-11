import jwt from 'jsonwebtoken';
import { GetServerSidePropsContext } from 'next';
import { getCookie } from 'cookies-next';
import { getFirebaseAdmin } from './firebaseAdmin';
import prisma from '@/server/prisma';

export async function verifyUser(request): Promise<any> {
  let token = '';
  let undefinedUser = { userId: undefined, email: undefined };

  if (request.headers.authorization) {
    const authorization = request.headers.authorization.split(' ');
    token = authorization[1];
  }

  if (!token) {
    console.log('No authorized token');
    return undefinedUser;
  }

  const admin = getFirebaseAdmin();
  return await admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      return { userId: decodedToken.uid, email: decodedToken.email };
    })
    .catch((error) => {
      console.log(error);
      return undefinedUser;
    });
}

export const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, OPTIONS, PATCH, DELETE, POST, PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return await fn(req, res);
};
