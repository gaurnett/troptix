import jwt from 'jsonwebtoken';
import { GetServerSidePropsContext } from 'next';
import { getCookie } from 'cookies-next';
import admin from './firebaseAdmin';
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
// This is a helper function to be used with getServerSideProps for routes that require authentication
export async function requireAuth(
  ctx: GetServerSidePropsContext,
  opts = { organizerOnly: false }
) {
  const token = await getCookie('fb-token', { req: ctx.req, res: ctx.res });
  if (!token) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }

  try {
    //Gets and verifies the token
    const decoded = await admin.auth().verifyIdToken(token as string);
    const uid = decoded.uid;
    // TODO: We should store a mapping of firebase uid to troptix user id
    const userRecord = await admin.auth().getUser(uid);

    const user = await prisma.users.findUnique({
      where: { email: userRecord.email },
    });
    if (!user) throw new Error('User not found');
    // TODO: We should use firebase Custom Claims to check if the user is an organizer (more secure and performant)
    if (opts.organizerOnly && user.role !== 'ORGANIZER') {
      return { redirect: { destination: '/', permanent: false } };
    }

    return { props: { user: { email: user.email, role: user.role } } };
  } catch (error) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }
}

async function verifyJwtToken(request): Promise<any> {
  let token = '';
  if (request.headers.authorization) {
    const authorization = request.headers.authorization.split(' ');
    token = authorization[1];
  }

  if (!token) {
    console.log('No authorized token');
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
