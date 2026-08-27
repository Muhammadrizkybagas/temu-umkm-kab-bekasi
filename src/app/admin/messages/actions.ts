"use server";

import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { logActivity } from "@/lib/logger";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export async function getMessages() {
  return await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));
}

// Update status pesan
export async function updateMessageStatus(id: string, status: "READ" | "REPLIED" | "UNREAD") {
  await db
    .update(contactMessages)
    .set({ status, updatedAt: new Date() })
    .where(eq(contactMessages.id, id));

    
  await logActivity("UPDATE", `Mengubah status pesan ID (${id}) menjadi ${status}`);

  revalidatePath("/admin/messages");
}

// Hapus pesan
export async function deleteMessage(id: string) {
  await db
    .delete(contactMessages)
    .where(eq(contactMessages.id, id));

    
  await logActivity("DELETE", `Menghapus pesan masuk ID (${id})`);

  revalidatePath("/admin/messages");
}