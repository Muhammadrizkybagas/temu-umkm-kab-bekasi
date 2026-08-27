import { NextResponse } from 'next/server';
import { db } from '@/db';
import { umkm } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getStorageProvider } from '@/lib/storage';
import { z } from 'zod';


const umkmSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  ownerName: z.string().min(2, 'Nama pemilik minimal 2 karakter'),
  phone: z.string().min(9, 'Nomor HP minimal 9 digit'),
  district: z.string().min(2, 'Kecamatan wajib diisi'),
  village: z.string().min(2, 'Desa/Kelurahan wajib diisi'),
  address: z.string().min(5, 'Alamat minimal 5 karakter'),
  logoUrl: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.string().default('Inkubator'),
  isNaikKelas: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

async function getIdFromParams(params: { id: string } | Promise<{ id: string }>) {
  const resolved = await params;
  return resolved.id;
}

// get single umkm 
export async function GET(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const id = await getIdFromParams(params);

    const dataList = await db
      .select()
      .from(umkm)
      .where(eq(umkm.id, id));

    const data = dataList[0];

    if (!data) {
      return NextResponse.json({ error: 'UMKM tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET Single UMKM Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// Update umkm
export async function PUT(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const id = await getIdFromParams(params);
    const body = await req.json();

    const validatedData = umkmSchema.parse({
      ...body,
      isNaikKelas: Boolean(body.isNaikKelas ?? body.isUpgraded),
      isFeatured: Boolean(body.isFeatured),
    });

  
    const existingList = await db
      .select()
      .from(umkm)
      .where(eq(umkm.id, id));

    const existing = existingList[0];

    if (!existing) {
      return NextResponse.json({ error: 'UMKM tidak ditemukan' }, { status: 404 });
    }

    if (existing.logoUrl && validatedData.logoUrl && existing.logoUrl !== validatedData.logoUrl) {
      try {
        const storage = getStorageProvider();
        await storage.delete(existing.logoUrl);
      } catch (e) {
        console.warn('Gagal hapus logo lama:', e);
      }
    }

    if (existing.coverUrl && validatedData.coverUrl && existing.coverUrl !== validatedData.coverUrl) {
      try {
        const storage = getStorageProvider();
        await storage.delete(existing.coverUrl);
      } catch (e) {
        console.warn('Gagal hapus cover lama:', e);
      }
    }

    const updatedList = await db
      .update(umkm)
      .set({
        name: validatedData.name,
        ownerName: validatedData.ownerName,
        phone: validatedData.phone,
        district: validatedData.district,
        village: validatedData.village,
        address: validatedData.address,
        logoUrl: validatedData.logoUrl || null,
        coverUrl: validatedData.coverUrl || null,
        description: validatedData.description || null,
        status: validatedData.status,
        isNaikKelas: validatedData.isNaikKelas,
        isFeatured: validatedData.isFeatured,
      })
      .where(eq(umkm.id, id))
      .returning();

    return NextResponse.json(updatedList[0]);
  } catch (error: any) {
    console.error('PUT UMKM Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Input data tidak valid' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Gagal memperbarui UMKM' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const id = await getIdFromParams(params);
    const body = await req.json();

    const existingList = await db
      .select()
      .from(umkm)
      .where(eq(umkm.id, id));

    const existing = existingList[0];

    if (!existing) {
      return NextResponse.json({ error: 'UMKM tidak ditemukan' }, { status: 404 });
    }

    const updatePayload: { isNaikKelas?: boolean; isFeatured?: boolean } = {};

    if (typeof body.isUpgraded !== 'undefined' || typeof body.isNaikKelas !== 'undefined') {
      updatePayload.isNaikKelas = Boolean(body.isNaikKelas ?? body.isUpgraded);
    }
    if (typeof body.isFeatured !== 'undefined') {
      updatePayload.isFeatured = Boolean(body.isFeatured);
    }

    // Update DB
    const updatedList = await db
      .update(umkm)
      .set(updatePayload)
      .where(eq(umkm.id, id))
      .returning();

    return NextResponse.json(updatedList[0]);
  } catch (error) {
    console.error('PATCH UMKM Error:', error);
    return NextResponse.json({ error: 'Gagal update status' }, { status: 500 });
  }
}

// Hapus umkm
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const id = await getIdFromParams(params);

    // Cari DB
    const existingList = await db
      .select({ logoUrl: umkm.logoUrl, coverUrl: umkm.coverUrl })
      .from(umkm)
      .where(eq(umkm.id, id));

    const existing = existingList[0];

    if (!existing) {
      return NextResponse.json({ error: 'UMKM tidak ditemukan' }, { status: 404 });
    }

    // Hapus logo
    if (existing.logoUrl) {
      try {
        const storage = getStorageProvider();
        await storage.delete(existing.logoUrl);
      } catch (e) {
        console.warn('Gagal hapus logo:', e);
      }
    }

    // Hapus cover
    if (existing.coverUrl) {
      try {
        const storage = getStorageProvider();
        await storage.delete(existing.coverUrl);
      } catch (e) {
        console.warn('Gagal hapus cover:', e);
      }
    }

    // Hapus DB
    await db.delete(umkm).where(eq(umkm.id, id));

    return NextResponse.json({ message: 'UMKM berhasil dihapus' });
  } catch (error) {
    console.error('DELETE UMKM Error:', error);
    return NextResponse.json({ error: 'Gagal menghapus UMKM' }, { status: 500 });
  }
}