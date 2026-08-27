import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

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

    
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `umkm-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    
    const blob = await put(fileName, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url }, { status: 201 });

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