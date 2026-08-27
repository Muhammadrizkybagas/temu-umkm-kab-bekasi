import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(contactMessages)
      .where(eq(contactMessages.status, "UNREAD"));

    const count = result[0]?.count || 0;

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Gagal mengambil unread count:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}