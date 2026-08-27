'use server';

import { getStorageProvider } from '@/lib/storage';
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    
    const storage = getStorageProvider();
    const fileUrl = await storage.upload(buffer, file.name, file.type);

    
    await logActivity('CREATE', `Mengunggah media baru: ${file.name}`);

    return { url: fileUrl };
  } catch (error: any) {
    console.error('Upload Action Error:', error);
    return { error: error?.message || 'Gagal mengunggah file' };
  }
}