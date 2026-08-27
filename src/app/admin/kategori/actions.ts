"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { logActivity } from "@/lib/logger";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export async function getCategories() {
  return await db.select().from(categories);
}

// Tambah Kategori
export async function createCategory(name: string, slug: string) {
  try {
    const [newCategory] = await db
      .insert(categories)
      .values({ name, slug })
      .returning();

      
    await logActivity("CREATE", `Menambahkan kategori baru: "${name}"`);

    revalidatePath("/admin/kategori");
    return { success: true, data: newCategory };
  } catch (error) {
    console.error("Gagal menambah kategori:", error);
    return { success: false, error: "Gagal menambahkan kategori baru." };
  }
}

// update Kategori
export async function updateCategory(id: string, name: string, slug: string) {
  try {
    await db
      .update(categories)
      .set({ name, slug })
      .where(eq(categories.id, id));

      
    await logActivity("UPDATE", `Mengubah nama kategori menjadi: "${name}"`);

    revalidatePath("/admin/kategori");
    return { success: true };
  } catch (error) {
    console.error("Gagal memperbarui kategori:", error);
    return { success: false, error: "Gagal memperbarui kategori." };
  }
}

// hapus Kategori
export async function deleteCategory(id: string, name: string) {
  try {
    await db.delete(categories).where(eq(categories.id, id));

    
    await logActivity("DELETE", `Menghapus kategori: "${name}"`);

    revalidatePath("/admin/kategori");
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus kategori:", error);
    return { success: false, error: "Gagal menghapus kategori." };
  }
}