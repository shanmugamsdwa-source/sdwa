import { config } from 'dotenv';
config({ path: '.env.local' });

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { INITIAL_OFFICIAL_OBJECTIVES } from '../src/lib/constants/objectives';
import { COLLECTIONS } from '../src/types';

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
  console.log('🌱 Seeding SDWA Official Objectives & Commitments...');
  const db = getDb();
  const collectionRef = db.collection(COLLECTIONS.ASSOCIATION_OBJECTIVES);

  const existingSnap = await collectionRef.get();
  console.log(`Current objectives count: ${existingSnap.size}`);

  const batch = db.batch();
  const timestamp = new Date();

  for (const item of INITIAL_OFFICIAL_OBJECTIVES) {
    const docRef = collectionRef.doc();
    batch.set(docRef, {
      ...item,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  await batch.commit();
  console.log(`✅ Successfully seeded ${INITIAL_OFFICIAL_OBJECTIVES.length} official objectives!`);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
