import { NextResponse } from "next/server";
import { db } from "@/db";
import { news } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // get berita publish
    const publishedNews = await db
      .select()
      .from(news)
      .where(eq(news.status, "Published"));
      
    return NextResponse.json(publishedNews);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat berita" }, { status: 500 });
  }
}