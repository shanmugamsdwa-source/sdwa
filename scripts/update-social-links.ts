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
  console.log('🌐 Updating SDWA Official Social Media Links in Firestore...');
  const db = getDb();
  const docRef = db.collection('settings').doc('association');

  const socialLinks = {
    instagram: 'https://www.instagram.com/isha_gym_shanmugam?igsh=MnlneHF1ZG9wb2Ny',
    facebook: 'https://www.facebook.com/share/14kUMAKhV4x',
    youtube: 'https://youtube.com/@ishagym_salem_tn?si=gxU5QBkCYOTBjxYb',
  };

  await docRef.set(
    {
      socialLinks,
      updatedAt: new Date(),
    },
    { merge: true }
  );

  console.log('✅ Official Social Media Links updated in settings/association:');
  console.log(JSON.stringify(socialLinks, null, 2));
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Failed to update social links:', err);
  process.exit(1);
});
