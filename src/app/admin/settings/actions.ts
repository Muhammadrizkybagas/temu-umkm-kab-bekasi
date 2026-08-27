"use server";

import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { logActivity } from "@/lib/logger";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export async function getSettings() {
  let settings = await db.select().from(siteSettings).where(eq(siteSettings.id, "general")).get();
  
  if (!settings) {
    
    await db.insert(siteSettings).values({ 
      id: "general",
      siteName: "UMKM Kabupaten Bekasi",
      siteDescription: "Direktori dan pusat informasi resmi UMKM Kabupaten Bekasi.",
      contactPhone: "081234567890",
      contactEmail: "info@umkmbekasi.go.id",
      officeAddress: "Jl. A. Yani No.1, Cikarang Pusat, Bekasi",
      instagramUrl: "",
      facebookUrl: "",
      youtubeUrl: ""
    });
    
    settings = await db.select().from(siteSettings).where(eq(siteSettings.id, "general")).get();
  }

  return settings || {
    siteName: "UMKM Kabupaten Bekasi",
    siteDescription: "Direktori dan pusat informasi resmi UMKM Kabupaten Bekasi.",
    contactPhone: "081234567890",
    contactEmail: "info@umkmbekasi.go.id",
    officeAddress: "Jl. A. Yani No.1, Cikarang Pusat, Bekasi",
    instagramUrl: "",
    facebookUrl: "",
    youtubeUrl: ""
  };
}


export async function updateSettings(formData: FormData) {
  try {
    const siteName = formData.get("siteName") as string;
    const siteDescription = formData.get("siteDescription") as string;
    const contactPhone = formData.get("contactPhone") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const officeAddress = formData.get("officeAddress") as string;
    const instagramUrl = formData.get("instagramUrl") as string;
    const facebookUrl = formData.get("facebookUrl") as string;
    const youtubeUrl = formData.get("youtubeUrl") as string;

    
    await db
      .update(siteSettings)
      .set({
        siteName,
        siteDescription,
        contactPhone,
        contactEmail,
        officeAddress,
        instagramUrl,
        facebookUrl,
        youtubeUrl,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, "general"));

      
    await logActivity("UPDATE", `Memperbarui Pengaturan Umum Website (${siteName})`);

    revalidatePath("/", "layout");
    return { success: true, message: "Pengaturan website berhasil disimpan!" };
  } catch (error) {
    console.error("Gagal update settings:", error);
    return { success: false, error: "Terjadi kesalahan pada server." };
  }
}