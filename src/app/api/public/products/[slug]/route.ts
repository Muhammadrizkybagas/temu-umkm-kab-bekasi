import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, umkm, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params; 

    const result = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        description: products.description,
        imageUrl: products.imageUrl,
        umkmId: umkm.id,
        umkmName: umkm.name,
        ownerName: umkm.ownerName,
        phone: umkm.phone,
        district: umkm.district,
        village: umkm.village,
        address: umkm.address,
        categoryName: categories.name,
        status: umkm.status,
        isNaikKelas: umkm.isNaikKelas,
      })
      .from(products)
      .leftJoin(umkm, eq(products.umkmId, umkm.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.slug, slug))
      .get();

    if (!result) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil detail produk' }, { status: 500 });
  }
}