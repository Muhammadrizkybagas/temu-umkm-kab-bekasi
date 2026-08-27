import { NextResponse } from 'next/server';
import { db } from '@/db';
import { umkm } from '@/db/schema';
import { desc } from 'drizzle-orm';
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

// get all umkm
export async function GET() {
  try {
    const list = await db
      .select()
      .from(umkm)
      .orderBy(desc(umkm.createdAt));

    return NextResponse.json(list);
  } catch (error) {
    console.error("GET UMKM Error:", error);
    return NextResponse.json({ error: 'Gagal mengambil data UMKM' }, { status: 500 });
  }
}

// add umkm
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = umkmSchema.parse({
      ...body,
      isNaikKelas: Boolean(body.isNaikKelas),
      isFeatured: Boolean(body.isFeatured),
    });

    const newUmkmList = await db
      .insert(umkm)
      .values({
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
      .returning();

    return NextResponse.json(newUmkmList[0], { status: 201 });
  } catch (error: any) {
    console.error("POST UMKM Error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Input data tidak valid' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Gagal menambah UMKM' }, { status: 500 });
  }
}