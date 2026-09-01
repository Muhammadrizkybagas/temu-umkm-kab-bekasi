"use server";

import { db } from "@/db";
import { banners } from "@/db/schema";
import { logActivity } from "@/lib/logger";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { uploadFileAction } from "@/app/actions/upload";

export async function createBanner(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const dateText = formData.get("dateText") as string;
    const locationText = formData.get("locationText") as string;
    const isActive = formData.get("isActive") === "on" ? 1 : 0;
    const order = Number(formData.get("order")) || 0;
    const imageFile = formData.get("image") as File;

    if (!title || !imageFile || imageFile.size === 0) {
      return { success: false, message: "Judul dan gambar wajib diisi!" };
    }

    // Upload file ke Turso 
    const uploadFormData = new FormData();
    uploadFormData.append("file", imageFile);

    const uploadResult = await uploadFileAction(uploadFormData);

    if ("error" in uploadResult) {
      return { success: false, message: uploadResult.error };
    }

    const imageUrl = uploadResult.url; 

    await db.insert(banners).values({
      title,
      subtitle,
      dateText,
      locationText,
      imageUrl,
      linkUrl: null,
      linkText: null,
      isActive,
      order,
    });

    await logActivity("CREATE", `Menambahkan banner baru: "${title}"`);

    revalidatePath("/admin/banner");
    return { success: true, message: "Banner berhasil disimpan!" };
  } catch (error) {
    console.error("Gagal menyimpan banner:", error);
    return { success: false, message: "Terjadi kesalahan pada server." };
  }
}

export async function toggleBannerStatus(id: number, currentStatus: number) {
  const newStatus = currentStatus === 1 ? 0 : 1;
  await db.update(banners).set({ isActive: newStatus }).where(eq(banners.id, id));

  const statusLabel = newStatus === 1 ? "Aktif" : "Nonaktif";
  await logActivity("UPDATE", `Mengubah status banner (ID: ${id}) menjadi status ${statusLabel}`);

  revalidatePath("/admin/banner");
}

export async function deleteBanner(id: number) {
  await db.delete(banners).where(eq(banners.id, id));

  await logActivity("DELETE", `Menghapus banner (ID: ${id})`);

  revalidatePath("/admin/banner");
}