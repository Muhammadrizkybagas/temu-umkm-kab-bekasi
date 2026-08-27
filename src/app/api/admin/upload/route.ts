import { NextResponse } from 'next/server';
import { getStorageProvider } from '@/lib/storage';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'File tidak ditemukan atau format tidak valid' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Harap unggah file gambar (JPG, PNG, WEBP).' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let fileUrl = '';

    try {
      const storage = getStorageProvider();
      if (storage) {
        if (typeof storage.upload === 'function') {
          fileUrl = await storage.upload(buffer, file.name, file.type);
        }
      }
    } catch (storageErr: any) {
      console.error('Storage Provider Error Stack:', storageErr?.stack || storageErr);
    }

    if (!fileUrl) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      fileUrl = `/uploads/${fileName}`;
    }

    return NextResponse.json({ url: fileUrl }, { status: 201 });

  } catch (error: any) {
    console.error('=== DETAILED UPLOAD ERROR ===');
    console.error(error?.stack || error);
    console.error('============================');

    return NextResponse.json(
      { error: error?.message || 'Terjadi kesalahan internal pada server upload' },
      { status: 500 }
    );
  }
}