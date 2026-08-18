import { config } from 'dotenv';
config({ path: '.env.local' });

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

function getAdminApp() {
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID || 'sdwa-4835b';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    return initializeApp({
      credential: cert({ projectId, clientEmail: clientEmail!, privateKey: privateKey! }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'sdwa-4835b.firebasestorage.app',
    });
  }
  return getApps()[0];
}

async function main() {
  console.log('Testing Firebase Admin Storage upload...');
  const app = getAdminApp();
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'sdwa-4835b.firebasestorage.app';
  console.log('Bucket name:', bucketName);

  try {
    const storage = getStorage(app);
    const bucket = storage.bucket(bucketName);
    const fileName = `test/test-${Date.now()}.txt`;
    const file = bucket.file(fileName);

    await file.save('Hello SDWA Storage!', {
      contentType: 'text/plain',
      public: true,
      metadata: {
        firebaseStorageDownloadTokens: 'test-token',
      },
    });

    console.log('✅ Firebase Storage upload SUCCESS!');
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    console.log('Public URL:', publicUrl);
  } catch (err: any) {
    console.error('❌ Firebase Storage upload error:', err.message);
  }
}

main();
