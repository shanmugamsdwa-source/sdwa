import { config } from 'dotenv';
config({ path: '.env.local' });

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getDb() {
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID || 'sdwa-4835b';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (clientEmail && privateKey) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    } else {
      initializeApp({ projectId });
    }
  }
  return getFirestore();
}

async function main() {
  console.log('📧 Updating SDWA Official Email Address in Firestore...');
  const db = getDb();
  const docRef = db.collection('settings').doc('association');

  await docRef.set(
    {
      email: 'shanmugamsdwa@gmail.com',
      updatedAt: new Date(),
    },
    { merge: true }
  );

  console.log('✅ Official Email set to shanmugamsdwa@gmail.com in settings/association');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Failed to update email:', err);
  process.exit(1);
});
