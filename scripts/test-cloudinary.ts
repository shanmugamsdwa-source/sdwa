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
  console.log('Testing Cloudinary direct upload...');
  console.log('cloud_name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  console.log('api_key:', process.env.CLOUDINARY_API_KEY);
  console.log('api_secret:', process.env.CLOUDINARY_API_SECRET?.substring(0, 5) + '...');

  const tinyBase64Png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  try {
    const result = await cloudinary.uploader.upload(tinyBase64Png, {
      folder: 'sdwa/gallery',
      overwrite: true,
      resource_type: 'auto',
    });
    console.log('✅ Cloudinary upload SUCCESS!');
    console.log('URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
  } catch (err: any) {
    console.error('❌ Cloudinary upload FAILED:');
    console.error('Error details:', err);
  }
}

main();
