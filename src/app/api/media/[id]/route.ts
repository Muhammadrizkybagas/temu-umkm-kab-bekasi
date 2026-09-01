import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { media } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const mediaId = params.id;

    if (!mediaId) {
      return new NextResponse('Bad Request: Media ID dibutuhkan', { status: 400 });
    }

    // Ambil data gambar dari tabel media
    const item = await db
      .select({
        data: media.data,
        mimeType: media.mimeType,
      })
      .from(media)
      .where(eq(media.id, mediaId))
      .get();

    if (!item || !item.data) {
      return new NextResponse('Gambar tidak ditemukan', { status: 404 });
    }

    // Convert string Base64 kembali ke binary Buffer
    const imageBuffer = Buffer.from(item.data, 'base64');

    // Return binary gambar dengan header caching agar performa cepat
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': item.mimeType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Error serving media image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}