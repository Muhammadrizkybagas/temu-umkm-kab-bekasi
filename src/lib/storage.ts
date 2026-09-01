import { db } from '@/db';
import { media } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface StorageProvider {
  upload(file: Buffer, fileName: string, mimeType?: string): Promise<string>;
  delete(filePath: string): Promise<boolean>;
}

export class TursoStorageProvider implements StorageProvider {
  async upload(file: Buffer, _fileName: string, mimeType?: string): Promise<string> {
    const base64Data = file.toString('base64');
    const type = mimeType || 'image/jpeg';

    const [insertedMedia] = await db
      .insert(media)
      .values({
        data: base64Data,
        mimeType: type,
      })
      .returning({ id: media.id });

    return `/api/media/${insertedMedia.id}`;
  }

  async delete(fileUrl: string): Promise<boolean> {
    try {
      // fileUrl berbentuk "/api/media/uuid-id"
      const mediaId = fileUrl.split('/').pop();
      if (!mediaId) return false;

      await db.delete(media).where(eq(media.id, mediaId));
      return true;
    } catch {
      return false;
    }
  }
}

export function getStorageProvider(): StorageProvider {
  return new TursoStorageProvider();
}