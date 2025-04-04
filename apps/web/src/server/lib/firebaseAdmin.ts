import * as admin from 'firebase-admin';

// Only initialize if no apps exist
if (admin.apps.length === 0) {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE_64! as string;
  const json = Buffer.from(base64, 'base64').toString('utf-8');
  const serviceAccount = JSON.parse(json);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
