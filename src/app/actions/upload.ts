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

    // maksimal 2mb
    const MAX_SIZE_BYTES = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return { error: 'Ukuran file terlalu besar. Maksimal ukuran gambar adalah 2MB.' };
    }

    // konversi jadi string
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');

    
    const [insertedMedia] = await db
      .insert(media)
      .values({
        data: base64Data,
        mimeType: file.type,
      })
      .returning({ id: media.id });

      
    const publicUrl = `/api/media/${insertedMedia.id}`;

    await logActivity('CREATE', `Mengunggah media baru ke Turso: ${file.name}`);

    
    return { url: publicUrl };
  } catch (error: any) {
    console.error('Upload Action Error (Turso):', error);
    return { error: error?.message || 'Gagal menyimpan gambar ke database Turso' };
  }
}