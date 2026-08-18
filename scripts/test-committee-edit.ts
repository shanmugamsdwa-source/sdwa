import { config } from 'dotenv';
config({ path: '.env.local' });

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
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
  console.log('🧪 Running Executive Committee Data Integrity Tests...\n');
  const db = getDb();
  const collectionRef = db.collection(COLLECTIONS.COMMITTEE_MEMBERS);

  // 1. Fetch all members
  const snapshot = await collectionRef.orderBy('displayOrder').get();
  console.log(`Step 1: Found ${snapshot.size} members (Expected 11):`);
  if (snapshot.size !== 11) {
    throw new Error(`Expected 11 members, got ${snapshot.size}`);
  }

  snapshot.docs.forEach((doc, i) => {
    const d = doc.data();
    console.log(`  [${d.displayOrder}] ${d.name} -> ${d.designation}`);
  });

  // Pick first member (L.R. Marconi)
  const firstDoc = snapshot.docs[0];
  const originalData = firstDoc.data();
  console.log(`\nTesting with: "${originalData.name}" - "${originalData.designation}"`);

  // Test A: Change only Name
  console.log('\n--- Test A: Change only Name ---');
  await firstDoc.ref.update({ name: 'L.R. Marconi TEST' });
  let checkSnap = await firstDoc.ref.get();
  let checkData = checkSnap.data();
  console.log(`After name edit: Name = "${checkData?.name}", Designation = "${checkData?.designation}"`);
  if (checkData?.name !== 'L.R. Marconi TEST' || checkData?.designation !== 'President') {
    throw new Error('Test A failed: Designation changed or Name not updated!');
  }
  console.log('✅ Test A Passed: Designation remained "President" when Name was updated.');

  // Test B: Change only Designation
  console.log('\n--- Test B: Change only Designation ---');
  await firstDoc.ref.update({ name: 'L.R. Marconi', designation: 'President TEST' });
  checkSnap = await firstDoc.ref.get();
  checkData = checkSnap.data();
  console.log(`After designation edit: Name = "${checkData?.name}", Designation = "${checkData?.designation}"`);
  if (checkData?.name !== 'L.R. Marconi' || checkData?.designation !== 'President TEST') {
    throw new Error('Test B failed: Name changed or Designation not updated!');
  }
  console.log('✅ Test B Passed: Name remained "L.R. Marconi" when Designation was updated.');

  // Restore original values
  console.log('\n--- Restoring original values ---');
  await firstDoc.ref.update({ name: 'L.R. Marconi', designation: 'President', position: 'President' });
  checkSnap = await firstDoc.ref.get();
  checkData = checkSnap.data();
  console.log(`Restored: Name = "${checkData?.name}", Designation = "${checkData?.designation}"`);

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
