import { db } from '@/db';
import { media } from '@/db/schema';

export async function uploadToBlob(file: File | string | null): Promise<string | null> {
  if (!file) return null;

  // Jika input sudah berupa string URL
  if (typeof file === 'string') return file;

  if (file.size === 0) return null;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');

    // Simpan ke database Turso DB
    const [insertedMedia] = await db
      .insert(media)
      .values({
        data: base64Data,
        mimeType: file.type || 'image/jpeg',
      })
      .returning({ id: media.id });

    if (!insertedMedia?.id) {
      throw new Error("Gagal mendapatkan ID dari database.");
    }

    return `/api/media/${insertedMedia.id}`;
  } catch (error) {
    console.error("Gagal upload gambar ke Turso DB:", error);
    throw new Error("Gagal mengupload file gambar.");
  }
}