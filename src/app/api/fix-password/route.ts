import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const existingUsers = await db.select().from(users);

    if (existingUsers.length === 0) {
      return NextResponse.json({ success: false, message: "Tidak ada user di database!" });
    }

    const targetId = existingUsers[0].id;
    await db
      .update(users)
      .set({
        email: "admin@bekasikab.go.id",
        passwordHash: "135790", 
      })
      .where(eq(users.id, targetId));

    return NextResponse.json({
      success: true,
      message: "SUKSES PAKSA! Password di-set plain text '135790'",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}