import { NextResponse } from "next/server";
import { db } from "@/db";
import { news } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await db
      .update(news)
      .set({ views: sql`COALESCE(${news.views}, 0) + 1` })
      .where(eq(news.slug, slug));

    const data = await db
      .select()
      .from(news)
      .where(and(eq(news.slug, slug), eq(news.status, "Published")))
      .limit(1);

    if (data.length === 0) {
      return NextResponse.json(
        { error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error GET news detail:", error);
    return NextResponse.json(
      { error: "Gagal mengambil berita" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const updated = await db
      .update(news)
      .set({ likes: sql`COALESCE(${news.likes}, 0) + 1` })
      .where(eq(news.slug, slug))
      .returning();

    if (!updated.length) {
      return NextResponse.json(
        { error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, likes: updated[0].likes });
  } catch (error) {
    console.error("Error POST news like:", error);
    return NextResponse.json(
      { error: "Gagal menyukai berita" },
      { status: 500 }
    );
  }
}