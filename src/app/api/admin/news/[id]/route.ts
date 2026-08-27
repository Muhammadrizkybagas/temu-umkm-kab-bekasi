import { NextResponse } from "next/server";
import { db } from "@/db";
import { news } from "@/db/schema";
import { eq } from "drizzle-orm";
import { writeFile, mkdir } from "fs/promises";
import path from "path";


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await db
      .select() 
      .from(news)
      .where(eq(news.id, id))
      .limit(1);

    if (data.length === 0) {
      return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error fetching news detail:", error);
    return NextResponse.json({ error: "Gagal mengambil detail berita" }, { status: 500 });
  }
}

// update berita
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const formData = await request.formData();
    
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const editor = formData.get("editor") as string;
    const status = formData.get("status") as string || "Draft";
    const imageFile = formData.get("thumbnail") as File | null;

    if (!title || !content) {
      return NextResponse.json({ error: "Judul dan isi berita wajib diisi" }, { status: 400 });
    }

    const updateData: Record<string, any> = {
      title,
      content,
      editor: editor || null,
      status,
      updatedAt: new Date(),
    };

    
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filename = `${Date.now()}-${imageFile.name.replaceAll(" ", "_")}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/news");
      
      
      await mkdir(uploadDir, { recursive: true });
      
      await writeFile(path.join(uploadDir, filename), buffer);
      
      updateData.thumbnailUrl = `/uploads/news/${filename}`;
    }

    const updated = await db
      .update(news)
      .set(updateData)
      .where(eq(news.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    console.error("Error updating news:", error);
    return NextResponse.json({ error: error.message || "Gagal memperbarui berita" }, { status: 500 });
  }
}

// delete berita
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await db
      .delete(news)
      .where(eq(news.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Berita berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json({ error: "Gagal menghapus berita" }, { status: 500 });
  }
}