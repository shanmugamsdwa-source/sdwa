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
  const db = getDb();
  const snapshot = await db.collection('committeeMembers').orderBy('displayOrder').get();
  console.log(`Found ${snapshot.size} committee member documents:`);
  snapshot.docs.forEach((doc) => {
    const d = doc.data();
    console.log(`ID: ${doc.id} | Order: ${d.displayOrder} | Name: "${d.name}" | Position/Designation: "${d.position || d.designation}"`);
  });
  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
