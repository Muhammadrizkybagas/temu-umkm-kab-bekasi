import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, umkm, categories } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { z } from 'zod';

const productSchema = z.object({
  umkmId: z.string().min(1, 'UMKM wajib dipilih'),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  name: z.string().min(2, 'Nama produk minimal 2 karakter'),
  slug: z.string().min(2, 'Slug minimal 2 karakter'),
  price: z.number().positive('Harga harus berupa angka positif'),
  description: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  isFeatured: z.number().default(0),
});

export async function GET() {
  try {
    const list = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        imageUrl: products.imageUrl,
        isFeatured: products.isFeatured,
        umkmName: umkm.name,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(umkm, eq(products.umkmId, umkm.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(sql`products.rowid`));

    return NextResponse.json(list);
  } catch (error) {
    console.error("GET Admin Products Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = productSchema.parse({
      ...body,
      price: Number(body.price),
    });

    const newProduct = await db
      .insert(products)
      .values({
        name: validatedData.name,
        slug: validatedData.slug,
        price: validatedData.price,
        description: validatedData.description,
        imageUrl: validatedData.imageUrl,
        umkmId: validatedData.umkmId,
        categoryId: validatedData.categoryId,
        isFeatured: validatedData.isFeatured,
      })
      .returning()
      .get();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("POST Product Error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Input data tidak valid' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Gagal menambah produk' }, { status: 500 });
  }
}