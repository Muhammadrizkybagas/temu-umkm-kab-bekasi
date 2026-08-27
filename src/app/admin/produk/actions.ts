"use server";

import { db } from "@/db";
import { products, umkm, categories, activityLogs } from "@/db/schema";
import { eq, like, or, count, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export async function getProducts(query: string = "", page: number = 1, limit: number = 100) {
  try {
    const offset = (page - 1) * limit;

    const whereClause = query
      ? or(
          like(products.name, `%${query}%`),
          like(umkm.name, `%${query}%`),
          like(categories.name, `%${query}%`)
        )
      : undefined;

    const dataList = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        imageUrl: products.imageUrl,
        description: products.description,
        isFeatured: products.isFeatured,
        createdAt: products.createdAt,
        umkmId: products.umkmId,
        umkmName: umkm.name,
        categoryId: products.categoryId,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(umkm, eq(products.umkmId, umkm.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(whereClause)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    return dataList;
  } catch (error: any) {
    console.error("Gagal mengambil data produk:", error);
    return [];
  }
}

export async function getProductFormOptions() {
  try {
    const umkmList = await db.select({ id: umkm.id, name: umkm.name }).from(umkm);
    const categoryList = await db.select({ id: categories.id, name: categories.name }).from(categories);
    return { umkmList, categoryList };
  } catch (error) {
    console.error("Gagal mengambil opsi form:", error);
    return { umkmList: [], categoryList: [] };
  }
}

export async function getProductById(id: string) {
  try {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Gagal mengambil detail produk:", error);
    return null;
  }
}

// buat product
export async function createProduct(data: {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  umkmId: string;
  categoryId: string;
}) {
  try {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newProductId = crypto.randomUUID();

    await db.insert(products).values({
      id: newProductId,
      name: data.name,
      slug,
      price: data.price,
      description: data.description || "",
      imageUrl: data.imageUrl || "",
      umkmId: data.umkmId,
      categoryId: data.categoryId,
    });

    await db.insert(activityLogs).values({
      userName: "Admin",
      action: "TAMBAH_PRODUK",
      description: `Menambahkan produk baru "${data.name}"`,
    });

    revalidatePath("/admin/produk");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal membuat produk:", error);
    return { success: false, error: error.message || "Gagal membuat produk" };
  }
}

// update product
export async function updateProduct(
  id: string,
  data: {
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
    umkmId: string;
    categoryId: string;
  }
) {
  try {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    await db
      .update(products)
      .set({
        name: data.name,
        slug,
        price: data.price,
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        umkmId: data.umkmId,
        categoryId: data.categoryId,
      })
      .where(eq(products.id, id));

    await db.insert(activityLogs).values({
      userName: "Admin",
      action: "EDIT_PRODUK",
      description: `Memperbarui informasi produk "${data.name}" (ID: ${id})`,
    });

    revalidatePath("/admin/produk");
    revalidatePath(`/admin/produk/edit/${id}`);

    return { success: true };
  } catch (error: any) {
    console.error("Gagal memperbarui produk:", error);
    return { success: false, error: error.message || "Gagal memperbarui produk" };
  }
}

// delete product
export async function deleteProduct(id: string) {
  try {
    const targetProduct = await db
      .select({ name: products.name })
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    const productName = targetProduct[0]?.name || "Produk";

    await db.delete(products).where(eq(products.id, id));

    await db.insert(activityLogs).values({
      userName: "Admin",
      action: "HAPUS_PRODUK",
      description: `Menghapus produk "${productName}" (ID: ${id})`,
    });

    revalidatePath("/admin/produk");

    return { success: true };
  } catch (error: any) {
    console.error("Gagal menghapus produk:", error);
    return { success: false, error: error.message || "Gagal menghapus produk" };
  }
}