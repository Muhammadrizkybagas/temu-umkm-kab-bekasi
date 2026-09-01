import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { media } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: mediaId } = await params;

    if (!mediaId) {
      return new NextResponse('Bad Request: Media ID dibutuhkan', { status: 400 });
    }

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

    const imageBuffer = Buffer.from(item.data, 'base64');

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