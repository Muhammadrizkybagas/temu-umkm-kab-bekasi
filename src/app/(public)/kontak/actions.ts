"use server";

import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { logActivity } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export async function submitContactMessage(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!name || !phone || !message) {
      return { success: false, error: "Mohon lengkapi field yang wajib diisi!" };
    }

    await db.insert(contactMessages).values({
      name,
      phone,
      email: "-",
      subject: subject || "Pertanyaan Umum dari Website",
      message,
      status: "UNREAD",
    });

    // Catat log aktivitas
    await logActivity("CREATE", `Pesan masuk baru dari: ${name} (${phone})`, name, phone);

    revalidatePath("/admin/messages");
    return { success: true, message: "Pesan Anda berhasil dikirim!" };
  } catch (error) {
    console.error("Gagal kirim pesan:", error);
    return { success: false, error: "Terjadi kesalahan pada server." };
  }
}