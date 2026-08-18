import { config } from 'dotenv';
config({ path: '.env.local' });

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function main() {
  const tinyBase64Png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const remoteImageUrl = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300';

  console.log('--- TEST 1: Remote URL with resource_type: image ---');
  try {
    const res1 = await cloudinary.uploader.upload(remoteImageUrl, {
      resource_type: 'image',
    });
    console.log('✅ TEST 1 Success! URL:', res1.secure_url);
  } catch (e: any) {
    console.error('❌ TEST 1 Failed:', e.message, e.http_code);
  }

  console.log('\n--- TEST 2: Base64 data URI with resource_type: image ---');
  try {
    const res2 = await cloudinary.uploader.upload(tinyBase64Png, {
      resource_type: 'image',
    });
    console.log('✅ TEST 2 Success! URL:', res2.secure_url);
  } catch (e: any) {
    console.error('❌ TEST 2 Failed:', e.message, e.http_code);
  }

  console.log('\n--- TEST 3: Base64 with folder "sdwa/gallery" ---');
  try {
    const res3 = await cloudinary.uploader.upload(tinyBase64Png, {
      folder: 'sdwa/gallery',
      resource_type: 'image',
    });
    console.log('✅ TEST 3 Success! URL:', res3.secure_url);
  } catch (e: any) {
    console.error('❌ TEST 3 Failed:', e.message, e.http_code);
  }
}

main();
