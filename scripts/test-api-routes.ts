import { config } from 'dotenv';
config({ path: '.env.local' });

async function main() {
  console.log('Testing local API endpoints with mock Bearer token...');

  // Create a mock Firebase JWT payload (sub: 'admin123', email: 'admin@sdwa.org')
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({
    user_id: 'admin_test_uid',
    sub: 'admin_test_uid',
    email: 'shanmugamsdwa@gmail.com',
    exp: Math.floor(Date.now() / 1000) + 3600,
  })).toString('base64');
  const mockToken = `${header}.${payload}.mockSignature`;

  const endpoints = [
    '/api/auth/verify',
    '/api/admin/committee',
    '/api/admin/centres',
    '/api/admin/gallery/albums',
    '/api/admin/tournaments',
    '/api/admin/achievements',
  ];

  for (const ep of endpoints) {
    try {
      const isPost = ep === '/api/auth/verify';
      const res = await fetch(`http://localhost:3000${ep}`, {
        method: isPost ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: isPost ? JSON.stringify({ token: mockToken }) : undefined,
      });

      const text = await res.text();
      console.log(`[${res.status}] ${ep}: ${text.substring(0, 80)}...`);
    } catch (err: any) {
      console.error(`[ERR] ${ep}:`, err.message);
    }
  }

  // Test Upload endpoint
  try {
    const tinyBase64Png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const uploadRes = await fetch('http://localhost:3000/api/admin/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockToken}`,
      },
      body: JSON.stringify({
        file: tinyBase64Png,
        folder: 'sdwa/gallery',
      }),
    });
    const uploadText = await uploadRes.text();
    console.log(`[${uploadRes.status}] /api/admin/upload:`, uploadText);
  } catch (uploadErr: any) {
    console.error('[ERR] /api/admin/upload:', uploadErr.message);
  }
}

main();
