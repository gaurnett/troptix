import * as admin from 'firebase-admin';

let initialized = false;

function init() {
  if (!initialized && admin.apps.length === 0) {
    const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE_64;
    if (!base64) {
      throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY_BASE_64');
    }

    const json = Buffer.from(base64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(json);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    initialized = true;
  }
}

init();

export default admin;
