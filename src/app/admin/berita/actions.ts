"use server";

import { db } from "@/db";
import { news } from "@/db/schema";
import { logActivity } from "@/lib/logger";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// add berita
export async function createNews(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const editor = (formData.get("editor") as string) || "Admin";
    const thumbnailUrl = (formData.get("thumbnailUrl") as string) || null;
    const status = (formData.get("status") as string) || "Draft";

    if (!title || !content) {
      return { success: false, error: "Judul dan konten wajib diisi!" };
    }

    const id = crypto.randomUUID();
    const slug = `${slugify(title)}-${Date.now()}`;

    await db.insert(news).values({
      id,
      title,
      slug,
      content,
      editor,
      thumbnailUrl,
      status,
    });

    await logActivity("CREATE", `Menambahkan berita baru: "${title}"`);

    revalidatePath("/admin/berita");
    return { success: true };
  } catch (error) {
    console.error("Gagal buat berita:", error);
    return { success: false, error: "Gagal menambah berita." };
  }
}

// edit berita
export async function updateNews(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const editor = formData.get("editor") as string;
    const status = (formData.get("status") as string) || "Draft";
    
    const thumbnailFile = formData.get("thumbnail") as File | null;

    const existingNews = await db.select().from(news).where(eq(news.id, id)).limit(1);
    let thumbnailUrl = existingNews[0]?.thumbnailUrl || null;

    if (thumbnailFile && thumbnailFile.size > 0) {
      
      
      const bytes = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      thumbnailUrl = `data:${thumbnailFile.type};base64,${base64}`;
    }

    const slug = `${slugify(title)}-${Date.now()}`;

    await db
      .update(news)
      .set({
        title,
        slug,
        content,
        editor,
        thumbnailUrl,
        status,
      })
      .where(eq(news.id, id));

    await logActivity("UPDATE", `Memperbarui berita: "${title}"`);

    revalidatePath("/admin/berita");
    return { success: true };
  } catch (error) {
    console.error("Gagal update berita:", error);
    return { success: false, error: "Gagal memperbarui berita." };
  }
}

//delete berita
export async function deleteNews(id: string, title: string) {
  try {
    await db.delete(news).where(eq(news.id, id));

    await logActivity("DELETE", `Menghapus berita: "${title}"`);

    revalidatePath("/admin/berita");
    return { success: true };
  } catch (error) {
    console.error("Gagal hapus berita:", error);
    return { success: false, error: "Gagal menghapus berita." };
  }
}