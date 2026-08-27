import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getStorageProvider } from "@/lib/storage";
import { z } from "zod";


const updateProductSchema = z.object({
  umkmId: z.string().min(1, "UMKM wajib dipilih"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter"),
  price: z.number().positive("Harga harus berupa angka positif"),
  description: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  isFeatured: z.number().default(0),
});

async function getIdFromParams(params: { id: string } | Promise<{ id: string }>) {
  const resolvedParams = await params;
  return resolvedParams.id;
}

// get detail product
export async function GET(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const id = await getIdFromParams(params);

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .get();

    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET Single Product Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data produk" },
      { status: 500 }
    );
  }
}

// update produk
export async function PUT(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const id = await getIdFromParams(params);
    const body = await req.json();

    
    const validatedData = updateProductSchema.parse({
      ...body,
      price: Number(body.price),
    });

    
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .get();

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    
    if (
      existingProduct.imageUrl &&
      validatedData.imageUrl &&
      existingProduct.imageUrl !== validatedData.imageUrl
    ) {
      try {
        const storage = getStorageProvider();
        await storage.delete(existingProduct.imageUrl);
      } catch (storageError) {
        console.warn("Gagal menghapus foto lama dari storage:", storageError);
      }
    }

    
    const updatedProduct = await db
      .update(products)
      .set({
        name: validatedData.name,
        slug: validatedData.slug,
        price: validatedData.price,
        description: validatedData.description,
        imageUrl: validatedData.imageUrl,
        umkmId: validatedData.umkmId,
        categoryId: validatedData.categoryId,
        isFeatured: validatedData.isFeatured,
      })
      .where(eq(products.id, id))
      .returning()
      .get();

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("PUT Product Error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Input data tidak valid" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Gagal memperbarui produk" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const id = await getIdFromParams(params);

    // cari produk
    const product = await db
      .select({ imageUrl: products.imageUrl })
      .from(products)
      .where(eq(products.id, id))
      .get();

    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    // hapus gambar
    if (product.imageUrl) {
      try {
        const storage = getStorageProvider();
        await storage.delete(product.imageUrl);
      } catch (storageError) {
        console.warn("Gagal menghapus file foto dari storage:", storageError);
      }
    }

    // hapus dari db
    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}