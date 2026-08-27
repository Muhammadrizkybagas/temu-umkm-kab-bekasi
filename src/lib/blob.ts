import { put } from '@vercel/blob';

export async function uploadToBlob(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  
  if (typeof file === 'string') return file;

  try {
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const blob = await put(filename, file, {
      access: 'public',
    });
    return blob.url;
  } catch (error) {
    console.error("Gagal upload ke Vercel Blob:", error);
    throw new Error("Gagal mengupload file gambar.");
  }
}