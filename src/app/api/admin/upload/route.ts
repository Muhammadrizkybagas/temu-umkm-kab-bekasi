import { NextResponse } from 'next/server';
import { db } from '@/db';
import { media } from '@/db/schema';

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

    const MAX_SIZE_BYTES = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Ukuran file terlalu besar. Maksimal 2MB.' },
        { status: 400 }
      );
    }

    // Convert file ke Base64
    const bytes = await file.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString('base64');

    // Simpan ke Turso
    const [insertedMedia] = await db
      .insert(media)
      .values({
        data: base64Data,
        mimeType: file.type,
      })
      .returning({ id: media.id });

    const publicUrl = `/api/media/${insertedMedia.id}`;

    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (error: any) {
    console.error('Error uploading via API route:', error);
    return NextResponse.json(
      { error: error?.message || 'Terjadi kesalahan internal pada server upload' },
      { status: 500 }
    );
  }
}