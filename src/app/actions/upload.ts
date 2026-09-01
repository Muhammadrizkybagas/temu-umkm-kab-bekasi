'use server';

import { db } from '@/db';
import { media } from '@/db/schema';
import { logActivity } from '@/lib/logger';

export async function uploadFileAction(
  formData: FormData
): Promise<
  | { success: true; url: string; id: string | number }
  | { error: string }
> {
  try {
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return { error: 'File tidak ditemukan atau format tidak valid' };
    }

    if (!file.type.startsWith('image/')) {
      return { error: 'Harap unggah file gambar (JPG, PNG, WEBP, GIF).' };
    }

    // Batasi ukuran gambar maksimal 2MB
    const MAX_SIZE_BYTES = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return { error: 'Ukuran file terlalu besar. Maksimal 2MB.' };
    }

    // Convert file ke Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');

    // Menggunakan .returning() karena resmi didukung Turso & Drizzle
    const [insertedMedia] = await db
      .insert(media)
      .values({
        data: base64Data,
        mimeType: file.type,
      })
      .returning({ id: media.id });

    if (!insertedMedia?.id) {
      return { error: 'Gagal mendapatkan ID media dari database' };
    }

    const publicUrl = `/api/media/${insertedMedia.id}`;

    // Non-blocking logging: Jika logActivity error, upload gambar TIDAK dibatalkan
    try {
      await logActivity('CREATE', `Mengunggah media baru: ${file.name}`);
    } catch (e) {
      console.warn('logActivity gagal, melanjutkan upload:', e);
    }

    return { success: true, url: publicUrl, id: insertedMedia.id };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return { error: error?.message || 'Gagal mengunggah gambar ke database' };
  }
}