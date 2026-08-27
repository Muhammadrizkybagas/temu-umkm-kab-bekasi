"use server";

import { db } from "@/db";
import { users, activityLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyToken, hashPassword } from "@/lib/auth";

export async function getAdminProfile() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;

    const decoded = verifyToken(token) as { id?: string; role?: string } | null;
    if (!decoded?.id) return null;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id))
      .get();

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error("Gagal mengambil profil:", error);
    return null;
  }
}

export async function updateAdminProfile(data: {
  id: string;
  name?: string;
  email?: string;
  newPassword?: string;
}) {
  try {
    if (!data.id) return { success: false, error: "ID user tidak valid" };

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, data.id))
      .get();

    if (!existingUser) return { success: false, error: "User tidak ditemukan" };

    const updateData: Partial<typeof users.$inferInsert> = {};
    if (data.name?.trim()) updateData.name = data.name.trim();
    if (data.email?.trim()) updateData.email = data.email.trim();
    if (data.newPassword?.trim()) {
      updateData.passwordHash = await hashPassword(data.newPassword.trim());
    }

    if (Object.keys(updateData).length === 0) return { success: true };

    await db.update(users).set(updateData).where(eq(users.id, data.id));

    const finalEmail = updateData.email || existingUser.email;
    const finalName = updateData.name || existingUser.name;

    await db.insert(activityLogs).values({
      userName: finalName,
      userEmail: finalEmail,
      action: "UPDATE_PROFIL",
      description: "Meng-update informasi profil pribadi.",
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal memperbarui profil" };
  }
}