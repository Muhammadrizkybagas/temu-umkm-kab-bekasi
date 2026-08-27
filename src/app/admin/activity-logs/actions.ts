"use server";

import { db } from "@/db";
import { activityLogs } from "@/db/schema";
import { logActivity } from "@/lib/logger";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export async function getActivityLogs() {
  return await db
    .select()
    .from(activityLogs)
    .orderBy(desc(activityLogs.createdAt));
}


export async function clearActivityLogs() {
  
  await db.delete(activityLogs);

  
  await logActivity("DELETE", "Membersihkan seluruh riwayat log aktivitas");

  revalidatePath("/admin/activity-logs");
  return { success: true };
}

