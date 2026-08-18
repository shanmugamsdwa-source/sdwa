import fs from 'fs';
import path from 'path';

async function testLocalUpload() {
  const base64Data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  const ext = mimeType.split('/')[1] || 'png';
  const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);

  const publicUrl = `/uploads/gallery/${filename}`;
  console.log('✅ Local upload test success! Public URL:', publicUrl);
}

testLocalUpload();
