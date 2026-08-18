import { config } from 'dotenv';
config({ path: '.env.local' });

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { INITIAL_OFFICIAL_COMMITTEE } from '../src/lib/constants/committee';
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
  console.log('👥 Seeding/Reconciling SDWA Executive Committee...');
  const db = getDb();
  const collectionRef = db.collection(COLLECTIONS.COMMITTEE_MEMBERS);

  // Fetch existing docs to avoid duplicates / clean up incorrect test entries if needed
  const existingSnap = await collectionRef.get();
  console.log(`Current committee count: ${existingSnap.size}`);

  const batch = db.batch();

  // Delete old/test docs if any
  for (const doc of existingSnap.docs) {
    batch.delete(doc.ref);
  }

  const timestamp = new Date();

  // Insert exactly the 11 official committee members
  for (const member of INITIAL_OFFICIAL_COMMITTEE) {
    const docRef = collectionRef.doc();
    batch.set(docRef, {
      name: member.name,
      designation: member.designation,
      position: member.designation, // for backward compatibility
      description: member.description,
      photoUrl: member.photoUrl || '',
      photoPublicId: member.photoPublicId || '',
      displayOrder: member.displayOrder,
      isActive: member.isActive,
      isPublished: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  await batch.commit();
  console.log(`✅ Successfully seeded exactly ${INITIAL_OFFICIAL_COMMITTEE.length} official committee members!`);

  // Verify
  const verifiedSnap = await collectionRef.orderBy('displayOrder').get();
  console.log('\n--- VERIFIED COMMITTEE IN FIRESTORE ---');
  verifiedSnap.docs.forEach((doc) => {
    const d = doc.data();
    console.log(`${d.displayOrder}. ${d.name} — ${d.designation}`);
  });

  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
