import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const allCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      })
      .from(categories)
      .orderBy(asc(categories.name));

    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("GET Public Categories Error:", error);
    return NextResponse.json({ error: 'Gagal mengambil data kategori' }, { status: 500 });
  }
}