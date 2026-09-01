'use server';

import { db } from '@/db';
import { media } from '@/db/schema';
import { logActivity } from '@/lib/logger';

export async function uploadFileAction(formData: FormData) {
  try {
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return { error: 'File tidak ditemukan atau format tidak valid' };
    }

    if (!file.type.startsWith('image/')) {
      return { error: 'Harap unggah file gambar (JPG, PNG, WEBP, GIF).' };
    }

    // Batasi ukuran gambar maksimal 2MB agar DB Turso tetap ringan
    const MAX_SIZE_BYTES = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return { error: 'Ukuran file terlalu besar. Maksimal ukuran gambar adalah 2MB.' };
    }

    // Convert file ke Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');

    // Simpan ke database Turso dan ambil ID otomatis yang dihasilkan
    const [insertedMedia] = await db
      .insert(media)
      .values({
        data: base64Data,
        mimeType: file.type,
      })
      .returning({ id: media.id });

    const publicUrl = `/api/media/${insertedMedia.id}`;

    await logActivity('CREATE', `Mengunggah media baru ke Turso: ${file.name}`);

    return { success: true, url: publicUrl, id: insertedMedia.id };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return { error: error?.message || 'Gagal mengunggah gambar ke database' };
  }
}