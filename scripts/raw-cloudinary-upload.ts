import { config } from 'dotenv';
config({ path: '.env.local' });

import crypto from 'crypto';

async function testRawUpload() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'jamyxdzq';
  const apiKey = process.env.CLOUDINARY_API_KEY || '';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || '';

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const stringToSign = `timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

  const formData = new FormData();
  formData.append('file', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);

  console.log(`Sending upload request to https://api.cloudinary.com/v1_1/${cloudName}/image/upload ...`);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  console.log('HTTP Status:', response.status);
  console.log('Headers:', Object.fromEntries(response.headers.entries()));
  const bodyText = await response.text();
  console.log('Body:', bodyText);
}

testRawUpload();
