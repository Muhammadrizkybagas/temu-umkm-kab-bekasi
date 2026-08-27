"use server";

import { db } from "@/db";
import { banners } from "@/db/schema";
import { logActivity } from "@/lib/logger";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

    
    const MAX_SIZE = 3 * 1024 * 1024;
    if (imageFile.size > MAX_SIZE) {
      return { success: false, message: "Ukuran file gambar melebihi batas maksimal 3 MB." };
    }

    
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/heic", "image/heif"];
    if (imageFile.type && !allowedTypes.includes(imageFile.type)) {
      const ext = imageFile.name.split(".").pop()?.toLowerCase();
      if (!["jpg", "jpeg", "png", "webp", "heic", "heif"].includes(ext || "")) {
        return { success: false, message: "Format gambar tidak didukung! Gunakan PNG, JPG, JPEG, HEIC, atau WEBP." };
      }
    }

    
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + "-" + imageFile.name.replace(/\s/g, "_");
    
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${filename}`;

    
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
    console.error(error);
    return { success: false, message: "Terjadi kesalahan pada server." };
  }
}

export async function toggleBannerStatus(id: number, currentStatus: number) {
  const newStatus = currentStatus === 1 ? 0 : 1;
  await db.update(banners).set({ isActive: newStatus }).where(eq(banners.id, id));

  
  const statusLabel = newStatus === 1 ? "mengaktifkan" : "dinonaktifkan";
  await logActivity("UPDATE", `Mengubah status banner (ID: ${id}) menjadi ${statusLabel}`);

  revalidatePath("/admin/banner");
}

export async function deleteBanner(id: number) {
  await db.delete(banners).where(eq(banners.id, id));

  
  await logActivity("DELETE", `Menghapus banner (ID: ${id})`);

  revalidatePath("/admin/banner");
}