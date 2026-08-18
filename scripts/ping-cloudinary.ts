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
  console.log('Testing Cloudinary ping & credentials...');
  try {
    const pingRes = await cloudinary.api.ping();
    console.log('Ping response:', pingRes);
  } catch (err: any) {
    console.error('Ping error status:', err.http_code);
    console.error('Ping error message:', err.message);
    console.error('Full error:', JSON.stringify(err, null, 2));
  }
}

main();
