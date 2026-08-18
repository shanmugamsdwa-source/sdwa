import { config } from 'dotenv';
config({ path: '.env.local' });

async function main() {
  const { initializeApp, cert, getApps } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  const { getAuth } = await import('firebase-admin/auth');

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  console.log('--- ENV CHECK ---');
  console.log('projectId:', projectId);
  console.log('clientEmail:', clientEmail);
  console.log('privateKey defined:', !!privateKey);
  console.log('privateKey length:', privateKey?.length);

  // Check if the key has literal \\n (escaped) vs actual newlines
  if (privateKey) {
    const hasEscapedNewlines = privateKey.includes('\\n');
    const hasRealNewlines = privateKey.includes('\n');
    console.log('Has escaped \\\\n:', hasEscapedNewlines);
    console.log('Has real newlines:', hasRealNewlines);

    // Replace escaped newlines with real ones if needed
    if (hasEscapedNewlines) {
      privateKey = privateKey.replace(/\\n/g, '\n');
      console.log('Replaced escaped newlines with real newlines');
    }
  }

  console.log('\n--- INIT TEST ---');
  try {
    if (getApps().length > 0) {
      console.log('App already exists, skipping init');
    } else {
      const app = initializeApp({
        credential: cert({ projectId: projectId!, clientEmail: clientEmail!, privateKey: privateKey! }),
      });
      console.log('✅ Firebase Admin SDK initialized successfully');
    }
  } catch (err: any) {
    console.error('❌ Firebase Admin SDK init FAILED:', err.message);
    process.exit(1);
  }

  console.log('\n--- FIRESTORE TEST ---');
  try {
    const db = getFirestore();
    const snap = await db.collection('settings').doc('association').get();
    console.log('✅ Firestore read success, doc exists:', snap.exists);
    if (snap.exists) {
      const data = snap.data();
      console.log('  email:', data?.email);
      console.log('  socialLinks:', JSON.stringify(data?.socialLinks));
    }
  } catch (err: any) {
    console.error('❌ Firestore read FAILED:', err.message);
  }

  console.log('\n--- AUTH TEST ---');
  try {
    const auth = getAuth();
    console.log('✅ Auth instance created, verifyIdToken available:', typeof auth.verifyIdToken === 'function');
  } catch (err: any) {
    console.error('❌ Auth init FAILED:', err.message);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
