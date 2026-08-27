import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, umkm, categories } from '@/db/schema';
import { eq, like, or, and, desc } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const categoryFilter = searchParams.get('category') || '';
    const districtFilter = searchParams.get('district') || ''; 

    const conditions = [];

    if (query) {
      conditions.push(
        or(
          like(products.name, `%${query}%`),
          like(umkm.name, `%${query}%`),
          like(umkm.district, `%${query}%`)
        )
      );
    }

    if (categoryFilter) {
      conditions.push(
        or(
          eq(products.categoryId, categoryFilter),
          eq(categories.slug, categoryFilter)
        )
      );
    }

    if (districtFilter) {
      conditions.push(like(umkm.district, `%${districtFilter}%`));
    }

    const data = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        description: products.description,
        imageUrl: products.imageUrl,
        umkmName: umkm.name,
        phone: umkm.phone,
        district: umkm.district,
        isNaikKelas: umkm.isNaikKelas, 
        status: umkm.status,           
        categoryId: products.categoryId,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(umkm, eq(products.umkmId, umkm.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(products.createdAt));

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Public Catalog Error:", error);
    return NextResponse.json({ error: 'Gagal mengambil data katalog' }, { status: 500 });
  }
}