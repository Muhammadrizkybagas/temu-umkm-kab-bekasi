import { NextResponse } from "next/server";
import { db } from "@/db";
import { news } from "@/db/schema";
import crypto from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { desc } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const editor = formData.get("editor") as string;
    const status = (formData.get("status") as string) || "Draft";
    const imageFile = formData.get("thumbnail") as File | null;

    
    if (!title || !content) {
      return NextResponse.json(
        { error: "Judul dan isi berita wajib diisi" },
        { status: 400 }
      );
    }

    let thumbnailUrl = null;

    
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      
      const safeFileName = imageFile.name
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .toLowerCase();
      const filename = `${Date.now()}-${safeFileName}`;
      
      const uploadDir = path.join(process.cwd(), "public/uploads/news");

      
      await mkdir(uploadDir, { recursive: true });

      
      await writeFile(path.join(uploadDir, filename), buffer);
      thumbnailUrl = `/uploads/news/${filename}`;
    }

    
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    
      
    const uniqueSuffix = crypto.randomBytes(2).toString("hex");
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const newId = crypto.randomUUID();

    
    await db.insert(news).values({
      id: newId,
      title,
      slug,
      content,
      editor: editor || null,
      thumbnailUrl,
      status,
      views: 0,
      likes: 0,
    });

    return NextResponse.json(
      { success: true, message: "Berita berhasil ditambahkan" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: error.message || "Gagal menyimpan berita" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    
      const allNews = await db
        .select()
        .from(news)
        .orderBy(desc(news.createdAt)); 

      return NextResponse.json(allNews);
    } catch (error) {
      console.error("Error fetching news:", error);
      return NextResponse.json(
        { error: "Gagal memuat data berita" },
        { status: 500 }
      );
    }
  }