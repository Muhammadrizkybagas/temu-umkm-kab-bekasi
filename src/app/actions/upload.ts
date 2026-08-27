'use server';

import { put } from '@vercel/blob';
import { logActivity } from '@/lib/logger';

export async function uploadFileAction(formData: FormData) {
  try {
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return { error: 'File tidak ditemukan atau format tidak valid' };
    }

    if (!file.type.startsWith('image/')) {
      return { error: 'Harap unggah file gambar (JPG, PNG, WEBP).' };
    }

    
    const filename = `uploads/${Date.now()}-${file.name}`;
    const blob = await put(filename, file, {
      access: 'public',
    });

    
    await logActivity('CREATE', `Mengunggah media baru: ${file.name}`);

    return { url: blob.url };
  } catch (error: any) {
    console.error('Upload Action Error:', error);
    return { error: error?.message || 'Gagal mengunggah file ke Vercel Blob' };
  }
}