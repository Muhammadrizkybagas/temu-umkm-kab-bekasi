"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { logActivity } from "@/lib/logger";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";


export async function createUser(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!name || !email || !password) {
      return { success: false, error: "Semua bidang wajib diisi!" };
    }

    
    if (password.length < 6) {
      return { success: false, error: "Password minimal 6 karakter!" };
    }

    
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    if (existing) {
      return { success: false, error: "Email sudah terdaftar!" };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      passwordHash,
      role: role || "Kontributor Berita",
    });

    await logActivity("CREATE", `Menambahkan user baru: ${name} (${role})`);
    revalidatePath("/admin/users");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal membuat user baru" };
  }
}


export async function updateUserDetail(
  id: string,
  name: string,
  email: string,
  role: string
) {
  try {
    if (!name || !email) {
      return { success: false, error: "Nama dan Email wajib diisi!" };
    }

    await db
      .update(users)
      .set({ name, email, role })
      .where(eq(users.id, id));

    await logActivity("UPDATE", `Mengubah profil user: ${name} (${email})`);
    revalidatePath("/admin/users");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal memperbarui user" };
  }
}


export async function updateUserPassword(id: string, newPassword: string) {
  try {
    
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "Password baru minimal 6 karakter!" };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, id));

    await logActivity("UPDATE", `Mengubah password untuk user ID: ${id}`);
    revalidatePath("/admin/users");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal memperbarui password" };
  }
}


export async function deleteUser(id: string) {
  try {
    await db.delete(users).where(eq(users.id, id));
    await logActivity("DELETE", `Menghapus user ID: ${id}`);
    revalidatePath("/admin/users");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menghapus user" };
  }
}