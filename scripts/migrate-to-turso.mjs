import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import { randomUUID } from 'crypto';

// Load .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env;

if (!TURSO_DATABASE_URL) {
  console.error('Error: TURSO_DATABASE_URL tidak ditemukan di .env.local');
  process.exit(1);
}

const tursoClient = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

// Download gambar dari URL
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'image/*,*/*',
      },
      rejectUnauthorized: false,
    };

    const req = protocol.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP Status ${res.statusCode}`));
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const contentType = res.headers['content-type'] || 'image/jpeg';
        resolve({ buffer, contentType });
      });
    });

    req.on('error', (err) => reject(err));
  });
}

// yang akan dimigrasi
const TARGET_TABLES = [
  { name: 'products', idCol: 'id', urlCols: ['image_url'] },
  { name: 'umkm', idCol: 'id', urlCols: ['logo_url', 'cover_url'] },
  { name: 'news', idCol: 'id', urlCols: ['thumbnail_url'] },
  { name: 'banners', idCol: 'id', urlCols: ['image_url'] },
  { name: 'partners', idCol: 'id', urlCols: ['logo_url'] },
];

async function runMigration() {
  console.log('Memulai proses migrasi SELURUH GAMBAR dari Vercel Blob -> Turso DB...\n');

  try {
    for (const target of TARGET_TABLES) {
      for (const col of target.urlCols) {
        console.log(`Scanning tabel \`${target.name}\` (kolom \`${col}\`)...`);

        const queryResult = await tursoClient.execute({
          sql: `SELECT ${target.idCol}, ${col} FROM ${target.name} WHERE ${col} LIKE '%vercel-storage.com%'`,
          args: [],
        });

        const rows = queryResult.rows;
        if (rows.length === 0) {
          console.log(`   Selesai: Tidak ada data di \`${target.name}.${col}\` yang perlu dimigrasi.\n`);
          continue;
        }

        console.log(`   Ditemukan ${rows.length} gambar di \`${target.name}.${col}\`. Memulai migrasi...`);

        let successCount = 0;
        for (const row of rows) {
          const id = row[target.idCol];
          const oldUrl = row[col];

          try {
            // Download gambar dari Vercel Blob
            const { buffer, contentType } = await downloadImage(oldUrl);
            const base64Data = buffer.toString('base64');
            const mediaId = randomUUID();
            const newApiUrl = `/api/media/${mediaId}`;

            // simpan ke tabel media di Turso DB
            await tursoClient.execute({
              sql: 'INSERT INTO media (id, data, mime_type) VALUES (?, ?, ?)',
              args: [mediaId, base64Data, contentType],
            });


            await tursoClient.execute({
              sql: `UPDATE ${target.name} SET ${col} = ? WHERE ${target.idCol} = ?`,
              args: [newApiUrl, id],
            });

            console.log(`   [${target.name}:${id}] -> ${newApiUrl}`);
            successCount++;
          } catch (err) {
            console.error(`   Gagal memproses gambar (${oldUrl}):`, err.message);
          }
        }
        console.log(`   Migrasi \`${target.name}.${col}\` selesai (${successCount}/${rows.length} sukses).\n`);
      }
    }

    console.log('SELURUH TABEL DAN GAMBAR BERHASIL DIPINDAHKAN KE TURSO DB!');
  } catch (error) {
    console.error('Terjadi kesalahan fatal:', error);
  } finally {
    process.exit(0);
  }
}

runMigration();