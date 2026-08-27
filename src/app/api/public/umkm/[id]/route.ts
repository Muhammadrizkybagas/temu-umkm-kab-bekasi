import { NextResponse } from 'next/server';
import { db } from '@/db';
import { umkm, products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Profil UMKM
    const umkmData = await db
      .select()
      .from(umkm)
      .where(eq(umkm.id, id))
      .get();

    if (!umkmData) {
      return NextResponse.json({ error: 'UMKM tidak ditemukan' }, { status: 404 });
    }

    // Produk
    const umkmProducts = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        imageUrl: products.imageUrl,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.umkmId, id));

    return NextResponse.json({
      ...umkmData,
      products: umkmProducts,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data UMKM' }, { status: 500 });
  }
}