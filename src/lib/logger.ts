import { db } from "@/db";
import { activityLogs } from "@/db/schema";

export async function logActivity(
  action: "CREATE" | "UPDATE" | "DELETE" | "AUTH",
  description: string,
  userName = "Admin Utama",
  userEmail = "admin@bekasikab.go.id"
) {
  try {
    await db.insert(activityLogs).values({
      userName,
      userEmail,
      action,
      description,
    });
  } catch (error) {
    console.error("Gagal menyimpan activity log:", error);
  }
}