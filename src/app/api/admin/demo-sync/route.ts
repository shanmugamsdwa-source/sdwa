import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * POST /api/admin/demo-sync
 * Syncs demo storage items to public/uploads/demo_<collectionName>.json for Server-Side Rendering (SSR).
 */
export async function POST(request: NextRequest) {
  try {
    const { collectionName, items } = await request.json();

    if (!collectionName || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, `demo_${collectionName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('demo-sync error:', err);
    return NextResponse.json({ error: err?.message || 'Sync failed' }, { status: 500 });
  }
}
