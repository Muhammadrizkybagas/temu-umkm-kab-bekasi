import fs from 'fs/promises';
import path from 'path';

// Storage interface
export interface StorageProvider {
  upload(file: Buffer, fileName: string, mimeType?: string): Promise<string>;
  delete(filePath: string): Promise<boolean>;
}

// Local Storage
export class LocalStorageProvider implements StorageProvider {
  private uploadDir = path.join(process.cwd(), 'public', 'uploads');

  async upload(file: Buffer, fileName: string, _mimeType?: string): Promise<string> {
    await fs.mkdir(this.uploadDir, { recursive: true });

    const cleanFileName = path
      .basename(fileName)
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-');

    const uniqueName = `${Date.now()}-${cleanFileName}`;
    const filePath = path.join(this.uploadDir, uniqueName);

    await fs.writeFile(filePath, file);

    return `/uploads/${uniqueName}`;
  }

  async delete(fileUrl: string): Promise<boolean> {
    try {
      const fileName = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, fileName);

      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

// Storage Factory
export function getStorageProvider(): StorageProvider {
  const driver = process.env.STORAGE_DRIVER || 'local';

  switch (driver) {
    case 'local':
    default:
      return new LocalStorageProvider();
  }
}