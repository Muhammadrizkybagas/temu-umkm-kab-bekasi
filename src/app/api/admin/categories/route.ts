import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.name));

    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("GET Admin Categories Error:", error);
    return NextResponse.json({ error: 'Gagal mengambil data kategori' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Nama dan slug wajib diisi' }, { status: 400 });
    }

    await db
      .insert(categories)
      .values({
        name: body.name,
        slug: body.slug,
        description: body.description || null,
      });

    return NextResponse.json({ success: true, message: 'Kategori berhasil ditambahkan' }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST Categories Detailed Error:", error);
    
    const err = error as Error;
    const errorString = String(err?.message || error || "");
    
    if (
      errorString.includes('UNIQUE constraint failed') || 
      errorString.includes('SQLITE_CONSTRAINT')
    ) {
      return NextResponse.json({ 
        error: 'Kategori atau URL slug tersebut sudah terdaftar. Silakan gunakan nama lain.' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Kategori gagal ditambahkan. Silakan coba nama lain.' 
    }, { status: 500 });
  }
}